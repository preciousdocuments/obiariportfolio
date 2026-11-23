import { motion } from "framer-motion";

const transition = { duration: 0.8, ease: [0.19, 1, 0.22, 1] as const };

const ContactBanner = () => {
  return (
    <footer id="contact" className="py-[15vh] px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={transition}
        className="border border-foreground"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="p-6 border-b sm:border-b-0 sm:border-r border-foreground">
            <span className="font-mono-meta text-[10px] text-muted-foreground uppercase block mb-2">
              Name
            </span>
            <span className="font-display text-2xl font-bold tracking-tight">
              Obiari Ugwu-Uche
            </span>
            <p className="mt-1 font-mono-meta text-[10px] tracking-tighter text-muted-foreground/70">
              BSI Information UI/UX · BS Cognitive Science Philosophy
              <br />
              University of Michigan
            </p>
          </div>
          <div className="p-6">
            <span className="font-mono-meta text-[10px] text-muted-foreground uppercase block mb-2">
              Current Status
            </span>
            <div className="space-y-2">
              <span className="font-serif-body text-base not-italic flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-accent" />
                GOODSENSSE Product Builder
              </span>
              <div className="flex items-start gap-2">
                <span className="mt-2 inline-block h-2 w-2 shrink-0 bg-accent" />
                <div>
                  <span className="font-serif-body text-base not-italic">
                    MBAxMS Engineering Candidate @ Columbia University
                  </span>
                  <span className="mt-1 block font-mono-meta text-[10px] tracking-tighter text-muted-foreground/70">
                    Entrepreneurship · Medical Device Design
                  </span>
                </div>
              </div>
              <span hidden className="!hidden font-serif-body text-base not-italic flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-accent" />
                UI Engineer, Global Applications Platform @ Citadel
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-foreground">
          <div className="p-6 border-b sm:border-b-0 sm:border-r border-foreground">
            <span className="font-mono-meta text-[10px] text-muted-foreground uppercase block mb-2">
              Email
            </span>
            <a href="mailto:hello@example.com" className="font-mono-meta text-sm hover:text-accent transition-colors">
              obiariuche@gmail.com
            </a>
          </div>
          <div className="p-6 border-b sm:border-b-0 sm:border-r border-foreground">
            <span className="font-mono-meta text-[10px] text-muted-foreground uppercase block mb-2">
              LinkedIn
            </span>
            <a href="https://www.linkedin.com/in/obiari-ugwu-uche-abb497202/" className="font-mono-meta text-sm hover:text-accent transition-colors">
              in/obiari-ugwu-uche
            </a>
          </div>
          <div className="p-6">
            <span className="font-mono-meta text-[10px] text-muted-foreground uppercase block mb-2">
              Location
            </span>
            <span className="font-mono-meta text-sm">
              New York Chicago 
            </span>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 flex justify-between items-center">
        <span className="font-mono-meta text-[10px] text-muted-foreground">
          2026 — OBIARI UCHE
        </span>
        <span className="font-mono-meta text-[10px] text-muted-foreground">
          DESIGNED WITH PRECISION
        </span>
      </div>
    </footer>
  );
};

export default ContactBanner;
