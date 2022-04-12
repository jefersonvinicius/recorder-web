import Theme from 'config/theme';
import styled from 'styled-components';
import { ColorStyle } from '.';

export const AsLink = styled.a`
  display: block;
  text-decoration: none;
`;

type ButtonContainerProps = {
  asLink?: boolean;
  hasLeftIcon?: boolean;
  colorStyle?: ColorStyle;
};

export const ButtonContainer = styled.button<ButtonContainerProps>`
  background-color: ${(props) => (props.colorStyle === 'dark' ? Theme.pallet.primaryDark : Theme.pallet.primaryLight)};
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
    color: ${(props) => (props.colorStyle === 'dark' ? '#fff' : Theme.pallet.primaryDark)};
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
