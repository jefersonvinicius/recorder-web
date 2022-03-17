import React, { HTMLProps, ReactNode, useMemo } from 'react';
import { AsLink, ButtonContainer } from './styles';

type Props = HTMLProps<HTMLButtonElement> & {
  label: string;
  onClick?: () => void;
  LeftIcon?: ReactNode;
  RightIcon?: ReactNode;
  asLink?: boolean;
  href?: string;
  filenameDownload?: string;
  disabled?: boolean;
  width?: string | number;
  maxWidth?: string | number;
};

export default function Button({
  label,
  LeftIcon,
  RightIcon,
  onClick,
  asLink = false,
  href,
  filenameDownload,
  disabled,
  maxWidth,
  width,
}: Props) {
  const style = useMemo(() => ({ maxWidth, width }), [maxWidth, width]);

  const content = useMemo(() => {
    const onClickFn = asLink ? () => {} : onClick;
    return (
      <ButtonContainer onClick={onClickFn} disabled={disabled} asLink={asLink} style={style} hasLeftIcon={!!LeftIcon}>
        {LeftIcon && <div>{LeftIcon}</div>}
        <span>{label}</span>
        {RightIcon && <div>{RightIcon}</div>}
      </ButtonContainer>
    );
  }, [LeftIcon, RightIcon, asLink, disabled, label, onClick, style]);

  if (asLink) {
    return (
      <AsLink href={href} download={filenameDownload} style={style}>
        {content}
      </AsLink>
    );
  }

  return content;
}
