import ProfilDecorations from "./_components/ProfilDecorations";
import ProfilLayout from "./_components/ProfilLayout";
import { fetchProfilData } from "./_utils/fetchProfil";

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden">
      <ProfilDecorations />
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {children}
      </div>
    </main>
  );
}

export default async function ProfilPage() {
  const entityInfo = await fetchProfilData();
  return (
    <PageShell>
      <ProfilLayout role={entityInfo.role} entityInfo={entityInfo} />
    </PageShell>
  );
}
