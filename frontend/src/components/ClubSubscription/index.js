import React, { useState } from 'react';
import styled from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING, mediaQueries, SHADOWS } from '../../styles/tokens';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../Toast/ToastContainer';
import BrandFeature from '../BrandFeature'; // Import brand feature component
import { normalizePhoneNumber, isValidRussianPhone } from '../../lib/phone';
import { subscribeToNews } from '../../lib/api/bitrix';

const hardcodedFeaturedBrandData = {
  id: 'eiger',
  name: 'Eiger',
  featureImage: '/images/brands/eiger_img_8048.jpg',
  logoImage: '/images/brands/eiger_tac_logo.jpg',
  description: "Компания EIGER основана в 1989 году индонезийцем Ронни Лукито и начала свое триумфальное шествие с производства бивачного снаряжения.\n\nВсего через десять лет продукция компании завоевала уверенную нишу в сетях туристических магазинов Вьетнама, Китая, Тайваня, Гонконга, Южной Кореи, Франции, Германии и США.\n\nEiger Adventure изначально ориентировалась на восхождения и горный туризм, однако с 2016 обратила свое внимание на хайкинг, треккинг и тропический климат, открыв линейку Tropical.\n\nВ 2020 применила свой многолетний опыт для входа на рынок тактического и спортивного снаряжения, создав линейки Eiger TAC и Eiger Practical – тем самым обеспечив потребности местных силовиков и практических стрелков.\n\nСегодня компания Eiger - это 35 лет экспертизы в проектировании одежды и снаряжения для различных климатических условий."
};

const SubscriptionContainer = styled.section`
  width: 100%;
  position: relative;
  /* Remove the regular bottom border since we'll use pseudo-element */
  border-top: none;

  /* Show top border only from 1264px and up (desktop wide) */
  @media (min-width: 1264px) {
    border-top: 4px solid ${COLORS.gray400};
  }

  /* Fluid bottom border using pseudo-element */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw; /* Full viewport width */
    height: 2px;
    background-color: ${COLORS.gray400};
    z-index: 1;
  }

  /* Hide bottom border on mobile (< 768px) */
  @media (max-width: 767px) {
    &::after {
      display: none;
    }
  }

  /* Bottom border becomes 4px thick from 992px and up */
  ${mediaQueries.lg} {
    &::after {
      height: 4px;
    }
  }

  ${mediaQueries.xxl} {
    max-width: 1920px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${mediaQueries.md} {
    flex-direction: row;
    align-items: stretch;
  }
`;

const FormContainer = styled.div`
  display: flex; 
  flex-direction: column;
  justify-content: center; /* Center vertically within ContentWrapper */
  background-color: ${COLORS.white};
  width: 100%;
  padding: ${SPACING.lg};
  position: relative;
  overflow: visible;

  ${mediaQueries.md} {
    /* Ensure ContentWrapper has enough height for vertical centering to be visible */
    align-self: center; /* In case ContentWrapper is taller, center self vertically */
    height: 100%;
  }

  ${mediaQueries.lg} {
    width: 52%;
    padding: ${SPACING.lg} ${SPACING['3xl']} ${SPACING['3xl']} ${SPACING['3xl']};
  }
`;

const FormHeading = styled.h2`
  font-family: ${TYPOGRAPHY.additionalFonts.montserrat};
  font-style: normal;
  font-weight: 600;
  font-size: clamp(1.25rem, 5vw, 54px);
  line-height: 1.1;
  color: ${COLORS.black};
  margin-bottom: ${SPACING.xl};
  padding-top: 12px;
  padding-bottom: 12px;

  ${mediaQueries.lg} {
    font-size: ${TYPOGRAPHY.size["3xl"]}; /* -1 step from tokens */
    margin-bottom: ${SPACING["2xl"]};
    padding-top: 0;
    padding-bottom: 0;
  }

  ${mediaQueries.xl} {
    font-size: ${TYPOGRAPHY.size.xl}; /* Уменьшен для xl */
  }

  ${mediaQueries.xxl} {
    font-size: ${TYPOGRAPHY.size["2xl"]}; /* Компактный для xxl */
  }

  ${mediaQueries.xxxl} {
    font-size: ${TYPOGRAPHY.size["4xl"]}; /* Еще компактнее для 1920px+ */
  }
`;

const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: ${SPACING.xl};
  
  ${mediaQueries.lg} {
    gap: ${SPACING.lg}; /* reduced gap */
    margin-bottom: ${SPACING['3xl']};
  }
    
`;

const InputWrapper = styled.div`
  width: 100%;
  /* Remove max-width constraint on mobile/tablet (< 992px) */
  border-bottom: 2px solid ${COLORS.gray400};
  padding-bottom: ${SPACING.xs};

  ${mediaQueries.lg} {
    max-width: none;
    border-bottom-width: 4px;
  }
  
  @media (min-width: 1200px) {
    max-width: 600px;
    padding: ${SPACING.lg} ${SPACING['3xl']} ${SPACING.sm} 0;
  }
