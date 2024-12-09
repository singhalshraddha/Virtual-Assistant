import React, { createContext, useState } from "react";
import run from "../gemini";

export const Datacontext = createContext();

function UserContext({ children }) {
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState("listening...");
  const [response, setResponse] = useState(false);
  const [recognizedText, setRecognizedText] = useState(""); // For real-time recognized speech
  const [aiResponseText, setAiResponseText] = useState(""); // For AI response text

  // Function for Text-to-Speech
  function speak(text) {
    const textSpeak = new SpeechSynthesisUtterance(text);
    textSpeak.volume = 1;
    textSpeak.rate = 1;
    textSpeak.pitch = 1;
    textSpeak.lang = "en-GB";
    window.speechSynthesis.speak(textSpeak);
  }

  // Function to Fetch AI Response
 
  async function aiResponse(prompt) {
    try {
      const Text = await run(prompt); // Fetch the AI response
      speak(Text); // Convert AI response to speech
      setAiResponseText(Text); // Store AI response text
      setResponse(true); // Indicate that the AI has responded
  
      // Reset speaking and response states after speaking is done
      const speechDuration = Math.max((Text.split(" ").length / 2) * 1000, 5000); // Estimate duration based on text length
      setTimeout(() => {
        setSpeaking(false);
        setResponse(false);
      }, speechDuration);
    } catch (error) {
      console.error("AI Response Error:", error);
      speak("Sorry, I encountered an error processing your request.");
      setSpeaking(false);
      setResponse(false);
    }
  }
  
  // Initialize SpeechRecognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  let recognition = null;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true; // Enable interim results for real-time feedback
    recognition.continuous = false;

    recognition.onstart = () => {
      console.log("Speech recognition started.");
      setSpeaking(true); // Start the speaking state
    };

    recognition.onresult = (e) => {
      let interimTranscript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        interimTranscript += e.results[i][0].transcript.trim();
      }
      setRecognizedText(interimTranscript); // Update real-time transcript

      if (e.results[e.resultIndex].isFinal) {
        setRecognizedText(interimTranscript); // Finalize transcript
        //aiResponse(interimTranscript); // Fetch AI response
        takeCommand(interimTranscript.toLowerCase())
      }
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
      // Keep the speaking state if AI response is processing
      if (!response) setSpeaking(false);
    };

    recognition.onerror = (event) => {
      console.error("SpeechRecognition Error:", event.error);
      speak("Sorry, I couldn't understand that. Please try again.");
      setSpeaking(false);
    };
  } else {
    console.warn("SpeechRecognition is not supported in this browser.");
  }
  function takeCommand(command){
    if(command.includes("open") && command.includes("youtube")){
      window.open("https://www.youtube.com/","_blank")
      speak("opening Youtube ")
      setPrompt("opening Youtube")
      setTimeout(() => {
        setSpeaking(false);
        
      },5000);
    }else if (command.includes("open") && command.includes("instagram")){
      window.open("https://www.instagram.com/","_blank")
      speak("opening instagram ")
      setPrompt("opening instagram")
      setTimeout(() => {
        setSpeaking(false);
        
      },5000);
    }
    else{
      aiResponse(command)
    }


  }

  // Context Value
  const value = {
    recognition: recognition || null,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    response,
    setResponse,
    recognizedText,
    aiResponseText,
  };

  return (
    <Datacontext.Provider value={value}>
      {children}
    </Datacontext.Provider>
  );
}

export default UserContext;
