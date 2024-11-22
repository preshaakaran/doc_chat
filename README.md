Doc Chat: PDF Chatbot
Overview
Doc Chat is a web application that allows users to upload multiple PDF documents and interact with them through a chatbot interface. The backend uses FastAPI with integration to LangChain, Google Gemini, and FAISS for document processing, vector storage, and conversational AI. The frontend is built with React and communicates with the FastAPI backend using fetch to handle PDF uploads and chat requests.

Backend (FastAPI)
Setup
Clone this repository to your local machine.
bash
Copy code
git clone <repository-url>
cd doc-chat-backend
Create a .env file in the root directory and add your Google API key:
bash
Copy code
GOOGLE_API_KEY=your-google-api-key
Install the required Python dependencies:
bash
Copy code
pip install -r requirements.txt
Run the FastAPI backend server:
bash
Copy code
uvicorn main:app --reload
The backend should now be running at http://localhost:8000.

Endpoints
1. Upload PDF Documents
Endpoint: /upload
Method: POST
Description: Upload one or more PDF files for processing.
Request:
files: A list of PDF files to be uploaded.
Response: Success message indicating the number of files processed.
2. Chat with the PDFs
Endpoint: /chat
Method: POST
Description: Ask a question based on the uploaded PDFs.
Request:
question: The question you want to ask the chatbot.
Response: The chatbot’s response based on the context of the uploaded PDFs.
Frontend (React)
Setup
Navigate to the frontend directory:
bash
Copy code
cd doc-chat-frontend
Install the required Node.js dependencies:
bash
Copy code
npm install
Start the React development server:
bash
Copy code
npm start
The frontend will be available at http://localhost:5173.

React Frontend
The frontend uses React to display the user interface and communicate with the FastAPI backend.

PDF Upload
Functionality: Allows users to select and upload multiple PDF files.
API: Makes a POST request to the /upload endpoint with the selected files.
Chat Interface
Functionality: Allows users to ask questions based on the uploaded PDFs.
API: Makes a POST request to the /chat endpoint with the user's question.
Communication between React and FastAPI
PDF Upload: The frontend uses fetch to send the uploaded files to the backend. After processing, it returns a success message.
Chat Requests: The frontend sends a POST request with the question to the /chat endpoint, and the backend responds with the chatbot's answer.
Example fetch code from the React app:

js
Copy code
// Upload PDFs
const handleFileUpload = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await fetch('http://localhost:8000/upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  console.log(result);
};

// Chat Request
const handleChatRequest = async (question) => {
  const response = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });

  const result = await response.json();
  console.log(result.response);
};
Requirements
Backend (FastAPI)
Python 3.8+
Required Python Libraries:
fastapi
uvicorn
PyPDF2
langchain
google-generativeai
faiss-cpu
pydantic
python-dotenv
Frontend (React)
Node.js (v14+)
React (v18+)
Dependencies:
react
react-dom
