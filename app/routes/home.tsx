import TileBg from "~/components/TileBg";
import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { useEffect, useRef, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rezux" },
    {
      name: "description",
      content: "AI Resume Analyser and Job ready improver",
    },
  ];
}

export default function Home() {
  const { isLoading, auth, fs, kv } = usePuterStore();

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [IsFetchingResumes, setIsFetchingResumes] = useState(false);
  const [Resumes, setResumes] = useState<null | Resume[]>(null);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/");
    }

    setIsFetchingResumes(true);

    const FetchResumes = async () => {
      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      if (!resumes || !resumes?.length) return;

      const parsed = resumes.map(
        (resume) => JSON.parse(resume.value) as Resume
      );
      setResumes(parsed);

      setIsFetchingResumes(false);
    };

    FetchResumes();
  }, [auth.isAuthenticated, isLoading]);

  return (
    <main className="main w-screen h-auto relative">
      <TileBg parentRef={containerRef} />
      <Navbar />
      <section
        ref={containerRef}
        className="main-section max-w-[1400px] relative z-10 px-4"
      >
        <div className="section-headings">
          <h1 className="text-center !text-4xl">
            Analyze Your Resume. Beat the ATS.
          </h1>
          <h2 className="text-center !text-sm">
            Get instant, AI-powered insights to improve keyword match,
            structure, and readability.
          </h2>
        </div>

        {IsFetchingResumes && (
          <div className="fetching w-full flex justify-center items-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}

        {!Resumes?.length && (
          <div className="upload capatilize text-md font-semibold text-gray-600">
            click{" "}
            <Link to="/upload" className="navbar-button primary-button w-fit">
              Upload Resume
            </Link> {" "}
            your first resume
          </div>
        )}

        <div className="resumes-section w-full flex flex-wrap gap-3">
          {!IsFetchingResumes &&
            Resumes &&
            Resumes.map((resume) => <ResumeCard key={resume.id} {...resume} />)}
        </div>
      </section>
    </main>
  );
}
