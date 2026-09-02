from pathlib import Path

from PIL import Image


SOURCE = Path(r"C:\Users\MECHREVO\AppData\Local\Temp\codex-clipboard-8f099ede-b916-4b06-98a1-1d2623532137.png")
TARGET = Path(__file__).resolve().parents[1] / "src" / "assets" / "competition-more-icon.png"
BACKGROUND = (210, 255, 0)


image = Image.open(SOURCE).convert("RGB")
pixels = []
for red, green, _blue in image.getdata():
    contrast = (1 - red / BACKGROUND[0]) * 0.58 + (1 - green / BACKGROUND[1]) * 0.42
    alpha = max(0, min(1, contrast * 1.25))
    pixels.append((6, 6, 6, round(alpha * 255)))

rgba = Image.new("RGBA", image.size)
rgba.putdata(pixels)
alpha_mask = rgba.getchannel("A").point(lambda value: 255 if value > 12 else 0)
cropped = rgba.crop(alpha_mask.getbbox())
padding = 3
canvas = Image.new("RGBA", (cropped.width + padding * 2, cropped.height + padding * 2), (0, 0, 0, 0))
canvas.paste(cropped, (padding, padding))
canvas.save(TARGET, format="PNG", optimize=True)
print(f"wrote {TARGET} ({canvas.width}x{canvas.height})")
