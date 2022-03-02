import React, { ReactNode, useMemo } from 'react';
import { AsLink, ButtonContainer } from './styles';

type Props = {
  label: string;
  onClick?: () => void;
  LeftIcon?: ReactNode;
  RightIcon?: ReactNode;
  asLink?: boolean;
  href?: string;
  filenameDownload?: string;
};

export default function Button({ label, LeftIcon, RightIcon, onClick, asLink, href, filenameDownload }: Props) {
  const content = useMemo(() => {
    const onClickFn = asLink ? onClick : () => {};

    return (
      <ButtonContainer onClick={onClickFn}>
        {LeftIcon && <div>{LeftIcon}</div>}
        <span>{label}</span>
        {RightIcon && <div>{RightIcon}</div>}
      </ButtonContainer>
    );
  }, [LeftIcon, RightIcon, asLink, label, onClick]);

  if (asLink) {
    return (
      <AsLink href={href} download={filenameDownload}>
        {content}
      </AsLink>
    );
  }

  return content;
}
