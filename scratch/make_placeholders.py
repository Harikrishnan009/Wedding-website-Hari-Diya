import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

os.makedirs("assets", exist_ok=True)

placeholders = [
    (5, "Sunset Promise", (40, 25, 30), (168, 82, 93)),
    (6, "Starlit Moment", (23, 15, 17), (223, 192, 123)),
    (7, "Golden Hour", (55, 30, 35), (200, 160, 100)),
    (8, "Forever & Always", (30, 20, 25), (180, 120, 130)),
    (9, "Heart in Hand", (25, 18, 22), (212, 175, 55)),
    (10, "Eternal Bond", (35, 22, 28), (195, 145, 90))
]

width, height = 1024, 1024

for num, title, c1, c2 in placeholders:
    img = Image.new("RGB", (width, height), c1)
    draw = ImageDraw.Draw(img)
    
    # Create radial background glow
    for r in range(width, 0, -10):
        factor = r / width
        rr = int(c1[0] * factor + c2[0] * (1 - factor))
        gg = int(c1[1] * factor + c2[1] * (1 - factor))
        bb = int(c1[2] * factor + c2[2] * (1 - factor))
        draw.ellipse([width/2 - r, height/2 - r, width/2 + r, height/2 + r], fill=(rr, gg, bb))
    
    # Add subtle blur to smooth gradient
    img = img.filter(ImageFilter.GaussianBlur(15))
    draw = ImageDraw.Draw(img)
    
    # Gold border
    draw.rectangle([30, 30, width - 30, height - 30], outline=(223, 192, 123), width=2)
    draw.rectangle([45, 45, width - 45, height - 45], outline=(223, 192, 123, 128), width=1)
    
    # Center text
    try:
        font_large = ImageFont.truetype("arial.ttf", 42)
        font_small = ImageFont.truetype("arial.ttf", 24)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
        
    draw.text((width/2, height/2 - 20), f"Pre-Wedding Moment #{num}", fill=(250, 240, 242), font=font_large, anchor="mm")
    draw.text((width/2, height/2 + 40), title, fill=(223, 192, 123), font=font_small, anchor="mm")
    
    out_path = f"assets/shoot_placeholder_{num}.png"
    img.save(out_path)
    print(f"Created {out_path}")
