

import { useState } from "react"
import { Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function FileUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState([])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    const pdfFiles = droppedFiles.filter(file => 
      file.type === "application/pdf" && file.size <= 200 * 1024 * 1024
    )
    setFiles((prevFiles) => [...prevFiles, ...pdfFiles])
  }

  const handleFileInput = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const pdfFiles = selectedFiles.filter(file => 
        file.type === "application/pdf" && file.size <= 200 * 1024 * 1024
      )
      setFiles((prevFiles) => [...prevFiles, ...pdfFiles])
    }
  }

  return (
    <div className="w-[40vw] max-w-md">
      <Card className="border-2 border-dashed">
        <CardContent className="p-4">
          <div
            className={`flex flex-col items-center justify-center space-y-4 p-4 text-center ${
              dragActive ? "bg-muted/50" : ""
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Drag and drop files here</p>
              <p className="text-xs text-muted-foreground">Limit 200MB per file</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => document.getElementById("file-input").click()}>
                Browse files
              </Button>
              <Button 
                variant="default" 
                disabled={files.length === 0}
                onClick={async () => {
                    const formData = new FormData();
                    files.forEach((file, index) => {
                      formData.append(`files`, file);
                    });
  
                    try {
                      const response = await fetch("http://localhost:8000/upload", {
                        method: "POST",
                        body: formData,
                      });
                      const data = await response.json();
                      console.log(data.message);
                      
                    } catch (error) {
                      console.error("Error uploading files:", error);
                      
                    }
                  }}
              >
                Submit & Process
              </Button>
            </div>
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept=".pdf"
              multiple
              onChange={handleFileInput}
            />
          </div>
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Selected files:</p>
              {files.map((file, index) => (
                <p key={index} className="text-xs text-muted-foreground">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
