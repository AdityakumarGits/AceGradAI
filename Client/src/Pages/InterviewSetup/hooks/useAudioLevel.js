import { useEffect, useRef, useState } from "react";

export function useAudioLevel(stream) {
  const [volume, setVolume] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!stream) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const measure = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      setVolume(Math.min(100, Math.round((average / 128) * 100)));
      animationRef.current = requestAnimationFrame(measure);
    };
    measure();

    return () => {
      cancelAnimationFrame(animationRef.current);
      source.disconnect();
      audioContext.close();
    };
  }, [stream]);

  return volume;
}