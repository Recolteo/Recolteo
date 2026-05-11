export default function Btns() {
    return (
        <div>
            <button>
                Click moi
            </button>
        </div>
    )
}

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "tertiary" | "foruthary";
}

const variants = {
  primary: "bg-color-sapin",
  secondary:  "bg-color-cream",
  tertiary: "bg-color-peach",
  foruthary: "bg-color-lime",
};

const Button = ({ label, onClick, disabled = false, variant = "primary" }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} px-4 py-2 rounded transition-colors`}
    >
      {label}
    </button>
  );
};

<Button label="Valider" onClick={() => alert("OK")} variant="primary" />
