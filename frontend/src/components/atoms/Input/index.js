import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { COLORS, SPACING, SIZES, TYPOGRAPHY } from '../../../styles/tokens';

const inputSizes = {
  sm: css`
    height: 32px;
    padding: ${SPACING.xs} ${SPACING.sm};
    font-size: 14px;
  `,
  md: css`
    height: 40px;
    padding: ${SPACING.sm} ${SPACING.md};
    font-size: 16px;
  `,
  lg: css`
    height: 48px;
    padding: ${SPACING.md} ${SPACING.lg};
    font-size: 18px;
  `,
};

const InputWrapper = styled.div`
  position: relative;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  display: inline-block;
`;

const StyledInput = styled.input`
  display: block;
  width: 100%;
  font-family: ${TYPOGRAPHY.fontFamily};
  color: ${COLORS.black};
  background-color: ${COLORS.white};
  border: 1px solid ${props => props.$error ? COLORS.error : COLORS.gray300};
  border-radius: ${SIZES.borderRadius.sm};
  ${props => inputSizes[props.$size || 'md']};
  
  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
  
  &:disabled {
    background-color: ${COLORS.gray100};
    border-color: ${COLORS.gray200};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${COLORS.gray400};
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${SPACING.xs};
  font-family: ${TYPOGRAPHY.fontFamily};
  font-size: 14px;
  font-weight: ${TYPOGRAPHY.weight.medium};
  color: ${COLORS.black};
`;

const ErrorMessage = styled.div`
  margin-top: ${SPACING.xs};
  font-family: ${TYPOGRAPHY.fontFamily};
  font-size: 12px;
  color: ${COLORS.error};
`;

const HelperText = styled.div`
  margin-top: ${SPACING.xs};
  font-family: ${TYPOGRAPHY.fontFamily};
  font-size: 12px;
  color: ${COLORS.gray500};
`;

const Input = forwardRef(({
  id,
  name,
  type = 'text',
  label,
  error,
  helperText,
  size = 'md',
  fullWidth = false,
  className,
  ...rest
}, ref) => {
  const inputId = id || `input-${name || Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <InputWrapper $fullWidth={fullWidth} className={className}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <StyledInput
        id={inputId}
        name={name}
        type={type}
        ref={ref}
        $size={size}
        $error={!!error}
        aria-invalid={!!error}
        {...rest}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </InputWrapper>
  );
});

Input.displayName = 'Input';

export default Input; 