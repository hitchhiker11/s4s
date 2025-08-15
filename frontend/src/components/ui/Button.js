import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING, ANIMATION, mediaQueries } from '../../styles/tokens';

// Базовые стили для всех кнопок
const baseButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.$size === 'small' ? '8px 16px' : '12px 24px'};
  font-family: ${TYPOGRAPHY.fontFamily};
  font-size: ${props => props.$size === 'small' ? TYPOGRAPHY.size.sm : TYPOGRAPHY.size.md};
  font-weight: ${TYPOGRAPHY.weight.medium};
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all ${ANIMATION.duration} ${ANIMATION.timing};
  text-decoration: none;
  
  /* Отступ для иконки */
  svg {
    margin-right: ${props => props.$iconOnly ? '0' : SPACING.sm};
  }
  
  /* Если только иконка, меняем размеры и padding */
  ${props => props.$iconOnly && css`
    padding: ${props.$size === 'small' ? '8px' : '12px'};
    width: ${props.$size === 'small' ? '32px' : '44px'};
    height: ${props.$size === 'small' ? '32px' : '44px'};
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus-visible {
    outline: 2px solid ${COLORS.primary};
    outline-offset: 2px;
  }
`;

// Варианты кнопок
const buttonVariants = {
  primary: css`
    background-color: ${COLORS.primary};
    color: white;
    box-shadow: ${SHADOWS.sm};
    
    &:hover:not(:disabled) {
      background-color: ${COLORS.primaryHover};
      box-shadow: ${SHADOWS.md};
    }
    
    &:active:not(:disabled) {
      transform: translateY(1px);
      box-shadow: none;
    }
  `,
  
  secondary: css`
    background-color: white;
    color: ${COLORS.primary};
    border: 2px solid ${COLORS.primary};
    ${mediaQueries.lg} { border-width: 4px; }
    
    &:hover:not(:disabled) {
      background-color: ${COLORS.gray100};
    }
    
    &:active:not(:disabled) {
      background-color: ${COLORS.gray200};
    }
  `,
  
  text: css`
    background-color: transparent;
    color: ${COLORS.primary};
    padding: ${props => props.$size === 'small' ? '4px 8px' : '8px 16px'};
    
    &:hover:not(:disabled) {
      background-color: ${COLORS.gray100};
    }
    
    &:active:not(:disabled) {
      background-color: ${COLORS.gray200};
    }
  `,
  
  // Можно добавить другие варианты: success, danger, etc.
};

const StyledButton = styled.button`
  ${baseButtonStyles}
  ${props => buttonVariants[props.$variant || 'primary']}
  
  /* Additional custom styles if needed */
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
`;

/**
 * Универсальный компонент кнопки
 */
const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  iconOnly = false,
  fullWidth = false,
  icon,
  as = 'button',
  ...props
}, ref) => {
  const Icon = icon;
  
  return (
    <StyledButton
      as={as}
      $variant={variant}
      $size={size}
      $iconOnly={iconOnly}
      $fullWidth={fullWidth}
      ref={ref}
      {...props}
    >
      {Icon && <Icon size={size === 'small' ? 16 : 20} />}
      {(!iconOnly || !Icon) && children}
    </StyledButton>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'text']),
  size: PropTypes.oneOf(['small', 'medium']),
  iconOnly: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.elementType,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
};

export default Button; 