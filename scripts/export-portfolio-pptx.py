from html import escape
from zipfile import ZIP_DEFLATED, ZipFile
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "obiari-uche-portfolio.pptx"
SW, SH = 12192000, 6858000  # 16:9 widescreen
BURGUNDY = "450B22"
IVORY = "FFF9E0"
MUTED = "765E68"
BLUE = "0D59CC"
PALE = "D4C2C6"

def color(hex_color):
    return f'<a:solidFill><a:srgbClr val="{hex_color}"/></a:solidFill>'

def shape_text(idx, x, y, w, h, text, size=1800, fill=BURGUNDY, bold=False,
               italic=False, font="Aptos", align="l", charspace=0):
    font_attrs = f' sz="{size}" spc="{charspace}"' + (' b="1"' if bold else '') + (' i="1"' if italic else '')
    paras = []
    for line in text.split("\n"):
        paras.append(
            f'<a:p><a:pPr algn="{align}"/><a:r><a:rPr lang="en-US"{font_attrs} dirty="0">'
            f'{color(fill)}<a:latin typeface="{font}"/></a:rPr>'
            f'<a:t xml:space="preserve">{escape(line)}</a:t></a:r><a:endParaRPr lang="en-US"/></a:p>'
        )
    return (f'<p:sp><p:nvSpPr><p:cNvPr id="{idx}" name="Text {idx}"/><p:cNvSpPr txBox="1"/>'
            f'<p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{w}" cy="{h}"/></a:xfrm>'
            f'<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></p:spPr>'
            f'<p:txBody><a:bodyPr wrap="square" lIns="0" rIns="0" tIns="0" bIns="0" anchor="t"/><a:lstStyle/>'
            f'{"".join(paras)}</p:txBody></p:sp>')

def shape_rect(idx, x, y, w, h, fill, line=None):
    line_xml = '<a:ln><a:noFill/></a:ln>' if not line else f'<a:ln w="12000">{color(line)}</a:ln>'
    return (f'<p:sp><p:nvSpPr><p:cNvPr id="{idx}" name="Shape {idx}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>'
            f'<p:spPr><a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{w}" cy="{h}"/></a:xfrm>'
            f'<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>{color(fill)}{line_xml}</p:spPr></p:sp>')

def shape_line(idx, x, y, w, hex_color=BURGUNDY):
    return (f'<p:sp><p:nvSpPr><p:cNvPr id="{idx}" name="Rule {idx}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>'
            f'<p:spPr><a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{w}" cy="0"/></a:xfrm>'
            f'<a:prstGeom prst="line"><a:avLst/></a:prstGeom><a:ln w="11000">{color(hex_color)}</a:ln></p:spPr></p:sp>')

def slide_xml(shapes, bg=IVORY):
    tree = ('<p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
            '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>')
    tree += shape_rect(2, 0, 0, SW, SH, bg)
    tree += "".join(shapes) + "</p:spTree>"
    return (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            f'<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
            f'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
            f'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld>{tree}</p:cSld>'
            '<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>')

def label_shapes(section, number):
    return [shape_text(3, 520000, 260000, 5500000, 220000, "OBIARI UCHE  /  PORTFOLIO", 1100, BURGUNDY, True, charspace=120),
            shape_text(4, 520000, 580000, 5700000, 220000, section.upper(), 1000, MUTED, charspace=120),
            shape_text(5, 11100000, 260000, 450000, 220000, f"{number:02}", 1000, BLUE, charspace=80),
            shape_line(6, 520000, 900000, 10900000)]

slides = []
# 1: Cover
s = [shape_rect(3, 0, 0, 150000, SH, BLUE),
     shape_text(4, 650000, 720000, 6500000, 300000, "OBIARI UCHE  -  2026", 1300, IVORY, charspace=140),
     shape_line(5, 650000, 1120000, 10900000, PALE),
     shape_text(6, 650000, 1750000, 10000000, 850000, "Driving Function", 4300, IVORY, italic=True, font="Georgia"),
     shape_text(7, 650000, 2680000, 10000000, 850000, "in Wellness:", 4300, PALE, italic=True, font="Georgia"),
     shape_text(8, 650000, 3650000, 10800000, 800000, "one idea at a time.", 3600, IVORY, bold=True),
     shape_rect(9, 650000, 4780000, 950000, 55000, BLUE),
     shape_text(10, 650000, 5100000, 9000000, 700000, "A selected portfolio of product building, health technology, research, and systems thinking.", 1900, IVORY, font="Georgia", italic=True),
     shape_text(11, 650000, 6170000, 9000000, 250000, "PRODUCT  /  RESEARCH  /  WELLNESS     •     NEW YORK  /  CHICAGO", 1200, PALE, charspace=90)]
