import React, { useState } from 'react';
import styled from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING, mediaQueries, SHADOWS } from '../../styles/tokens';

const SubscriptionContainer = styled.section`
  width: 100%;
  // margin-bottom: ${SPACING["4xl"]};
  // border-top: 2px solid ${COLORS.gray400};
  border-bottom: 2px solid ${COLORS.gray400};
  // padding: ${SPACING.lg};

  ${mediaQueries.md} {
    // border-top-width: 4px;
    border-bottom-width: 4px;
    // padding: ${SPACING.xl};
  }

  ${mediaQueries.lg} {
    // padding: ${SPACING["2xl"]} 40px;
    // padding-top: 10px;
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
    // align-items: stretch; // This is the default, so ImageContainer should stretch
  }
`;

const FormContainer = styled.div`
  display: flex; 
  flex-direction: column;
  background-color: ${COLORS.white};
  width: 100%;
  padding: ${SPACING.lg};



  ${mediaQueries.md} {
    width: 50%;
    padding: ${SPACING.lg} ${SPACING['3xl']} ${SPACING.lg} ${SPACING['3xl']};
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

  ${mediaQueries.md} {
    font-size: 54px;
    margin-bottom: ${SPACING["3xl"]};
    padding-top: 0;
    padding-bottom: 0;
  }
`;

const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: ${SPACING.xl};
  
  ${mediaQueries.md} {
    gap: 40px;
    margin-bottom: ${SPACING["2xl"]};
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  max-width: 473px;
  border-bottom: 2px solid ${COLORS.gray400};
  padding-bottom: ${SPACING.xs};

  ${mediaQueries.md} {
    border-bottom-width: 3px;
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

  ${mediaQueries.md} {
    font-size: 27px;
    padding: ${SPACING.sm} 0;
    line-height: 1.5;
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

  ${mediaQueries.md} {
    width: 473px;
    font-size: 20px;
    padding: 24px 40px;
  }
`;

const ImageContainer = styled.div`
  display: none; // Hidden on small screens by default

  ${mediaQueries.md} {
    display: block; // Becomes a flex item in ContentWrapper on medium screens and up
    width: 50%;
    // height: 100%; // Removed: Rely on flexbox's align-items: stretch (default on ContentWrapper)
                     // This makes ImageContainer take the full height of the ContentWrapper row.
  }
`;

const Image = styled.img`
  display: block; // Ensures image behaves as a block element, removing potential bottom space
  width: 100%;    // Image takes full width of ImageContainer
  height: 100%;   // Image takes full height of ImageContainer
  object-fit: cover; // Image maintains aspect ratio, covers the container, may be cropped
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