import styled, { css } from 'styled-components';

const videoBaseStyle = css`
  width: ${1280 / 2}px;
  height: ${720 / 2}px;
`;

export const Container = styled.div`
  height: 100%;
`;

export const VideoArea = styled.div`
  height: 85%;
  padding: 10px;
`;

export const InputBox = styled.div``;

export const RecordingVideo = styled.video`
  background-color: #999;
  width: 100%;
  height: 100%;
  border-radius: 5px;
`;

export const RecordPreview = styled.video`
  ${videoBaseStyle}
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px 10px 10px 10px;
  justify-content: space-between;
`;

export const FooterLeftSide = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FooterRightSide = styled.div``;
