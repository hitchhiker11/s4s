import React from 'react';
import styled from 'styled-components';
import { useQueryClient } from 'react-query';
import { basketApi } from '../lib/api';

// Стилизованные компоненты
const Card = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: #fff;
  height: 100%;
  
  &:hover {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
    transform: translateY(-3px);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  padding-top: 100%; // Соотношение сторон 1:1
  overflow: hidden;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const Content = styled.div`
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 16px;
  margin: 0 0 10px 0;
  color: #333;
  font-weight: 600;
  line-height: 1.4;
`;

const Price = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-top: auto;
  margin-bottom: 15px;
`;

const OldPrice = styled.span`
  text-decoration: line-through;
  color: #999;
  font-size: 14px;
  margin-left: 10px;
  font-weight: normal;
`;

const AddToCartButton = styled.button`
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3367d6;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const AvailabilityTag = styled.span`
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: ${props => props.available ? '#e6f7e6' : '#ffeeee'};
  color: ${props => props.available ? '#2e7d32' : '#c62828'};
`;

/**
 * Компонент карточки товара
 * @param {Object} props - Свойства компонента
 * @param {Object} props.product - Данные о товаре
 * @param {Function} props.onAddToCart - Обработчик добавления в корзину (опционально)
 */
const ProductCard = ({ product, onAddToCart }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const queryClient = useQueryClient();
  
  // Обработчик добавления в корзину
  const handleAddToCart = async () => {
    if (!product.ID || isLoading) return;
    
    setIsLoading(true);
    
    try {
      await basketApi.addToBasket(product.ID, 1);
      
      // Инвалидируем кэш количества товаров в корзине
      queryClient.invalidateQueries('basketCount');
      
      // Вызываем внешний обработчик, если он передан
      if (onAddToCart) {
        onAddToCart(product);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Проверяем, доступен ли товар для заказа
  const isAvailable = product.CATALOG_AVAILABLE === 'Y';
  
  return (
    <Card>
      <ImageContainer>
        <Image 
          src={product.PREVIEW_PICTURE_SRC || '/images/no-image.png'} 
          alt={product.NAME} 
          loading="lazy"
        />
      </ImageContainer>
      <Content>
        <AvailabilityTag available={isAvailable}>
          {isAvailable ? 'В наличии' : 'Нет в наличии'}
        </AvailabilityTag>
        <Title>{product.NAME}</Title>
        <Price>
          {new Intl.NumberFormat('ru-RU', { 
            style: 'currency', 
            currency: 'RUB',
            maximumFractionDigits: 0 
          }).format(product.PRICE)}
          
          {product.OLD_PRICE && product.OLD_PRICE > product.PRICE && (
            <OldPrice>
              {new Intl.NumberFormat('ru-RU', { 
                style: 'currency', 
                currency: 'RUB',
                maximumFractionDigits: 0 
              }).format(product.OLD_PRICE)}
            </OldPrice>
          )}
        </Price>
        <AddToCartButton 
          onClick={handleAddToCart} 
          disabled={!isAvailable || isLoading}
        >
          {isLoading ? 'Добавление...' : 'В корзину'}
        </AddToCartButton>
      </Content>
    </Card>
  );
};

export default ProductCard; 