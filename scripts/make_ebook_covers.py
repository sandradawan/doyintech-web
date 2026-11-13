"""Draws every ebook cover in brand colours into public/ebooks/covers.

Run from the repo root on Windows, with Pillow installed: py -3 scripts/make_ebook_covers.py
Book details come from scripts/ebook-covers.json. Fonts come from C:/Windows/Fonts.
"""
import json
import math
import pathlib
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "ebooks" / "covers-bw"
FONTS = pathlib.Path("C:/Windows/Fonts")
GREEN, DARK, WHITE, ORANGE, BLACK = "#111111", "#000000", "#ffffff", "#ff8c14", "#0b0b0b"
SOFT = "#d2d2d7"
SS = 2  # draw at double size, then shrink, for clean edges
W, H = 1000, 1500


def font(name, size):
    return ImageFont.truetype(str(FONTS / name), size * SS)


class Pic:
    """A small drawing on a 100 by 100 grid, using a background, main and accent colour."""

    def __init__(self, size, bg, fg, acc):
        self.s = size * 4 / 100
        self.im = Image.new("RGB", (size * 4, size * 4), bg)
        self.d = ImageDraw.Draw(self.im)
        self.bg, self.fg, self.acc = bg, fg, acc

    def _c(self, name):
        return {"f": self.fg, "b": self.bg, "a": self.acc}[name]

    def r(self, x, y, w, h, c="f", rad=0):
        s = self.s
        self.d.rounded_rectangle([x * s, y * s, (x + w) * s, (y + h) * s], rad * s, fill=self._c(c))

    def o(self, cx, cy, rad, c="f"):
        s = self.s
        self.d.ellipse([(cx - rad) * s, (cy - rad) * s, (cx + rad) * s, (cy + rad) * s], fill=self._c(c))

    def e(self, x, y, w, h, c="f"):
        s = self.s
        self.d.ellipse([x * s, y * s, (x + w) * s, (y + h) * s], fill=self._c(c))

    def p(self, pts, c="f"):
        self.d.polygon([(x * self.s, y * self.s) for x, y in pts], fill=self._c(c))

    def l(self, pts, c="f", w=4):
        s = self.s
        pix = [(x * s, y * s) for x, y in pts]
        self.d.line(pix, fill=self._c(c), width=int(w * s), joint="curve")
        for x, y in pix:
            rad = w * s / 2
            self.d.ellipse([x - rad, y - rad, x + rad, y + rad], fill=self._c(c))

    def ring(self, cx, cy, rad, c="f", w=5):
        s = self.s
        self.d.ellipse([(cx - rad) * s, (cy - rad) * s, (cx + rad) * s, (cy + rad) * s], outline=self._c(c), width=int(w * s))

    def arc(self, cx, cy, rad, a, b, c="f", w=5):
        s = self.s
        self.d.arc([(cx - rad) * s, (cy - rad) * s, (cx + rad) * s, (cy + rad) * s], a, b, fill=self._c(c), width=int(w * s))

    def done(self, size):
        return self.im.resize((size, size), Image.LANCZOS)


def lines(g, x, y, widths, gap=9, h=3.5, c="b"):
    for i, w in enumerate(widths):
        g.r(x, y + i * gap, w, h, c)


def tick(g, x, y, c="a", w=3.5, k=1.0):
    g.l([(x, y), (x + 4 * k, y + 4 * k), (x + 11 * k, y - 5 * k)], c, w)


def certificate(g):
    g.r(20, 12, 56, 74)
    lines(g, 28, 24, [40, 40, 28, 34])
    g.o(66, 72, 15, "b")
    g.o(66, 72, 12, "a")
    tick(g, 60, 72, "b", 3)


def spreadsheet(g):
    g.r(14, 18, 72, 64)
    for x in (32, 50, 68):
        g.r(x, 18, 2, 64, "b")
    for y in (32, 46, 60, 72):
        g.r(14, y, 72, 2, "b")
    g.r(52, 48, 16, 12, "a")


