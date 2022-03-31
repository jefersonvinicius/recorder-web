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

export const VideoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const VideoPlaceholderText = styled.span``;

export const InputBox = styled.div``;

export const RecordingVideo = styled.video`
  width: 100%;
  height: 100%;
  border-radius: 5px;
`;

export const RecordPreview = styled.video`
  ${videoBaseStyle}
`;

export const WarnMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fdd835;
  padding: 5px 50px;
  margin: 10px 0;
  color: #555;

  & > span {
    font-size: 14px;
  }

  & > button {
    background-color: transparent;
    border: none;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-left: 20px;

    &:hover {
      cursor: pointer;
    }
  }
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

  & > *:not(:last-child) {
    margin-right: 10px;
  }
`;

export const FooterRightSide = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & > *:not(:last-child) {
    margin-right: 10px;
  }
`;
