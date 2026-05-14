import { AuthenticatedLayout } from "@/components/shared/authenticated-layout";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticatedLayout requiredRole="admin">{children}</AuthenticatedLayout>
  );
}