def grad_cap(g):
    g.p([(30, 50), (70, 50), (70, 68), (50, 76), (30, 68)])
    g.p([(50, 22), (92, 42), (50, 62), (8, 42)], "f")
    g.p([(50, 26), (84, 42), (50, 58), (16, 42)], "f")
    g.l([(50, 42), (82, 48), (82, 68)], "a", 3)
    g.o(82, 72, 5, "a")


def remote(g):
    g.r(20, 22, 60, 42, "f", 3)
    g.r(25, 27, 50, 32, "b")
    g.p([(12, 68), (88, 68), (94, 78), (6, 78)])
    g.o(50, 43, 13, "a")
    g.arc(50, 43, 6, 0, 360, "b", 2)
    g.r(37, 42, 26, 2, "b")
    g.r(49, 30, 2, 26, "b")


def ledger(g):
    g.p([(10, 24), (48, 30), (48, 82), (10, 76)])
    g.p([(90, 24), (52, 30), (52, 82), (90, 76)])
    for i in range(4):
        g.l([(17, 36 + i * 9), (41, 40 + i * 9)], "b", 2.4)
        g.l([(83, 36 + i * 9), (59, 40 + i * 9)], "b", 2.4)
    g.p([(66, 20), (76, 20), (76, 44), (71, 39), (66, 44)], "a")


def sprout_coins(g):
    for i, y in enumerate((74, 65, 56)):
        g.e(24, y, 52, 16, "f")
        g.e(29, y + 2, 42, 9, "b" if i == 2 else "f")
    g.r(48, 28, 4, 32, "a")
    g.p([(50, 40), (28, 34), (20, 16), (42, 20)], "a")
    g.p([(50, 32), (68, 26), (78, 10), (58, 12)], "a")


def bubbles(g):
    g.r(8, 16, 60, 40, "f", 9)
    g.p([(18, 50), (34, 50), (16, 68)])
    g.r(36, 44, 56, 36, "a", 9)
    g.p([(78, 74), (64, 74), (84, 90)], "a")
    tick(g, 52, 62, "b", 3.5)
    tick(g, 62, 62, "b", 3.5)
    lines(g, 18, 26, [38, 26], 9, 3.5)


def browser(g):
    g.r(10, 18, 80, 62, "f", 4)
    g.r(14, 30, 72, 46, "b")
    for x in (17, 25, 33):
        g.o(x, 24, 2.5, "b")
    lines(g, 21, 38, [32, 24], 9, 4, "f")
    g.p([(56, 46), (84, 62), (72, 65), (79, 78), (73, 81), (66, 68), (58, 76)], "a")


def shield(g):
    g.p([(50, 10), (84, 22), (84, 48), (74, 70), (50, 90), (26, 70), (16, 48), (16, 22)])
    g.o(50, 42, 10, "a")
    g.p([(46, 46), (54, 46), (58, 68), (42, 68)], "a")


def rocket(g):
    g.p([(50, 8), (66, 30), (66, 66), (34, 66), (34, 30)])
    g.p([(34, 44), (16, 72), (34, 66)], "a")
    g.p([(66, 44), (84, 72), (66, 66)], "a")
    g.o(50, 36, 8, "b")
    g.p([(40, 70), (60, 70), (50, 94)], "a")


def chip(g):
    for i in range(4):
        g.r(30 + i * 12, 10, 4, 80)
        g.r(10, 30 + i * 12, 80, 4)
    g.r(20, 20, 60, 60, "f", 4)
    g.r(27, 27, 46, 46, "b", 2)
    g.r(39, 39, 22, 22, "a", 2)


def page_target(g):
    g.r(20, 8, 60, 84, "f", 2)
    lines(g, 30, 18, [40, 28], 9, 4)
    g.o(50, 62, 22, "b")
    g.o(50, 62, 17, "a")
    g.o(50, 62, 11, "b")
    g.o(50, 62, 5, "a")