slides.append(slide_xml(s, BURGUNDY))

# 2: Health technology
s = label_shapes("Health technology", 2)
s += [shape_text(7, 520000, 1130000, 10000000, 600000, "Building clearer care experiences", 3000, BURGUNDY, True),
      shape_text(8, 520000, 1760000, 2500000, 220000, "2025 - 2026", 1200, BLUE, charspace=80),
      shape_text(9, 3100000, 1760000, 8000000, 300000, "DIGITAL TWIN PATTERN SYSTEMS  /  ORACLE HEALTH", 1700, BURGUNDY, True),
      shape_text(10, 3100000, 2110000, 7700000, 680000, "Frontend architecture for facility maps, body maps, and medical device twin configuration, expanding a 3D object library.", 1700, MUTED, font="Georgia"),
      shape_line(11, 520000, 3000000, 10900000),
      shape_text(12, 520000, 3270000, 2500000, 220000, "2024 - 2025", 1200, BLUE, charspace=80),
      shape_text(13, 3100000, 3270000, 8000000, 300000, "CLINICAL SCHEDULER  /  ORACLE HEALTH", 1700, BURGUNDY, True),
      shape_text(14, 3100000, 3620000, 7700000, 680000, "Scheduling across calendar, week, day, and month views, connecting patient data, appointments, and reporting.", 1700, MUTED, font="Georgia"),
      shape_line(15, 520000, 4500000, 10900000),
      shape_text(16, 520000, 4770000, 2500000, 220000, "2023", 1200, BLUE, charspace=80),
      shape_text(17, 3100000, 4770000, 8000000, 300000, "HOSPITAL MANAGEMENT DASHBOARD", 1700, BURGUNDY, True),
      shape_text(18, 3100000, 5120000, 7700000, 680000, "Dashboard visualizations for operational KPIs, connecting appointment data to Oracle HCM services.", 1700, MUTED, font="Georgia"),
      shape_text(19, 520000, 6240000, 7000000, 250000, "ORACLE HEALTH  /  ORACLE DESIGN ENGINEERING", 1100, MUTED, charspace=90)]
slides.append(slide_xml(s))

# 3: Product and community
s = label_shapes("Products & community", 3)
s += [shape_text(7, 520000, 1130000, 10000000, 600000, "Technology with a social purpose", 3000, BURGUNDY, True),
      shape_rect(8, 520000, 1830000, 5000000, 3200000, "F8F2DD", BURGUNDY),
      shape_text(9, 800000, 2130000, 4400000, 260000, "2022 - 2026  /  PRODUCT BUILDER", 1100, BLUE, True, charspace=80),
      shape_text(10, 800000, 2530000, 4400000, 430000, "GOODSENSSE DIGITAL", 2200, BURGUNDY, True),
      shape_text(11, 800000, 3030000, 4300000, 1450000, "Social wellness software and digital consulting for community wellbeing. Product suite includes Inheritance, Heritage, and Safe.", 1800, MUTED, font="Georgia"),
      shape_text(12, 800000, 4670000, 4300000, 260000, "SOCIAL WELLNESS  /  DIGITAL CONSULTING", 1000, BURGUNDY, charspace=55),
      shape_text(13, 6000000, 1950000, 4900000, 300000, "GOOGLE  /  2022 - 2024", 1300, BLUE, True),
      shape_text(14, 6000000, 2320000, 4900000, 320000, "Community Leaders", 2100, BURGUNDY, True),
      shape_text(15, 6000000, 2690000, 4900000, 800000, "Student advisory and workshops supporting nonprofits and small businesses with ads, search, SEO, and community initiatives.", 1600, MUTED, font="Georgia"),
      shape_line(16, 6000000, 3860000, 4900000, PALE),
      shape_text(17, 6000000, 4170000, 4900000, 300000, "DELOITTE  /  2022", 1300, BLUE, True),
      shape_text(18, 6000000, 4540000, 4900000, 320000, "Discovery II Consultant", 2100, BURGUNDY, True),
      shape_text(19, 6000000, 4910000, 4900000, 700000, "UX and business technology consulting for augmented reality simulation experiences in public services.", 1600, MUTED, font="Georgia"),
      shape_text(20, 520000, 5830000, 10000000, 370000, "Approach: turn complex systems into intuitive tools that support people and communities.", 1700, BURGUNDY, italic=True, font="Georgia")]
