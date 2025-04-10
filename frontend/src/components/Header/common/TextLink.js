import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import { HEADER_COLORS, SPACING, TYPOGRAPHY, ANIMATION, mediaQuery, SIZES } from '../styles';

const LinkWrapper = styled.a`
  display: inline-flex;
  align-items: center;
  color: ${HEADER_COLORS.dark};
  text-decoration: none;
  font-family: ${TYPOGRAPHY.fontFamily};
  font-size: ${TYPOGRAPHY.baseSize}; // Или другой размер по умолчанию
  font-weight: 400; // Или другой вес по умолчанию
  transition: color ${ANIMATION.duration} ${ANIMATION.timing};

  svg {
    width: ${SIZES.iconSizeSmall}; // Меньший размер для иконок в ссылках
    height: ${SIZES.iconSizeSmall};
    margin-right: ${SPACING.small};
    color: ${HEADER_COLORS.primary}; // Цвет иконки
    flex-shrink: 0;
  }

  ${mediaQuery.hover} {
    &:hover {
      color: ${HEADER_COLORS.primary};
      text-decoration: none; // Убираем подчеркивание при ховере, если не нужно

      svg {
        // Можно добавить эффект для иконки при ховере
      }
    }
  }

  &:focus {
    outline: 2px solid ${HEADER_COLORS.primary};
    outline-offset: 2px;
    border-radius: 2px; // Скруглить рамку фокуса
  }
`;

const TextLink = ({ href, icon: IconComponent, children, ariaLabel, className, itemProp }) => {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
  const linkProps = {
    href,
    'aria-label': ariaLabel || undefined,
    className,
    itemProp: itemProp || undefined,
    ...(isExternal && { target: '_blank', rel: 'noopener noreferrer' }), // Для внешних ссылок
  };

  const content = (
    <>
      {IconComponent && <IconComponent />}
      <span>{children}</span>
    </>
  );

  if (isExternal) {
    return (
      <LinkWrapper {...linkProps}>
        {content}
      </LinkWrapper>
    );
  }

  // Для внутренних ссылок используем Link из Next.js
  return (
    <Link href={href} passHref legacyBehavior>
      <LinkWrapper {...linkProps}>
        {content}
      </LinkWrapper>
    </Link>
  );
};

TextLink.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.elementType, // Компонент иконки
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  itemProp: PropTypes.string, // Для микроразметки
};

export default TextLink; 