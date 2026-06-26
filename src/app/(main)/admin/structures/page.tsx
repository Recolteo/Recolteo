import AdminDecorations from "../_components/AdminDecorations";
import StructuresFiltre from "./_components/StructuresFiltre";
import { fetchStructuresData } from "./_utils/fetchStructures";

export default async function StructuresPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>;
}) {
  const {
    commercants,
    commercantsTotal,
    associations,
    associationsTotal,
    filter,
    page,
  } = await fetchStructuresData(searchParams);

  return (
    <main className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden">
      <AdminDecorations />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <StructuresFiltre
          commercants={commercants}
          commercantsTotal={commercantsTotal}
          associations={associations}
          associationsTotal={associationsTotal}
          filter={filter}
          page={page}
          pageSize={10}
        />
      </div>
    </main>
  );
}
