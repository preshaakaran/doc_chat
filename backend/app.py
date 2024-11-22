from fastapi import FastAPI, File, UploadFile,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from PyPDF2 import PdfReader
import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from langchain.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import io
from typing import List

load_dotenv()

genai.configure(api_key = os.getenv("GOOGLE_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


global_faiss_index = None

def get_text_from_pdf(pdf_file):
    text = ""
    reader = PdfReader(pdf_file)
    for page in reader.pages:
        text += page.extract_text()
    return text

def get_text_chunks(text):
    splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = splitter.split_text(text)
    return chunks

def get_embeddings(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model='models/embedding-001')
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    return vector_store

def get_conversational_chain():
    prompt_template = """
    Answer the question in detail from the provided context, make sure to provide an answer with all the details. If the answer is not in the provided context, just say, "answer is not in the context". Don't provide any wrong answers.
    Context: \n{context}\n
    Question: \n{question}\n
    
    Answer:
    """
    
    model = ChatGoogleGenerativeAI(model='gemini-pro', temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=['context', 'question'])
    chain = load_qa_chain(model, chain_type='stuff', prompt=prompt)
    return chain

@app.post("/upload")
async def process_pdfs(files: List[UploadFile] = File(...)):
    global global_faiss_index
    try:
        all_text = ""
        for file in files:
            pdf_content = await file.read()
            pdf_file = io.BytesIO(pdf_content)
            text = get_text_from_pdf(pdf_file)
            all_text += text + "\n\n"
        
        text_chunks = get_text_chunks(all_text)
        global_faiss_index = get_embeddings(text_chunks)
        
        return JSONResponse(content={"message": f"Successfully processed {len(files)} files"})
    
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat(chat_request: ChatRequest):
    global global_faiss_index
    try:
        if global_faiss_index is None:
            raise HTTPException(status_code=400, detail="No PDFs have been uploaded yet")
        
        docs = global_faiss_index.similarity_search(chat_request.question)
        chain = get_conversational_chain()
        response = chain({"input_documents": docs, "question": chat_request.question}, return_only_outputs=True)

        return JSONResponse(content={"response": response['output_text']})
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)