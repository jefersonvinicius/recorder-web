import Theme from 'config/theme';
import styled from 'styled-components';

export const AudioControlContainer = styled.div`
  background-color: ${Theme.pallet.primaryDark};
  border: 1px #999 solid;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 50%;

  &:hover {
    cursor: pointer;
  }
`;

export const AudioControlFrequency = styled.div`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
`;
