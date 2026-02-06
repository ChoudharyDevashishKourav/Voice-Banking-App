import { Disc, Mic } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  uploadUrl: string;
  fieldName?: string;
  extraFields?: Record<string, string>;
  onTranscribed?: (text: string) => void; // NEW
};

const MicRecorder: React.FC<Props> = ({ uploadUrl, fieldName = 'file', extraFields = {}, onTranscribed }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setisTranscribing] = useState(false);
  const [TTS, setTTS] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [supportedMime, setSupportedMime] = useState<string>('audio/webm;codecs=opus');
  const token = localStorage.getItem('JWTS_TOKEN')

  useEffect(() => {
    // Pick a widely-supported audio MIME type
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4', // some browsers support this in 2024+, but not all
      'audio/ogg;codecs=opus'
    ];
    const picked = candidates.find((c) =>
      typeof MediaRecorder !== 'undefined' && (MediaRecorder as any).isTypeSupported
        ? MediaRecorder.isTypeSupported(c)
        : c === 'audio/webm;codecs=opus'
    ) || 'audio/webm;codecs=opus';
    setSupportedMime(picked);
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const options: MediaRecorderOptions = {};
      if (supportedMime) options.mimeType = supportedMime;

      const mr = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mr;

      chunksRef.current = [];

      mr.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mr.onstop = async () => {
        try {
          const blob = new Blob(chunksRef.current, { type: supportedMime });
          chunksRef.current = [];
          await uploadBlob(blob);
        } catch (e: any) {
          setError(e?.message || 'Upload failed');
        } finally {
          // Fully stop the tracks to clear the browser’s recording indicator
          mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
          mediaStreamRef.current = null;
        }
      };

      mr.start();
      setIsRecording(true);
    } catch (e: any) {
      setError(e?.message || 'Microphone access failed');
    }
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== 'inactive') {
      mr.stop();
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const uploadBlob = async (blob: Blob) => {
    const ext = supportedMime.includes('mp4') ? 'm4a' : supportedMime.includes('ogg') ? 'ogg' : 'webm';
    const file = new File([blob], `recording.${ext}`, { type: blob.type || supportedMime || 'application/octet-stream' });

    const form = new FormData();
    form.append(fieldName, file);
    Object.entries(extraFields || {}).forEach(([k, v]) => form.append(k, v));
    setisTranscribing(true);
    const res = await fetch(`http://localhost:8080/api/audio/${uploadUrl}`, {
      method: 'POST',
      body: form,
     //headers: { 'Authorization': `Bearer ${localStorage.getItem('JWTS_TOKEN') || ''}` }
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Upload error ${res.status}: ${text || res.statusText}`);
    }

    // EXPECTATION: backend returns JSON like { transcript: "..." }
    const data = await res.json().catch(() => null);
    const text = data?.transcript || '';
    setTTS(text);
    if (text && onTranscribed) onTranscribed(text);
    setisTranscribing(false);

  };

  return (
    <div className=''>   
    <div className="flex flex-col items-center gap-3 m-5">
      <button
        type="button"
        onClick={toggleRecording}
        className={`inline-flex items-center justify-center rounded-full h-14 w-14 transition
          ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-800 hover:bg-slate-700'}
          text-white shadow`}
        aria-pressed={isRecording}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {/* Mic icon (Tailwind-styled SVG) */}
        {!isRecording ? (
          <Mic/>
        ) : (
          // Stop-circle icon
          <Disc />
        )}
      </button>

      <div className="text-sm text-gray-300">
        {isRecording ? 'Recording...' : 'Tap to record'}
      </div>
      <div className="text-sm text-gray-300">
        {isTranscribing ? 'Transcribing...' : ''}
      </div>
        
        
        


      {!!error && <div className="text-sm text-red-600">{error}</div>}
    </div>
    </div>
  );
};

export default MicRecorder;
