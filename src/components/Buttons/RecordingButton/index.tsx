import React from 'react';
import { useMemo } from 'react';
import { Circle, RecordingButtonContainer } from './styles';
import Lottie from 'react-lottie';
import * as pulseAnimation from 'lottie/pulse-animation.json';

type Props = React.HTMLAttributes<HTMLButtonElement> & {
  isRecording: boolean;
  currentSeconds: number;
};

export default function RecordingButton({ isRecording, currentSeconds, ...props }: Props) {
  const time = useMemo(() => {
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [currentSeconds]);

  return (
    <RecordingButtonContainer {...props}>
      {isRecording ? (
        <div className="recording-box">
          <span>GRAVANDO</span>
          <span className="time">{time}</span>
        </div>
      ) : (
        <span>GRAVAR</span>
      )}
      {isRecording ? (
        <Lottie options={{ animationData: pulseAnimation, autoplay: true, loop: true }} width={35} height={35} />
      ) : (
        <Circle />
      )}
    </RecordingButtonContainer>
  );
}
