"""Count catalog entries with no pyramid `source`, grouped by house, to pick
the next batch. Run from the repo root:

    python scripts/catalog/unsourced.py          # counts per house
    python scripts/catalog/unsourced.py --ids    # with entry ids
    python scripts/catalog/unsourced.py Guerlain # one house's entries in detail

Names may be single- or double-quoted in data.ts; both are handled.
"""
import os
import re
import sys
from collections import defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from catalog_edit import DATA, _read  # noqa: E402


def entries():
    s = _read(DATA).replace('\r\n', '\n')
    for id_, body in re.findall(r"\n  \{\n    id: '([^']+)',(.*?)\n  \},", s, re.S):
        house = re.search(r"\n    house: (['\"])(.*?)\1,", body).group(2)
        yield id_, house, body


def field(body, key):
    m = re.search(r"\n    " + key + r": ([^\n]*)", body)
    return m.group(1).rstrip(',') if m else '-'


def main(args):
    if args and not args[0].startswith('--'):
        for id_, house, body in entries():
            if house == args[0]:
                print(id_, '|', field(body, 'name'), '|', field(body, 'price'), field(body, 'priceSizeMl'),
                      field(body, 'concentration'), field(body, 'audience'),
                      '| src' if 'source:' in body else '| NOSRC', '| ing' if 'ingredients:' in body else '| NOING')
                for key in ('topNotes', 'heartNotes', 'baseNotes', 'rationale'):
                    print('   ', key, field(body, key))
        return
    by_house = defaultdict(list)
    total = 0
    for id_, house, body in entries():
        total += 1
        if 'source:' not in body:
            by_house[house].append(id_)
    print(f'{total} entries; {sum(len(v) for v in by_house.values())} unsourced')
    for house, ids in sorted(by_house.items(), key=lambda x: (-len(x[1]), x[0])):
        print(len(ids), house, ' '.join(ids) if '--ids' in args else '')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main(sys.argv[1:])
