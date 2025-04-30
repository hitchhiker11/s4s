import React from 'react';
import styled from 'styled-components';
import { SPACING } from '../../../styles/tokens';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FormGroup = styled.div`
  margin-bottom: ${SPACING.md};
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: ${props => props.$align || 'flex-start'};
  gap: ${SPACING.md};
  margin-top: ${SPACING.lg};
`;

const Form = ({
  onSubmit,
  children,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  showCancel = false,
  onCancel,
  isSubmitting = false,
  buttonAlign = 'flex-start',
  ...rest
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit} {...rest}>
      {children}
      <ButtonGroup $align={buttonAlign}>
        {showCancel && (
          <Button
            variant="secondary"
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : submitLabel}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

// Helper component to create form fields
const FormField = ({
  label,
  name,
  type = 'text',
  error,
  helperText,
  ...rest
}) => (
  <FormGroup>
    <Input
      label={label}
      name={name}
      type={type}
      error={error}
      helperText={helperText}
      fullWidth
      {...rest}
    />
  </FormGroup>
);

Form.Field = FormField;

export default Form; 