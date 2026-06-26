export default function ProfilHeader() {
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
