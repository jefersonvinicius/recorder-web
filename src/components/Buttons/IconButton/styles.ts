import styled from 'styled-components';
import Button from '../Basic';

export const IconButtonContainer = styled(Button)`
  border: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    cursor: pointer;
  }
`;
