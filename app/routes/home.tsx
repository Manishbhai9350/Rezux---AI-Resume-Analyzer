import TileBg from "~/components/TileBg";
import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rezux" },
    { name: "description", content: "AI Resume Analyser and Job ready improver" },
  ];
}

export default function Home() {
  return <main className="main w-screen h-auto relative">
    <TileBg />
    <Navbar />
    <section className="main-section relative z-10">
      <div className="section-headings">
        <h1 className="text-center">Analyze Your Resume. Beat the ATS.</h1>
        <h2 className="text-center">Get instant, AI-powered insights to improve keyword match, structure, and readability.</h2>
      </div>
    </section>
  </main>;
}
