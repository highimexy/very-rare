import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";

interface BackButtonProps {
  theme?: "red" | "emerald" | "purple" | "yellow" | "orange" | "pink";
}

function BackButton({ theme = "purple" }: BackButtonProps) {
  const navigate = useNavigate();

  const styles = {
    red: "hover:text-red-500 hover:border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]",
    emerald:
      "hover:text-emerald-500 hover:border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    purple:
      "hover:text-purple-500 hover:border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.2)]",
    yellow:
      "hover:text-yellow-400 hover:border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]",
    orange:
      "hover:text-orange-500 hover:border-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.2)]",
    pink:
      "hover:text-pink-500 hover:border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.2)]",
  }[theme];

  return (
    <button
      onClick={() => navigate("/")}
      className={`
        absolute top-6 left-6 z-50
        flex items-center gap-2 
        px-4 py-2 
        bg-[#1e0b37]/40 backdrop-blur-md
        border-2 border-[#1e0b37] rounded-lg
        text-gray-400 font-bold uppercase text-xs tracking-widest
        transition-all duration-300 cursor-pointer
        ${styles}
      `}
    >
      <FaChevronLeft className="text-sm" />
      Back to Lobby
    </button>
  );
}

export default BackButton;
