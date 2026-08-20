"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { config } from "@/data/config";
import resumes from "@/data/resumes";

export default function ResumeView() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      {/* Hide the global nav on mobile, only while this page is mounted */}
      <style
        dangerouslySetInnerHTML={{
          __html:
            "@media (max-width: 767px){ header { display: none !important; } }",
        }}
      />

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 pb-16 pt-16 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-10"
        >
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Résumés
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {config.author} — {config.role}. Pick the variant that best fits
            the role you&apos;re hiring for; each opens as a PDF in a new
            tab.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {resumes.map((resume, index) => (
            <motion.a
              key={resume.id}
              href={resume.file}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
              className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {resume.icon}
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold tracking-tight">
                  {resume.label}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {resume.description}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
