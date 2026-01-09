import { useMemo, useRef, useState, type FormEvent } from "react";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import TileBg from "~/components/TileBg";
import { prepareInstructions } from "~/constants";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";


const upload = () => {
  const parentRef = useRef<HTMLDivElement>(null);

  const { auth, ai, fs, kv } = usePuterStore()

  const [file, setFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  
  const [processingMessage, setProcessingMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const isValidForm = useMemo(
    () => companyName && jobTitle && jobDescription,
    [companyName, jobTitle, jobDescription]
  );

  async function AnalyzeResume({ companyName, jobDescription, jobTitle, pdf }: { jobTitle:string, jobDescription:string, companyName:string, pdf:string }){
    const feedback = await ai.feedback(
      pdf,
      prepareInstructions({
        jobTitle,
        jobDescription,
        AIResponseFormat:'string'
      })
    )

    return feedback;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (!isValidForm || !file) return;

    setIsProcessing(true)
    setProcessingMessage('Uploading your resume...')
    const uploadedPDF = await fs.upload([file])

    if(!uploadedPDF) {
      setProcessingMessage('!Failed to upload resume...')
      return;
    }
    
    setProcessingMessage('Creating image from resume...')
    const pdfImage = await convertPdfToImage(file)
    
    if(!pdfImage.file){
      setProcessingMessage('!Failed to create image from resume...')
      return;
    } 
    
    setProcessingMessage('Uploading resume image...')
    const uplaodedPdfImage = await fs.upload([pdfImage.file])
    
    if(!uplaodedPdfImage) {
      setProcessingMessage('!Failed to upload resume image...')
      return;
    }

    const data = {
      imagePath:uplaodedPdfImage.path,
      resumePath:uploadedPDF.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback:''
    }
    
    setProcessingMessage('Analyzing Your Resume...')

    const analysisResult = await AnalyzeResume({
      companyName,
      jobDescription,
      jobTitle,
      pdf:uploadedPDF.path,
    })

    if(!analysisResult) {
      setProcessingMessage('!Unable to analyze the resume...')
      return;
    }
    
    const feedback = typeof analysisResult.message.content === 'string' ? 
    analysisResult.message.content :
    analysisResult.message.content[0].text; 

    data.feedback = feedback;

    setProcessingMessage('Uploading The Data...')

    const uploadedData = await kv.set(`resume:${generateUUID()}`,JSON.stringify(data))

    if(!uploadedData) {
      setProcessingMessage("Failed To Upload Data")
      return;
    }
    setProcessingMessage("Successfully Uploaded Data. Redirecting...")
    console.log(data)
    

  }

  return (
    <main ref={parentRef} className="upload-page w-screen h-auto relative">
      <Navbar />
      <TileBg parentRef={parentRef} />

      <section className="main-section w-full min-h-screen h-fit relative z-20">
        <div className="page-heading">
          <h1>Smart feedback for your dream job.</h1>
          <h2>Drop your resume for an ATS score and improvement tips</h2>
        </div>

      {
        isProcessing ? (

          <div className="w-full flex flex-col justify-start items-center">
            <h2 className="text-4xl">{processingMessage}</h2>
            <img 
              src="/images/resume-scan-2.gif"
              alt="processing-resume"
              className="md:h-75"
            />
          </div>

        ) : (
        <form onSubmit={onSubmit} className="upload-form flex flex-col justify-start items-center px-4">
          <div className="form-div">
            <label htmlFor="company-name">Company Name</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              type="text"
              placeholder="Company Name"
              name="company-name"
              id="company-name"
            />
          </div>
          <div className="form-div">
            <label htmlFor="job-title">Job Title</label>
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              type="text"
              placeholder="Job Title"
              name="job-title"
              id="job-title"
            />
          </div>
          <div className="form-div">
            <label htmlFor="job-description">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
              placeholder="Job Description"
              name="job-description"
              id="job-description"
            />
          </div>
          <div className="form-div">
            <label htmlFor="upload-resume">Upload Resume</label>
            <FileUploader file={file} setFile={setFile} />
          </div>
          <div className="form-div">
            <button
              type="submit"
              className={`w-full ${isValidForm ? 'bg-blue-600' : 'bg-blue-300'} cursor-pointer transition-colors duration-300 text-white py-3 rounded-3xl text-center`}
            >
              Analyze Resume
            </button>
          </div>
        </form>
        )
      }

      </section>
    </main>
  );
};

export default upload;
