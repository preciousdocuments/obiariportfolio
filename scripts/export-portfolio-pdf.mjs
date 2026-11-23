import { writeFileSync } from "node:fs";

// A small, dependency-free PDF export of the public portfolio content.
const W = 595.28;
const H = 841.89;
const burgundy = [0.27, 0.04, 0.13];
const ivory = [1, 0.98, 0.88];
const muted = [0.43, 0.28, 0.34];
const blue = [0.05, 0.35, 0.8];
const pages = [];

const ascii = (s) => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[—–]/g, " - ").replace(/[’‘]/g, "'").replace(/[“”]/g, '"')
  .replace(/·/g, " / ").replace(/↗/g, "").replace(/[^\x20-\x7E]/g, "");
const esc = (s) => ascii(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
const num = (n) => Number(n.toFixed(2));

function page(bg = ivory) {
  const ops = [];
  ops.push(`${bg.map(num).join(" ")} rg 0 0 ${W} ${H} re f`);
  return ops;
}
function text(ops, x, y, value, size = 11, font = "F1", color = burgundy, spacing = 0) {
  const [r, g, b] = color;
  ops.push(`BT /${font} ${size} Tf ${r} ${g} ${b} rg ${spacing} Tc 1 0 0 1 ${num(x)} ${num(y)} Tm (${esc(value)}) Tj ET`);
}
function rect(ops, x, y, w, h, color, stroke = false, lineWidth = 0.7) {
  ops.push(`${color.map(num).join(" ")} ${stroke ? "RG" : "rg"} ${lineWidth} w ${num(x)} ${num(y)} ${num(w)} ${num(h)} re ${stroke ? "S" : "f"}`);
}
function rule(ops, x1, y1, x2, y2, color = burgundy, width = 0.7) {
  ops.push(`${color.map(num).join(" ")} RG ${width} w ${num(x1)} ${num(y1)} m ${num(x2)} ${num(y2)} l S`);
}
function wrap(value, maxWidth, size) {
  const words = ascii(value).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length * size * 0.49 > maxWidth && line) { lines.push(line); line = word; }
    else line = next;
  }
  if (line) lines.push(line);
  return lines;
}
function paragraph(ops, x, y, value, width, size = 11, leading = 16, color = muted, font = "F3") {
  const lines = wrap(value, width, size);
  lines.forEach((line, i) => text(ops, x, y - i * leading, line, size, font, color));
  return y - lines.length * leading;
}
function header(ops, label, pageNo) {
  text(ops, 48, 800, "OBIARI UCHE  /  PORTFOLIO", 8, "F2", burgundy, 1.1);
  text(ops, 48, 774, label.toUpperCase(), 8, "F1", muted, 1.2);
  text(ops, 520, 800, String(pageNo).padStart(2, "0"), 8, "F1", blue, 0.5);
  rule(ops, 48, 760, 547, 760, burgundy, 0.55);
}
function footer(ops, pageNo) {
  rule(ops, 48, 45, 547, 45, burgundy, 0.45);
  text(ops, 48, 28, "DRIVING FUNCTION IN WELLNESS", 7, "F1", muted, 0.7);
  text(ops, 518, 28, `2026  /  ${pageNo}`, 7, "F1", muted, 0.4);
}

// Cover
{
  const p = page(burgundy);
  rect(p, 0, 0, 12, H, blue);
  text(p, 48, 792, "OBIARI UCHE  -  2026", 9, "F1", ivory, 1.1);
  rule(p, 48, 762, 547, 762, [0.76, 0.65, 0.68], 0.6);
  text(p, 48, 617, "Driving Function", 38, "F4", ivory);
  text(p, 48, 572, "in Wellness:", 38, "F4", [0.83, 0.76, 0.77]);
  text(p, 48, 515, "one idea at a time.", 32, "F2", ivory);
  rect(p, 48, 442, 52, 3, blue);
  paragraph(p, 48, 402, "A selected portfolio of product building, health technology, research, and systems thinking.", 400, 14, 21, [0.88, 0.83, 0.83], "F3");
  text(p, 48, 110, "PRODUCT  /  RESEARCH  /  WELLNESS", 8, "F1", ivory, 1.2);
  text(p, 48, 75, "New York  -  Chicago", 9, "F3", [0.83, 0.76, 0.77]);
  pages.push(p);
}

