import BaseModal from 'components/BaseModal';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ModalAboutButton,
  ModalAboutContainer,
  ModalAboutContent,
  ModalAboutContentChild,
  ModalAboutFooter,
  ModalAboutGithubBox,
  ModalAboutGithubLink,
  ModalAboutImg,
  ModalAboutText,
  ModalAboutTitle,
} from './styles';
import { AiFillGithub } from 'react-icons/ai';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ModalAbout({ isOpen, onClose }: Props) {
  return (
    <BaseModal isOpen={isOpen} onRequestClose={onClose} width={700}>
      <ModalAboutContainer>
        <ModalAboutTitle>Bem vindo ao WebRecorder</ModalAboutTitle>
        <ModalAboutContent>
          <ModalAboutContentChild>
            <ModalAboutText>
              Está simples aplicação tem por objetivo te ajudar quando você precisar de simples gravaçãoes de sua tela
              ou webcam.
            </ModalAboutText>
            <ModalAboutText>
              Você podera selecinar entre diferentes fontes de vídeo e som que tiver disponiveis para criar gravações
              que posteriormente poderão ser baixadas e compartilhadas.
            </ModalAboutText>
            <ModalAboutButton onClick={onClose} colorStyle="dark" label="Começar a gravar" labelAlign="center" />
          </ModalAboutContentChild>
          <ModalAboutContentChild>
            <ModalAboutImg src="%PUBLIC_URL%/imgs/instructions.png" />
          </ModalAboutContentChild>
        </ModalAboutContent>
        <ModalAboutFooter>
          <ModalAboutGithubBox>
            Criado por{' '}
            <ModalAboutGithubLink target="_blank" href="https://www.github.com/jefersonvinicius">
              jefersonvinicius
            </ModalAboutGithubLink>
            <AiFillGithub />
          </ModalAboutGithubBox>
        </ModalAboutFooter>
      </ModalAboutContainer>
    </BaseModal>
  );
}

const MODAL_ALREADY_OPENED_KEY = 'already-opened';

export function useModalAbout() {
  const [isOpen, setIsOpen] = useState(false);

  const openModalAbout = useCallback(() => {
    localStorage.setItem(MODAL_ALREADY_OPENED_KEY, 'true');
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (localStorage.getItem(MODAL_ALREADY_OPENED_KEY) === null) {
      openModalAbout();
    }
  }, [openModalAbout]);

  const closeModalAbout = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleModalAbout = useCallback(() => {
    if (isOpen) closeModalAbout();
    else openModalAbout();
  }, [closeModalAbout, isOpen, openModalAbout]);

  return { modalAboutIsOpen: isOpen, openModalAbout, closeModalAbout, toggleModalAbout };
}
