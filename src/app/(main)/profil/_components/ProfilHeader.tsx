const ROLE_LABEL = {
  admin: "Administrateur",
  commercant: "Commerçant",
  association: "Association",
} as const;

const ROLE_CLASS = {
  admin: "bg-sapin/10 text-sapin",
  commercant: "bg-peach/10 text-peach border border-peach/20",
  association: "bg-lime/30 text-sapin border border-lime/40",
} as const;

interface ProfilHeaderProps {
  nom: string;
  role: "commercant" | "association" | "admin";
}

export default function ProfilHeader({ nom, role }: ProfilHeaderProps) {
  return (
    <div>
      <h1 className="text-sapin font-black">
        Votre{" "}
        <span className="relative italic whitespace-nowrap">
          <span
            className="absolute inset-0 bg-lime rounded-xl -rotate-1 scale-x-110"
            aria-hidden="true"
          />
          <span className="relative">profil</span>
        </span>
      </h1>
    </div>
  );
}
