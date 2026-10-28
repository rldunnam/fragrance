"""Pre-commit checks for catalog edits that `pnpm validate` or tsc would fail
on in CI. Run from the repo root: python scripts/catalog/checks.py

- alias keys: a stored note equal to a NOTE_ALIASES key (Fragrantica
  spellings such as 'Citruses' or 'oak moss') fails `pnpm validate`.
- unescaped quotes: an apostrophe left unescaped in a single-quoted data.ts
  string breaks tsc (Git Bash heredocs strip the backslash; write Python
  that emits TS strings to a file, not a heredoc).
- note case conflicts: one note stored under two capitalisations.
- mixed newlines: the CRLF working copy gained a bare LF.
Exits 1 if any check fails.
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from catalog_edit import DATA, ROOT, VALIDATOR, _read, Catalog  # noqa: E402


def main():
    data = _read(DATA)
    failed = False

    block = _read(VALIDATOR).split('const NOTE_ALIASES')[1].split('])')[0]
    keys = re.findall(r"\['([^']+)', '[^']+'\],", block)
    stored = set()
    for arr in re.findall(r"(?:topNotes|heartNotes|baseNotes): \[([^\]]*)\]", data):
        stored.update(re.findall(r"'((?:[^'\\]|\\.)*)'", arr))
    hits = [k for k in keys if k in stored]
    print(f'alias keys stored as notes ({len(keys)} aliases): {hits or "none"}')
    failed |= bool(hits)

    bad = []
    for n, line in enumerate(data.splitlines(), 1):
        m = re.match(r"^\s+\w+: '(.*)',\s*$", line)
        if m and re.search(r"(?<!\\)'", m.group(1)):
            bad.append(f'{DATA}:{n}')
    print(f'unescaped quotes: {bad or "none"}')
    failed |= bool(bad)

    conflicts = Catalog().note_case_conflicts()
    print(f'note case conflicts: {conflicts or "none"}')
    failed |= bool(conflicts)

    mixed = '\r\n' in data and ('\r\r' in data or re.search(r'(?<!\r)\n', data))
    print(f'mixed newlines in {DATA}: {"yes" if mixed else "no"}')
    failed |= bool(mixed)

    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    os.chdir(ROOT)
    main()
