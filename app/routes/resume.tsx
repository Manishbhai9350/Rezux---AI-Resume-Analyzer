import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/feedback/ATS";
import Details from "~/components/feedback/Details";
import Summary from "~/components/feedback/Summary";
import { usePuterStore } from "~/lib/puter";

const resume = () => {
  const { id } = useParams();
  const { ai, auth, fs, kv, isLoading } = usePuterStore();

  const [FetchingResume, setFetchingResume] = useState(true);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
      return;
    }

    async function FetchResume() {
      const resume = await kv.get(`resume:${id}`);

      if (!resume) return;

      const Resume: Resume = JSON.parse(resume);

      const resumeBlob = await fs.read(Resume.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(pdfUrl);

      const imageBlob = await fs.read(Resume.imagePath);
      if (!imageBlob) return;

      const imgUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imgUrl);
      setFeedback(Resume.feedback);

      let parsedFeedback = Resume.feedback;
      if(typeof parsedFeedback == 'string'){
        parsedFeedback = JSON.parse(parsedFeedback)
    }
    console.log(parsedFeedback)
    setFeedback(parsedFeedback)

      setFetchingResume(false);
    }

    FetchResume();

    return () => {};
  }, [id, isLoading, auth]);

  return (
    <main className="resume-page w-full h-auto !pt-0 m-0">
      <nav className="w-full absolute top-0 z-20 flex h-12 justify-between items-center bg-white shadow-2xl px-6">
        <Link to={"/"} className="back-button">
          <img src="/icons/back.svg" alt="back" />
        </Link>
      </nav>

      {
        FetchingResume && (
            <div className="fetching-img h-screen w-full flex justify-center items-center">
                <img 
                  src="/images/resume-scan-2.gif"
                  alt="fetching-resume"
                  className="h-[400px] object-cover"
                />
            </div>
        )
      }

      {feedback && imageUrl && (
        <div className="resume-section p-4 pt-12 h-screen overflow-y-scroll gap-3 flex flex-row max-sm:flex-col-reverse">
          <div className="resume flex-1 w-full h-screen sticky top-0">
            <div className="h-[90%] w-full flex justify-center">
              <img
                src={imageUrl}
                alt="resume"
                className="h-full object-cover overflow-hidden rounded-xl"
              />
            </div>
          </div>
          <div className="summary flex-1">
            <h2 className="font-semibold text-2xl">Resume Summary</h2>
            <div className="summary">
              <Summary feedback={feedback} />
            </div>
            <div className="details">
              <Details feedback={feedback} />
            </div>
            <div className="ats">
                <ATS score={feedback.ATS.score} suggestions={feedback.ATS.tips}  />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default resume;
