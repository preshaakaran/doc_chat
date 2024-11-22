# Doc Chat: PDF Chatbot

Doc Chat is a web application that allows users to upload multiple PDF documents and interact with them through a chatbot interface. The backend is powered by **FastAPI**, integrated with **LangChain**, **Google Gemini**, and **FAISS** for document processing, vector storage, and conversational AI. The frontend is built with **React** and communicates with the backend using fetch requests for PDF uploads and chat interactions.


## Backend Setup

### Requirements

- Python 3.8 or higher
- Required Python Libraries:
  - `fastapi`
  - `uvicorn`
  - `PyPDF2`
  - `langchain`
  - `google-generativeai`
  - `faiss-cpu`
  - `pydantic`
  - `python-dotenv`

### Setup Steps

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd doc-chat-backend
   ```
2.**Create a .env file in the root directory and add your Google API key:**

```bash
GOOGLE_API_KEY=your-google-api-key
```
3.**Install the required Python dependencies:**

```bash
pip install -r requirements.txt
```
4.**Run the FastAPI backend server:**

```bash
uvicorn main:app --reload
```
The backend will be running at http://localhost:8000.
