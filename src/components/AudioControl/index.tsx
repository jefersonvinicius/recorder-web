import { useAudioFrequency } from 'hooks/audio';
import React, { useMemo } from 'react';
import { interpolate } from 'utils/math';
import { AudioControlContainer, AudioControlFrequency } from './styles';
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';

type Props = {
  stream: MediaStream;
  isPaused: boolean;
  onClick: () => void;
};

export type AudioFrequencyRef = {
  setStream: (stream: MediaStream) => void;
};

const MAX_SIZE = 40;
const MIN_SIZE = 10;

function AudioControl({ stream, isPaused, onClick }: Props) {
  const frequency = useAudioFrequency(stream);

  const size = useMemo(() => {
    return interpolate(frequency, {
      input: [10, 100],
      output: [MIN_SIZE, MAX_SIZE],
    });
  }, [frequency]);

  if (!stream) return null;

  const iconProps = { color: '#fff', size: 18 };

  return (
    <AudioControlContainer
      style={{ width: MAX_SIZE, height: MAX_SIZE, borderColor: iconProps.color }}
      onClick={onClick}
    >
      {!isPaused && <AudioControlFrequency style={{ width: size, height: size }} />}
      {isPaused ? <BiMicrophoneOff {...iconProps} /> : <BiMicrophone {...iconProps} />}
    </AudioControlContainer>
  );
}

export default React.forwardRef<AudioFrequencyRef, Props>(AudioControl);
