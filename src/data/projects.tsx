import SlideShow from "@/components/slide-show";
import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typography";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

const BASE_PATH = "/assets/projects-screenshots";
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
  supabase: brand("Supabase", "supabase-mono.svg"),
  cloudStorage: brand("Cloud Storage", "cloudflare-mono.svg"),
  aiSDK: brand("Vercel AI SDK", "vercel-mono.svg"),
  aiApis: brand("AI APIs", "anthropic-mono.svg"),
  aiAssistant: brand("AI Assistant", "mistral-ai-mono.svg"),
  anthropic: brand("Anthropic Claude", "anthropic-mono.svg"),
  mistral: brand("Mistral AI", "mistral-ai-mono.svg"),
  sockerio: brand("Socket.io", "socketdotio-mono.svg"),
  docker: brand("Docker", "docker-mono.svg"),
  aws: brand("AWS", "cloudflare-mono.svg"),
};

export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  screenshots: string[];
  thumbnailImages?: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
};

const projects: Project[] = [
  {
    id: "realpath",
    category: "AI Resume Builder",
    title: "RealPath – AI Resume Builder",
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
    id: "whatsapp",
    category: "Messaging",
    title: "CallHQ WhatsApp",
    src: `${BASE_PATH}/whatsapp/whatsapp.png`,
    screenshots: ["whatsapp.png"],
    live: "https://whatsapp.callhq.ai",
    skills: {
      frontend: [PROJECT_SKILLS.react, PROJECT_SKILLS.ts, PROJECT_SKILLS.tailwind],
      backend: [PROJECT_SKILLS.node, PROJECT_SKILLS.sockerio],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            WhatsApp integration layer for CallHQ — automate customer
            conversations and workflows over WhatsApp Business.
          </TypographyP>
          <ProjectsLinks live={this.live} />
          <SlideShow images={[`${BASE_PATH}/whatsapp/whatsapp.png`]} />
        </div>
      );
    },
  },
  {
    id: "orrdr",
    category: "Commerce",
    title: "Orrdr",
    src: `${BASE_PATH}/orrdr/orrdr.png`,
    screenshots: ["orrdr.png"],
    live: "https://orrdr.com",
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [PROJECT_SKILLS.node, PROJECT_SKILLS.postgres],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            Commerce platform for ordering and fulfillment.
          </TypographyP>
          <ProjectsLinks live={this.live} />
          <SlideShow images={[`${BASE_PATH}/orrdr/orrdr.png`]} />
        </div>
      );
    },
  },
  {
    id: "otoma8",
    category: "AI Platform",
    title: "Otoma8",
    src: `${BASE_PATH}/otoma8/otoma8.png`,
    screenshots: ["otoma8.png"],
    live: "https://otoma8.com",
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [
        PROJECT_SKILLS.node,
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.aiSDK,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            AI platform co-founded alongside CallHQ and Broki — building the next
            generation of business automation tools.
          </TypographyP>
          <ProjectsLinks live={this.live} />
          <SlideShow images={[`${BASE_PATH}/otoma8/otoma8.png`]} />
        </div>
      );
    },
  },
  {
    id: "tesorobysania",
    category: "E-commerce",
    title: "Tesoro by Sania",
    src: PLACEHOLDER_IMG,
    screenshots: [],
    live: "https://tesorobysania.com",
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [PROJECT_SKILLS.node],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            Premium e-commerce storefront for Tesoro by Sania.
          </TypographyP>
          <ProjectsLinks live={this.live} />
        </div>
      );
    },
  },
];

export default projects;
