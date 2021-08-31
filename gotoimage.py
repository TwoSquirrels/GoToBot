#!/usr/bin/python3

# require: Pillow
import os
import sys
from PIL import Image, ImageDraw, ImageFont

# constants
base_size = 128

# args
id = sys.argv[1]
dest = sys.argv[2]
english = sys.argv[3]
color = sys.argv[4]

# load goto
goto = Image.open("./resources/goto.png")
ratio = (goto.size[0] / base_size, goto.size[1] / base_size)

# set background
image = Image.alpha_composite(
        Image.new("RGBA", goto.size, (int(color[0:2], 16), int(color[2:4], 16), int(color[4:6], 16), 255)),
        goto
    )
draw = ImageDraw.Draw(image)

# overlay dest
dest_font = ImageFont.truetype("./resources/LightNovelPOPv2.otf", int(24 * ratio[1]))
dest_size = dest_font.getsize(dest)
dest_font = ImageFont.truetype("./resources/LightNovelPOPv2.otf", int(min(dest_font.size * 120 * ratio[0] / dest_size[0], 36 * ratio[1])))
dest_size = dest_font.getsize(dest)
draw.text(
        (int((goto.width - dest_size[0]) / 2), int(90 * ratio[1] - dest_size[1] / 2)),
        dest,
        font = dest_font,
        fill = (255, 255, 255, 255)
    )

# overlay english
english_font = ImageFont.truetype("./resources/AnonymousPro-Regular.ttf", int(4 * ratio[1]))
#english_size = draw.textsize(english, font = english_font)
for i in range(len(english)):
    draw.text(
            (int((goto.width - len(english) * english_font.size) / 2 + english_font.size / 2 + english_font.size * i), int(112 * ratio[1])),
            english[i],
            font = english_font,
            fill = (255, 255, 255, 255)
        )

# output
if not os.path.exists("tmp"):
    os.mkdirs("tmp")
image.save("tmp/" + id + ".png")
