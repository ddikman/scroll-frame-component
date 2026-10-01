"""Generate the local SVG pages used by the Vite example. Standard library only."""

from html import escape
from pathlib import Path


OUT = Path(__file__).resolve().parents[1] / "example/public/samples"
OUT.mkdir(parents=True, exist_ok=True)


def rect(x, y, width, height, fill, radius=0):
    return f'<rect x="{x}" y="{y}" width="{width}" height="{height}" rx="{radius}" fill="{fill}"/>'


def line(x1, y1, x2, y2, color="#45493f"):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}"/>'


def circle(x, y, radius, fill):
    return f'<circle cx="{x}" cy="{y}" r="{radius}" fill="{fill}"/>'


def text(x, y, content, size, color="#f4f2e9", weight=500, spacing=0):
    return (
        f'<text x="{x}" y="{y}" fill="{color}" font-family="Arial, Helvetica, sans-serif" '
        f'font-size="{size}" font-weight="{weight}" letter-spacing="{spacing}">{escape(content)}</text>'
    )


def artwork(x, y, width, height, kind):
    background = "#292f2a" if kind == 0 else "#313638"
    result = [rect(x, y, width, height, background, 12)]
    if kind == 0:
        result += [
            circle(x + width * .53, y + height * .49, min(width, height) * .30, "#afc996"),
            circle(x + width * .53, y + height * .49, min(width, height) * .21, background),
            rect(x + width * .10, y + height * .12, width * .20, 3, "#f4f2e9"),
        ]
    else:
        for index in range(7):
            result.append(rect(x + width * (.14 + index * .105), y + height * .13,
                               width * .046, height * .68,
                               "#d5a788" if index % 2 else "#e7cbb8", width * .022))
        result.append(circle(x + width * .68, y + height * .47, min(width, height) * .15, background))
    result += [
        rect(x + width * .07, y + height * .84, width * .40, height * .10, background, 4),
        text(x + width * .10, y + height * .90, "STUDIO / 001" if kind == 0 else "OBJECT / 002",
             max(12, width * .035), weight=700, spacing=2),
    ]
    return result


def generate(name, cfg):
    width, height, margin = cfg["width"], cfg["height"], cfg["margin"]
    inner = width - 2 * margin
    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
           rect(0, 0, width, height, "#10130f")]
    svg += [
        text(margin, cfg["nav_y"], "FOLIO.", cfg["nav_size"], weight=800, spacing=-1),
        text(width - margin - cfg["menu_width"], cfg["nav_y"], "MENU  +", cfg["menu_size"], "#c1c7b6", 700, 1),
        line(margin, cfg["nav_line"], width - margin, cfg["nav_line"]),
    ]
    for label, baseline, color in zip(["WE MAKE", "IDEAS", "MOVE."], cfg["hero_y"],
                                      ["#f4f2e9", "#f4f2e9", "#b3cc98"]):
        svg.append(text(margin, baseline, label, cfg["hero_size"], color, 700, cfg["hero_spacing"]))
    cx, cy, radius = width / 2, cfg["orb_y"], cfg["orb_radius"]
    svg += [circle(cx, cy, radius, "#b3cc98"), circle(cx, cy, radius * .68, "#10130f"),
            circle(cx, cy, radius * .27, "#b3cc98")]
    svg += [line(margin, cfg["hero_line"], width - margin, cfg["hero_line"]),
            text(margin, cfg["tag_y"][0], "INDEPENDENT CREATIVE PRACTICE", cfg["tag_size"], "#b9c1b0", 700, 2),
            text(margin, cfg["tag_y"][1], "Designing digital moments with purpose.", cfg["tag_body_size"], "#818b7b")]
    for baseline, label in zip(cfg["selected_y"], ["SELECTED", "WORK."]):
        svg.append(text(margin, baseline, label, cfg["selected_size"], weight=700, spacing=-2))
    card_y, card_h = cfg["cards_y"], cfg["card_height"]
    if name == "phone":
        svg += artwork(margin, card_y, inner, card_h, 0)
        svg += artwork(margin, card_y + card_h + 20, inner, card_h, 1)
    else:
        gap = cfg["card_gap"]
        card_w = (inner - gap) / 2
        svg += artwork(margin, card_y, card_w, card_h, 0)
        svg += artwork(margin + card_w + gap, card_y, card_w, card_h, 1)
    svg += [line(margin, cfg["work_line"], width - margin, cfg["work_line"]),
            text(margin, cfg["work_label_y"], "HOW WE WORK", cfg["work_label_size"], "#b3cc98", 700, 2)]
    for baseline, label in zip(cfg["work_title_y"], ["SMALL TEAM.", "BIG IDEAS."]):
        svg.append(text(margin, baseline, label, cfg["work_title_size"], weight=700, spacing=-3))
    for baseline, label in zip(cfg["description_y"], cfg["description"]):
        svg.append(text(margin, baseline, label, cfg["description_size"], "#aeb7a8"))
    svg.append(line(margin, cfg["stats_line"], width - margin, cfg["stats_line"]))
    for index, (number, label) in enumerate([("12", "YEARS MAKING"), ("48", "PROJECTS SHIPPED"),
                                            ("09", "COUNTRIES REACHED")]):
        x = margin + index * inner / 3
        svg += [text(x, cfg["stats_y"], number, cfg["stats_size"], "#b3cc98", 700, -3),
                text(x, cfg["stats_label_y"], label, cfg["stats_label_size"], "#b8c1b0", 700, 1)]
    svg += [line(margin, cfg["footer_line"], width - margin, cfg["footer_line"]),
            text(margin, cfg["footer_title_y"], "LET’S TALK.", cfg["footer_title_size"], weight=700, spacing=-3),
            text(margin, cfg["footer_bottom_y"], "FOLIO.  © 2026", cfg["footer_small_size"], "#859080", 700, 1),
            text(width - margin - cfg["footer_right_width"], cfg["footer_bottom_y"], "BACK TO TOP ↑",
                 cfg["footer_small_size"], "#859080", 700, 1), "</svg>"]
    (OUT / f"{name}.svg").write_text("\n".join(svg) + "\n", encoding="utf-8")


