import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SIZES, SPACING, mediaQueries } from '../../styles/tokens';

const ContainerWrapper = styled.div`
  width: 100%;
  max-width: ${props => props.$fluid ? '100%' : SIZES.containerMaxWidth};
  margin: 0 auto;
  padding: 0 ${SPACING.lg};
  
  ${mediaQueries.lg} {
    padding: 0 ${SPACING.xl};
  }
`;

const Container = ({ children, fluid = false, as = 'div', className }) => {
  return (
    <ContainerWrapper as={as} $fluid={fluid} className={className}>
      {children}
    </ContainerWrapper>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  fluid: PropTypes.bool,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  className: PropTypes.string
};

export default Container; 