import { css } from 'styled-components';
import { COLORS, mediaQueries } from './tokens';

// Responsive brand border helpers (mobile/tablet 2px → desktop 4px by default)

export const responsiveBorder = (
  side = 'all',
  color = COLORS.gray400,
  mobile = 2,
  desktop = 4,
  bp = mediaQueries.lg
) => {
  if (side === 'all') {
    return css`
      border: ${mobile}px solid ${color};
      ${bp} {
        border-width: ${desktop}px;
      }
    `;
  }

  const sideProp = `border-${side}`;
  return css`
    ${sideProp}: ${mobile}px solid ${color};
    ${bp} {
      ${sideProp}-width: ${desktop}px;
    }
  `;
};

export const responsiveBorderBlock = (
  sides = {},
  color = COLORS.gray400,
  mobile = 2,
  desktop = 4,
  bp = mediaQueries.lg
) => {
  const { top, right, bottom, left } = sides;
  return css`
    ${top ? `border-top: ${mobile}px solid ${color};` : ''}
    ${right ? `border-right: ${mobile}px solid ${color};` : ''}
    ${bottom ? `border-bottom: ${mobile}px solid ${color};` : ''}
    ${left ? `border-left: ${mobile}px solid ${color};` : ''}
    ${bp} {
      ${top ? `border-top-width: ${desktop}px;` : ''}
      ${right ? `border-right-width: ${desktop}px;` : ''}
      ${bottom ? `border-bottom-width: ${desktop}px;` : ''}
      ${left ? `border-left-width: ${desktop}px;` : ''}
    }
  `;
};

