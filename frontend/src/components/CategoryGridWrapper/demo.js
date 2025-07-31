import React, { useState } from 'react';
import styled from 'styled-components';
import CategoryGridWrapper from './index';

const DemoContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.div`
  margin-bottom: 40px;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 20px;
  font-family: 'Rubik', sans-serif;
  color: #1C1C1C;
`;

const Controls = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: ${props => props.active ? '#E7194A' : 'white'};
  color: ${props => props.active ? 'white' : 'black'};
  border-radius: 4px;
  cursor: pointer;
`;

const LayoutDescription = styled.div`
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
`;

// Моковые данные для тестирования
const generateMockCategories = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Категория ${i + 1}`,
    link: `/category/${i + 1}`,
    imageUrl: `/images/categories/cat${i + 1}.jpg`
  }));
};

const allProductsCard = {
  id: 'all',
  name: 'Все товары',
  link: '/catalog/all',
  isAllProducts: true
};

/**
 * Получает описание раскладки для заданного количества карточек
 */
const getLayoutDescription = (totalCards) => {
  const descriptions = {
    1: `1 карточка:
└── Карточка 1: span 6 (100% ширины)`,
    
    2: `2 карточки:
├── Карточка 1: span 3 (50% ширины)
└── Карточка 2: span 3 (50% ширины)`,
    
    3: `3 карточки:
├── Карточка 1: span 2 (33.33% ширины)
├── Карточка 2: span 2 (33.33% ширины) 
└── Карточка 3: span 2 (33.33% ширины)`,
    
    4: `4 карточки:
Строка 1:
├── Карточка 1: span 2 (33.33% ширины)
├── Карточка 2: span 2 (33.33% ширины)
└── Карточка 3: span 2 (33.33% ширины)
Строка 2:
└── Карточка 4: span 6 (100% ширины)`,

    5: `5 карточек:
Строка 1:
├── Карточка 1: span 2 (33.33% ширины)
├── Карточка 2: span 2 (33.33% ширины)
└── Карточка 3: span 2 (33.33% ширины)
Строка 2:
├── Карточка 4: span 3 (50% ширины)
└── Карточка 5: span 3 (50% ширины)`,

    6: `6 карточек:
Строка 1:
├── Карточка 1: span 2 (33.33% ширины)
├── Карточка 2: span 2 (33.33% ширины)
└── Карточка 3: span 2 (33.33% ширины)
Строка 2:
├── Карточка 4: span 2 (33.33% ширины)
├── Карточка 5: span 2 (33.33% ширины)
└── Карточка 6: span 2 (33.33% ширины)`,

    7: `7 карточек:
Строка 1-2: 6 карточек по span 2 (33.33%)
├── Карточка 1-3: Строка 1
├── Карточка 4-6: Строка 2
Строка 3:
└── Карточка 7: span 6 (100% ширины)`,

    8: `8 карточек:
Строка 1-2: 6 карточек по span 2 (33.33%)
├── Карточка 1-3: Строка 1
├── Карточка 4-6: Строка 2
Строка 3:
├── Карточка 7: span 3 (50% ширины)
└── Карточка 8: span 3 (50% ширины)`
  };

  if (totalCards > 8) {
    const fullRows = Math.floor(totalCards / 3);
    const remainder = totalCards % 3;
    
    let description = `${totalCards} карточек:\n`;
    description += `Строки 1-${fullRows}: ${fullRows * 3} карточек по span 2 (33.33%)\n`;
    
    if (remainder === 1) {
      description += `Последняя строка: 1 карточка span 6 (100%)`;
    } else if (remainder === 2) {
      description += `Последняя строка: 2 карточки по span 3 (50%)`;
    }
    
    return description;
  }

  return descriptions[totalCards] || 'Описание не найдено';
};

const CategoryGridWrapperDemo = () => {
  const [categoryCount, setCategoryCount] = useState(5);
  const [showAllProducts, setShowAllProducts] = useState(true);

  const categories = generateMockCategories(categoryCount);
  const totalCards = showAllProducts ? categoryCount + 1 : categoryCount;

  return (
    <DemoContainer>
      <h1>CategoryGridWrapper Demo - Строгая 6-колоночная система</h1>
      
      <Section>
        <SectionTitle>Настройки</SectionTitle>
        <Controls>
          <div>
            <span>Количество категорий: </span>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(count => (
              <Button 
                key={count}
                active={categoryCount === count}
                onClick={() => setCategoryCount(count)}
              >
                {count}
              </Button>
            ))}
          </div>
        </Controls>
        <Controls>
          <Button 
            active={showAllProducts}
            onClick={() => setShowAllProducts(!showAllProducts)}
          >
            {showAllProducts ? 'Скрыть' : 'Показать'} карточку "Все товары"
          </Button>
        </Controls>
      </Section>

      <Section>
        <SectionTitle>
          Строгая 6-колоночная раскладка: {totalCards} карточек
          {showAllProducts && ' (включая "Все товары")'}
        </SectionTitle>
        
        <LayoutDescription>
          <strong>📱 МОБИЛЬНАЯ ВЕРСИЯ (до lg):</strong>
          {'\n'}• 6-колоночная система с умным позиционированием
          {'\n'}• Gap: строго 12px везде
          {'\n'}• Размеры карточек: только span 2, span 3, span 6
          {'\n'}• Минимальная ширина: span 2 (33.33%)
          {'\n\n'}
          <strong>🖥️ ДЕСКТОПНАЯ ВЕРСИЯ (lg+):</strong>
          {'\n'}• Простой 4-колоночный грид
          {'\n'}• Все карточки одинакового размера (span 1)
          {'\n'}• Автоматическое заполнение по строкам (4 карточки в ряд)
          {'\n\n'}
          <strong>📐 Мобильная раскладка ({totalCards} карточек):</strong>
          {'\n'}
          {getLayoutDescription(totalCards)}
        </LayoutDescription>
        
        <CategoryGridWrapper 
          categories={categories}
          allProductsCard={showAllProducts ? allProductsCard : null}
        />
      </Section>

      <Section>
        <SectionTitle>🚨 Исправленные проблемы</SectionTitle>
        <div style={{ fontFamily: 'sans-serif', fontSize: '14px', lineHeight: '1.6' }}>
          <p><strong>✅ Проблема 1 решена:</strong> Две карточки теперь корректно позиционируются по 50% (span 3)</p>
          <p><strong>✅ Проблема 2 решена:</strong> Одинокая карточка растягивается на всю ширину (span 6)</p>
          <p><strong>✅ Проблема 3 решена:</strong> Единая строгая 6-колоночная система во всех случаях</p>
          <p><strong>✅ Gap исправлен:</strong> Строго 12px везде (было 16px-23px)</p>
        </div>
      </Section>
    </DemoContainer>
  );
};

export default CategoryGridWrapperDemo; 