generate("phone", dict(width=390, height=2350, margin=24, nav_y=55, nav_size=22,
    menu_width=54, menu_size=11, nav_line=76, hero_y=[150, 219, 288], hero_size=65,
    hero_spacing=-4, orb_y=450, orb_radius=76, hero_line=570, tag_y=[610, 638],
    tag_size=12, tag_body_size=13, selected_y=[770, 813], selected_size=38,
    cards_y=850, card_height=350, work_line=1610, work_label_y=1660,
    work_label_size=12, work_title_y=[1750, 1800], work_title_size=42,
    description_y=[1870, 1897], description=["Strategy, design and development", "for the next generation of brands."],
    description_size=17, stats_line=1990, stats_y=2070, stats_label_y=2105,
    stats_size=46, stats_label_size=8, footer_line=2190, footer_title_y=2270,
    footer_title_size=44, footer_bottom_y=2320, footer_small_size=10, footer_right_width=82))

generate("tablet", dict(width=768, height=3000, margin=52, nav_y=75, nav_size=31,
    menu_width=104, menu_size=16, nav_line=100, hero_y=[250, 380, 510], hero_size=125,
    hero_spacing=-8, orb_y=760, orb_radius=150, hero_line=960, tag_y=[1005, 1035],
    tag_size=18, tag_body_size=20, selected_y=[1200, 1275], selected_size=68,
    cards_y=1380, card_height=420, card_gap=24, work_line=1840, work_label_y=1900,
    work_label_size=18, work_title_y=[2020, 2100], work_title_size=72,
    description_y=[2170, 2203], description=["Strategy, design and development", "for the next generation of brands."],
    description_size=22, stats_line=2360, stats_y=2460, stats_label_y=2500,
    stats_size=80, stats_label_size=12, footer_line=2690, footer_title_y=2820,
    footer_title_size=85, footer_bottom_y=2950, footer_small_size=15, footer_right_width=130))

generate("desktop", dict(width=1440, height=3600, margin=90, nav_y=90, nav_size=31,
    menu_width=104, menu_size=16, nav_line=125, hero_y=[380, 590, 800], hero_size=205,
    hero_spacing=-8, orb_y=1130, orb_radius=220, hero_line=1410, tag_y=[1460, 1500],
    tag_size=20, tag_body_size=23, selected_y=[1680, 1790], selected_size=108,
    cards_y=1900, card_height=520, card_gap=35, work_line=2470, work_label_y=2530,
    work_label_size=20, work_title_y=[2680, 2800], work_title_size=110,
    description_y=[2900], description=["Strategy, design and development for the next generation of brands."],
    description_size=32, stats_line=3090, stats_y=3220, stats_label_y=3280,
    stats_size=130, stats_label_size=17, footer_line=3370, footer_title_y=3500,
    footer_title_size=120, footer_bottom_y=3570, footer_small_size=16, footer_right_width=130))
