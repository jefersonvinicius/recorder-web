import Theme from 'config/theme';
import styled from 'styled-components';
import { ButtonContainer } from '../Basic/styles';

export const RecordingButtonContainer = styled(ButtonContainer)`
  padding: 0;
  background-color: transparent;
  height: 60px;

  &.recording-box {
    display: flex;
    flex-direction: column;
  }

  & span {
    display: block;
    color: ${Theme.pallet.primaryDark};
    font-weight: bold;
    font-size: 16px;
    text-align: right;

    &.time {
      font-size: 12px;
    }
  }
`;

export const Circle = styled.div`
  width: 20px;
  height: 20px;
  background-color: red;
  border-radius: 50%;
  margin-left: 10px;
`;
