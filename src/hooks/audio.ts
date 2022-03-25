import { useEffect, useRef, useState } from 'react';

export function useAudioFrequency(stream: MediaStream | null | undefined) {
  const interval = useRef<number | null>(null);

  const [volumeAverage, setVolumeAverage] = useState(0);

  useEffect(() => {
    if (!stream) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const volumes = new Uint8Array(analyser.frequencyBinCount);
    const callback = () => {
      analyser.getByteFrequencyData(volumes);
      const total = volumes.reduce((prev, current) => prev + current, 0);
      setVolumeAverage(total / volumes.length);
    };

    interval.current = window.setInterval(callback, 60 / 1000);

    return () => {
      if (interval.current) window.clearInterval(interval.current);
    };
  }, [stream]);

  return volumeAverage;
}
