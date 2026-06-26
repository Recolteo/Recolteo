import AdminDecorations from "../_components/AdminDecorations";
import CollecteAdminList from "./_components/CollecteAdminList";
import Reveal from "@/src/components/animations/Reveal";
import { getPendingCollects } from "../actions";

export default async function AdminCollectesPage() {
  const collects = await getPendingCollects();

  return (
    <main className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden">
      <AdminDecorations />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col gap-10">
          <Reveal delay={0}>
            <div>
              <h1 className="text-sapin font-black">Collectes en attente</h1>
              <p className="text-sapin/80 mt-2">
                Validez une collecte si le commerçant ou l'association ne peut pas le faire.
              </p>
            </div>
          </Reveal>
          <CollecteAdminList collects={collects} />
        </div>
      </div>
    </main>
  );
}
