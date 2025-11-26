interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Logo = ({ size = "md", className = "" }: LogoProps) => {
  const sizes = {
    sm: "w-8 h-8 text-2xl",
    md: "w-12 h-12 text-4xl",
    lg: "w-20 h-20 text-6xl",
    xl: "w-24 h-24 text-7xl"
  };

  return (
    <div className={`${sizes[size]} relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 gradient-gold rounded-2xl opacity-20 blur-xl"></div>
      <div className="relative gradient-gold rounded-2xl w-full h-full flex items-center justify-center shadow-gold border-2 border-gold/30">
        <span className="font-bold text-deep-black leading-none tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>
          F
        </span>
      </div>
    </div>
  );
};
