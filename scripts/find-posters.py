"""Look up posters + links for the Screen tape. No API keys needed.
- Movies: English Wikipedia page summary (poster image + article link).
- TV shows: TVmaze API (free, attribution requested).
Usage: python3 scripts/find-posters.py
Prints data.js-ready lines; copy the ones you want into data.js.
Edit MOVIES / SHOWS below. For movies give the exact Wikipedia article title.
"""
import json, urllib.parse, urllib.request

UA = {'User-Agent': 'tianas-tapes/1.0 (personal site; poster lookup)'}

def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.load(r)

def wiki(display, article):
    url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + urllib.parse.quote(article)
    try:
        d = get(url)
        img = (d.get('originalimage') or {}).get('source', '')
        img = img.split('?')[0]
        link = (d.get('content_urls') or {}).get('desktop', {}).get('page', '')
        return display, img, link, d.get('title')
    except Exception as e:
        return display, '', '', f'ERROR {e}'

def tvmaze(display, q):
    url = 'https://api.tvmaze.com/search/shows?' + urllib.parse.urlencode({'q': q})
    try:
        s = get(url)[0]['show']
        img = ((s.get('image') or {}).get('medium') or '')
        return display, img, s.get('url', ''), f'{s.get("name")} ({(s.get("premiered") or "")[:4]})'
    except Exception as e:
        return display, '', '', f'ERROR {e}'

# (display title, Wikipedia article title)
MOVIES = [
    ('Notting Hill', 'Notting_Hill_(film)'),
    ("To All the Boys I've Loved Before", "To_All_the_Boys_I've_Loved_Before_(film)"),
    ('Begin Again', 'Begin_Again_(film)'),
    ('Set It Up', 'Set_It_Up'),
    ('The Idea of You', 'The_Idea_of_You_(film)'),
    ('Love Actually', 'Love_Actually'),
    ('A Family Affair', 'A_Family_Affair_(2024_film)'),
    ('Your Place or Mine', 'Your_Place_or_Mine_(film)'),
    ('The Intern', 'The_Intern_(2015_film)'),
    ('The Devil Wears Prada', 'The_Devil_Wears_Prada_(film)'),
    ('It Ends with Us', 'It_Ends_with_Us_(film)'),
    ('Love Guaranteed', 'Love,_Guaranteed'),
    ('Purple Hearts', 'Purple_Hearts_(2022_film)'),
    ('The Fall Guy', 'The_Fall_Guy_(2024_film)'),
    ('Barbie', 'Barbie_(film)'),
]
# (display title, TVmaze search query)
SHOWS = [
    ('The Summer I Turned Pretty', 'The Summer I Turned Pretty'),
    ('Sex Education', 'Sex Education'),
    ('Sex and the City', 'Sex and the City'),
    ('Sex/Life', 'Sex/Life'),
]

for display, article in MOVIES:
    d, img, link, note = wiki(display, article)
    print(f"      {{ title: {json.dumps(d, ensure_ascii=False)}, poster: '{img}', link: '{link}' }},  // {note}")
for display, q in SHOWS:
    d, img, link, note = tvmaze(display, q)
    print(f"      {{ title: {json.dumps(d, ensure_ascii=False)}, poster: '{img}', link: '{link}' }},  // {note}")
