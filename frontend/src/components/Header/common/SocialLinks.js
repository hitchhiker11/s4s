import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { HEADER_COLORS, SPACING, SIZES, ANIMATION, mediaQuery } from '../styles';

const SocialList = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: ${SPACING.medium}; // Отступ между иконками
`;

const SocialItem = styled.li``;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${HEADER_COLORS.dark}; // Цвет иконок по умолчанию
  transition: color ${ANIMATION.duration} ${ANIMATION.timing}, transform ${ANIMATION.duration} ${ANIMATION.timing};
  width: ${SIZES.iconSize}; // Размер кликабельной области
  height: ${SIZES.iconSize};

  svg {
    width: 100%;
    height: 100%;
  }

  ${mediaQuery.hover} {
    &:hover {
      color: ${HEADER_COLORS.primary}; // Цвет при ховере
      transform: scale(1.1); // Небольшое увеличение
    }
  }

  &:focus {
    outline: 2px solid ${HEADER_COLORS.primary};
    outline-offset: 2px;
    border-radius: 50%; // Круглый фокус для иконок
  }
`;

const SocialLinks = ({ links, className }) => {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <SocialList className={className}>
      {links.map(({ id, url, IconComponent, ariaLabel }) => (
        <SocialItem key={id}>
          <SocialLink
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            title={ariaLabel} // Добавляем title для подсказки
          >
            <IconComponent />
          </SocialLink>
        </SocialItem>
      ))}
    </SocialList>
  );
};

SocialLinks.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    IconComponent: PropTypes.elementType.isRequired,
    ariaLabel: PropTypes.string.isRequired,
  })).isRequired,
  className: PropTypes.string,
};

export default SocialLinks; 