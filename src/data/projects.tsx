import SlideShow from "@/components/slide-show";
import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typography";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

const PLACEHOLDER_IMG = "/assets/logo-dark.svg";

const MaskIcon = ({ src, title }: { src: string; title?: string }) => (
  <span
    role="img"
    aria-label={title}
    className="block bg-current"
    style={{
      width: "1em",
      height: "1em",
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      WebkitMaskSize: "contain",
      maskSize: "contain",
    }}
  />
);

const ProjectsLinks = ({ live }: { live?: string }) => {
  if (!live || live === "#") return null;
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      <Link
        className="font-mono underline flex gap-2"
        rel="noopener"
        target="_new"
        href={live}
      >
        <Button variant={"default"} size={"sm"}>
          Visit Website
          <ArrowUpRight className="ml-3 w-5 h-5" />
        </Button>
      </Link>
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};

const brand = (title: string, file: string): Skill => ({
  title,
  bg: "black",
  fg: "white",
  icon: <MaskIcon src={`/assets/logos/${file}`} title={title} />,
});

const brandSrc = (title: string, src: string): Skill => ({
  title,
  bg: "black",
  fg: "white",
  icon: <MaskIcon src={src} title={title} />,
});

const PROJECT_SKILLS = {
  next: brand("Next.js", "nextdotjs-mono.svg"),
  react: brand("React.js", "react-mono.svg"),
  ts: brand("TypeScript", "typescript-mono.svg"),
  tailwind: brand("Tailwind", "tailwind-css-mono.svg"),
  node: brand("Node.js", "nodedotjs-mono.svg"),
  prisma: brand("Prisma", "prisma-mono.svg"),
  resend: brand("Resend", "vercel-mono.svg"),
  python: brand("Python", "python-mono.svg"),
  postgres: brand("PostgreSQL", "postgresql-mono.svg"),
  mongo: brand("MongoDB", "mongodb-mono.svg"),
  flutter: brandSrc(
    "Flutter",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg"
  ),
  dart: brandSrc(
    "Dart",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg"
  ),
  fastapi: brandSrc(
    "FastAPI",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg"
  ),
  mysql: brandSrc(
    "MySQL",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
  ),
  redux: brandSrc(
    "Redux Toolkit",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg"
  ),
  supabase: brand("Supabase", "supabase-mono.svg"),
  cloudStorage: brand("Cloud Storage", "cloudflare-mono.svg"),
  aiSDK: brand("Vercel AI SDK", "vercel-mono.svg"),
  aiApis: brand("AI APIs", "anthropic-mono.svg"),
  aiAssistant: brand("AI Assistant", "mistral-ai-mono.svg"),
  docker: brand("Docker", "docker-mono.svg"),
};

export type Project = {
  id: string;
  category: string;
  title: string;
  /** Short name shown on the grid card; falls back to `title` when omitted. */
  cardTitle?: string;
  /** Short tag shown on the grid card; falls back to `category` when omitted. */
  cardBadge?: string;
  src: string;
  screenshots: string[];
  thumbnailImages?: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
  /** Placeholder slot for an upcoming project — renders without links or a dialog. */
  comingSoon?: boolean;
};

