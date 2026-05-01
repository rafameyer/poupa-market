import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-700",
  secondary:
    "border border-slate-200 bg-white text-slate-800 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold",
        "disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