slides.append(slide_xml(s))

# 4: Research
s = label_shapes("Research & writing", 4)
s += [shape_text(7, 520000, 1130000, 10000000, 560000, "Research for more precise, preventative care", 2800, BURGUNDY, True),
      shape_text(8, 520000, 1730000, 10500000, 380000, "How imaging, clinical twins, and noninvasive technologies may help manage chronic conditions.", 1650, MUTED, italic=True, font="Georgia")]
research = [
    ("01", "MEDICAL IMAGING", "Clinical context and patient-specific imaging for anatomically accurate views of individual health needs.", "DICOM / 3D SLICER / Z-ANATOMY"),
    ("02", "CLINICAL DIGITAL TWINS", "Digital representations and simulation to support visualization, planning, and preventative care.", "BLENDER / UNITY / UNREAL / SOLIDWORKS"),
    ("03", "NONINVASIVE MEDICINE", "Emerging biopharma and medical technologies for more targeted diagnosis and treatment.", "BOTANICAL / ALTERNATIVE MEDICINE")]
for i, (n, title, desc, tools) in enumerate(research):
    x = 520000 + i * 3650000
    s.extend([shape_line(9 + i * 4, x, 2420000, 3200000),
              shape_text(10 + i * 4, x, 2490000, 500000, 220000, n, 1100, BLUE),
              shape_text(11 + i * 4, x, 2780000, 3200000, 450000, title, 1400, BURGUNDY, True),
              shape_text(12 + i * 4, x, 3260000, 3200000, 850000, desc, 1450, MUTED, font="Georgia"),
              shape_text(13 + i * 4, x, 4140000, 3200000, 300000, tools, 900, BLUE, charspace=30)])
s += [shape_line(21, 520000, 4750000, 10900000),
      shape_text(22, 520000, 4940000, 5000000, 250000, "SELECTED WRITING", 1100, MUTED, True, charspace=100),
      shape_text(23, 520000, 5300000, 4800000, 260000, "CONSCIOUSNESS & ART", 1300, BURGUNDY, True),
      shape_text(24, 520000, 5660000, 5000000, 700000, "Afrosurrealism Through Art  /  Measurement of Consciousness  /  Will and Awareness  /  Optimal Consciousness", 1300, MUTED, font="Georgia"),
      shape_text(25, 6200000, 5300000, 4700000, 260000, "INDEPENDENT & GRADUATE", 1300, BURGUNDY, True),
      shape_text(26, 6200000, 5660000, 4700000, 700000, "Clinical review and quantitative analysis of biotech markets, biomedical imaging, and fairness in AI.", 1300, MUTED, font="Georgia")]
slides.append(slide_xml(s))

