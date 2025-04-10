import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import { TYPOGRAPHY, ANIMATION } from '../../styles/tokens'; // Import ANIMATION directly
import { SOCIAL_ICONS } from './icons';
import { TextLinkStyles, SocialIconStyles, LinkStyles, NavItemStyles, HEADER_COLORS, HEADER_SPACING, HEADER_SIZES, mediaQuery, ButtonStyles, HeaderIconStyles } from './styles';
import { SocialLinkPropTypes } from './config'; // Импортируем PropTypes для соц. ссылки

/**
 * TextLink - общий компонент для текстовых ссылок (телефон, email и т.д.)
 */
const StyledTextLink = styled.a`
  ${TextLinkStyles}
`;

const TextLinkWrapper = styled.a`
  ${ButtonStyles} // Наследуем базовые стили кнопки/ссылки
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: ${props => props.$color || HEADER_COLORS.dark}; // Цвет по умолчанию или из пропсов
  font-family: ${TYPOGRAPHY.fontFamily};
  font-size: ${props => props.$fontSize || TYPOGRAPHY.size.sm}; // Размер шрифта по умолчанию или из пропсов
  font-weight: ${props => props.$fontWeight || TYPOGRAPHY.weight.regular};
  line-height: 1.4;
  transition: color ${ANIMATION.duration} ${ANIMATION.timing};

  /* Стили для иконки внутри ссылки */
  ${HeaderIconStyles} { // Применяем стили к обертке иконки
    width: ${props => props.$iconSize || HEADER_SIZES.iconSizeSmall}; // Размер иконки по умолчанию или из пропсов
    height: ${props => props.$iconSize || HEADER_SIZES.iconSizeSmall};
    margin-right: ${HEADER_SPACING.small}; // Отступ справа от иконки
    color: ${props => props.$iconColor || HEADER_COLORS.primary}; // Цвет иконки по умолчанию или из пропсов
  }

  ${mediaQuery.hover} {
    &:hover:not(:disabled) {
      color: ${props => props.$hoverColor || HEADER_COLORS.primary}; // Цвет при наведении
      text-decoration: ${props => props.$underlineOnHover ? 'underline' : 'none'};

      ${HeaderIconStyles} {
         color: ${props => props.$iconHoverColor || props.$hoverColor || HEADER_COLORS.primary}; // Цвет иконки при наведении
      }
    }
  }

  &:focus-visible {
    outline-color: ${props => props.$hoverColor || HEADER_COLORS.primary};
    /* Можно добавить другие стили фокуса */
  }
`;

/**
 * Универсальный компонент для текстовых ссылок с опциональной иконкой.
 * Подходит для контактов (телефон, email), ссылок в TopBar и т.д.
 */
export const TextLink = React.forwardRef((
  {
    href,
    icon: IconComponent, // Компонент иконки
    ariaLabel,
    itemProp, // Для микроразметки
    children,
    target,
    rel,
    className,
    color,
    hoverColor,
    iconColor,
    iconHoverColor,
    fontSize,
    fontWeight,
    iconSize,
    underlineOnHover = false, // Подчеркивание при наведении
    ...rest // Передаем остальные пропсы (например, onClick)
  },
  ref
) => {
  const linkContent = (
    <>
      {IconComponent && (
        <HeaderIconStyles>
          <IconComponent />
        </HeaderIconStyles>
      )}
      <span>{children}</span>
    </>
  );

  // Если href начинается с '/', используем Next.js Link для внутренних ссылок
  const isInternal = href && href.startsWith('/');

  if (isInternal) {
    return (
      <Link href={href} passHref legacyBehavior>
        <TextLinkWrapper
          ref={ref}
          aria-label={ariaLabel}
          itemProp={itemProp}
          className={className}
          $color={color}
          $hoverColor={hoverColor}
          $iconColor={iconColor}
          $iconHoverColor={iconHoverColor}
          $fontSize={fontSize}
          $fontWeight={fontWeight}
          $iconSize={iconSize}
          $underlineOnHover={underlineOnHover}
          {...rest}
        >
          {linkContent}
        </TextLinkWrapper>
      </Link>
    );
  }

  // Для внешних ссылок, tel:, mailto: используем обычный <a>
  return (
    <TextLinkWrapper
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      itemProp={itemProp}
      target={target || (href && !href.startsWith('#') ? '_blank' : undefined)} // Открывать внешние ссылки в новой вкладке
      rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)} // Безопасность для _blank
      className={className}
      $color={color}
      $hoverColor={hoverColor}
      $iconColor={iconColor}
      $iconHoverColor={iconHoverColor}
      $fontSize={fontSize}
      $fontWeight={fontWeight}
      $iconSize={iconSize}
      $underlineOnHover={underlineOnHover}
      {...rest}
    >
      {linkContent}
    </TextLinkWrapper>
  );
});

TextLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.elementType, // Компонент иконки (необязательно)
  ariaLabel: PropTypes.string, // Важно для доступности, особенно если только иконка
  itemProp: PropTypes.string, // Для Schema.org
  target: PropTypes.string,
  rel: PropTypes.string,
  className: PropTypes.string,
  // Style props
  color: PropTypes.string,
  hoverColor: PropTypes.string,
  iconColor: PropTypes.string,
  iconHoverColor: PropTypes.string,
  fontSize: PropTypes.string,
  fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  iconSize: PropTypes.string,
  underlineOnHover: PropTypes.bool,
};

TextLink.displayName = 'TextLink'; // Для удобства отладки

/**
 * SocialLink - общий компонент для ссылок на социальные сети
 */
const StyledSocialLink = styled.a`
  ${SocialIconStyles}
`;

export const SocialLink = ({ id, url, ariaLabel }) => {
  const Icon = SOCIAL_ICONS[id];
  return (
    <StyledSocialLink 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      aria-label={ariaLabel}
    >
      <Icon size={20} />
    </StyledSocialLink>
  );
};

SocialLink.propTypes = {
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
};

/**
 * SocialLinks - компонент для отображения группы социальных ссылок
 */
const SocialLinksContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const SocialLinksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${props => props.$gap || HEADER_SPACING.medium}; // Пропс для управления отступом
`;

const SocialLinkItem = styled.li`
  line-height: 0; // Предотвращаем лишние отступы
`;

const SocialLinkAnchor = styled.a`
  ${ButtonStyles} // Наследуем базовые стили
  display: inline-flex; // Важно для правильного отображения
  padding: ${HEADER_SPACING.small}; // Добавляем padding для удобства нажатия
  margin: -${HEADER_SPACING.small}; // Компенсируем padding
  color: ${props => props.$color || HEADER_COLORS.textSecondary}; // Цвет иконки по умолчанию
  border-radius: 50%; // Делаем круглым

  ${HeaderIconStyles} {
    width: ${props => props.$iconSize || HEADER_SIZES.iconSize}; // Размер иконки
    height: ${props => props.$iconSize || HEADER_SIZES.iconSize};
    color: inherit; // Наследуем цвет от ссылки
  }

  ${mediaQuery.hover} {
    &:hover:not(:disabled) {
      color: ${props => props.$hoverColor || HEADER_COLORS.primary};
      background-color: ${props => props.$hoverBackgroundColor || HEADER_COLORS.gray}; // Легкий фон при наведении
    }
  }

  &:focus-visible {
    color: ${props => props.$hoverColor || HEADER_COLORS.primary};
    background-color: ${props => props.$hoverBackgroundColor || HEADER_COLORS.gray};
    outline-color: ${props => props.$hoverColor || HEADER_COLORS.primary};
    outline-offset: 1px; // Ближе к иконке
  }
`;

/**
 * Компонент для отображения списка ссылок на социальные сети.
 */
export const SocialLinks = ({ links, className, gap, iconSize, color, hoverColor, hoverBackgroundColor }) => {
  if (!links || links.length === 0) {
    return null; // Не рендерим ничего, если ссылок нет
  }

  return (
    <SocialLinksList className={className} $gap={gap}>
      {links.map((link) => {
        const Icon = SOCIAL_ICONS[link.id];
        if (!Icon) return null; // Пропускаем, если нет иконки для этого сервиса

        return (
          <SocialLinkItem key={link.id}>
            <SocialLinkAnchor
              href={link.url}
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={link.ariaLabel || `Мы в ${link.id}`}
              $iconSize={iconSize} 
              $color={color}
              $hoverColor={hoverColor}
              $hoverBackgroundColor={hoverBackgroundColor}
            >
              <HeaderIconStyles>
                <Icon />
              </HeaderIconStyles>
            </SocialLinkAnchor>
          </SocialLinkItem>
        );
      })}
    </SocialLinksList>
  );
};

SocialLinks.propTypes = {
  links: PropTypes.arrayOf(SocialLinkPropTypes).isRequired,
  className: PropTypes.string,
  // Style props
  gap: PropTypes.string, // Отступ между иконками
  iconSize: PropTypes.string,
  color: PropTypes.string,
  hoverColor: PropTypes.string,
  hoverBackgroundColor: PropTypes.string,
};

/**
 * NavigationItem - компонент для элемента навигации
 */
const StyledNavItem = styled(NavItemStyles)``;

export const NavigationItem = ({ path, className, children, onClick }) => {
  const router = useRouter();
  const isActive = router.pathname === path;
  
  return (
    <StyledNavItem className={`${isActive ? 'active' : ''} ${className || ''}`}>
      <Link href={path} className={isActive ? 'active' : ''} onClick={onClick}>
        {children}
      </Link>
    </StyledNavItem>
  );
};

NavigationItem.propTypes = {
  path: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

/**
 * NavigationList - компонент для списка навигации
 */
const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 20px;
`;

export const NavigationList = ({ items, onClick, direction = 'row' }) => (
  <NavList style={{ flexDirection: direction }}>
    {items.map((item) => (
      <NavigationItem
        key={item.id}
        path={item.path}
        onClick={onClick}
      >
        {item.name}
      </NavigationItem>
    ))}
  </NavList>
);

NavigationList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClick: PropTypes.func,
  direction: PropTypes.oneOf(['row', 'column']),
}; 