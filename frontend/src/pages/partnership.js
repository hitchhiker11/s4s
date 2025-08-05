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
  { href: '/partnership', label: 'Сотрудничество' },
];

// Данные для страницы Сотрудничество
const partnershipData = {
  title: 'Сотрудничество',
  content: [
    'Мы всегда открыты к взаимовыгодному сотрудничеству и новым предложениям. Если у вас есть интересные идеи, вы являетесь поставщиком товаров для стрелкового спорта и тактического снаряжения, или хотите стать нашим партнёром, пожалуйста, свяжитесь с нами по указанным контактам.',
    'Будем рады обсудить возможности совместной работы и ответить на все вопросы.',
  ],
  contacts: {
    phone: '8(800)250-11-01',
    email: 'shop@weapon-culture.ru'
  }
};

const PartnershipPage = () => {
  const [isContactsModalOpen, setIsContactsModalOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePhoneClick = () => {
    window.location.href = `tel:${partnershipData.contacts.phone}`;
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${partnershipData.contacts.email}`;
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
        <title>Сотрудничество - Shop4Shoot</title>
        <meta name="description" content="Сотрудничество с Shop4Shoot - ваш надежный партнер в мире стрельбы и охоты" />
      </Head>
      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <main className={styles.aboutContainer}>
        <div className={styles.aboutContent}>
          <h1 className={styles.aboutTitle}>{partnershipData.title}</h1>
          
          <div className={styles.aboutText}>
            {partnershipData.content.map((paragraph, index) => (
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
                {partnershipData.contacts.phone}
              </span>
            </p>
            
            <p className={styles.aboutParagraph}>
              E-mail: <span 
                style={{ color: COLORS.primary, cursor: 'pointer', textDecoration: 'underline' }}
                onClick={handleEmailClick}
              >
                {partnershipData.contacts.email}
              </span>
            </p>

            <p className={styles.aboutParagraph}>
              Или <span 
                style={{ color: COLORS.primary, cursor: 'pointer', textDecoration: 'underline' }}
                onClick={handleContactsClick}
              >
                заполните форму обратной связи
              </span> и мы свяжемся с вами в удобное время.
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

export default PartnershipPage; 