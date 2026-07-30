import { useEffect, useRef, useState } from "react";

export function useCameraStream() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOk, setCameraOk] = useState(null);

  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraOk(true);
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

  return { videoRef, cameraOk };
}