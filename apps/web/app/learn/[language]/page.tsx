import LanguageClient from "./LanguageClient";

export function generateStaticParams() {
  return ["spanish", "mandarin", "french", "japanese", "korean"].map((language) => ({ language }));
}

export default function LanguagePage() {
  return <LanguageClient />;
}
