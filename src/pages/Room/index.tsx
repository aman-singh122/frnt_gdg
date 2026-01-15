import { useParams } from "react-router-dom";

const Room = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="w-screen h-screen bg-slate-900 flex items-center justify-center">
      
      {/* Video Wrapper */}
      <div className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
        <iframe
          src={`http://localhost:3000?roomId=${id}`}
          title="Video Consultation Room"
          allow="camera; microphone"
          allowFullScreen
          className="w-full h-full border-none"
        />
      </div>

    </div>
  );
};

export default Room;

