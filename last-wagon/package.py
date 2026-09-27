"""Build a standalone Yandex upload archive, with no repository files included."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent
out = root.parent / 'last-wagon.zip'
with ZipFile(out, 'w', ZIP_DEFLATED) as archive:
    for name in ('index.html', 'style.css', 'game.js'):
        archive.write(root / name, name)
print(out)
