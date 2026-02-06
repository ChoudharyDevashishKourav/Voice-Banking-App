// App.tsx
import React, { useCallback, useEffect, useState } from 'react';
import MicRecorder from '../components/MicRecorder';
import { GoogleGenAI } from "@google/genai";
import InfoBox from '../components/InfoBox';

export default function Speak() {
  const [transcript, setTranscript] = useState<string>('');
  const [intent, setIntent] = useState<string>('');
  const [out, setOut] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{query: string, response: string}>>([]);

  const handleTranscribed = useCallback((text: string) => {
    setTranscript(text);
    setIsProcessing(true);
    console.log(text);
    SendReq(text);
  }, []);

  const validJson = (s: string) => {
    const start = s.indexOf('{');
    const end = s.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      const jsonString = s.slice(start, end + 1);
      try {
        const data = JSON.parse(jsonString);
        return data;
      } catch (error) {
        console.error("The extracted string isn't valid JSON:", error);
      }
    } else {
      console.error("No curly braces found in the string.");
    }
  }

  const SendReq = async(transcriptText: string) => {
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
Date should be in format : YYYY-MM-DD (if user doesn't mention year, assume 2025)
Date should be between may-2025 and jan-2026
User query:
"${transcriptText}"
Return in strictly JSON format like this:
{
  "intent": "MONTHLY_SUMMARY",
  "startDate": "2026-01-01",
  "endDate": "2026-01-31",
  "limit": null
}`

    try {
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      const ai = new GoogleGenAI({apiKey: key});
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: pl,
      });
      const tmp = JSON.stringify(validJson(response.text));
      setIntent(tmp);
      console.log(tmp);
      fetchsql(tmp, transcriptText);
    } catch (error) {
      console.error("Error in SendReq:", error);
      setIsProcessing(false);
    }
  }

  const fetchsql = (intentData: string, transcriptText: string) => {
    fetch("http://localhost:8080/test/query", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: intentData,
    })
      .then(response => response.json())
      .then(data => answer(JSON.stringify(data), transcriptText))
      .catch(error => {
        console.error("Error fetching sql query from backend:", error);
        setIsProcessing(false);
      });
  }

  const answer = async(temp: string, transcriptText: string) => {
    const pl = `You are a voice banking assistant.
Your job is to answer the user's question using the SQL result provided.
Rules:
- Do not mention SQL, database, or technical details.
- If the result is empty, say you could not find any transactions.
- Write Output in natural language, that could be Read by a speaker, remove all the json, or csv formatting
- Return plain text in natural language
User question:
${transcriptText}
SQL result:
${temp}
`
    try {
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      const ai = new GoogleGenAI({apiKey: key});
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: pl,
      });
      console.log(temp);
      console.log("and finally answer: ");
      const finalAnswer = response.text;
      setOut(finalAnswer);
      console.log(finalAnswer);
      
      // Add to conversation history
      setConversationHistory(prev => [...prev, {query: transcriptText, response: finalAnswer}]);
      setIsProcessing(false);
    } catch (error) {
      console.error("Error in answer:", error);
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Animated background gradient overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-700/20 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Voice Banking Assistant
            </h1>
          </div>
          <p className="text-purple-300/80 text-lg">Ask me anything about your transactions and spending</p>
        </div>

        {/* Main Card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 mb-6">
          {/* Microphone Section */}
          <div className="mb-8">
            <div className="flex flex-col items-center gap-4">
              <MicRecorder
                uploadUrl="transcribe"
                onTranscribed={handleTranscribed}
                fieldName="file"
                extraFields={{speakerId: '12345'}}
              />
              
              {isProcessing && (
                <div className="flex items-center gap-3 text-purple-300">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                  <span className="text-sm font-medium">Processing your request...</span>
                </div>
              )}
              
              {transcript && (
                <div className="w-full mt-4 p-4 rounded-xl bg-purple-900/30 border border-purple-500/30">
                  <p className="text-xs text-purple-400 font-semibold mb-1">You asked:</p>
                  <p className="text-white/90 italic">"{transcript}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Response Section */}
          {out && (
            <div className="animate-fade-in">
              <InfoBox text={out} />
            </div>
          )}

          {/* Quick suggestions */}
          {!transcript && !out && (
            <div className="mt-6">
              <p className="text-purple-300/60 text-sm mb-3 text-center">Try asking:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "What were my top expenses last month?",
                  "Show my spending by merchant",
                  "What's my current balance?",
                  "Monthly summary for January"
                ].map((suggestion, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-purple-900/20 border border-purple-500/20 hover:bg-purple-900/30 transition-all cursor-pointer group">
                    <p className="text-purple-200/80 text-sm group-hover:text-purple-200">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl shadow-xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-purple-300 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Queries
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {conversationHistory.slice().reverse().map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-purple-900/20 border border-purple-500/20 hover:bg-purple-900/30 transition-all">
                  <p className="text-purple-300 text-sm mb-2 font-medium">Q: {item.query}</p>
                  <p className="text-white/80 text-sm">A: {item.response}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}