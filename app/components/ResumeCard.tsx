import { useEffect, useState } from "react";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  feedback,
  id,
  imagePath,
  resumePath,
  companyName,
  jobTitle,
}: Resume) => {

  const { kv,fs } = usePuterStore()
  const [FetchingResumeImage, setFetchingResumeImage] = useState(false)
  const [ImageUrl, setImageUrl] = useState('')

  useEffect(() => {
    
    const FetchResumeImage = async () => {
      setFetchingResumeImage(true)

      const imgBlob =  await fs.read(imagePath)

      if(!imgBlob) return;

      const imgUrl = URL.createObjectURL(imgBlob)

      if(!imgUrl) return;

      setImageUrl(imgUrl)

      setFetchingResumeImage(false)
    }

    FetchResumeImage()
  
    return () => {
      
    }
  }, [imagePath])
  

  return (
    <div className="resume-card">
      <div className="resume-card-header">
        <div className="flex flex-col">
          { jobTitle && <h1 className="!text-xl">{jobTitle}</h1>}
          { companyName && <p className="text-black/40 text-sm">{companyName}</p>}
        </div>
        <div className="shrink-0">
          <ScoreCircle score={90} />
        </div>
      </div>
      {
        FetchingResumeImage ? (
          <div className="fetching w-full flex justify-center items-center">
            <img 
              src="/images/resume-scan-2.gif"
              className="w-[200px]"
            />
          </div>
        ) : (
        <div className="resume-image w-full h-full overflow-hidden rounded-sm">
          {ImageUrl && <img
            className="w-full h-auto object-cover"
            src={ImageUrl}
            alt="resume-image"
          />}
        </div>
        )
      }
    </div>
  );
};

export default ResumeCard;
