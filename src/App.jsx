import React, { useContext } from "react";
import "./App.css";
import va from "./assets/ai.png";
import { CiMicrophoneOn } from "react-icons/ci";
import { Datacontext } from "./context/UserContext";
import speakimg from "./assets/speak.gif";
import aigif from "./assets/aiVoice.gif";

function App() {
  const {
    recognition,
    speaking,
    setSpeaking,
    recognizedText,
    aiResponseText,
    response,
  } = useContext(Datacontext);

  const handleStartRecognition = () => {
    if (recognition) {
      try {
        setSpeaking(true);
        recognition.start();
      } catch (error) {
        console.error("Error starting recognition:", error);
        alert("An error occurred while starting speech recognition.");
      }
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  return (
    <div className="main">
      <img src={va} alt="Virtual Assistant Icon" id="sifra" />
      <span>Hello, I'm your virtual assistant</span>
      {!speaking && !response ? ( // Button shows when neither speaking nor responding
        <button onClick={handleStartRecognition}>
          Click Here <CiMicrophoneOn />
        </button>
      ) : (
        <div className="response">
          {!response ? (
            <div>
              <img src={speakimg} alt="Speaking animation" id="speak" />
              <p>{recognizedText || "Listening..."}</p>
            </div>
          ) : (
            <div>
              <img src={aigif} alt="AI responding animation" id="aigif" />
              <p>{aiResponseText}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;