// App.tsx
import React, { useCallback, useEffect, useState } from 'react';
import MicRecorder from '../components/MicRecorder';
import { GoogleGenAI } from "@google/genai";

export default function Speak() {
  const [transcript, setTranscript] = useState<string>('');

  const handleTranscribed = useCallback((text: string) => {
    setTranscript(text);      // triggers extractor
    console.log(text);
  }, []);

  const validJson = (s: String) => {

      // 1. Find the first occurrence of '{'
      const start = s.indexOf('{');

      // 2. Find the last occurrence of '}'
      const end = s.lastIndexOf('}');

      if (start !== -1 && end !== -1 && end > start) {
          // 3. Extract the substring
          const jsonString = s.slice(start, end + 1);
          
          try {
              const data = JSON.parse(jsonString);
              return data;
          } catch (error) {
              console.error("The extracted string isn't valid JSON:", error.message);
          }
      } else {
          console.error("No curly braces found in the string.");
      }
  }

  const SendReq = async() => {
    const pl = `You are an intent parser for a banking assistant.

Extract:
- intent
- startDate
- endDate
- category (if present)

Return ONLY valid JSON.

Possible intents:
MONTHLY_SUMMARY
TOP_EXPENSES
SPENDING_BY_MERCHANT
BALANCE

Date should be in formate : YYYY-MM-DD (if user doesnt mention year, assume 2025)
Date should be between may-2025 and jan-2026

User query:
"Can You give me octuber spending analysis"

Return in strictly JSON formate like this:
{
  "intent": "MONTHLY_SUMMARY",
  "startDate": "2026-01-01",
  "endDate": "2026-01-31",
  "limit": null
}`
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    // const ai = new GoogleGenAI({apiKey: key});
    // const response = await ai.models.generateContent({
    //   // model: "gemini-2.5-flash-lite-preview-09-2025",
    //   model: "gemini-2.5-flash-lite",
    //   contents: pl,
    // });
    // console.log(validJson(response.text));

  }

  return (
    <div className="p-4 space-y-4">
      {/* 1) Record & transcribe */}
      <MicRecorder
        uploadUrl="transcribe"          // adjust to match backend path
        onTranscribed={handleTranscribed}
        fieldName="file" 
        extraFields={{speakerId: '12345' }}
      />
      <button onClick={SendReq} className='border-spacing-3 text-purple-900 border-lime-800'>Send Request to gemini</button>
      {/* 3) Render EHR once bundle is ready */}
    </div>
  );
}
