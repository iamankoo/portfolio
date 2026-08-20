import ResumeView from "./resume-view";
import { config } from "@/data/config";

export const metadata = {
  title: `Résumé | ${config.author}`,
  description: `Choose the résumé variant that best fits the role — ${config.author}, ${config.role}.`,
};

export default function ResumePage() {
  return <ResumeView />;
}
