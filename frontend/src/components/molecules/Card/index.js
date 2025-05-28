import React from 'react';
import styled, { css } from 'styled-components';
import { COLORS, SPACING, SIZES, SHADOWS as TokenShadows } from '../../../styles/tokens';
import { SHADOWS } from '../../../components/Header/styles';

const variantStyles = {
  default: css`
    background-color: ${COLORS.white};
    border: 1px solid ${COLORS.gray200};
  `,
  primary: css`
    background-color: ${COLORS.primary};
    color: ${COLORS.white};
  `,
  secondary: css`
    background-color: ${COLORS.secondary};
    color: ${COLORS.white};
  `,
  outlined: css`
    background-color: transparent;
    border: 1px solid ${COLORS.primary};
  `,
};

const elevationStyles = {
  flat: css`
    box-shadow: none;
  `,
  sm: css`
    box-shadow: ${SHADOWS.sm};
  `,
  md: css`
    box-shadow: ${SHADOWS.md};
  `,
  lg: css`
    box-shadow: ${SHADOWS.lg};
  `,
};

const CardContainer = styled.div`
  border-radius: ${SIZES.borderRadius.md};
  overflow: hidden;
  width: ${props => props.$fullWidth ? '100%' : props.$width || 'auto'};
  height: ${props => props.$height || 'auto'};
  ${props => variantStyles[props.$variant || 'default']};
  ${props => elevationStyles[props.$elevation || 'sm']};
  
  ${props => props.$hover && css`
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${SHADOWS.lg};
    }
  `}
  
  ${props => props.$clickable && css`
    cursor: pointer;
  `}
`;

const CardHeader = styled.div`
  padding: ${SPACING.md};
  border-bottom: ${props => props.$divider ? `1px solid ${COLORS.gray200}` : 'none'};
`;

const CardMedia = styled.div`
  width: 100%;
  height: ${props => props.$height || '200px'};
  background-image: url(${props => props.$image});
  background-size: cover;
  background-position: center;
`;

const CardContent = styled.div`
  padding: ${SPACING.md};
`;

const CardFooter = styled.div`
  padding: ${SPACING.md};
  border-top: ${props => props.$divider ? `1px solid ${COLORS.gray200}` : 'none'};
  display: flex;
  justify-content: ${props => props.$align || 'flex-start'};
  gap: ${SPACING.sm};
`;

const Card = ({
  children,
  variant = 'default',
  elevation = 'sm',
  width,
  height,
  fullWidth = false,
  hover = false,
  clickable = false,
  onClick,
  className,
  ...rest
}) => {
  return (
    <CardContainer
      $variant={variant}
      $elevation={elevation}
      $width={width}
      $height={height}
      $fullWidth={fullWidth}
      $hover={hover}
      $clickable={clickable}
      onClick={clickable ? onClick : undefined}
      className={className}
      {...rest}
    >
      {children}
    </CardContainer>
  );
};

// Compose Header, Media, Content, and Footer components
Card.Header = ({ children, divider = true, ...rest }) => (
  <CardHeader $divider={divider} {...rest}>
    {children}
  </CardHeader>
);

Card.Media = ({ image, height, ...rest }) => (
  <CardMedia $image={image} $height={height} {...rest} />
);

Card.Content = ({ children, ...rest }) => (
  <CardContent {...rest}>
    {children}
  </CardContent>
);

Card.Footer = ({ children, divider = true, align = 'flex-start', ...rest }) => (
  <CardFooter $divider={divider} $align={align} {...rest}>
    {children}
  </CardFooter>
);

export default Card; 