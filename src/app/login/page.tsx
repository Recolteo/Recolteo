import LoginForm from "./_components/LoginForm";
import Image from "next/image";
import Ecureuil from "@/src/asset/ecureuil.webp";

export default function LoginPage() {
  return (
    <main className="relative w-full flex flex-row items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-10 gap-12 overflow-hidden">
      <LoginForm />
      <Image src={Ecureuil} alt="description" width={200} height={200}/>
    </main>
  );
}
