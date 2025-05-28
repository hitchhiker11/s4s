export { default as SearchIcon } from './SearchIcon';
export { default as CartIcon } from './CartIcon';
export { default as MenuBurgerIcon } from './MenuBurgerIcon';
export { default as CloseIcon } from './CloseIcon';
export { default as PhoneIcon } from './PhoneIcon';
export { default as EmailIcon } from './EmailIcon';
export { default as LocationIcon } from './LocationIcon';
export { default as UserIcon } from './UserIcon';
export { default as VkIcon } from './VkIcon';
export { default as TelegramIcon } from './TelegramIcon';
export { default as InstagramIcon } from './InstagramIcon';
// Добавьте сюда экспорт иконок соцсетей, если они тоже SVG 

// Объект с иконками социальных сетей для использования в SocialLinks
import VkIcon from './VkIcon';
import TelegramIcon from './TelegramIcon';
import InstagramIcon from './InstagramIcon';

export const SOCIAL_ICONS = {
  vk: VkIcon,
  telegram: TelegramIcon,
  instagram: InstagramIcon
}; 