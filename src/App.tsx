import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useAudioInputs, useVideosInputs } from './hooks/media-devices';

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const [selectedAudioInput, setSelectedAudioInput] = useState<MediaDeviceInfo | null>(null);
  const [selectedVideoInput, setSelectedVideoInput] = useState<MediaDeviceInfo | null>(null);
  const [isDisableAudio, setIsDisableAudio] = useState(false);
  const [isScreenRecording, setIsScreenRecording] = useState(false);

  const { audioInputs } = useAudioInputs();
  const { videosInputs } = useVideosInputs();

  useEffect(() => {
    if (!selectedAudioInput && audioInputs.length > 0) {
      setSelectedAudioInput(audioInputs[0]);
    }

    if (!selectedVideoInput && videosInputs.length > 0) {
      setSelectedVideoInput(videosInputs[0]);
    }
  }, [audioInputs, selectedAudioInput, selectedVideoInput, videosInputs]);

  function handleAudioInputChange(event: ChangeEvent<HTMLSelectElement>) {
    const selectedDeviceId = event.target.value;
    setSelectedAudioInput(audioInputs.find((input) => input.deviceId === selectedDeviceId) ?? null);
  }

  function handleVideoInputChange(event: ChangeEvent<HTMLSelectElement>) {
    const selectedDeviceId = event.target.value;
    setSelectedVideoInput(videosInputs.find((input) => input.deviceId === selectedDeviceId) ?? null);
  }

  function handleIsDisableAudioChange(event: ChangeEvent<HTMLInputElement>) {
    setIsDisableAudio(event.target.checked);
  }

  function handleIsScreenRecordingChange(event: ChangeEvent<HTMLInputElement>) {
    setIsScreenRecording(event.target.checked);
  }

  async function handleStartRecordingClick() {
    const stream = await getStream();
    videoRef.current!.srcObject = stream;

    async function getStream() {
      if (isScreenRecording) {
        return await navigator.mediaDevices.getDisplayMedia({ audio: !isDisableAudio, video: true });
      }
      return await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedVideoInput?.deviceId },
        audio: isDisableAudio ? false : { deviceId: selectedAudioInput?.deviceId },
      });
    }
  }

  return (
    <div>
      <label htmlFor="audio-checkbox">Desativar Audio</label>
      <input type="checkbox" id="audio-checkbox" checked={isDisableAudio} onChange={handleIsDisableAudioChange} />
      <select value={selectedAudioInput?.deviceId} onChange={handleAudioInputChange} disabled={isDisableAudio}>
        {audioInputs.map((input) => (
          <option key={input.deviceId} value={input.deviceId}>
            {input.label}
          </option>
        ))}
      </select>

      <label htmlFor="record-screen-checkbox">Gravar Própria Tela</label>
      <input
        type="checkbox"
        id="record-screen-checkbox"
        checked={isScreenRecording}
        onChange={handleIsScreenRecordingChange}
      />
      <select value={selectedVideoInput?.deviceId} onChange={handleVideoInputChange} disabled={isScreenRecording}>
        {videosInputs.map((input) => (
          <option key={input.deviceId} value={input.deviceId}>
            {input.label}
          </option>
        ))}
      </select>
      <button onClick={handleStartRecordingClick}>Gravar</button>
      <video ref={videoRef} autoPlay />
    </div>
  );
}

export default App;