// Selected work
{
  const p = page(); header(p, "Selected work", 2);
  text(p, 48, 720, "Meaningful Work", 27, "F2", burgundy);
  text(p, 48, 697, "PRODUCTS, SYSTEMS, AND COMMUNITY-FOCUSED TECHNOLOGY", 7, "F1", muted, 0.85);
  const entries = [
    ["2025-26", "DIGITAL TWIN PATTERN SYSTEMS  /  ORACLE HEALTH", "Frontend architecture for facility maps, body maps, and medical device twin configuration, expanding a 3D object library."],
    ["2024-25", "CLINICAL SCHEDULER  /  ORACLE HEALTH", "Clinical scheduling experiences across calendar, week, day, and month views, connecting patient data, appointments, and reporting."],
    ["2023", "HOSPITAL MANAGEMENT DASHBOARD  /  ORACLE DESIGN ENGINEERING", "Dashboard visualizations for operational KPIs, connecting appointment data to Oracle HCM services."],
    ["2022-26", "GOODSENSSE DIGITAL  /  PRODUCT BUILDER", "Social wellness software and digital consulting for community wellbeing, including Inheritance, Heritage, and Safe."],
    ["2022-24", "COMMUNITY LEADERS  /  GOOGLE", "Student advisory and workshops supporting nonprofits and small businesses with ads, search, SEO, and community initiatives."],
    ["2022", "UNLIMITED REALITY  /  DELOITTE", "UX and business technology consulting for augmented reality simulation experiences in public services."],
  ];
  let y = 654;
  for (const [date, title, desc] of entries) {
    rule(p, 48, y + 12, 547, y + 12, [0.73, 0.64, 0.67], 0.45);
    text(p, 48, y - 5, date, 8, "F1", blue, 0.5);
    text(p, 137, y - 5, title, 9, "F2", burgundy, 0.2);
    const end = paragraph(p, 137, y - 24, desc, 395, 10, 14, muted, "F3");
    y = Math.min(y - 83, end - 29);
  }
  footer(p, 2); pages.push(p);
}

// Research
{
  const p = page(); header(p, "Research & academic writing", 3);
  text(p, 48, 720, "Research for more", 28, "F2", burgundy);
  text(p, 48, 686, "precise, preventative care.", 28, "F2", burgundy);
  paragraph(p, 48, 650, "Exploring how medical imaging, clinical twins, and noninvasive technologies can help manage chronic conditions.", 470, 13, 19, muted, "F4");
  const cards = [
    ["01", "MEDICAL IMAGING", "Clinical context and patient-specific imaging for anatomically accurate views of individual health needs.", "DICOM  /  3D SLICER  /  Z-ANATOMY"],
    ["02", "CLINICAL DIGITAL TWINS", "Digital representations and simulation tools to support visualization, planning, and preventative care.", "BLENDER  /  UNITY  /  UNREAL  /  SOLIDWORKS"],
    ["03", "NONINVASIVE MEDICINE", "Emerging biopharma and medical technologies for more targeted diagnosis and treatment.", "BOTANICAL SOLUTIONS  /  ALTERNATIVE MEDICINE"],
  ];
  let x = 48;
  for (const [n, title, desc, tools] of cards) {
    rect(p, x, 462, 156, 0.8, burgundy);
    text(p, x, 443, n, 8, "F1", blue, 0.5);
    let y = paragraph(p, x, 412, title, 148, 12, 15, burgundy, "F2");
    y = paragraph(p, x, y - 14, desc, 148, 10, 14, muted, "F3");
    paragraph(p, x, y - 15, tools, 148, 7, 10, blue, "F1");
    x += 174;
  }
  text(p, 48, 344, "SELECTED WRITING", 8, "F1", muted, 1.2);
  rule(p, 48, 330, 547, 330, burgundy, 0.55);
  text(p, 48, 304, "UNDERGRADUATE COLLECTION", 9, "F2", burgundy, 0.3);
  paragraph(p, 48, 283, "Afrosurrealism Through Art: A Metaphysical Study of the Route to Higher Consciousness and Meaning Through Portrayals of Art and Entertainment Multimedia", 485, 10, 14, muted, "F4");
  paragraph(p, 48, 224, "Measurement of Consciousness: Subjective vs. Objective  /  Will and Awareness  /  Optimal Consciousness  /  Problems of Personal Identity", 485, 10, 15, muted, "F4");
  text(p, 48, 159, "INDEPENDENT COLLECTION", 9, "F2", burgundy, 0.3);
  paragraph(p, 48, 137, "Clinical review and quantitative analysis of biopharma, medical device, and software as a medical device markets.", 485, 10, 15, muted, "F4");
  text(p, 48, 77, "Graduate research includes biomedical imaging and fairness in AI.", 9, "F3", blue);
  footer(p, 3); pages.push(p);
}

