import { motion } from "framer-motion";
import { useState } from "react";
import { publicAsset } from "@/lib/utils";

const transition = { duration: 0.8, ease: [0.19, 1, 0.22, 1] as const };

const researchAreas = [
  {
    number: "01",
    title: "Medical Imaging",
    description:
      "Using clinical trail context and patient-specific imaging to anatomically model for clearer, more useful views of individual health needs.",
    tools: "DICOM data, 3D Slicer, Z-Anatomy",
  },
  {
    number: "02",
    title: "Clinical Digital Twins",
    description:
      "Creating digital representations and simulation tools that can support visualization, planning, and preventative care.",
    tools: "Blender, Unity/Unreal, SOLIDWORKS",
  },
  {
    number: "03",
    title: "Noninvasive Medicine",
    description:
      "Emerging biopharma and medical technologies that aim to make diagnosis and treatment more targeted.",
    topics: "Botanical Solutions, Alternative Medicine",
  },
];

type ResearchPaper = { title: string; url?: string; placeholder?: boolean };
type WritingSection = {
  title: string;
  papers?: ResearchPaper[];
  subsections?: WritingSection[];
};
type WritingCollection = {
  number: string;
  title: string;
  description: string;
  sections: WritingSection[];
};

const writingCollections: WritingCollection[] = [
  {
    number: "01",
    title: "Undergraduate Collection",
    description: "Selected writing and projects from undergraduate study.",
    sections: [
      {
        title: "Art",
        papers: [{
          title:
            "Afrosurrealism Through Art: A Metaphysical Study of the Route to Higher Consciousness and Meaning Through Portrayals of Art and Entertainment Multimedia",
          url: "/afrosurrealism-through-art.pdf",
        }],
      },
      {
        title: "Consciousness",
        papers: [
          {
            title: "Measurement of Consciousness: Subjective vs. Objective",
            url: "/measurement-of-consciousness-subjective-vs-objective.pdf",
          },
          { title: "Will and Awareness", url: "/psych447-will-and-awareness.pdf" },
          { title: "Optimal Consciousness", url: "/honors241-build-4-optimal-consciousness.pdf" },
          { title: "Problems of Personal Identity", url: "/honors241-westworld-build-3.pdf" },
          { title: "Consciousness", url: "/honors241-westworld-build-1.pdf" },
        ],
      },
    ],
  },
  {
    number: "02",
    title: "Independent Collection",
    description: "Research and writing developed through independent inquiry.",
    sections: [
      {
        title: "Clinical Analysis",
        papers: [{ title: "174 Clinical Review of Duplicated Chronic Illness", placeholder: true }],
      },
      {
        title: "Global Biotech Quantitative Analysis",
        papers: [
          { title: "Biopharma Market Analysis in the 2020s Statistical Review", placeholder: true },
          { title: "Medical Device Market Analysis in the 2020s Statistical Review", placeholder: true },
          { title: "SaMD Market Analysis in the 2020s Statistical Review", placeholder: true },
        ],
      },
    ],
  },
  {
    number: "03",
    title: "Graduate Collection",
    description: "Academic work and research from graduate study.",
    sections: [
      {
        title: "Biomedical Research",
        subsections: [
          {
            title: "Heffner Lab",
            papers: [{
              title:
                "Replicational Study of CT Scans in Partnership with the Heffner Biomedical Lab at Columbia University",
              placeholder: true,
            }],
          },
          {
            title: "Meyers Lab",
            papers: [{ title: "", placeholder: true }],
          },
        ],
      },
      {
        title: "Fairness in AI",
        subsections: [
          {
            title: "Diagnostic and Health",
            papers: [{ title: "", placeholder: true }],
          },
          {
            title: "Global and Racial",
            papers: [{ title: "", placeholder: true }],
          },
        ],
      },
    ],
  },
];

