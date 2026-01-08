import TileBg from "~/components/TileBg";
import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import { resumes } from "~/constants";
import ResumeCard from "~/components/ResumeCard";
import { useRef } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rezux" },
    { name: "description", content: "AI Resume Analyser and Job ready improver" },
  ];
}

export default function Home() {

    const containerRef = useRef<HTMLDivElement>(null);

  return <main className="main w-screen h-auto relative">
    <TileBg parentRef={containerRef} />
    <Navbar />
    <section ref={containerRef} className="main-section max-w-[1400px] relative z-10 px-4">
      <div className="section-headings">
        <h1 className="text-center">Analyze Your Resume. Beat the ATS.</h1>
        <h2 className="text-center">Get instant, AI-powered insights to improve keyword match, structure, and readability.</h2>
      </div>

      <div className="resumes-section w-full">
        {
          resumes && (
            resumes.map(resume => (
              <ResumeCard
                key={resume.id}
                {...resume}
              />
            ))
          )
        }
      </div>
    </section>
  </main>;
}