def banknotes(g):
    g.r(20, 22, 70, 40, "f", 2)
    g.r(10, 36, 70, 42, "b", 2)
    g.r(13, 39, 70, 40, "f", 2)
    g.o(48, 59, 12, "a")
    g.r(19, 45, 8, 4, "b")
    g.r(69, 69, 8, 4, "b")


def checklist(g):
    g.r(18, 10, 64, 80, "f", 4)
    g.r(38, 5, 24, 11, "a", 2)
    for i in range(3):
        tick(g, 27, 33 + i * 20, "a", 3.5, 0.9)
        g.r(43, 30 + i * 20, 30, 4, "b")


def handshake(g):
    """A contract ready to sign, for closing a deal."""
    g.r(16, 8, 54, 84, "f", 2)
    lines(g, 25, 20, [36, 36, 26, 32], 9, 3.5)
    g.r(25, 74, 36, 2.5, "b")
    g.l([(27, 69), (32, 63), (36, 70), (41, 64), (46, 69)], "b", 2.5)
    g.p([(84, 28), (92, 36), (58, 72), (48, 76), (50, 64)], "a")


def megaphone(g):
    g.p([(14, 40), (34, 40), (72, 18), (72, 76), (34, 54), (14, 54)])
    g.r(22, 54, 12, 26)
    g.l([(80, 34), (92, 26)], "a", 4)
    g.l([(82, 47), (95, 47)], "a", 4)
    g.l([(80, 60), (92, 68)], "a", 4)


def chain(g):
    s = g.s
    g.d.rounded_rectangle([4 * s, 26 * s, 62 * s, 74 * s], 24 * s, outline=g._c("f"), width=int(10 * s))
    g.d.rounded_rectangle([38 * s, 26 * s, 96 * s, 74 * s], 24 * s, outline=g._c("a"), width=int(10 * s))


def calendar_heart(g):
    g.r(14, 20, 72, 68, "f", 4)
    g.r(26, 12, 6, 16, "a", 2)
    g.r(68, 12, 6, 16, "a", 2)
    g.r(20, 36, 60, 46, "b")
    g.o(43, 52, 8, "a")
    g.o(57, 52, 8, "a")
    g.p([(36, 56), (64, 56), (50, 74)], "a")


def headset(g):
    g.arc(50, 52, 34, 180, 360, "f", 7)
    g.r(10, 50, 14, 28, "f", 5)
    g.r(76, 50, 14, 28, "f", 5)
    g.arc(58, 64, 25, 20, 95, "a", 4)
    g.r(44, 84, 16, 8, "a", 3)


def phone_pin(g):
    g.r(26, 6, 48, 88, "f", 7)
    g.r(31, 15, 38, 66, "b")
    g.o(50, 87, 3, "b")
    g.o(50, 40, 14, "a")
    g.p([(38, 47), (62, 47), (50, 70)], "a")
    g.o(50, 40, 6, "b")


def price_tag(g):
    g.p([(12, 52), (50, 14), (86, 14), (86, 50), (48, 88)])
    g.o(72, 28, 6, "b")
    g.o(44, 54, 13, "a")
    g.r(37, 46, 3, 16, "b")
    g.r(48, 46, 3, 16, "b")
    g.p([(37, 46), (41, 46), (51, 62), (47, 62)], "b")
    g.r(34, 51, 20, 2, "b")
    g.r(34, 56, 20, 2, "b")


def map_pin(g):
    g.p([(8, 58), (34, 48), (66, 58), (92, 48), (92, 88), (66, 96), (34, 88), (8, 96)])
    g.l([(34, 50), (34, 88)], "b", 2)
    g.l([(66, 58), (66, 95)], "b", 2)
    g.o(50, 28, 22, "a")
    g.p([(31, 40), (69, 40), (50, 74)], "a")
    g.o(50, 28, 9, "b")


def jar(g):
    g.r(32, 12, 36, 8, "a", 2)
    g.r(24, 22, 52, 66, "f", 8)
    g.r(30, 28, 40, 54, "b", 5)
    for x, y in ((41, 72), (59, 72), (50, 58), (39, 48)):
        g.o(x, y, 8, "a")


