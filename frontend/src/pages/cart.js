import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Link from 'next/link';

import { basketApi } from '../lib/api';
import { loadBitrixCore } from '../lib/auth';

// Стилизованные компоненты
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 30px;
  color: #333;
`;

const CartTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  
  th {
    text-align: left;
    padding: 12px;
    background-color: #f5f5f5;
    border-bottom: 2px solid #ddd;
  }
  
  td {
    padding: 15px 12px;
    border-bottom: 1px solid #eee;
    vertical-align: middle;
  }
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const ProductName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const ProductCode = styled.div`
  font-size: 12px;
  color: #777;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #e5e5e5;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 40px;
  height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 0 5px;
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #cc0000;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Price = styled.div`
  font-weight: 600;
  font-size: 16px;
`;

const Summary = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 16px;
`;

const SummaryTotal = styled(SummaryRow)`
  font-size: 20px;
  font-weight: 700;
  padding-top: 15px;
  border-top: 1px solid #ddd;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s;
  margin-right: 10px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #4285f4;
  color: white;
  
  &:hover {
    background-color: #3367d6;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: white;
  border: 1px solid #ddd;
  color: #333;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 50px 0;
`;

const EmptyCartTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const EmptyCartText = styled.p`
  color: #666;
  margin-bottom: 30px;
`;

/**
 * Страница корзины
 */
const CartPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Загружаем данные корзины
  const { data, isLoading, error, refetch } = useQuery(
    'basket',
    () => basketApi.getBasket(),
    {
      staleTime: 1000 * 60, // 1 минута
      refetchOnWindowFocus: true,
    }
  );
  
  // Мутации для обновления корзины
  const updateItemMutation = useMutation(
    ({ productId, quantity }) => basketApi.updateBasketItem(productId, quantity),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('basket');
        queryClient.invalidateQueries('basketCount');
      },
    }
  );
  
  const removeItemMutation = useMutation(
    (productId) => basketApi.removeFromBasket(productId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('basket');
        queryClient.invalidateQueries('basketCount');
      },
    }
  );
  
  const clearBasketMutation = useMutation(
    () => basketApi.clearBasket(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('basket');
        queryClient.invalidateQueries('basketCount');
      },
    }
  );
  
  // Загружаем скрипты Bitrix при монтировании компонента
  useEffect(() => {
    loadBitrixCore();
  }, []);
  
  // Обработчики событий
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    updateItemMutation.mutate({ productId, quantity: newQuantity });
  };
  
  const handleRemoveItem = (productId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар из корзины?')) {
      removeItemMutation.mutate(productId);
    }
  };
  
  const handleClearBasket = () => {
    if (window.confirm('Вы уверены, что хотите очистить корзину?')) {
      clearBasketMutation.mutate();
    }
  };
  
  const handleCheckout = () => {
    router.push('/checkout');
  };
  
  // Рендеринг пустой корзины
  if (!isLoading && (!data || !data.ITEMS || data.ITEMS.length === 0)) {
    return (
      <>
        <Head>
          <title>Корзина - Пусто</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Container>
          <Title>Корзина</Title>
          <EmptyCart>
            <EmptyCartTitle>Ваша корзина пуста</EmptyCartTitle>
            <EmptyCartText>Добавьте товары в корзину, чтобы оформить заказ</EmptyCartText>
            <Link href="/catalog" passHref>
              <PrimaryButton as="a">Перейти в каталог</PrimaryButton>
            </Link>
          </EmptyCart>
        </Container>
      </>
    );
  }
  
  // Рендеринг состояния загрузки
  if (isLoading) {
    return (
      <Container>
        <Title>Корзина</Title>
        <div>Загрузка корзины...</div>
      </Container>
    );
  }
  
  // Рендеринг ошибки
  if (error) {
    return (
      <Container>
        <Title>Корзина</Title>
        <div>Произошла ошибка при загрузке корзины. Пожалуйста, попробуйте позже.</div>
      </Container>
    );
  }
  
  return (
    <>
      <Head>
        <title>Корзина - {data.ITEMS.length} товаров</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Container>
        <Title>Корзина</Title>
        
        <CartTable>
          <thead>
            <tr>
              <th>Товар</th>
              <th>Цена</th>
              <th>Количество</th>
              <th>Сумма</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.ITEMS.map((item) => (
              <tr key={item.ID}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ProductImage 
                      src={item.PREVIEW_PICTURE_SRC || '/images/no-image.png'} 
                      alt={item.NAME} 
                    />
                    <div style={{ marginLeft: 15 }}>
                      <ProductName>{item.NAME}</ProductName>
                      <ProductCode>Артикул: {item.PRODUCT_ID}</ProductCode>
                    </div>
                  </div>
                </td>
                <td>
                  <Price>
                    {new Intl.NumberFormat('ru-RU', { 
                      style: 'currency', 
                      currency: 'RUB',
                      maximumFractionDigits: 0 
                    }).format(item.PRICE)}
                  </Price>
                </td>
                <td>
                  <QuantityControl>
                    <QuantityButton 
                      onClick={() => handleQuantityChange(item.PRODUCT_ID, item.QUANTITY - 1)}
                      disabled={item.QUANTITY <= 1}
                    >
                      -
                    </QuantityButton>
                    <QuantityInput 
                      type="number" 
                      min="1"
                      value={item.QUANTITY}
                      onChange={(e) => handleQuantityChange(item.PRODUCT_ID, parseInt(e.target.value) || 1)}
                    />
                    <QuantityButton 
                      onClick={() => handleQuantityChange(item.PRODUCT_ID, item.QUANTITY + 1)}
                    >
                      +
                    </QuantityButton>
                  </QuantityControl>
                </td>
                <td>
                  <Price>
                    {new Intl.NumberFormat('ru-RU', { 
                      style: 'currency', 
                      currency: 'RUB',
                      maximumFractionDigits: 0 
                    }).format(item.PRICE * item.QUANTITY)}
                  </Price>
                </td>
                <td>
                  <RemoveButton onClick={() => handleRemoveItem(item.PRODUCT_ID)}>
                    Удалить
                  </RemoveButton>
                </td>
              </tr>
            ))}
          </tbody>
        </CartTable>
        
        <Summary>
          <SummaryRow>
            <span>Товаров:</span>
            <span>{data.ITEMS.length} шт.</span>
          </SummaryRow>
          <SummaryRow>
            <span>Сумма:</span>
            <span>
              {new Intl.NumberFormat('ru-RU', { 
                style: 'currency', 
                currency: 'RUB',
                maximumFractionDigits: 0 
              }).format(data.TOTAL_PRICE)}
            </span>
          </SummaryRow>
          {data.DISCOUNT_PRICE > 0 && (
            <SummaryRow>
              <span>Скидка:</span>
              <span>- 
                {new Intl.NumberFormat('ru-RU', { 
                  style: 'currency', 
                  currency: 'RUB',
                  maximumFractionDigits: 0 
                }).format(data.DISCOUNT_PRICE)}
              </span>
            </SummaryRow>
          )}
          <SummaryTotal>
            <span>Итого:</span>
            <span>
              {new Intl.NumberFormat('ru-RU', { 
                style: 'currency', 
                currency: 'RUB',
                maximumFractionDigits: 0 
              }).format(data.TOTAL_PRICE - (data.DISCOUNT_PRICE || 0))}
            </span>
          </SummaryTotal>
        </Summary>
        
        <ButtonGroup>
          <div>
            <SecondaryButton onClick={handleClearBasket}>Очистить корзину</SecondaryButton>
            <Link href="/catalog" passHref>
              <SecondaryButton as="a">Продолжить покупки</SecondaryButton>
            </Link>
          </div>
          <PrimaryButton onClick={handleCheckout}>Оформить заказ</PrimaryButton>
        </ButtonGroup>
      </Container>
    </>
  );
};

export default CartPage; 