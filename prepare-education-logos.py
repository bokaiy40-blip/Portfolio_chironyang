from pathlib import Path

import numpy as np
from PIL import Image


OUT_DIR = Path("public/education")


def crop_to_alpha(image: Image.Image, alpha: np.ndarray) -> Image.Image:
    ys, xs = np.where(alpha > 8)
    if not len(xs):
        raise RuntimeError("Logo foreground was not found")
    pad = 4
    x0, x1 = max(int(xs.min()) - pad, 0), min(int(xs.max()) + pad + 1, image.width)
    y0, y1 = max(int(ys.min()) - pad, 0), min(int(ys.max()) + pad + 1, image.height)
    rgba = np.asarray(image.convert("RGBA")).copy()
    rgba[..., 3] = alpha.astype(np.uint8)
    return Image.fromarray(rgba[y0:y1, x0:x1], "RGBA")


def prepare_dut(source: Path, output: Path) -> None:
    image = Image.open(source).convert("RGBA")
    rgb = np.asarray(image)[..., :3].astype(np.int16)
    red, green, blue = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    blue_distance = blue - red
    green_distance = blue - green
    alpha = np.clip((blue_distance - 8) * 255 / 90, 0, 255)
    alpha = np.where((blue_distance > 20) & (green_distance > 2), alpha, 0)
    crop_to_alpha(image, alpha).save(output, optimize=True)


def prepare_school(source: Path, output: Path) -> None:
    image = Image.open(source).convert("RGBA")
    rgb = np.asarray(image)[..., :3].astype(np.int16)
    minimum = rgb.min(axis=2)
    maximum = rgb.max(axis=2)
    alpha = np.clip((minimum - 92) * 255 / 150, 0, 255)
    alpha = np.where((minimum > 105) & ((maximum - minimum) < 70), alpha, 0)
    rgba = np.zeros_like(np.asarray(image))
    rgba[..., :3] = (148, 27, 31)
    rgba[..., 3] = alpha.astype(np.uint8)
    crop_to_alpha(Image.fromarray(rgba, "RGBA"), alpha).save(output, optimize=True)


OUT_DIR.mkdir(parents=True, exist_ok=True)
prepare_dut(
    Path(r"C:\Users\MECHREVO\AppData\Local\Temp\codex-clipboard-79dec14b-5c7e-46ef-9882-6052f30ea382.png"),
    OUT_DIR / "dut-logo-clear.png",
)
prepare_school(
    Path(r"C:\Users\MECHREVO\AppData\Local\Temp\codex-clipboard-06dbe8bd-b1e4-493c-9c02-6d79ebbe45f4.png"),
    OUT_DIR / "school-logo-clear.png",
)
for output in (OUT_DIR / "dut-logo-clear.png", OUT_DIR / "school-logo-clear.png"):
    with Image.open(output) as image:
        print(f"{output}: {image.size}, {image.mode}")
