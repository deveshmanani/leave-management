import { AuthenticatedLayout } from "@/components/shared/authenticated-layout";

export default async function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
