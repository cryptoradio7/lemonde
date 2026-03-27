import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function EspacePersoPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  return (
    <main className="max-w-[600px] mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-8">Mon espace personnel</h1>
      <div className="border border-[var(--lemonde-border)] p-6">
        <p className="text-lg mb-2">
          Bonjour, <strong>{session.user.name}</strong>
        </p>
        <p className="text-sm text-[var(--lemonde-gray)] mb-6">
          {session.user.email}
        </p>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="bg-[var(--lemonde-black)] text-white px-4 py-2 text-sm hover:bg-[var(--lemonde-dark)]"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </main>
  );
}
