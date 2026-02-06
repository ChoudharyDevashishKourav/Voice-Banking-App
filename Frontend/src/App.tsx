import MicRecorder from "./components/MicRecorder"
import Speak from "./pages/Speak.tsx"

const MinimalTextBar = ({ text }) => {
  return (
    <div className="flex items-center justify-center bg-purple-800 p-3 shadow-md">
      <p className="text-white text-sm font-medium">
        {text}
      </p>
    </div>
  );
};

function App() {
  return (
    <div>
      <Speak/>
        
    </div>
  )
}
export default App