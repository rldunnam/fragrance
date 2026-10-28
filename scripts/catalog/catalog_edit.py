"""Shared helpers for catalog batch scripts (Python 3, stdlib only).

A batch script imports this module, edits entries, then calls save():

    import sys; sys.path.insert(0, 'scripts/catalog')
    from catalog_edit import Catalog
    c = Catalog()
    c.update('pdm-perseus',
             source='https://www.fragrantica.com/perfume/Parfums-de-Marly/Perseus-90199.html',
             top='Grapefruit, Bergamot', heart='Vetiver', base='Cedar',
             replace=[("    price: 320,", "    price: 290,")],
             ingredients=['Alcohol Denat.', 'Parfum (Fragrance)'],
             ingredients_source='https://us.parfums-de-marly.com/products/perseus')
    c.set_price_basis('Parfums de Marly', 75)
    c.add_ledger_rows(['| F-... |'], coverage='| batch-NN | ... |')
    c.save()

The working copies are CRLF (core.autocrlf), so every file keeps the newline
style it was read with, and save() refuses to write a file with mixed newlines.
Run from the repo root.
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA = 'lib/fragrances/data.ts'
LEDGER = 'docs/validation-findings.md'
PRICE_BASIS = 'lib/fragrances/price-basis.json'
PUBLISHED_IDS = 'lib/fragrances/published-ids.json'
VALIDATOR = 'scripts/validate-fragrances.mjs'


def _read(path):
    return open(os.path.join(ROOT, path), encoding='utf-8', newline='').read()


def _write(path, text):
    open(os.path.join(ROOT, path), 'w', encoding='utf-8', newline='').write(text)


def _nl(text):
    return '\r\n' if '\r\n' in text else '\n'


def ts_str(value):
    """A single-quoted TS string literal, escaping backslashes and apostrophes."""
    return "'" + value.replace('\\', '\\\\').replace("'", "\\'") + "'"


def notes(text):
    """'A, B, C' -> ['A', 'B', 'C']; '' -> []."""
    return [n.strip() for n in text.split(',')] if text else []


def check_newlines(text, path):
    if '\r\n' in text:
        assert '\r\r' not in text and not re.search(r'(?<!\r)\n', text), f'mixed newlines in {path}'


class Catalog:
    def __init__(self):
        self.data = _read(DATA)
        self.nl = _nl(self.data)
        self._ledger = None

    # data.ts -----------------------------------------------------------
    def _find(self, id_):
        nl = re.escape(self.nl)
        m = re.search(nl + r"  \{" + nl + r"    id: '" + re.escape(id_) + r"',.*?" + nl + r"  \},", self.data, re.S)
        assert m, f'entry not found: {id_}'
        return m

    def block(self, id_):
        return self._find(id_).group(0)

    def wrap(self, items, indent='      ', width=100):
        lines, cur = [], indent
        for item in items:
            tok = ts_str(item) + ', '
            if len(cur) + len(tok) > width and cur.strip():
                lines.append(cur.rstrip())
                cur = indent
            cur += tok
        lines.append(cur.rstrip())
        return self.nl.join(lines)

    def update(self, id_, source=None, top=None, heart=None, base=None, flat=False,
               replace=(), ingredients=None, ingredients_source=None, formula_code=None,
               label_comment=None, require_unsourced=True):
        """Edit one entry.

        replace: (old, new) pairs applied inside the entry; each old string must
        occur exactly once. top/heart/base: comma-separated note strings that
        replace the stored tiers. source, notesFlat, an optional // comment,
        ingredients, ingredientsSource and formulaCode are appended at the end
        of the entry in that order.
        """
        m = self._find(id_)
        b = m.group(0)
        if require_unsourced:
            assert 'source:' not in b and 'ingredients' not in b, f'{id_} already has a source or label'
        for old, new in replace:
            assert b.count(old) == 1, (id_, old)
            b = b.replace(old, new)
        for key, val in (('topNotes', top), ('heartNotes', heart), ('baseNotes', base)):
            if val is None:
                continue
            arr = '[' + ', '.join(ts_str(n) for n in notes(val)) + ']'
            b, n = re.subn(r"    " + key + r": \[[^\]]*\],", lambda _m: f"    {key}: {arr},", b)
            assert n == 1, (id_, key)
        tail = ''
        if source:
            tail += f"    source: {ts_str(source)}," + self.nl
        if flat:
            tail += "    notesFlat: true," + self.nl
        if label_comment:
            tail += f"    // {label_comment}" + self.nl
        if ingredients is not None:
            tail += "    ingredients: [" + self.nl + self.wrap(ingredients) + self.nl + "    ]," + self.nl
        if ingredients_source:
            tail += f"    ingredientsSource: {ts_str(ingredients_source)}," + self.nl
        if formula_code:
            tail += f"    formulaCode: {ts_str(formula_code)}," + self.nl
        assert b.endswith("  },")
        b = b[:-len("  },")] + tail + "  },"
        self.data = self.data[:m.start()] + b + self.data[m.end():]

    def remove(self, id_):
        """Delete an entry (pair it with retire())."""
        m = self._find(id_)
        self.data = self.data[:m.start()] + self.data[m.end():]

    def note_case_conflicts(self):
        """Notes stored under more than one capitalisation, e.g. {'oakmoss': {'Oakmoss', 'OakMoss'}}."""
        seen = {}
        for arr in re.findall(r"(?:topNotes|heartNotes|baseNotes): \[([^\]]*)\]", self.data):
            for n in re.findall(r"'((?:[^'\\]|\\.)*)'", arr):
                seen.setdefault(n.lower(), set()).add(n)
        return {k: v for k, v in seen.items() if len(v) > 1}

    # JSON side files ---------------------------------------------------
    @staticmethod
    def _edit_json(path, fn):
        raw = _read(path)
        nl = _nl(raw)
        d = json.loads(raw)
        fn(d)
        _write(path, (json.dumps(d, indent=2, ensure_ascii=False) + '\n').replace('\n', nl))

    def set_price_basis(self, house, ml):
        def fn(d):
            d['houses'][house] = ml
            d['houses'] = dict(sorted(d['houses'].items()))
        self._edit_json(PRICE_BASIS, fn)

    def retire(self, id_, reason):
        self._edit_json(PUBLISHED_IDS, lambda d: d['retired'].__setitem__(id_, reason))

    # validate-fragrances.mjs -------------------------------------------
    @staticmethod
    def _add_map_line(const_name, line):
        t = _read(VALIDATOR)
        nl = _nl(t)
        start = t.index(f'const {const_name} = new Map([')
        end = t.index('])', start)
        assert line not in t[start:end], f'already present: {line}'
        t = t[:end] + f"  {line}," + nl + t[end:]
        _write(VALIDATOR, t)

    def add_us_source_host(self, host, path_regex=None):
        """path_regex is JS regex source such as r'^\\/us\\/' or None."""
        self._add_map_line('US_SOURCE_HOSTS', f"['{host}', {'/' + path_regex + '/' if path_regex else 'null'}]")

    def add_note_alias(self, alias, canonical):
        self._add_map_line('NOTE_ALIASES', f"['{alias}', '{canonical}']")

    # ledger ------------------------------------------------------------
    def ledger_lines(self):
        if self._ledger is None:
            self._ledger_text = _read(LEDGER)
            self._ledger_nl = _nl(self._ledger_text)
            self._ledger = self._ledger_text.split(self._ledger_nl)
        return self._ledger

    def next_finding(self):
        """The next free F-number."""
        L = self.ledger_lines()
        return max(int(m.group(1)) for l in L for m in [re.match(r'\| F-(\d+) \|', l)] if m) + 1

    def add_ledger_rows(self, finding_rows=(), coverage=None):
        """Append finding rows after the last F-row and a coverage row after the last batch row.
        The ledger is append-only; edit a row only before its PR merges."""
        L = self.ledger_lines()
        for row in list(finding_rows) + ([coverage] if coverage else []):
            cells = row.strip().strip('|').split(' | ')
            assert not any('|' in c for c in cells), f'stray | in: {row[:60]}'
        if finding_rows:
            i = max(k for k, l in enumerate(L) if re.match(r'\| F-\d+ \|', l))
            L[i + 1:i + 1] = list(finding_rows)
        if coverage:
            j = max(k for k, l in enumerate(L) if l.startswith('| batch-'))
            L.insert(j + 1, coverage)

    def edit_ledger_row(self, prefix, old, new):
        L = self.ledger_lines()
        i = [k for k, l in enumerate(L) if l.startswith(prefix)]
        assert len(i) == 1, prefix
        assert old in L[i[0]], (prefix, old)
        L[i[0]] = L[i[0]].replace(old, new)

    # write -------------------------------------------------------------
    def save(self):
        check_newlines(self.data, DATA)
        _write(DATA, self.data)
        if self._ledger is not None:
            text = self._ledger_nl.join(self._ledger)
            check_newlines(text, LEDGER)
            _write(LEDGER, text)
