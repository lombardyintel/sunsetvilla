"""Build demo.html from index.html.

The demo is the same game with:
- its own save (so it never touches a real playthrough),
- preview time on (tap to skip time), tutorial off, every feature open,
- a demo control bar above the phone (tools/demo.js).

Run from the repo root: python3 tools/build_demo.py
"""
import pathlib

root = pathlib.Path(__file__).resolve().parent.parent
html = (root / "index.html").read_text()

keys = "const CK='sv_career_v1',SK='sv_season_v1';"
assert keys in html, "storage keys not found"
html = html.replace(keys, "const CK='sv_demo_career',SK='sv_demo_season';")

seed = """<script>try{if(!localStorage.getItem('sv_demo_career'))localStorage.setItem('sv_demo_career',JSON.stringify({onb:{on:false,done:true},preview:true,ladderSim:99,ladderSeen:99}))}catch(e){}</script>\n"""
first_script = '<script src="./dialogue.js"></script>'
assert first_script in html
html = html.replace(first_script, seed + first_script, 1)

html = html.replace("<title>Sunset Villa concept</title>", "<title>Sunset Villa · Demo</title>", 1)

end = html.rfind("\n}\n</script>")
assert end > 0, "main script end not found"
html = html[:end] + "\n" + (root / "tools" / "demo.js").read_text() + html[end:]

(root / "demo.html").write_text(html)
print("wrote demo.html", len(html))