// Display order = grid order. Add new real projects at the TOP of this array
// so they surface first automatically; keep the two "Coming Soon" placeholders
// as the last two entries.
const projects: Project[] = [
  {
    id: "deeplens",
    category: "AI Platform",
    title: "DeepLens – Enterprise Multi-Agent RAG Platform",
    cardTitle: "DeepLens",
    src: "/assets/DL1.png",
    screenshots: [
      "/assets/DL1.png",
      "/assets/DL2.png",
      "/assets/DL3.png",
      "/assets/DL4.png",
      "/assets/DL5.png",
      "/assets/DL6.png",
    ],
    thumbnailImages: [
      "/assets/DL1.png",
      "/assets/DL2.png",
      "/assets/DL3.png",
      "/assets/DL4.png",
      "/assets/DL5.png",
      "/assets/DL6.png",
    ],
    live: "https://frontend-mu-seven-67.vercel.app",
    github: "https://github.com/iamankoo/DeepLens",
    skills: {
      frontend: [PROJECT_SKILLS.react, PROJECT_SKILLS.ts],
      backend: [
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.fastapi,
        PROJECT_SKILLS.aiApis,
        PROJECT_SKILLS.docker,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            DeepLens is an enterprise multi-agent Retrieval-Augmented
            Generation (RAG) platform. A multi-agent backend — routing,
            retrieval, reasoning, and response-generation agents — runs on an
            async FastAPI service with hybrid semantic search across ChromaDB
            and FAISS, ingesting PDFs, DOCX, PPTX, images, and emails. A
            React + TypeScript interface delivers real-time chat, citations,
            and session memory across Groq, Gemini, and OpenAI models.
          </TypographyP>
          <ProjectsLinks live={this.live} />
          <SlideShow images={this.screenshots} />
        </div>
      );
    },
  },
  {
    id: "aivoa",
    category: "AI Platform",
    title: "AIVOA – AI Pharmaceutical Complaint Management System",
    cardTitle: "AIVOA",
    src: "/assets/AA1.png",
    screenshots: [
      "/assets/AA1.png",
      "/assets/AA2.png",
      "/assets/AA3.png",
      "/assets/AA4.png",
    ],
    thumbnailImages: [
      "/assets/AA1.png",
      "/assets/AA2.png",
      "/assets/AA3.png",
      "/assets/AA4.png",
    ],
    live: "#",
    github: "https://github.com/iamankoo/AIVOA",
    skills: {
      frontend: [PROJECT_SKILLS.react, PROJECT_SKILLS.redux],
      backend: [
        PROJECT_SKILLS.fastapi,
        PROJECT_SKILLS.mysql,
        PROJECT_SKILLS.aiApis,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            AIVOA is an AI-powered pharmaceutical complaint management system
            built for enterprise use. It handles AI-assisted intake, risk
            assessment, duplicate detection, and CAPA/root-cause
            recommendations on an async FastAPI + SQLAlchemy backend, with
            OCR-based document parsing and a Groq LLM pipeline automating
            triage of incoming complaints.
          </TypographyP>
          <ProjectsLinks live={this.live} />
          <SlideShow images={this.screenshots} />
        </div>
      );
    },
  },
  {
    id: "realpath",
    category: "AI Resume Builder",
    cardBadge: "AI Career",
    title: "RealPath – AI Resume Builder",
    cardTitle: "RealPath",
    src: "/assets/Real-path1.png",
    screenshots: [
      "/assets/Real-path1.png",
      "/assets/Real-path2.png",
      "/assets/Real-path3.png",
      "/assets/Real-path4.png",
    ],
    thumbnailImages: [
      "/assets/Real-path1.png",
      "/assets/Real-path2.png",
      "/assets/Real-path3.png",
      "/assets/Real-path4.png",
    ],
    live: "https://real-path.vercel.app/",
    github: "https://github.com/iamankoo/real-path",
    skills: {
      frontend: [
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [
        PROJECT_SKILLS.prisma,
        PROJECT_SKILLS.postgres,
        PROJECT_SKILLS.resend,
        PROJECT_SKILLS.aiApis,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            A production-ready AI-powered resume builder that helps users create
            ATS-friendly resumes with live editing, multiple templates,
            AI-assisted content generation, resume scoring, PDF export, and
            modern career tools.
          </TypographyP>
          <ProjectsLinks live={this.live} />
          <SlideShow images={this.screenshots} />
        </div>
      );
    },
  },
  {
    id: "document-saathi",
    category: "Document Vault",
    title: "Document Saathi – Secure Family Document Vault",
    cardTitle: "Document Saathi",
    src: "/assets/ds1.png",
    screenshots: [
      "/assets/ds1.png",
      "/assets/ds2.png",
      "/assets/ds3.png",
      "/assets/ds4.png",
    ],
    thumbnailImages: [
      "/assets/ds1.png",
      "/assets/ds2.png",
      "/assets/ds3.png",
      "/assets/ds4.png",
    ],
    live: "https://drive.google.com/file/d/1gRG6DB1SOa79i3Yh7HMaboefQv8_oEv1/view?usp=sharing",
    github: "https://github.com/iamankoo/Document-Saathi-Updates",
    skills: {
      frontend: [PROJECT_SKILLS.flutter, PROJECT_SKILLS.dart],
      backend: [
        PROJECT_SKILLS.supabase,
        PROJECT_SKILLS.cloudStorage,
        PROJECT_SKILLS.aiAssistant,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            A secure family document management application that allows multiple
            family members to upload, organize, manage and securely access
            important family documents with cloud synchronization, family vaults,
            messaging, and integrated AI assistant support.
          </TypographyP>
          <ProjectsLinks live={this.live} />
          <SlideShow images={this.screenshots} />
        </div>
      );
    },
  },
  {
    id: "coming-soon-1",
    category: "Upcoming",
    title: "Coming Soon",
    src: PLACEHOLDER_IMG,
    screenshots: [],
    live: "#",
    comingSoon: true,
    skills: { frontend: [], backend: [] },
    content: null,
  },
  {
    id: "coming-soon-2",
    category: "Upcoming",
    title: "Coming Soon",
    src: PLACEHOLDER_IMG,
    screenshots: [],
    live: "#",
    comingSoon: true,
    skills: { frontend: [], backend: [] },
    content: null,
  },
];

export default projects;
