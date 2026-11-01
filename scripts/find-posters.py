"""Look up posters + links for the Screen tape. No API keys needed.
- Movies: iTunes Search API (Apple permits showing artwork that links to the store).
- TV shows: TVmaze API (free, attribution requested).
Usage: python3 scripts/find-posters.py
Prints candidates; copy the poster URL and link you want into data.js.
"""
import json, urllib.parse, urllib.request

UA = {'User-Agent': 'tianas-tapes/1.0 (personal site; poster lookup)'}

def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.load(r)

def itunes_movie(term):
    out = []
    for params in ({'media': 'movie', 'entity': 'movie', 'attribute': 'movieTerm'},
                   {'media': 'movie'}, {}):
        url = 'https://itunes.apple.com/search?' + urllib.parse.urlencode(
            {'term': term, 'limit': 5, 'country': 'us', **params})
        for x in get(url).get('results', []):
            if x.get('kind') != 'feature-movie': continue
            art = x.get('artworkUrl100', '').replace('100x100bb', '600x900bb')
            out.append(f'{x.get("trackName")} | {x.get("releaseDate", "")[:4]} | {art} | {x.get("trackViewUrl")}')
        if out: break
    return out

def tvmaze(term):
    url = 'https://api.tvmaze.com/search/shows?' + urllib.parse.urlencode({'q': term})
    out = []
    for r in get(url)[:4]:
        s = r['show']
        img = (s.get('image') or {}).get('original')
        out.append(f'{s.get("name")} | {(s.get("premiered") or "")[:4]} | {img} | {s.get("url")}')
    return out

MOVIES = ['10 Things I Hate About You', 'Love and Other Drugs']
SHOWS = ['Off Campus', 'Friends', 'The Big Bang Theory', 'Suits']

for t in MOVIES:
    print(f'== {t}')
    for line in itunes_movie(t)[:3]: print('  itunes:', line)
for t in SHOWS:
    print(f'== {t}')
    for line in tvmaze(t)[:3]: print('  tvmaze:', line)