# 5: About and contact
s = label_shapes("About & contact", 5)
s += [shape_text(7, 520000, 1130000, 9500000, 600000, "Designing for human wellness", 3100, BURGUNDY, True),
      shape_text(8, 520000, 1820000, 2600000, 250000, "PHILOSOPHY", 1100, MUTED, True, charspace=100),
      shape_text(9, 520000, 2200000, 6500000, 1600000, "Bridge emerging technology and social equity by building digital solutions that empower underserved communities and modernize health and wellness. Translate complex data - from anatomical modeling to financial systems - into intuitive tools that support people and communities.\n\nGuided by a commitment to do good and rigorous systems thinking, with the aim of driving function in wellness.", 1650, MUTED, font="Georgia"),
      shape_line(10, 7700000, 1830000, 3700000),
      shape_text(11, 7700000, 1990000, 3600000, 280000, "VALUES", 1100, MUTED, True, charspace=100),
      shape_text(12, 7700000, 2430000, 3900000, 1500000, "AUTHENTICITY\nINTEGRITY\nFAIRNESS\nRESPECT", 2100, BURGUNDY, True),
      shape_rect(13, 520000, 4310000, 10900000, 1100000, "F8F2DD", BURGUNDY),
      shape_text(14, 780000, 4500000, 3000000, 220000, "CURRENT", 1000, BLUE, True, charspace=100),
      shape_text(15, 780000, 4780000, 10000000, 300000, "Goodsensse Product Builder", 1900, BURGUNDY, True),
      shape_text(16, 780000, 5130000, 10000000, 250000, "MBA x MS Engineering Candidate, Columbia University  /  Entrepreneurship & Medical Device Design", 1300, MUTED, font="Georgia"),
      shape_text(17, 520000, 5740000, 2000000, 230000, "CONTACT", 1000, MUTED, True, charspace=100),
      shape_text(18, 520000, 6060000, 4500000, 250000, "obiariuche@gmail.com", 1500, BURGUNDY, True),
      shape_text(19, 520000, 6370000, 8500000, 230000, "linkedin.com/in/obiari-ugwu-uche-abb497202     /     NEW YORK  /  CHICAGO", 1050, BLUE)]
slides.append(slide_xml(s))

def rels(items):
    return ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
            ''.join(f'<Relationship Id="{rid}" Type="{typ}" Target="{target}"/>' for rid, typ, target in items) +
            '</Relationships>')

presentation = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
 '<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
 'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">'
 '<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:sldIdLst>'
 + ''.join(f'<p:sldId id="{255+i}" r:id="rId{i+2}"/>' for i in range(len(slides))) +
 f'</p:sldIdLst><p:sldSz cx="{SW}" cy="{SH}" type="screen16x9"/><p:notesSz cx="6858000" cy="9144000"/>'
 '<p:defaultTextStyle><a:defPPr><a:defRPr lang="en-US"/></a:defPPr></p:defaultTextStyle></p:presentation>')

master = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
 '<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
 'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree>'
 '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr>'
 '<a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm>'
 '</p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="1" r:id="rId1"/></p:sldLayoutIdLst></p:sldMaster>')
layout = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
 '<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
 'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1">'
 '<p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
 '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'
 '</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>')

content_types = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
 '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
 '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
 '<Default Extension="xml" ContentType="application/xml"/>'
 '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>'
 '<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>'
 '<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>'
 + ''.join(f'<Override PartName="/ppt/slides/slide{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>' for i in range(1, len(slides)+1))
 + '</Types>')

OUT.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(OUT, "w", ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", content_types)
    z.writestr("_rels/.rels", rels([("rId1", "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument", "ppt/presentation.xml")]))
    z.writestr("ppt/presentation.xml", presentation)
    z.writestr("ppt/_rels/presentation.xml.rels", rels(
        [("rId1", "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster", "slideMasters/slideMaster1.xml")]
        + [(f"rId{i+2}", "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide", f"slides/slide{i+1}.xml") for i in range(len(slides))]))
    z.writestr("ppt/slideMasters/slideMaster1.xml", master)
    z.writestr("ppt/slideMasters/_rels/slideMaster1.xml.rels", rels([("rId1", "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout", "../slideLayouts/slideLayout1.xml")]))
    z.writestr("ppt/slideLayouts/slideLayout1.xml", layout)
    z.writestr("ppt/slideLayouts/_rels/slideLayout1.xml.rels", rels([("rId1", "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster", "../slideMasters/slideMaster1.xml")]))
    for i, slide in enumerate(slides, 1):
        z.writestr(f"ppt/slides/slide{i}.xml", slide)
        z.writestr(f"ppt/slides/_rels/slide{i}.xml.rels", rels([("rId1", "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout", "../slideLayouts/slideLayout1.xml")]))

print(f"Created {OUT}")
