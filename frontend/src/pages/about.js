import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import { COLORS, SPACING } from '../styles/tokens';
import styles from '../styles/pages/AboutPage.module.css';

const breadcrumbItems = [
  { href: '/', label: 'Главная' },
  { href: '/about', label: 'О нас' },
];

// Данные для страницы About
const aboutData = {
  title: 'О Компании',
  content: [
    'Наша компания специализируется на продаже высококачественного снаряжения для стрельбы и охоты. Мы работаем с ведущими мировыми производителями и предлагаем нашим клиентам только лучшие товары.',
    'Мы гордимся тем, что предоставляем широкий ассортимент продукции, отвечающей самым высоким стандартам качества и безопасности. Наша команда экспертов всегда готова помочь вам выбрать идеальное снаряжение, соответствующее вашим потребностям и предпочтениям.',
    'Более 10 лет мы поставляем на российский рынок продукцию ведущих мировых брендов. За это время мы накопили огромный опыт и знания, которыми с удовольствием делимся с нашими клиентами.',
    'Наши преимущества:',
    '• Широкий ассортимент товаров от ведущих мировых производителей',
    '• Гарантия качества на всю продукцию',
    '• Быстрая доставка по всей России',
    '• Профессиональные консультации наших экспертов',
    '• Сервисное обслуживание и техническая поддержка',
  ],
};

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>О компании - Shop4Shoot</title>
        <meta name="description" content="О компании Shop4Shoot - ваш надежный партнер в мире стрельбы и охоты" />
      </Head>
      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <main className={styles.aboutContainer}>
        <div className={styles.aboutContent}>
          <h1 className={styles.aboutTitle}>{aboutData.title}</h1>
          
          <div className={styles.aboutText}>
            {aboutData.content.map((paragraph, index) => (
              <p key={index} className={styles.aboutParagraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AboutPage; 