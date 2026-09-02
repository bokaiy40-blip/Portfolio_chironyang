from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "favicon-knot-source.png"
TARGET = ROOT / "public" / "favicon-knot-v8.png"
LIME = (212, 240, 0, 255)
INK = (5, 5, 5, 255)


source = Image.open(SOURCE).convert("L")
line_mask = source.point(lambda value: value if value > 24 else 0)
bbox = line_mask.getbbox()
if bbox is None:
    raise RuntimeError("The supplied logo has no visible line artwork.")

line_mask = line_mask.crop(bbox)
line_mask = line_mask.filter(ImageFilter.MaxFilter(3))
base_mark_width = 56
base_mark_height = round(line_mask.height * base_mark_width / line_mask.width)
mark_width = round(base_mark_width * 0.7 * 0.95 * 1.3 * 1.03)
mark_height = base_mark_height
line_mask = line_mask.resize((mark_width, mark_height), Image.Resampling.LANCZOS)

canvas = Image.new("RGBA", (64, 64), LIME)
rounded_alpha = Image.new("L", (64, 64), 0)
ImageDraw.Draw(rounded_alpha).rounded_rectangle((0, 0, 63, 63), radius=13, fill=255)
canvas.putalpha(rounded_alpha)

mark = Image.new("RGBA", line_mask.size, INK)
mark.putalpha(line_mask)
mark_x = (canvas.width - mark.width) // 2
mark_y = (canvas.height - mark.height) // 2
canvas.alpha_composite(mark, (mark_x, mark_y))
canvas.save(TARGET, format="PNG", optimize=True)
print(f"wrote {TARGET}")
