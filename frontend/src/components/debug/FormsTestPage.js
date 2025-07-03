import React, { useState } from 'react';
import RequestModal from '../modals/RequestModal';
import ContactsModal from '../modals/ContactsModal';
import PreOrderModal from '../modals/PreOrderModal';

const FormsTestPage = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const testProduct = {
    name: 'Тестовый товар',
    description: 'Описание тестового товара для предзаказа',
    id: '12345',
    article: 'TEST-001'
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Тестирование модальных форм</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => openModal('request')}
          style={{
            margin: '10px',
            padding: '15px 30px',
            backgroundColor: '#E7194A',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Тест формы заявки (ID: 24)
        </button>
        
        <button 
          onClick={() => openModal('contacts')}
          style={{
            margin: '10px',
            padding: '15px 30px',
            backgroundColor: '#E7194A',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Тест формы звонка (ID: 23)
        </button>
        
        <button 
          onClick={() => openModal('preorder')}
          style={{
            margin: '10px',
            padding: '15px 30px',
            backgroundColor: '#E7194A',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Тест формы предзаказа (ID: 25)
        </button>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'left', maxWidth: '600px', margin: '30px auto' }}>
        <h3>Инструкции для тестирования:</h3>
        <ol>
          <li><strong>Форма заявки</strong>: Все поля обязательны кроме комментария</li>
          <li><strong>Форма звонка</strong>: Имя и телефон обязательны</li>
          <li><strong>Форма предзаказа</strong>: Все поля обязательны кроме комментария</li>
        </ol>
        
        <h3>Проверить:</h3>
        <ul>
          <li>Валидация полей работает</li>
          <li>Ошибки отображаются</li>
          <li>Успешная отправка показывает уведомление</li>
          <li>Модалки закрываются после отправки</li>
          <li>Состояние загрузки отображается</li>
        </ul>
      </div>

      {/* Модальные окна */}
      <RequestModal
        isOpen={activeModal === 'request'}
        onClose={closeModal}
        initialValues={{
          name: 'Тест',
          surname: 'Тестов'
        }}
      />

      <ContactsModal
        isOpen={activeModal === 'contacts'}
        onClose={closeModal}
      />

      <PreOrderModal
        isOpen={activeModal === 'preorder'}
        onClose={closeModal}
        productName={testProduct.name}
        productDescription={testProduct.description}
        productId={testProduct.id}
        productArticle={testProduct.article}
      />
    </div>
  );
};

export default FormsTestPage; 