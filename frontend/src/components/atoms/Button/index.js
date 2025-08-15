import React from 'react';
import styled, { css } from 'styled-components';
import { COLORS, SPACING, SIZES, ANIMATION, mediaQueries } from '../../../styles/tokens';

const variants = {
  primary: css`
    background-color: ${COLORS.primary};
    color: ${COLORS.white};
    border: none;
    
    &:hover {
      background-color: ${COLORS.primaryHover};
    }
    
    &:disabled {
      background-color: ${COLORS.gray300};
      cursor: not-allowed;
    }
  `,
  secondary: css`
    background-color: transparent;
    color: ${COLORS.black};
    border: 2px solid ${COLORS.gray400};
    ${mediaQueries.lg} { border-width: 4px; }
    
    &:hover {
      background-color: ${COLORS.gray100};
    }
    
    &:disabled {
      color: ${COLORS.gray400};
      border-color: ${COLORS.gray200};
      cursor: not-allowed;
    }
  `,
  text: css`
    background-color: transparent;
    color: ${COLORS.primary};
    border: none;
    padding-left: 0;
    padding-right: 0;
    
    &:hover {
      color: ${COLORS.primaryHover};
      text-decoration: underline;
    }
    
    &:disabled {
      color: ${COLORS.gray400};
      cursor: not-allowed;
    }
  `,
};

const sizes = {
  sm: css`
    padding: ${SPACING.xs} ${SPACING.sm};
    font-size: 14px;
  `,
  md: css`
    padding: ${SPACING.sm} ${SPACING.md};
    font-size: 16px;
  `,
  lg: css`
    padding: ${SPACING.md} ${SPACING.lg};
    font-size: 18px;
  `,
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border-radius: ${SIZES.borderRadius.sm};
  transition: all ${ANIMATION.duration} ${ANIMATION.timing};
  gap: ${SPACING.sm};
  
  ${props => variants[props.$variant || 'primary']};
  ${props => sizes[props.$size || 'md']};
  
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  ...rest
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled}
      type={type}
      onClick={onClick}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 