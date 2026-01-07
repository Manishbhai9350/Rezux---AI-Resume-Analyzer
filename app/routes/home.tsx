import TileBg from "~/components/TileBg";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rezux" },
    { name: "description", content: "AI Resume Analyser and Job ready improver" },
  ];
}

export default function Home() {
  return <main className="main w-screen h-auto relative">
    <TileBg />
  </main>;
}
