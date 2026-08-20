import { BrainCircuit, Database, Globe, Terminal } from "lucide-react";
import { ReactNode } from "react";

export type Resume = {
  id: string;
  label: string;
  description: string;
  file: string;
  icon: ReactNode;
};

// Add new resume variants here — the selection page picks them up automatically.
const resumes: Resume[] = [
  {
    id: "full-stack-developer",
    label: "Full Stack Developer",
    description:
      "React, Next.js, Node.js, and database-driven web platforms end-to-end.",
    file: "/resume/Aniket_Raj_Full_Stack_Developer_Resume.pdf",
    icon: <Globe className="h-6 w-6" />,
  },
  {
    id: "ai-ml-engineer",
    label: "AI / ML Engineer",
    description:
      "Multi-agent systems, LLM platforms, and RAG pipelines with FastAPI and LangGraph.",
    file: "/resume/Aniket_Raj_AI_ML_Engineer_Resume.pdf",
    icon: <BrainCircuit className="h-6 w-6" />,
  },
  {
    id: "data-engineer-ml-engineer",
    label: "Data Engineer / ML Engineer",
    description:
      "ETL pipelines, data validation, retrieval workflows, and applied machine learning.",
    file: "/resume/Aniket_Raj_Data_Engineer_ML_Engineer_Resume.pdf",
    icon: <Database className="h-6 w-6" />,
  },
  {
    id: "software-engineer",
    label: "Software Engineer",
    description:
      "Core CS fundamentals, backend services, and distributed/multi-agent systems.",
    file: "/resume/Aniket_Raj_Software_Engineer_Resume.pdf",
    icon: <Terminal className="h-6 w-6" />,
  },
];

export default resumes;
