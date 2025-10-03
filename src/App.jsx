import React, { useState } from "react";
import "./App.css";

import PasscodeGSAP from "./Pages/PasscodeGSAP";
import LoveLoading from "./Pages/LoveLoading";
import ClickSpark from "./Pages/ClickSpark";
import HomePage from "./Pages/HomePage";

export default function App() {
  const [step, setStep] = useState("lock"); 
  // lock -> loading -> home

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      {step === "lock" && <PasscodeGSAP onSuccess={() => setStep("loading")} />}
      
      {step === "loading" && <LoveLoading onComplete={() => setStep("home")} />}
      
      {step === "home" && (
        <ClickSpark>
          <HomePage />
        </ClickSpark>
      )}
    </div>
  );
}