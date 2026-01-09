import React, { useCallback, useState, type ActionDispatch, type SetStateAction } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/utils";

interface FileUploaderProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const FileUploader = ({ file,setFile }:FileUploaderProps) => {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]

    if(!file) return null;

    setFile(file)


  }, []);
  const { getRootProps, getInputProps, isDragActive, acceptedFiles} =
    useDropzone({ onDrop });

  return (
    <div
      className={`w-full rounded-2xl transition-colors duration-150 ${isDragActive ? "bg-sky-600" : "bg-sky-400"}`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {file ? (
        <div onClick={e => e.stopPropagation()} className="w-full px-4 flex justify-between items-center relative gradient-border text-center text-white">
          <img
            className="h-10 "
            src="/images/pdf.png"
          />
          <div className="flex flex-col justify-center items-center">
            <p className="leading-6 text-lg max-w-[40%] truncate text-center">{ file.name }</p>
            <p className="opacity-80 text-sm">{ formatSize(file.size) }</p>
          </div>
          
          <div onClick={e => setFile(null)} className="h-7 w-7 shrink-0 cursor-pointer flex justify-center items-center rounded-full bg-red-500">
            <img
              className="h-5 w-5"
              src="/icons/cross.svg"
              />
          </div>
        </div>
      ) : (
        <div className="w-full cursor-pointer gradient-border text-center text-white">
          <p>Select or Drag and Drop your Resume</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