def books_pencil(g):
    g.r(12, 66, 62, 14)
    g.r(18, 50, 54, 14, "a")
    g.r(12, 34, 58, 14)
    g.r(20, 70, 34, 3, "b")
    g.r(26, 54, 26, 3, "b")
    g.p([(78, 12), (90, 12), (90, 68), (84, 82), (78, 68)], "a")
    g.r(78, 18, 12, 3, "b")


def dumbbell(g):
    g.r(26, 45, 48, 10)
    g.r(14, 28, 13, 44, "f", 2)
    g.r(73, 28, 13, 44, "f", 2)
    g.r(5, 36, 8, 28, "a", 2)
    g.r(87, 36, 8, 28, "a", 2)


def pot(g):
    g.r(18, 46, 64, 40, "f", 6)
    g.r(14, 38, 72, 9, "f", 3)
    g.r(44, 30, 12, 8, "f", 2)
    g.r(6, 54, 13, 7, "f", 3)
    g.r(81, 54, 13, 7, "f", 3)
    for x in (34, 50, 66):
        g.l([(x, 24), (x + 4, 18), (x, 12), (x + 4, 6)], "a", 3)


def people(g):
    for x, c, y, k in ((24, "f", 40, 0.85), (76, "f", 40, 0.85), (50, "a", 32, 1.0)):
        g.o(x, y, 11 * k, c)
        g.p([(x - 18 * k, 88), (x - 16 * k, y + 22 * k), (x, y + 14 * k), (x + 16 * k, y + 22 * k), (x + 18 * k, 88)], c)
        if c == "a":
            g.l([(x - 20, 88), (x - 22, 56)], "b", 2)
            g.l([(x + 20, 88), (x + 22, 56)], "b", 2)


def bars_arrow(g):
    for i, h in enumerate((20, 34, 50, 68)):
        g.r(12 + i * 20, 90 - h, 14, h)
    g.l([(10, 50), (34, 34), (52, 38), (84, 12)], "a", 4)
    g.p([(90, 6), (86, 22), (74, 10)], "a")


def bulb(g):
    g.o(50, 38, 27)
    g.p([(36, 52), (64, 52), (61, 70), (39, 70)])
    g.r(39, 72, 22, 5, "a")
    g.r(42, 80, 16, 5, "a")
    g.l([(41, 46), (47, 38), (50, 44), (53, 38), (59, 46)], "b", 2.5)


def terminal(g):
    g.r(8, 16, 84, 68, "f", 4)
    g.r(12, 28, 76, 52, "b")
    for x in (15, 23, 31):
        g.o(x, 22, 2.5, "b")
    g.l([(22, 40), (34, 50), (22, 60)], "f", 4)
    g.r(40, 58, 18, 5, "a")


def scales(g):
    g.r(47, 14, 6, 66)
    g.r(30, 80, 40, 8, "f", 2)
    g.r(14, 22, 72, 5)
    g.l([(20, 26), (8, 56)], "f", 2)
    g.l([(20, 26), (32, 56)], "f", 2)
    g.l([(80, 26), (68, 56)], "f", 2)
    g.l([(80, 26), (92, 56)], "f", 2)
    g.p([(6, 56), (34, 56), (29, 66), (11, 66)])
    g.p([(66, 56), (94, 56), (89, 66), (71, 66)])
    g.o(20, 49, 7, "a")
    g.o(50, 13, 6, "a")


