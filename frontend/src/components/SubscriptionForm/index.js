import React, { useState } from 'react';
import styled from 'styled-components';
import { COLORS, SIZES, TYPOGRAPHY, SPACING, mediaQueries } from '../../styles/tokens'; // Adjusted path for styles
// import RequestModal from '../modals/RequestModal';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../Toast/ToastContainer';
import { normalizePhoneNumber, isValidRussianPhone } from '../../lib/phone';
import { subscribeToNews } from '../../lib/api/bitrix';

// Main wrapper for the subscription section, can be exported if pages need to use it directly
export const SubscriptionSectionWrapper = styled.div`
  width: 100%;
  margin-top: ${SPACING.xl};
  margin-bottom: ${props => props.$noOuterMargin ? '0' : SPACING.xl};
  // background-color: ${COLORS.grayBack}; // Or any other background you prefer
  // padding: ${SPACING.xl} 0;
`;

const SubscriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  // max-width: ${SIZES.containerMaxWidth || '1254px'}; // Use token or fallback
  max-width: 1680px;
  margin: 0 auto;
  gap: 35px;
  // padding: 0 ${SPACING.lg}; 

  ${mediaQueries.md} {
    padding: 0 ${SPACING.lg};
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column; // Mobile first: image above text
  justify-content: center;
  align-items: center;
  gap: ${SPACING.lg};
  text-align: center;
  

  ${mediaQueries.md} {
    flex-direction: row; // Desktop: image beside text
    justify-content: space-between; // Adjust as per Figma (flex-end, space-around etc)
    align-items: center;
    text-align: left;
    gap: ${SPACING.xl}; // Or a larger fixed gap like 300px if specified
  }
`;

const SubscriptionImageContainer = styled.div`
  background: rgba(252, 252, 252, 0.1); 
  display: flex;
  justify-content: center;
  align-items: center;
  // max-height: 187px; 
  // max-width: 118px;  
  width: 118px; 
  height: 187px; 
  padding: ${SPACING.md}; // Padding around the image itself

  ${mediaQueries.md} {
    // box-shadow: 4px 4px 0px 0px rgba(182, 182, 182, 1); 
    margin-bottom: 0; 
  }

  img {
    filter: invert(1); 
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const SubscriptionText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${TYPOGRAPHY.weight.bold};
  font-size: ${TYPOGRAPHY.size.lg}; // Mobile first font size
  text-align: left;
  line-height: 1.3;
  color: ${COLORS.black};
  margin-bottom: ${SPACING.sm}; // Mobile: space below text before form

  ${mediaQueries.md} {
    font-size: ${TYPOGRAPHY.size.xxl}; // Desktop font size (original 29px)
    line-height: 1.22em;
    text-align: right; // As per original screenshot for desktop
    margin-bottom: 0;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column; // Mobile: inputs stack
  gap: ${SPACING.md};

  ${mediaQueries.md} {
    flex-direction: row; // Desktop: inputs inline with button
    justify-content: stretch;
    align-items: stretch;
    width: 100%;
    gap: ${SPACING.xl}; // Original was 42px
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1; // Allow input groups to take available space
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  padding-bottom: ${SPACING.xs};

  ${mediaQueries.sm} {
    gap: ${SPACING.xs}; // Original was 10px
  }
`;

const Input = styled.input`
  font-family: 'Rubik', sans-serif;
  font-weight: ${TYPOGRAPHY.weight.light};
  font-size: ${TYPOGRAPHY.size.lg}; // Mobile font size
  line-height: 1.5em;
  letter-spacing: 2%;
  color: rgba(0, 0, 0, 0.3);
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  padding: ${SPACING.sm} 0; // Add some padding for better touch

  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
  }

  ${mediaQueries.md} {
    font-size: ${TYPOGRAPHY.size.xl}; // Desktop font size (original 27px)
  }
`;

const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px; // Mobile height
  padding: 0 ${SPACING.lg}; // Mobile padding
  font-family: ${TYPOGRAPHY.fontFamilyRubik || 'Rubik, sans-serif'};
  font-weight: ${TYPOGRAPHY.weight.medium};
  font-size: ${TYPOGRAPHY.size.md}; // Mobile font size
  line-height: 1.4em;
  text-transform: uppercase;
  color: ${COLORS.black};
  background: transparent;
  border: 2px solid ${COLORS.gray400}; // Mobile border
  border-top: none; // Often inputs have bottom border, button can have others
  border-left: none;
  cursor: pointer;
  width: 100%; // Mobile: full width
  border-radius: 0; // Consistent with design if no border-radius

  &:hover {
    border-color: ${COLORS.gray500};
    background-color: ${COLORS.gray100};
  }

  ${mediaQueries.md} {
    min-width: 270px;
    height: 60px;
    font-size: ${TYPOGRAPHY.size.lg}; // Desktop font size (original 20px)
    border-right: 4px solid ${COLORS.gray400}; // Desktop border
    border-bottom: 4px solid ${COLORS.gray400};
    border-top: none; // Ensure these are not applied
    border-left: none;
    width: auto; // Desktop: auto width
    &:hover {
      border-right-color: ${COLORS.gray500};
      border-bottom-color: ${COLORS.gray500};
      background-color: transparent; // Original hover was only border color change
    }
  }
`;

const SubscriptionForm = ({ noOuterMargin = false }) => {
  const [formInputs, setFormInputs] = useState({
    phone: '',
    name: '',
    email: ''
  });

  const { toasts, showSuccessToast, showErrorToast, removeToast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneBlur = () => {
    setFormInputs(prev => ({ ...prev, phone: normalizePhoneNumber(prev.phone) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalized = normalizePhoneNumber(formInputs.phone);
    const emailValid = !formInputs.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formInputs.email);

    if (!isValidRussianPhone(normalized)) {
      showErrorToast('Введите корректный номер телефона в формате +7XXXXXXXXXX');
      return;
    }

    if (!emailValid) {
      showErrorToast('Введите корректный email');
      return;
    }

    try {
      const payload = {
        phone: normalized,
        name: formInputs.name.trim(),
        email: formInputs.email.trim(),
      };

      const result = await subscribeToNews(payload);

      if (result.success) {
        showSuccessToast('Спасибо! Вы подписаны на новости.');
        setFormInputs({ phone: '', name: '', email: '' });
      } else {
        const apiMessage = result?.error?.message || result?.message || 'Не удалось оформить подписку';
        showErrorToast(apiMessage);
      }
    } catch (err) {
      showErrorToast(err.message || 'Ошибка при оформлении подписки');
    }
  };

  return (
    <SubscriptionSectionWrapper $noOuterMargin={noOuterMargin}>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <SubscriptionContainer>
        <ContentWrapper>
          <SubscriptionImageContainer>
            {/* Ensure this image path is correct and accessible from public folder */}
            <img src="/images/footer/culture_logo.jpg" alt="Shop4Shoot Club" />
          </SubscriptionImageContainer>
          <div>
            <SubscriptionText>
              Вступайте в закрытое сообщество,<br />
              получайте эксклюзивные предложения и новости
            </SubscriptionText>
          </div>
        </ContentWrapper>
        
        <form onSubmit={handleSubmit}>
          <FormContainer>
            <InputGroup>
              <Input 
                type="tel" 
                placeholder="Ваш номер телефона"
                name="phone"
                value={formInputs.phone}
                onChange={handleInputChange}
                onBlur={handlePhoneBlur}
                autoComplete="tel"
                required
              />
            </InputGroup>
            
            <InputGroup>
              <Input 
                type="text" 
                placeholder="Ваше имя"
                name="name"
                value={formInputs.name}
                onChange={handleInputChange}
                autoComplete="name"
              />
            </InputGroup>
            
            <InputGroup>
              <Input 
                type="email" 
                placeholder="Ваша почта"
                name="email"
                value={formInputs.email}
                onChange={handleInputChange}
                autoComplete="email"
              />
            </InputGroup>
            
            <SubmitButton type="submit">
              подать заявку
            </SubmitButton>
          </FormContainer>
        </form>
      </SubscriptionContainer>
    </SubscriptionSectionWrapper>
  );
};

export default SubscriptionForm; 