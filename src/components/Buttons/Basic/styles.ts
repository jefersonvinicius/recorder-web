import Theme from 'config/theme';
import styled from 'styled-components';

export const AsLink = styled.a`
  display: block;
  text-decoration: none;
`;
export const ButtonContainer = styled.button<{ asLink?: boolean; hasLeftIcon?: boolean }>`
  background-color: ${Theme.pallet.primaryLight};
  border: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  padding: 10px;
  height: ${(props) => (props.asLink ? '100%' : 'auto')};
  height: 60px;

  &:hover {
    cursor: pointer;
  }

  & > span {
    color: ${Theme.pallet.primaryDark};
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    text-align: left;
    width: 100%;
    margin-left: ${(props) => (props.hasLeftIcon ? 5 : 0)}px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
