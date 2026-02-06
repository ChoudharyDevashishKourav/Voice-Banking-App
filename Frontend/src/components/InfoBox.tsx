// components/InfoBox.tsx
import React from 'react';

interface InfoBoxProps {
  text: string;
}

export default function InfoBox({ text }: InfoBoxProps) {
  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6">
      {/* Header with icon */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 backdrop-blur-xl border border-purple-400/30 flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-purple-300">
          Response
        </h3>
      </div>

      {/* Response text */}
      <div className="p-4 rounded-xl bg-purple-900/30 border border-purple-500/30">
        <p className="text-white/90 leading-relaxed text-base whitespace-pre-wrap">
          {text}
        </p>
      </div>
    </div>
  );
}