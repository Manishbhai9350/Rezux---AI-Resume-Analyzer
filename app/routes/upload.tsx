import { useRef } from "react";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import TileBg from "~/components/TileBg";

const upload = () => {
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <main
      ref={parentRef}
      className="upload-page w-screen h-auto relative"
    >
        <Navbar />
        <TileBg parentRef={parentRef} />

        <section className="main-section w-full min-h-screen h-fit relative z-20 px-5 ">
            <div className="page-heading">
                <h1>Smart feedback for your dream job.</h1>
                <h2>Drop your resume for an ATS score and improvement tips</h2>
            </div>

            <form action="" className="upload-form">
                <div className="form-div">
                    <label htmlFor="company-name">Company Name</label>
                    <input type="text" placeholder="Company Name" name="company-name" id="company-name" />
                </div>
                <div className="form-div">
                    <label htmlFor="job-title">Job Title</label>
                    <input type="text" placeholder="Job Title" name="job-title" id="job-title" />
                </div>
                <div className="form-div">
                    <label htmlFor="job-description">Job Description</label>
                    <textarea rows={5} placeholder="Job Description" name="job-description" id="job-description" />
                </div>
                <div className="form-div">
                    <label htmlFor="upload-resume">Upload Resume</label>
                    <FileUploader />
                </div>
            </form>

        </section>

    </main>
  );
};

export default upload;
