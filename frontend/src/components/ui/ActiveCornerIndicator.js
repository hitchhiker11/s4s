import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COLORS } from '../../styles/tokens';

const CornerWrapper = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  overflow: hidden;
`;

const CornerShape = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => props.$color || COLORS.primary};
  clip-path: polygon(0 0, 100% 0, 100% 0, 50% 100%, 0 0);
`;

const ActiveCornerIndicator = ({ color }) => {
  return (
    <CornerWrapper>
      <CornerShape $color={color} />
    </CornerWrapper>
  );
};

ActiveCornerIndicator.propTypes = {
  color: PropTypes.string
};

export default ActiveCornerIndicator; 