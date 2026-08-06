import { HomePage } from "@/components/home-page";
import { getSiteConfig, themeToCssVars } from "@/lib/site-config";

export default function Page() {
  const config = getSiteConfig();

  return (
    <div className="flex min-h-full flex-1 flex-col" style={themeToCssVars(config.theme)}>
      <HomePage config={config} />
    </div>
  );
}