const ResearchWriting = () => {
  const [activeCollection, setActiveCollection] = useState<string | null>(null);

  const renderPapers = (papers: ResearchPaper[] = [], collectionIsActive: boolean, collectionNumber: string) => {
    const placeholderStatus = collectionNumber === "02" ? "[WIP]" : "Forthcoming";

    return (
    <ul className="mt-3 space-y-2 pl-3">
      {papers.map((paper) => (
        <li key={paper.title || "forthcoming"}>
          {paper.url ? (
            <a
              href={publicAsset(paper.url)}
              target="_blank"
              rel="noreferrer"
              tabIndex={collectionIsActive ? 0 : -1}
              className="font-serif-body text-base text-muted-foreground transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
            >
              {paper.title}
            </a>
          ) : (
            <span className="font-serif-body text-base text-muted-foreground">
              {paper.title || placeholderStatus}
              {paper.title && (
                <span className="italic">
                  {collectionNumber === "02" ? ` ${placeholderStatus}` : ` (${placeholderStatus})`}
                </span>
              )}
            </span>
          )}
        </li>
      ))}
    </ul>
    );
  };

  return (
  <section id="research" className="scroll-mt-24 py-[20vh] px-6 max-w-7xl mx-auto">
    <div className="mb-6 border-b border-border pb-4">
      <span className="font-mono-meta text-[11px] text-muted-foreground tracking-widest uppercase">
        Research &amp; Academic Writing
      </span>
    </div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={transition}
    >
      <h2 className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tighter max-w-4xl">
        research for more precise, preventative care.
      </h2>
      <p className="font-serif-body text-xl sm:text-2xl italic text-muted-foreground mt-6 max-w-3xl leading-relaxed">
        Exploring how medical imaging, clinical twins, and noninvasive technologies can help manage chronic conditions.
      </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
      {researchAreas.map((area, index) => (
        <motion.article
          key={area.number}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ ...transition, delay: index * 0.08 }}
          className="border-t border-foreground pt-5"
        >
          <span className="font-mono-meta text-xs text-muted-foreground">{area.number}</span>
          <h3 className="font-display text-2xl font-bold uppercase tracking-tight mt-8">{area.title}</h3>
          <p className="font-serif-body text-lg text-muted-foreground leading-relaxed mt-4">
            {area.description}
          </p>
          {"tools" in area && (
            <p className="mt-1 whitespace-nowrap font-mono-meta text-[10px] tracking-tighter text-muted-foreground/70">
              <span className="uppercase tracking-widest">Tools</span> · {area.tools}
            </p>
          )}
          {"topics" in area && (
            <p className="mt-1 whitespace-nowrap font-mono-meta text-[10px] tracking-tighter text-muted-foreground/70">
              <span className="uppercase tracking-widest">Topics</span> · {area.topics}
            </p>
          )}
        </motion.article>
      ))}
    </div>

    <div className="mt-24 pt-8">
      <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tighter">
        The Collections
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
        {writingCollections.filter((collection) => collection.number !== "03").map((collection) => (
          <motion.article
            key={collection.number}
            onHoverStart={() => setActiveCollection(collection.number)}
            onHoverEnd={() => setActiveCollection(null)}
            onFocusCapture={() => setActiveCollection(collection.number)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setActiveCollection(null);
              }
            }}
            tabIndex={"sections" in collection ? 0 : undefined}
            className="border-t border-foreground pt-5"
          >
            <span className="font-mono-meta text-xs text-muted-foreground">{collection.number}</span>
            <h4 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight mt-8">
              {collection.title}
            </h4>
            <p className="font-serif-body text-lg text-muted-foreground leading-relaxed mt-4">
              {collection.description}
            </p>
            {"sections" in collection && (
              <motion.ul
                initial={false}
                animate={{
                  opacity: activeCollection === collection.number ? 1 : 0,
                  height: activeCollection === collection.number ? "auto" : 0,
                  marginTop: activeCollection === collection.number ? 16 : 0,
                }}
                className="space-y-3 overflow-hidden"
                aria-hidden={activeCollection !== collection.number}
              >
                {collection.sections.map((section) => (
                  <li key={section.title}>
                    <details className="group border-b border-border/70 pb-2">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-mono-meta text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
                        {section.title}
                        <span className="transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
                      </summary>
                      {section.subsections ? (
                        <>
                          {section.papers?.length ? renderPapers(section.papers, activeCollection === collection.number, collection.number) : null}
                          <ul className="mt-3 space-y-3 pl-3">
                            {section.subsections.map((subsection) => (
                              <li key={subsection.title}>
                                <details className="group border-b border-border/50 pb-2">
                                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-mono-meta text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
                                    {subsection.title}
                                    <span className="transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
                                  </summary>
                                  {renderPapers(subsection.papers, activeCollection === collection.number, collection.number)}
                                </details>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : renderPapers(section.papers, activeCollection === collection.number, collection.number)}
                    </details>
                  </li>
                ))}
              </motion.ul>
            )}
          </motion.article>
        ))}
      </div>
    </div>
  </section>
  );
};

export default ResearchWriting;
