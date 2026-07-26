import { AppProviders } from "./providers/AppProviders";
import { DesktopLayout } from "./layouts/DesktopLayout";

export default function App() {
  return (
    <AppProviders>
      <DesktopLayout />
    </AppProviders>
  );
}
