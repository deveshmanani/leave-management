import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/shared/sidebar";
import { Header } from "@/components/shared/header";
import type { Role } from "@/types";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  requiredRole?: Role;
}

export async function AuthenticatedLayout({
  children,
  requiredRole,
}: AuthenticatedLayoutProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (requiredRole && (session.user.role as Role) !== requiredRole) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        role={session.user.role as Role}
        userName={session.user.name ?? "User"}
        userEmail={session.user.email ?? ""}
      />
      <div className="flex flex-1 flex-col overflow-auto">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Header
          userName={session.user.name ?? "User"}
          userImage={session.user.image}
          role={session.user.role as Role}
        />
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
