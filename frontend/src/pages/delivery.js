import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import ContactsModal from '../components/modals/ContactsModal';
import { COLORS, SPACING } from '../styles/tokens';
import styles from '../styles/pages/AboutPage.module.css';

const breadcrumbItems = [
  { href: '/', label: 'Главная' },
  { href: '/delivery', label: 'Доставка' },
];

// Данные для страницы Доставка
const deliveryData = {
  title: 'Доставка',
  content: [
    'Мы обеспечиваем быструю и надежную доставку товаров по всей территории Российской Федерации.',
    'Способы доставки:',
    '• Курьерская доставка по Москве и Московской области',
    '• Доставка через службы экспресс-доставки (СДЭК)',
    '• Почта России',
    '• Самовывоз из пункта выдачи',
    '',
    'Сроки доставки:',
    '• По Москве - 1-2 рабочих дня',
    '• По Московской области - 2-3 рабочих дня',
    '• По России - 3-7 рабочих дней',
    '',
    'Стоимость доставки рассчитывается индивидуально в зависимости от веса, габаритов товара и удаленности населенного пункта.',
    '',
    'Бесплатная доставка предоставляется при заказе от 5000 рублей по Москве и от 7000 рублей по России.',
    '',
    'Для уточнения информации о доставке конкретного товара, пожалуйста, свяжитесь с нами по указанным контактам.',
  ],
  contacts: {
    phone: '8(800)250-11-01',
    email: 'shop@weapon-culture.ru'
  }
};

const DeliveryPage = () => {
  const [isContactsModalOpen, setIsContactsModalOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePhoneClick = () => {
    window.location.href = `tel:${deliveryData.contacts.phone}`;
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${deliveryData.contacts.email}`;
  };

  const handleContactsClick = () => {
    setIsContactsModalOpen(true);
  };

  const handleCloseContactsModal = () => {
    setIsContactsModalOpen(false);
  };

  return (
    <>
      <Head>
        <title>Доставка - Shop4Shoot</title>
        <meta name="description" content="Информация о доставке товаров Shop4Shoot по всей России" />
      </Head>
      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <main className={styles.aboutContainer}>
        <div className={styles.aboutContent}>
          <h1 className={styles.aboutTitle}>{deliveryData.title}</h1>
          
          <div className={styles.aboutText}>
            {deliveryData.content.map((paragraph, index) => (
              <p key={index} className={styles.aboutParagraph}>
                {paragraph}
              </p>
            ))}
            
            <div className={styles.aboutParagraph}>
              <strong>Контактная информация:</strong>
            </div>
            
            <p className={styles.aboutParagraph}>
              Телефон: <span 
                style={{ color: COLORS.primary, cursor: 'pointer', textDecoration: 'underline' }}
                onClick={handlePhoneClick}
              >
                {deliveryData.contacts.phone}
              </span>
            </p>
            
            <p className={styles.aboutParagraph}>
              E-mail: <span 
                style={{ color: COLORS.primary, cursor: 'pointer', textDecoration: 'underline' }}
                onClick={handleEmailClick}
              >
                {deliveryData.contacts.email}
              </span>
            </p>

            <p className={styles.aboutParagraph}>
              Или <span 
                style={{ color: COLORS.primary, cursor: 'pointer', textDecoration: 'underline' }}
                onClick={handleContactsClick}
              >
                заполните форму обратной связи
              </span> и мы свяжемся с вами для уточнения деталей доставки.
            </p>
          </div>
        </div>
      </main>

      {isMounted && (
        <ContactsModal 
          isOpen={isContactsModalOpen}
          onClose={handleCloseContactsModal}
        />
      )}

      <Footer />
    </>
  );
};

export default DeliveryPage; 