import AdminDecorations from "../_components/AdminDecorations";
import AdminFiltre from "../_components/AdminFiltre";
import { getValidationData, VALIDATION_PAGE_SIZE } from "../_utils/fetchAdmin";

export default async function AdminValidationPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string; search?: string }>;
}) {
  const data = await getValidationData(searchParams);

  return (
    <main className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden">
      <AdminDecorations />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <AdminFiltre {...data} pageSize={VALIDATION_PAGE_SIZE} />
      </div>
    </main>
  );
}