PICS = {
    "start-and-register-a-business-in-nigeria": certificate,
    "excel-for-office-work": spreadsheet,
    "final-year-project-guide": grad_cap,
    "land-a-remote-job-from-nigeria": remote,
    "bookkeeping-for-small-businesses-nigeria": ledger,
    "grants-and-funding-for-nigerian-smes": sprout_coins,
    "whatsapp-business-playbook": bubbles,
    "first-paying-web-clients": browser,
    "small-business-cyber-basics": shield,
    "founder-website-launch": rocket,
    "ai-for-small-business": chip,
    "one-page-marketing-plan": page_target,
    "cash-first-small-business": banknotes,
    "founder-daily-systems": checklist,
    "negotiate-and-close": handshake,
    "digital-marketing-for-smes": megaphone,
    "affiliate-marketing-starter": chain,
    "social-media-management-playbook": calendar_heart,
    "virtual-assistant-starter": headset,
    "instagram-tiktok-local-services": phone_pin,
    "price-freelance-web-nigeria": price_tag,
    "google-business-profile-sme": map_pin,
    "personal-finance-nigeria": jar,
    "student-productivity-system": books_pencil,
    "fitness-for-busy-people": dumbbell,
    "home-food-on-a-budget": pot,
    "culture-and-community-advantage": people,
    "wealth-habits": bars_arrow,
    "lifelong-learning-system": bulb,
    "prompt-engineering-playbook": terminal,
    "law-of-money-and-wealth": scales,
}


def wrap(d, text, f, width):
    out, cur = [], ""
    for word in text.split():
        trial = f"{cur} {word}".strip()
        if d.textlength(trial, font=f) <= width or not cur:
            cur = trial
        else:
            out.append(cur)
            cur = word
    return out + [cur] if cur else out


def fit_title(d, text, width, max_lines, big, small):
    for size in range(big, small - 1, -4):
        f = font("georgiab.ttf", size)
        ls = wrap(d, text, f, width * SS)
        if len(ls) <= max_lines and all(d.textlength(x, font=f) <= width * SS for x in ls):
            return f, ls, size
    f = font("georgiab.ttf", small)
    return f, wrap(d, text, f, width * SS), small


def draw_block(d, x, y, ls, f, fill, leading):
    for i, line in enumerate(ls):
        d.text((x * SS, (y + i * leading) * SS), line, font=f, fill=fill)
    return y + len(ls) * leading


def spaced(d, x, y, text, f, fill, gap):
    cx = x * SS
    for ch in text:
        d.text((cx, y * SS), ch, font=f, fill=fill)
        cx += d.textlength(ch, font=f) + gap * SS
    return cx / SS


def logo_img(size):
    im = Image.open(ROOT / "public" / "logo.png").convert("RGBA")
    return im.crop(im.getbbox()).resize((size * SS, size * SS), Image.LANCZOS)


def brand(canvas, d, x, y, ink):
    logo = logo_img(64)
    canvas.paste(logo, (x * SS, y * SS), logo)
    d.text(((x + 80) * SS, (y + 9) * SS), "DoyinTech", font=font("arialbd.ttf", 38), fill=ink)


def footer_label(d, x, y, book, ink, num):
    f = font("arialbd.ttf", 21)
    spaced(d, x, y, book["category"].upper(), f, ink, 2.5)
    d.text((x * SS, (y + 34) * SS), f"Practical guide no. {num}", font=font("arial.ttf", 25), fill=ink)


def layout_field(book, num, pic):
    """Deep green cover, big white title, picture on a white tile at the foot."""
    c = Image.new("RGB", (W * SS, H * SS), GREEN)
    d = ImageDraw.Draw(c)
    brand(c, d, 70, 64, WHITE)
    d.rectangle([70 * SS, 158 * SS, (W - 70) * SS, 161 * SS], fill=WHITE)
    f, ls, size = fit_title(d, book["title"], 850, 5, 124, 84)
    y = draw_block(d, 70, 215, ls, f, WHITE, int(size * 1.14))
    d.rectangle([70 * SS, (y + 28) * SS, 200 * SS, (y + 40) * SS], fill=ORANGE)
    sub = wrap(d, book["subtitle"], font("arial.ttf", 34), 780 * SS)
    draw_block(d, 70, y + 72, sub[:3], font("arial.ttf", 34), SOFT, 46)
    tile = Pic(340, WHITE, GREEN, ORANGE)
    pic(tile)
    framed = Image.new("RGB", (340 * SS, 340 * SS), WHITE)
    framed.paste(tile.done(280 * SS), (30 * SS, 30 * SS))
    c.paste(framed, (70 * SS, (H - 70 - 340) * SS))
    footer_label(d, 450, H - 150, book, WHITE, num)
    return c


