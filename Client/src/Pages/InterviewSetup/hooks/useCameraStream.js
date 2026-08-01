import { useEffect, useRef, useState } from "react";

export function useCameraStream() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOk, setCameraOk] = useState(null);
  const [stream, setStream] = useState(null);   // 👈 naya

  useEffect(() => {
    const initMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setCameraOk(true);
        setStream(mediaStream);   // 👈 naya
      } catch (error) {
        console.error("Media access denied:", error);
        setCameraOk(false);
      }
    };
    initMedia();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return { videoRef, cameraOk, stream };   // 👈 stream bhi return
}