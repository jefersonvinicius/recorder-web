import ButtonBasic from 'components/Buttons/Basic';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useAudioInputs, useVideosInputs } from './hooks/media-devices';
import { useRequestWebcamAndMicrophonePermissions } from './hooks/permissions';
import {
  Container,
  Footer,
  FooterLeftSide,
  FooterRightSide,
  InputBox,
  RecordingVideo,
  RecordPreview,
  VideoArea,
} from './styles';
import { TiArrowDown, TiMicrophoneOutline } from 'react-icons/ti';
import { BsCameraVideo, BsChevronDown } from 'react-icons/bs';
import Theme from 'config/theme';
import RecordingButton from 'components/Buttons/RecordingButton';

const DownArrayIcon = () => <BsChevronDown size={20} color={Theme.pallet.primaryDark} />;

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordingChunks = useRef<Blob[]>([]);

  const [selectedAudioInput, setSelectedAudioInput] = useState<MediaDeviceInfo | null>(null);
  const [selectedVideoInputID, setSelectedVideoInputID] = useState<string>('screen');
  const [isDisableAudio, setIsDisableAudio] = useState(false);
  const [isToRecordScreenAudio, setIsToRecordScreenAudio] = useState(true);
  const [isRecordingRunning, setIsRecordingRunning] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [downloadFileName, setDownloadFileName] = useState('file.webm');

  useRequestWebcamAndMicrophonePermissions();
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
    console.log(stream.getTracks());
    videoRef.current!.srcObject = stream;

    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.addEventListener('dataavailable', handleMediaRecorderDataAvailable);
    mediaRecorder.current.addEventListener('stop', handleMediaRecorderStop);
    mediaRecorder.current.start(1000);
    setIsRecordingRunning(true);

    async function getStream() {
      const audio = Boolean(isDisableAudio || !selectedAudioInput) ? false : { deviceId: selectedAudioInput?.deviceId };

      if (isScreenRecording) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: audio });
        const displayMediaStream = await navigator.mediaDevices.getDisplayMedia({ audio: false, video: true });
        userMediaStream.getTracks().forEach((t) => displayMediaStream.addTrack(t));
        return displayMediaStream;
      }
      return await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedVideoInputID! },
        audio: audio,
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
      setDownloadFileName(`${new Date().toISOString()}.webm`);
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
    <Container>
      <VideoArea>
        <RecordingVideo />
      </VideoArea>
      <Footer>
        <FooterLeftSide>
          <ButtonBasic
            LeftIcon={<TiMicrophoneOutline size={20} color={Theme.pallet.primaryDark} />}
            label="Audio Device Name"
            RightIcon={<DownArrayIcon />}
          />
          <ButtonBasic
            LeftIcon={<BsCameraVideo size={20} color={Theme.pallet.primaryDark} />}
            label="Video Device Name"
            RightIcon={<DownArrayIcon />}
          />
        </FooterLeftSide>
        <FooterRightSide>
          <RecordingButton
            onClick={() => setIsRecordingRunning((state) => !state)}
            isRecording={isRecordingRunning}
            currentSeconds={70}
          />
        </FooterRightSide>
      </Footer>
    </Container>
  );
}

export default App;
