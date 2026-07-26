import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { KeyboardProvider } from "./KeyboardProvider";
import { TooltipProvider } from "./TooltipProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <ThemeProvider>
      <KeyboardProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </KeyboardProvider>
    </ThemeProvider>
  );
}
