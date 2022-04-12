import React, { HTMLAttributes, ReactNode, useMemo } from 'react';
import { AsLink, ButtonContainer } from './styles';

export type ColorStyle = 'light' | 'dark';

type Props = HTMLAttributes<HTMLButtonElement> & {
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
  labelAlign?: 'right' | 'center' | 'left';
  colorStyle?: ColorStyle;
  children?: ReactNode;
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
  labelAlign = 'left',
  colorStyle = 'light',
  ...props
}: Props) {
  console.log(props.style);
  const style = useMemo(() => ({ maxWidth, width, ...props.style }), [maxWidth, width, props.style]);

  const content = useMemo(() => {
    const onClickFn = asLink ? () => {} : onClick;
    return (
      <ButtonContainer
        onClick={onClickFn}
        disabled={disabled}
        colorStyle={colorStyle}
        asLink={asLink}
        hasLeftIcon={!!LeftIcon}
        {...props}
        style={style}
      >
        <>
          {LeftIcon && <div>{LeftIcon}</div>}
          <span style={{ textAlign: labelAlign }}>{label}</span>
          {RightIcon && <div>{RightIcon}</div>}
        </>
      </ButtonContainer>
    );
  }, [LeftIcon, RightIcon, asLink, colorStyle, disabled, label, labelAlign, onClick, props, style]);

  if (asLink) {
    return (
      <AsLink href={href} download={filenameDownload} style={style}>
        {content}
      </AsLink>
    );
  }

  return content;
}