def layout_panel(book, num, pic):
    """White title panel on deep green, with an orange foot and the picture in white on green."""
    c = Image.new("RGB", (W * SS, H * SS), GREEN)
    d = ImageDraw.Draw(c)
    brand(c, d, 70, 56, WHITE)
    f, ls, size = fit_title(d, book["title"], 850, 4, 116, 80)
    sub = wrap(d, book["subtitle"], font("arial.ttf", 33), 800 * SS)[:3]
    title_end = 205 + len(ls) * int(size * 1.14)
    panel_end = max(830, title_end + 66 + len(sub) * 45 + 50)
    d.rectangle([0, 150 * SS, W * SS, panel_end * SS], fill=WHITE)
    y = draw_block(d, 70, 205, ls, f, GREEN, int(size * 1.14))
    d.rectangle([70 * SS, (y + 26) * SS, 200 * SS, (y + 38) * SS], fill=ORANGE)
    draw_block(d, 70, y + 66, sub, font("arial.ttf", 33), "#515154", 45)
    side = min(370, H - 120 - panel_end - 70)
    tile = Pic(side, GREEN, WHITE, ORANGE)
    pic(tile)
    c.paste(tile.done(side * SS), (70 * SS, (H - 120 - 35 - side) * SS))
    d.rectangle([0, (H - 120) * SS, W * SS, H * SS], fill=ORANGE)
    footer_label(d, 70, H - 95, book, BLACK, num)
    return c


def layout_spine(book, num, pic):
    """Deep green with an orange band down the left and the picture on an orange tile."""
    c = Image.new("RGB", (W * SS, H * SS), DARK)
    d = ImageDraw.Draw(c)
    d.rectangle([0, 0, 96 * SS, H * SS], fill=ORANGE)
    strip = Image.new("RGB", (H * SS, 96 * SS), ORANGE)
    sd = ImageDraw.Draw(strip)
    spaced(sd, 70, 32, f"DOYINTECH PRACTICAL GUIDES", font("arialbd.ttf", 26), BLACK, 5)
    c.paste(strip.rotate(90, expand=True), (0, 0))
    brand(c, d, 150, 64, WHITE)
    tile = Pic(300, ORANGE, DARK, WHITE)
    pic(tile)
    framed = Image.new("RGB", (300 * SS, 300 * SS), ORANGE)
    framed.paste(tile.done(240 * SS), (30 * SS, 30 * SS))
    c.paste(framed, (150 * SS, 180 * SS))
    f, ls, size = fit_title(d, book["title"], 780, 5, 112, 76)
    y = draw_block(d, 150, 545, ls, f, WHITE, int(size * 1.14))
    sub = wrap(d, book["subtitle"], font("arial.ttf", 33), 740 * SS)
    y = draw_block(d, 150, y + 32, sub[:3], font("arial.ttf", 33), SOFT, 45)
    footer_label(d, 150, H - 130, book, WHITE, num)
    return c


LAYOUTS = (layout_field, layout_panel, layout_spine)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    books = json.loads((ROOT / "scripts" / "ebook-covers.json").read_text(encoding="utf-8"))
    for i, book in enumerate(books):
        book["subtitle"] = book["subtitle"].replace(" — ", ", ")
        pic = PICS[book["slug"]]
        cover = LAYOUTS[i % 3](book, i + 1, pic)
        cover = cover.resize((W, H), Image.LANCZOS)
        cover.save(OUT / f"{book['slug']}.jpg", quality=88, optimize=True, progressive=True, subsampling=0)
    print(len(books), "covers written to", OUT)


if __name__ == "__main__":
    main()
