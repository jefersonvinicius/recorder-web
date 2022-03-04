import ButtonBasic from 'components/Buttons/Basic';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useAudioInputs, useVideosInputs } from './hooks/media-devices';
import { useRequestWebcamAndMicrophonePermissions } from './hooks/permissions';
import { Container, Footer, FooterLeftSide, FooterRightSide, RecordingVideo, VideoArea } from './styles';
import { BsCameraVideo, BsChevronDown, BsDownload } from 'react-icons/bs';
import { BiMicrophone } from 'react-icons/bi';
import Theme from 'config/theme';
import RecordingButton from 'components/Buttons/RecordingButton';
import ModalSelector from 'components/ModalSelector';

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

  // useRequestWebcamAndMicrophonePermissions();
  const { audioInputs } = useAudioInputs();
  const { videosInputs } = useVideosInputs();

  // useEffect(() => {
  //   if (selectedVideoInputID === 'screen') {
  //     navigator.mediaDevices.getDisplayMedia().then(setStream).catch(console.error);
  //   } else {
  //     navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedVideoInputID } }).then(setStream);
  //   }

  //   function setStream(stream: MediaStream) {
  //     videoRef.current!.srcObject = stream;
  //   }
  // }, [selectedVideoInputID]);

  function handleAudioInputChange(event: ChangeEvent<HTMLSelectElement>) {
    const selectedDeviceId = event.target.value;
    setSelectedAudioInput(audioInputs.find((input) => input.deviceId === selectedDeviceId) ?? null);
  }

  function handleVideoInputChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedVideoInputID(event.target.value);
  }

  async function handleStartRecordingClick() {
    if (!selectedVideoInputID) {
      alert('Is required select video input');
      return;
    }

    const videoStream = videoRef.current?.srcObject as MediaStream;
    console.log(videoStream.getTracks());
    mediaRecorder.current = new MediaRecorder(videoStream);
    mediaRecorder.current.addEventListener('dataavailable', handleMediaRecorderDataAvailable);
    mediaRecorder.current.addEventListener('stop', handleMediaRecorderStop);
    mediaRecorder.current.start(1000);
    setIsRecordingRunning(true);

    function handleMediaRecorderDataAvailable(event: BlobEvent) {
      const chunk = event.data;
      recordingChunks.current.push(chunk);
      setRecordingTime((old) => old + 1);
    }

    function handleMediaRecorderStop() {
      const blob = new Blob(recordingChunks.current);
      const url = URL.createObjectURL(blob);
      console.log({ url });
      setDownloadLink(url);
      setIsRecordingRunning(false);
      setDownloadFileName(`${new Date().toISOString()}.webm`);
      videoStream.getTracks().forEach((track) => track.stop());
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
        <RecordingVideo ref={videoRef} autoPlay />
      </VideoArea>
      <Footer>
        <FooterLeftSide>
          <ButtonBasic
            LeftIcon={<BiMicrophone size={20} color={Theme.pallet.primaryDark} />}
            label={selectedAudioInput?.label ?? 'Não selecionado'}
            RightIcon={<DownArrayIcon />}
          />
          <ButtonBasic
            LeftIcon={<BsCameraVideo size={20} color={Theme.pallet.primaryDark} />}
            label={selectedVideoInputID === 'screen' ? 'Tela' : selectedVideoInputID}
            RightIcon={<DownArrayIcon />}
          />
          {downloadLink && (
            <ButtonBasic
              LeftIcon={<BsDownload size={20} color={Theme.pallet.primaryDark} />}
              label="Baixar Gravação"
              asLink
              href={downloadLink}
              filenameDownload={downloadFileName}
            />
          )}
        </FooterLeftSide>
        <FooterRightSide>
          <RecordingButton
            onClick={isRecordingRunning ? handleStopRecording : handleStartRecordingClick}
            isRecording={isRecordingRunning}
            currentSeconds={recordingTime}
          />
        </FooterRightSide>
      </Footer>
      <ModalSelector
        isOpen={true}
        selectedValue={selectedAudioInput?.deviceId ?? ''}
        items={audioInputs}
        textAttr="label"
        valueAttr="deviceId"
        onSelect={console.log}
      />
    </Container>
  );
}

export default App;
