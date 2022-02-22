import styled, { css } from 'styled-components';

const videoBaseStyle = css`
  width: ${1280 / 2}px;
  height: ${720 / 2}px;
`;

export const InputBox = styled.div``;

export const RecordingVideo = styled.video`
  ${videoBaseStyle}
`;

export const RecordPreview = styled.video`
  ${videoBaseStyle}
`;
