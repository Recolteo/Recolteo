import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-10 overflow-hidden">
      <LoginForm />
    </main>
  );
}
