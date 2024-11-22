import React from "react";
import { FileUpload } from "./components/FileUpload";
import { Chat } from "./components/Chat";


function App() {
  
 

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex gap-3 ">
        <FileUpload />
        <Chat />
      </div>
    </main>

  );
}

export default App;


