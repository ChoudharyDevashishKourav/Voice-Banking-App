// App.tsx
import React, { useCallback, useState } from 'react';
import MicRecorder from '../components/MicRecorder';

export default function Speak() {
  const [transcript, setTranscript] = useState<string>('');

  const handleTranscribed = useCallback((text: string) => {
    setTranscript(text);      // triggers extractor
    console.log(text);
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* 1) Record & transcribe */}
      <MicRecorder
        uploadUrl="transcribe"          // adjust to match backend path
        onTranscribed={handleTranscribed}
        fieldName="file" 
        extraFields={{speakerId: '12345' }}
      />
      

      {/* 3) Render EHR once bundle is ready */}
    </div>
  );
}
