import React from 'react';
import styled from 'styled-components';
import { useQueryClient } from 'react-query';
import { basketApi } from '../lib/api';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, ANIMATION } from '../styles/tokens';

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.md};
  overflow: hidden;
  height: 100%;
  width: 100%;
  padding-left: ${SPACING.lg};
  padding-right: ${SPACING.lg};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 600px) {
    padding-left: 0;
    padding-right: 0;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 180px;
  background-color: ${COLORS.white};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: ${SPACING.sm};

  @media (min-width: 600px) {
    height: 240px;
    padding: ${SPACING.md};
  }
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #FEFEFE;
  padding: ${SPACING.md} 0;
  gap: ${SPACING.sm};
  width: 100%;
  text-align: center;
  flex-grow: 1;

  @media (min-width: 600px) {
    padding: ${SPACING.xl} ${SPACING.lg};
    gap: ${SPACING.lg};
  }
`;

const BrandTitle = styled.span`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: ${TYPOGRAPHY.size.xl};
  line-height: 1;
  color: ${COLORS.primary};
  text-transform: uppercase;
`;

const ProductTitle = styled.h3`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: ${TYPOGRAPHY.size.xl};
  line-height: 1.2;
  color: ${COLORS.black};
  margin: 0;
`;

const Price = styled.div`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: ${TYPOGRAPHY.size["3xl"]};
  line-height: 0.7;
  color: ${COLORS.primary};
  margin-top: ${SPACING.xs};

  @media (min-width: 600px) {
    margin-top: ${SPACING.sm};
  }
`;

const DividerLine = styled.hr`
  border: none;
  border-top: 2px dashed rgba(0, 0, 0, 0.25);
  width: 100%;
  margin: ${SPACING.sm} 0 0 0;

  @media (min-width: 600px) {
    margin: ${SPACING.lg} 0 0 0;
  }
`;

const CartActionArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FEFEFE;
  padding: ${SPACING.md} 0;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${COLORS.gray100};
  }

  @media (min-width: 600px) {
    padding: ${SPACING.lg} ${SPACING.xl};
  }
`;

const AddToCartText = styled.span`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: ${TYPOGRAPHY.size.xl};
  line-height: 1;
  color: ${COLORS.primary};
  text-transform: uppercase;
`;

const ProductCard = ({ product, onAddToCart }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const queryClient = useQueryClient();

  const handleAddToCart = async () => {
    const productId = product.ID || product.id;
    const isAvailable = product.CATALOG_AVAILABLE === 'Y' || product.available;

    if (!productId || isLoading || !isAvailable) return;

    setIsLoading(true);

    try {
      await basketApi.addToBasket(productId, 1);
      queryClient.invalidateQueries('basketCount');
      if (onAddToCart) {
        onAddToCart(product);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const brandName = product.BRAND_NAME || product.brand || "Brand";
  const productName = product.NAME || product.name || "Product Name";
  const priceValue = product.PRICE || product.price || 0;
  const imageUrl = product.PREVIEW_PICTURE_SRC || product.imageUrl || '/images/no-image.png';
  const isAvailable = product.CATALOG_AVAILABLE === 'Y' || product.available === true;

  const formattedPrice = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(priceValue);

  return (
    <Card>
      <ImageContainer>
        <Image 
          src={imageUrl} 
          alt={productName} 
          loading="lazy"
        />
      </ImageContainer>
      <Content>
        <BrandTitle>{brandName}</BrandTitle> 
        <ProductTitle>{productName}</ProductTitle>
        <Price>{formattedPrice}</Price>
      </Content>
      <DividerLine />
      <CartActionArea onClick={handleAddToCart} disabled={!isAvailable || isLoading}>
        <AddToCartText>
          {isLoading ? 'Добавление...' : 'В корзину'}
        </AddToCartText>
      </CartActionArea>
    </Card>
  );
};

export default ProductCard; 