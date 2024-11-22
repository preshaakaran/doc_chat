# Doc Chat: PDF Chatbot

## Overview

Doc Chat is a web application that allows users to upload multiple PDF documents and interact with them through a chatbot interface. The backend uses FastAPI with integration to LangChain, Google Gemini, and FAISS for document processing, vector storage, and conversational AI. The frontend is built with React and communicates with the FastAPI backend using fetch to handle PDF uploads and chat requests.

## Backend (FastAPI)

### Setup

1. Clone this repository to your local machine:
   ```bash
   git clone <repository-url>
   cd doc-chat-backend
