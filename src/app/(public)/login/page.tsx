import LoginForm from "./_components/LoginForm";
import Leo from "../../../components/ui/modals/Leo";

const LEO_STEPS = [
  { message: "Bienvenue sur Récoltéo, accédez à votre espace." },
];

export default function LoginPage() {
  return (
    <main className="relative w-full flex flex-col sm:flex-row items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-2 sm:py-10 gap-1 overflow-hidden">

      <LoginForm />
      <Leo storageKey="leo-login" steps={LEO_STEPS} />

    </main>
  );
}
