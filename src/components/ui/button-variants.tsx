import { cva } from "class-variance-authority";

export const cinematicButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-gold hover:opacity-90 hover:shadow-lg hover:scale-105",
        hero: "gradient-gold text-deep-black shadow-gold hover:shadow-xl hover:scale-105 border-2 border-gold",
        filmRed: "gradient-red text-foreground shadow-red hover:shadow-xl hover:scale-105",
        outline: "border-2 border-gold text-gold hover:bg-gold hover:text-deep-black",
        ghost: "text-gold hover:bg-gold/10",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 px-4 text-sm",
        lg: "h-14 px-8 text-lg",
        xl: "h-16 px-10 text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