`;

const Input = styled.input`
  width: 100%;
  font-family: ${TYPOGRAPHY.fontFamily};
  font-size: clamp(1rem, 4vw, 27px);
  line-height: 1.4;
  color: ${COLORS.black};
  border: none;
  background: transparent;
  padding: ${SPACING.xs} 0;
  letter-spacing: 2%;

  &::placeholder {
    color: rgba(0, 0, 0, 0.6);
    letter-spacing: 0.02em;
  }

  &:focus {
    outline: none;
  }

  ${mediaQueries.lg} {
    font-size: ${TYPOGRAPHY.size.lg}; /* -1 step from tokens */
    padding: ${SPACING.sm} 0;
    line-height: 1.5;
  }

  ${mediaQueries.xl} {
    font-size: ${TYPOGRAPHY.size.xs}; /* Уменьшен для xl */
  }

  ${mediaQueries.xxl} {
    font-size: ${TYPOGRAPHY.size.md}; /* Компактный для xxl */
  }

  ${mediaQueries.xxxl} {
    font-size: ${TYPOGRAPHY.size.lg}; /* Еще компактнее для 1920px+ */
  }
`;

const SubmitButton = styled.button`
  align-self: flex-start;
  background-color: ${COLORS.primary};
  color: ${COLORS.white};
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: 500;
  font-size: clamp(0.9rem, 3.5vw, 20px);
  text-transform: uppercase;
  border: none;
  padding: 16px 30px;
  cursor: pointer;
  box-shadow: ${SHADOWS.md};
  transition: background-color 0.3s ease;
  width: 100%;

  &:hover {
    background-color: ${COLORS.primaryHover};
  }

  ${mediaQueries.lg} {
    width: auto;
    max-width: 380px;
    font-size: ${TYPOGRAPHY.size.md}; /* -1 step from tokens */
    padding: ${SPACING.lg} ${SPACING.xl};
  }

  ${mediaQueries.xl} {
    font-size: ${TYPOGRAPHY.size.md}; /* Уменьшен для xl */
    max-width: 340px;
  }

  ${mediaQueries.xxl} {
    font-size: ${TYPOGRAPHY.size.lg}; /* Компактный для xxl */
    max-width: 300px;
  }

  ${mediaQueries.xxxl} {
    font-size: ${TYPOGRAPHY.size.lg}; /* Еще компактнее для 1920px+ */
    max-width: 280px;
  }
`;

const ImageContainer = styled.div`
  display: none; // Hidden on small screens by default

  ${mediaQueries.lg} {
    display: block; // Becomes a flex item in ContentWrapper on medium screens and up
    width: 48%;
    position: relative;
    overflow: hidden; /* prevent bleed over footer */
  }
`;

const Image = styled.img`
  display: block; // Ensures image behaves as a block element, removing potential bottom space
  width: 100%;    // Image takes full width of ImageContainer
  height: 100%;   // Image takes full height of ImageContainer
  object-fit: cover; // Image maintains aspect ratio, covers the container, may be cropped
  object-position: center;
`;

const ClubSubscription = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const { toasts, showSuccessToast, showErrorToast, removeToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedPhone = normalizePhoneNumber(formData.phone);
    const emailValid = !formData.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

    if (!isValidRussianPhone(normalizedPhone)) {
      showErrorToast('Введите корректный номер телефона в формате +7XXXXXXXXXX');
      return;
    }
    if (!emailValid) {
      showErrorToast('Введите корректный email');
      return;
    }

    try {
      const result = await subscribeToNews({
        phone: normalizedPhone,
        name: formData.name.trim(),
        email: formData.email.trim(),
      });
      if (result && result.success !== false) {
        showSuccessToast('Спасибо! Вы подписаны на новости.');
        setFormData({ name: '', email: '', phone: '' });
      } else {
        const msg = result?.error?.message || result?.message || 'Не удалось оформить подписку';
        showErrorToast(msg);
      }
    } catch (err) {
      showErrorToast(err.message || 'Ошибка при оформлении подписки');
    }
  };

  return (
    <SubscriptionContainer>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <ContentWrapper>
        {/* <FormContainer>
          <FormHeading>
            Вступайте в закрытое сообщество,<br />
            получайте эксклюзивные предложения и новости
          </FormHeading>
          <form onSubmit={handleSubmit}>
            <InputsContainer>
              <InputWrapper>
                <Input
                  type="text"
                  name="name"
                  placeholder="Ваше имя"
                  value={formData.name}
                  onChange={handleChange}
                />
              </InputWrapper>
              <InputWrapper>
                <Input
                  type="email"
                  name="email"
                  placeholder="Ваша почта"
                  value={formData.email}
                  onChange={handleChange}
                />
              </InputWrapper>
              <InputWrapper>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Ваш номер телефона"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </InputWrapper>
            </InputsContainer>
            <SubmitButton type="submit">
              вступить в клуб
            </SubmitButton>
          </form>
        </FormContainer> */}
        <BrandFeature brandData={hardcodedFeaturedBrandData} showFeatureImage={false} />
        <ImageContainer>
          <Image src="/images/club/shooter_form.jpg" alt="Член клуба стрелков" />
        </ImageContainer>
      </ContentWrapper>
    </SubscriptionContainer>
  );
};

export default ClubSubscription;
