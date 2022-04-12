import Button from 'components/Buttons/Basic';
import Theme from 'config/theme';
import styled from 'styled-components';

export const ModalAboutContainer = styled.div``;

export const ModalAboutTitle = styled.h2``;

export const ModalAboutImg = styled.img``;

export const ModalAboutContent = styled.div`
  display: flex;
  flex-direction: row;
`;

export const ModalAboutContentChild = styled.div``;

export const ModalAboutText = styled.p`
  margin-top: 10px;
  font-size: 15px;
  color: #444;
`;

export const ModalAboutButton = styled(Button)`
  margin-top: 10px;
  width: 100%;
`;

export const ModalAboutFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const ModalAboutGithubBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
`;

export const ModalAboutGithubLink = styled.a`
  margin: 0 5px;
  text-decoration: none;
  color: ${Theme.pallet.primaryDark};
`;
