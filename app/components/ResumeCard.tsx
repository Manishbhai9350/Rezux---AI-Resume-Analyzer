import ScoreCircle from "./ScoreCircle";

const ResumeCard = ({
  feedback,
  id,
  imagePath,
  resumePath,
  companyName,
  jobTitle,
}: Resume) => {
  return (
    <div className="resume-card">
      <div className="resume-card-header">
        <div className="flex flex-col">
          <h1 className="!text-3xl">{jobTitle}</h1>
          <p className="text-black/40">{companyName}</p>
        </div>
        <div className="shrink-0">
          <ScoreCircle score={90} />
        </div>
      </div>
      <div className="resume-image w-full h-full overflow-hidden rounded-sm">
        <img
          className="w-full h-auto object-cover"
          src={imagePath}
          alt="resume-image"
        />
      </div>
    </div>
  );
};

export default ResumeCard;
