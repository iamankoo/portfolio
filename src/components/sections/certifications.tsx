"use client";
import React from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogTrigger,
} from "../ui/responsive-dialog";
import { Title as DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ScrollArea } from "../ui/scroll-area";
import { motion } from "motion/react";

import certifications, { Certification } from "@/data/certifications";
import { SectionHeader } from "./section-header";

import SectionWrapper from "../ui/section-wrapper";
import ScrollingPreview from "../scrolling-preview";

const mongoCertificateTitles = [
  "Introduction to MongoDB",
  "Getting Started with MongoDB Atlas",
  "MongoDB and the Document Model",
  "Connecting to a MongoDB Database",
  "MongoDB CRUD Operations: Insert and Find Documents",
  "MongoDB Indexes",
  "MongoDB CRUD Operations: Replace and Delete Documents",
  "MongoDB CRUD Operations: Modifying Query Results",
  "MongoDB Aggregation",
  "MongoDB Atlas Search",
  "MongoDB Data Modeling Intro",
  "MongoDB Transactions",
];

const CertificationsSection = () => {
  return (
    <SectionWrapper id="certifications" className="max-w-7xl mx-auto md:min-h-[130vh] px-4">
      <SectionHeader id="certifications" title="Certifications & Credentials" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {certifications.map((certification) => (
          <CertificationCard
            key={certification.id}
            certification={certification}
          />
        ))}
      </div>
    </SectionWrapper>
  );
};

const CertificationCard = ({
  certification,
}: {
  certification: Certification;
}) => {
  const card = (
    <div
      className="group relative w-full max-w-[400px] h-auto rounded-lg overflow-hidden ring-1 ring-white/5"
      style={{ aspectRatio: "3/2" }}
    >
      <ScrollingPreview
        src={certification.thumbnail}
        alt={certification.title}
      />
      <div className="absolute w-full h-24 bottom-0 left-0 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10">
        <div className="flex flex-col h-full items-start justify-end p-4">
          <div className="text-lg text-left [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
            {certification.title}
          </div>
          <div className="text-xs bg-primary text-primary-foreground rounded-lg w-fit px-2">
            {certification.category}
          </div>
        </div>
      </div>
    </div>
  );

  if (certification.pdf) {
    return (
      <div className="flex items-center justify-center">
        <button
          className="bg-transparent flex justify-center w-full"
          onClick={() => window.open(certification.pdf, "_blank")}
        >
          {card}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <ResponsiveDialog>
        <ResponsiveDialogTrigger className="bg-transparent flex justify-center w-full">
          {card}
        </ResponsiveDialogTrigger>

        <ResponsiveDialogContent className="md:max-w-4xl md:h-[85vh] md:!flex md:flex-col md:overflow-hidden md:p-0 md:gap-0">
          <VisuallyHidden>
            <DialogTitle>{certification.title}</DialogTitle>
          </VisuallyHidden>

          {/* Sticky header */}
          <div className="shrink-0 border-b border-border bg-background/80 backdrop-blur-sm px-8 py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <h4 className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight truncate">
                  {certification.title}
                </h4>
                <span className="shrink-0 text-[11px] uppercase tracking-widest text-muted-foreground border border-border rounded-full px-3 py-0.5">
                  {certification.category}
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <ScrollArea className="flex-1" type="always" data-lenis-prevent>
            <div className="px-8 py-8">
              {/* Credential meta */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col md:flex-row gap-6 md:gap-10 mb-10"
              >
                <div className="flex flex-col items-center md:items-start gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                    Organization
                  </span>
                  <span className="text-sm text-foreground">
                    {certification.organization}
                  </span>
                </div>
                {certification.issuedDate && (
                  <div className="flex flex-col items-center md:items-start gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                      Issued
                    </span>
                    <span className="text-sm text-foreground">
                      {certification.issuedDate}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

              {/* Certification content */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="font-mono text-muted-foreground leading-relaxed">
                  Completed 12 MongoDB University Certificates
                </p>
                <ol className="mt-6 grid list-decimal gap-3 pl-5 font-mono text-muted-foreground">
                  {mongoCertificateTitles.map((title, index) => {
                    const certificateNumber = index + 1;
                    return (
                      <li key={certificateNumber}>
                        <button
                          className="text-left underline-offset-4 hover:underline hover:text-foreground transition-colors"
                          onClick={() =>
                            window.open(
                              `/certificates/mongo-db-${certificateNumber}.pdf`,
                              "_blank"
                            )
                          }
                        >
                          {title}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </motion.div>
            </div>
          </ScrollArea>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </div>
  );
};

export default CertificationsSection;
