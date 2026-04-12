import { redirect } from "next/navigation";
import { listQuotationProjects } from "../../../src/server/db/quotation-repository";

export default async function NewQuotationPage() {
  const projects = await listQuotationProjects();
  redirect(`/quotations/${projects[0]?.id ?? ""}`);
}
