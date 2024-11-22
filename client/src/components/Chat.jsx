

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Chat() {
  const [messages, setMessages] = useState([])   
  const [input, setInput] = useState("")         

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return  

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])  
    setInput("")  

    try {

      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      
      const data = await response.json();
      console.log(data);

      
      if (data?.response) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I couldn't understand your request." },
        ])
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ])
    }
  }

  return (
    <Card className="w-[60vw] ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-center font-semibold text-3xl">
          Chat with Multiple PDF 
          <span role="img" aria-label="wizard emoji" className="text-2xl">
            🧙‍♂️
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg px-4 py-2 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <Input
            placeholder="Ask a question from the PDF files..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" disabled={!input.trim()}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
