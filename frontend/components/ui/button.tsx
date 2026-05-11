import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-400 disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}
