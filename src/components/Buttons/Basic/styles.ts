import Theme from 'config/theme';
import styled from 'styled-components';

export const ButtonContainer = styled.button`
  background-color: ${Theme.pallet.primaryLight};
  border: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  padding: 10px;

  &:hover {
    cursor: pointer;
  }

  & > span {
    color: ${Theme.pallet.primaryDark};
  }
`;
