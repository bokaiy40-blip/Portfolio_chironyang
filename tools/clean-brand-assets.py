from pathlib import Path

from PIL import Image


BRANDS = Path(__file__).resolve().parents[1] / "public" / "brands"
INK = (5, 5, 5)
BACKGROUND_THRESHOLD = 150
SOLID_THRESHOLD = 15


def clean(path: Path) -> None:
    image = Image.open(path).convert("RGBA")
    pixels = []
    for red, green, blue, alpha in image.getdata():
        if alpha == 0:
            pixels.append((*INK, 0))
            continue

        luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue
        if luminance >= BACKGROUND_THRESHOLD:
            next_alpha = 0
        elif luminance <= SOLID_THRESHOLD:
            next_alpha = alpha
        else:
            next_alpha = round(alpha * (BACKGROUND_THRESHOLD - luminance) / (BACKGROUND_THRESHOLD - SOLID_THRESHOLD))
        pixels.append((*INK, next_alpha))

    image.putdata(pixels)
    bbox = image.getchannel("A").getbbox()
    if bbox:
        pad = 8
        left = max(0, bbox[0] - pad)
        top = max(0, bbox[1] - pad)
        right = min(image.width, bbox[2] + pad)
        bottom = min(image.height, bbox[3] + pad)
        image = image.crop((left, top, right, bottom))
    image.save(path, format="PNG", optimize=True)


for asset in sorted(BRANDS.glob("*.png")):
    clean(asset)
    print(f"cleaned {asset.name}")
