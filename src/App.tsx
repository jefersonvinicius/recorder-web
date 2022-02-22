import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useAudioInputs, useVideosInputs } from './hooks/media-devices';
import { InputBox, RecordingVideo, RecordPreview } from './styles';

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordingChunks = useRef<Blob[]>([]);

  const [selectedAudioInput, setSelectedAudioInput] = useState<MediaDeviceInfo | null>(null);
  const [selectedVideoInputID, setSelectedVideoInputID] = useState<string>('screen');
  const [isDisableAudio, setIsDisableAudio] = useState(false);
  const [isRecordingRunning, setIsRecordingRunning] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const { audioInputs } = useAudioInputs();
  const { videosInputs } = useVideosInputs();

  const isScreenRecording = selectedVideoInputID === 'screen';

  useEffect(() => {
    if (!selectedAudioInput && audioInputs.length > 0) {
      setSelectedAudioInput(audioInputs[0]);
    }

    if (!selectedVideoInputID && videosInputs.length > 0) {
      setSelectedVideoInputID(videosInputs[0].deviceId);
    }
  }, [audioInputs, selectedAudioInput, selectedVideoInputID, videosInputs]);

  function handleAudioInputChange(event: ChangeEvent<HTMLSelectElement>) {
    const selectedDeviceId = event.target.value;
    setSelectedAudioInput(audioInputs.find((input) => input.deviceId === selectedDeviceId) ?? null);
  }

  function handleVideoInputChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedVideoInputID(event.target.value);
  }

  function handleIsDisableAudioChange(event: ChangeEvent<HTMLInputElement>) {
    setIsDisableAudio(event.target.checked);
  }

  async function handleStartRecordingClick() {
    if (!selectedVideoInputID) {
      alert('Is required select video input');
      return;
    }

    const stream = await getStream();
    videoRef.current!.srcObject = stream;

    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.addEventListener('dataavailable', handleMediaRecorderDataAvailable);
    mediaRecorder.current.addEventListener('stop', handleMediaRecorderStop);
    mediaRecorder.current.start(1000);
    setIsRecordingRunning(true);

    async function getStream() {
      if (isScreenRecording) {
        return await navigator.mediaDevices.getDisplayMedia({ audio: !isDisableAudio, video: true });
      }
      return await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedVideoInputID! },
        audio: Boolean(isDisableAudio || !selectedAudioInput) ? false : { deviceId: selectedAudioInput?.deviceId },
      });
    }

    function handleMediaRecorderDataAvailable(event: BlobEvent) {
      const chunk = event.data;
      recordingChunks.current.push(chunk);
      setRecordingTime((old) => old + 1);
    }

    function handleMediaRecorderStop() {
      const blob = new Blob(recordingChunks.current);
      const url = URL.createObjectURL(blob);
      setDownloadLink(url);
      setIsRecordingRunning(false);
      stream.getTracks().forEach((track) => track.stop());
      setRecordingTime(0);
      recordingChunks.current = [];
      mediaRecorder.current = null;
    }
  }

  function handleStopRecording() {
    mediaRecorder.current?.stop();
  }

  return (
    <div>
      <InputBox>
        <span>Audio:</span>
        {audioInputs.length > 0 ? (
          <>
            <label htmlFor="audio-checkbox">Desativar Audio</label>
            <input type="checkbox" id="audio-checkbox" checked={isDisableAudio} onChange={handleIsDisableAudioChange} />
            <select value={selectedAudioInput?.deviceId} onChange={handleAudioInputChange} disabled={isDisableAudio}>
              {audioInputs.map((input) => (
                <option key={input.deviceId} value={input.deviceId}>
                  {input.label}
                </option>
              ))}
            </select>
          </>
        ) : (
          <span>Nenhuma entrada de audio encontrada</span>
        )}
      </InputBox>
      <InputBox>
        <span>Vídeo:</span>
        <select value={selectedVideoInputID} onChange={handleVideoInputChange}>
          {videosInputs.map((input) => (
            <option key={input.deviceId} value={input.deviceId}>
              {input.label}
            </option>
          ))}
          <option value="screen">Própria Tela</option>
        </select>
      </InputBox>
      {isRecordingRunning ? (
        <button onClick={handleStopRecording}>Parar</button>
      ) : (
        <button onClick={handleStartRecordingClick}>Gravar</button>
      )}
      {isRecordingRunning && <span>Tempo: {recordingTime}s</span>}
      {!isRecordingRunning && downloadLink && (
        <a href={downloadLink} download="file.webm">
          Download
        </a>
      )}
      <RecordingVideo ref={videoRef} autoPlay style={{ display: isRecordingRunning ? 'initial' : 'none' }} />
      {!isRecordingRunning && downloadLink && <RecordPreview src={downloadLink} controls />}
    </div>
  );
}

export default App;
