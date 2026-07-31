export type Certification = {
  id: string;
  title: string;
  organization: string;
  category: string;
  description: string;
  pdf: string;
  thumbnail: string;
  issuedDate?: string;
};

// TODO: Add certification thumbnails and PDFs where they are still missing.
const certifications: Certification[] = [
  {
    id: "mongodb",
    title: "MongoDB University Learning Path",
    organization: "MongoDB University",
    category: "Database",
    description:
      "Completed 12 MongoDB University certificates covering MongoDB fundamentals, CRUD operations, aggregation pipelines, indexing, Atlas, data modeling, and modern database development.",
    pdf: "",
    thumbnail: "/assets/mongo.png",
  },
  {
    id: "nptel-business",
    title: "Business Analytics",
    organization: "NPTEL",
    category: "Course",
    description:
      "Successfully completed the NPTEL Business Analytics course.",
    pdf: "/certificates/Business.pdf",
    thumbnail: "/assets/business.png",
  },
  {
    id: "nptel-information",
    title: "Information Retrieval",
    organization: "NPTEL",
    category: "Course",
    description:
      "Successfully completed the NPTEL Information Retrieval course.",
    pdf: "/certificates/Information.pdf",
    thumbnail: "/assets/IR.png",
  },
];

export default certifications;
