#!/usr/bin/python3

# require: Pillow
import os
import sys
from PIL import Image, ImageDraw, ImageFont

# args
id = sys.argv[1]
dest = sys.argv[2]
english = sys.argv[3]
color = sys.argv[4]

# load goto
goto = Image.open("./resources/goto.png")

# set background
image = Image.alpha_composite(
        Image.new("RGBA", goto.size, (int(color[0:2], 16), int(color[2:4], 16), int(color[4:6], 16), 255)),
        goto
    )
draw = ImageDraw.Draw(image)

# overlay dest
dest_font = ImageFont.truetype("./resources/LightNovelPOPv2.otf", 48)
dest_size = draw.textsize(dest, font = dest_font)
dest_font = ImageFont.truetype("./resources/LightNovelPOPv2.otf", int(min(48 * 240 / dest_size[0], 72)))
dest_size = draw.textsize(dest, font = dest_font)
draw.text(
        ((goto.width - dest_size[0]) / 2, 180 - dest_size[1] / 2),
        dest,
        font = dest_font,
        fill = (255, 255, 255, 255)
    )

# overlay english
english_font = ImageFont.truetype("./resources/AnonymousPro-Regular.ttf", 8)
#english_size = draw.textsize(english, font = english_font)
for i in range(len(english)):
    draw.text(
            ((goto.width - len(english) * 8) / 2 + 2 + 8 * i, 224),
            english[i],
            font = english_font,
            fill = (255, 255, 255, 255)
        )

# output
if not os.path.exists("tmp"):
    os.mkdirs("tmp")
image.save("tmp/" + id + ".png")
