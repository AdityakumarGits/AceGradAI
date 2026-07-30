export default function CameraPreview({ videoRef, cameraOk, candidateName }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[rgba(255,255,255,0.10)] bg-black">
      {cameraOk === false ? (
        <div className="flex h-full min-h-[300px] items-center justify-center p-6 text-center text-sm text-[rgba(234,236,240,0.6)]">
          Camera access denied. Please allow camera and microphone permissions to continue.
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full min-h-[300px] w-full scale-x-[-1] object-cover"
        />
      )}
      {cameraOk && (
        <span className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white">
          {candidateName || "Candidate"}
        </span>
      )}
    </div>
  );
}