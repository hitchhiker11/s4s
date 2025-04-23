import React, { useState } from 'react';
import styled from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING, mediaQueries, SHADOWS } from '../../styles/tokens';

const SubscriptionContainer = styled.section`
  width: 100%;
  margin-bottom: ${SPACING["4xl"]};
  border-top: 4px solid ${COLORS.gray400};
  border-bottom: 4px solid ${COLORS.gray400};
  padding: ${SPACING.lg};
  
  ${mediaQueries.md} {
    padding: ${SPACING.xl};
  }
  
  ${mediaQueries.lg} {
    padding: ${SPACING["2xl"]} 40px;
  }
  
  ${mediaQueries.xxl} {
    max-width: 2000px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  
  ${mediaQueries.md} {
    flex-direction: row;
  }
`;

const FormContainer = styled.div`
  padding-right: ${SPACING.xl};
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.white};
  width: 100%;
  
  ${mediaQueries.md} {
    width: 50%;
    padding-right: ${SPACING["3xl"]};
  }
`;

const FormHeading = styled.h2`
  font-family: ${TYPOGRAPHY.additionalFonts.montserrat};
  font-style: normal;
  font-weight: 600;
  font-size: 34px;
  line-height: 110%;
  color: ${COLORS.black};
  margin-bottom: ${SPACING["3xl"]};
  padding-top: 16px;
  padding-bottom: 16px;

  ${mediaQueries.md} {
    font-size: 42px;
    padding-top: 0;
    padding-bottom: 0;
  }

  ${mediaQueries.lg} {
    font-size: 54px;
  }
`;

const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.xl};
  margin-bottom: ${SPACING["2xl"]};
`;

const InputWrapper = styled.div`
  width: 100%;
  max-width: 470px;
  border-bottom: 4px solid ${COLORS.gray400};
  padding-bottom: ${SPACING.xs};
`;

const Input = styled.input`
  width: 100%;
  font-family: ${TYPOGRAPHY.fontFamily};
  font-size: 18px;
  line-height: 1.5;
  color: ${COLORS.black};
  border: none;
  background: transparent;
  padding: ${SPACING.sm} 0;
  
  &::placeholder {
    color: rgba(0, 0, 0, 0.6);
    letter-spacing: 0.02em;
  }
  
  &:focus {
    outline: none;
  }
  
  ${mediaQueries.md} {
    font-size: 22px;
  }
  
  ${mediaQueries.lg} {
    font-size: 27px;
  }
`;

const SubmitButton = styled.button`
  align-self: flex-start;
  background-color: ${COLORS.primary};
  color: ${COLORS.white};
  font-family: ${TYPOGRAPHY.fontFamily};
  font-weight: 500;
  font-size: 20px;
  text-transform: uppercase;
  border: none;
  padding: 24px 40px;
  cursor: pointer;
  box-shadow: ${SHADOWS.md};
  transition: background-color 0.3s ease;
  width: 100%;
  
  
  &:hover {
    background-color: ${COLORS.primaryHover};
  }
  
  ${mediaQueries.md} {
    min-width: 100px;
    width: 50%;
    width: auto;
  }
`;

const ImageContainer = styled.div`
  display: none;
  
  ${mediaQueries.md} {
    display: block;
    width: 50%;
    height: 100%;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  
  object-fit: cover;
`;

const ClubSubscription = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    // Here you would typically send the data to an API
    // For now, we'll just log it
  };

  return (
    <SubscriptionContainer>
      <ContentWrapper>
        <FormContainer>
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
        </FormContainer>
        <ImageContainer>
          <Image src="/images/club/shooter_form.jpg" alt="Член клуба стрелков" />
        </ImageContainer>
      </ContentWrapper>
    </SubscriptionContainer>
  );
};

export default ClubSubscription; 