// About and contact
{
  const p = page(); header(p, "About & contact", 4);
  text(p, 48, 720, "Designing for", 30, "F2", burgundy);
  text(p, 48, 682, "human wellness.", 30, "F2", burgundy);
  text(p, 48, 633, "PHILOSOPHY", 8, "F1", muted, 1.2);
  let y = paragraph(p, 48, 605, "Bridge emerging technology and social equity by building digital solutions that empower underserved communities and modernize health and wellness. Translate complex data - from anatomical modeling to financial systems - into intuitive tools that support people and communities.", 485, 12, 18, muted, "F4");
  y = paragraph(p, 48, y - 17, "Guided by a commitment to do good and rigorous systems thinking, with the aim of driving function in wellness.", 485, 12, 18, muted, "F4");
  rule(p, 48, 389, 547, 389, burgundy, 0.55);
  text(p, 48, 362, "VALUES", 8, "F1", muted, 1.2);
  ["AUTHENTICITY", "INTEGRITY", "FAIRNESS", "RESPECT"].forEach((v, i) => text(p, 48 + i * 130, 328, v, 10, "F2", burgundy, 0.25));
  rect(p, 48, 173, 499, 112, [0.98, 0.96, 0.87], true, 0.7);
  text(p, 66, 260, "CURRENT", 7, "F1", blue, 0.9);
  text(p, 66, 237, "Goodsensse Product Builder", 13, "F2", burgundy);
  paragraph(p, 66, 215, "MBA x MS Engineering Candidate, Columbia University  /  Entrepreneurship and Medical Device Design", 455, 10, 14, muted, "F3");
  text(p, 48, 135, "CONTACT", 8, "F1", muted, 1.2);
  text(p, 48, 110, "obiariuche@gmail.com", 11, "F2", burgundy);
  text(p, 48, 90, "linkedin.com/in/obiari-ugwu-uche-abb497202", 9, "F1", blue);
  text(p, 48, 67, "New York  /  Chicago", 9, "F3", muted);
  footer(p, 4); pages.push(p);
}

function makePdf(contents) {
  const objects = [];
  const add = (s) => { objects.push(s); return objects.length; };
  const catalogId = add("");
  const pagesId = add("");
  const fonts = {
    F1: add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"),
    F2: add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"),
    F3: add("<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>"),
    F4: add("<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic >>"),
  };
  const pageIds = [];
  for (const ops of contents) {
    const stream = ops.join("\n");
    const streamId = add(`<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`);
    pageIds.push(add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << ${Object.entries(fonts).map(([k, v]) => `/${k} ${v} 0 R`).join(" ")} >> >> /Contents ${streamId} 0 R >>`));
  }
  objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  let out = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = [0];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(out, "latin1"));
    out += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xref = Buffer.byteLength(out, "latin1");
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) out += `${String(offset).padStart(10, "0")} 00000 n \n`;
  out += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(out, "latin1");
}

writeFileSync(new URL("../public/obiari-uche-portfolio.pdf", import.meta.url), makePdf(pages));
console.log("Created public/obiari-uche-portfolio.pdf");
