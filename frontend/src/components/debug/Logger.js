import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING } from '../../styles/tokens';

const LoggerContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 500px;
  max-height: 400px;
  overflow: auto;
  padding: ${SPACING.lg};
  background-color: rgba(0, 0, 0, 0.85);
  color: ${COLORS.white};
  border-radius: 8px;
  font-family: monospace;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(calc(100% - 40px))'};
`;

const LoggerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${SPACING.md};
  cursor: pointer;
`;

const LoggerTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: ${TYPOGRAPHY.weight.bold};
  color: ${COLORS.white};
`;

const LoggerBody = styled.div`
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const LoggerSection = styled.div`
  margin-bottom: ${SPACING.lg};
`;

const LoggerSectionTitle = styled.h4`
  margin: 0 0 ${SPACING.sm} 0;
  color: ${COLORS.primary};
  font-size: 14px;
`;

const LogEntry = styled.div`
  margin-bottom: 4px;
  display: flex;
`;

const LogLabel = styled.span`
  color: ${COLORS.gray400};
  margin-right: ${SPACING.sm};
  min-width: 120px;
  flex-shrink: 0;
`;

const LogValue = styled.span`
  color: ${props => props.$color || COLORS.white};
  word-break: break-word;
`;

const NodeButton = styled.button`
  background-color: ${COLORS.primary};
  color: white;
  border: none;
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: ${SPACING.sm};
  margin-top: ${SPACING.sm};
  
  &:hover {
    background-color: ${COLORS.primaryHover};
  }
`;

/**
 * Компонент для отображения отладочной информации
 */
const Logger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [browserInfo, setBrowserInfo] = useState({});
  const [nodeVersion, setNodeVersion] = useState('');
  
  useEffect(() => {
    const detectBrowser = () => {
      if (typeof window !== 'undefined') {
        const { userAgent } = navigator;
        setBrowserInfo({
          userAgent,
          width: window.innerWidth,
          height: window.innerHeight,
          pixelRatio: window.devicePixelRatio,
          language: navigator.language,
        });
      }
    };
    
    detectBrowser();
    
    try {
      const nodeVersionMatch = process.version?.match(/v(\d+\.\d+\.\d+)/);
      setNodeVersion(nodeVersionMatch ? nodeVersionMatch[1] : 'Unknown');
    } catch (error) {
      setNodeVersion('Error detecting Node.js version');
    }
    
    // Обновление размера окна при ресайзе
    window.addEventListener('resize', () => {
      if (typeof window !== 'undefined') {
        setBrowserInfo(prev => ({
          ...prev,
          width: window.innerWidth,
          height: window.innerHeight,
        }));
      }
    });
    
    // Раскрыть автоматически при запуске в режиме разработки
    if (process.env.NODE_ENV === 'development') {
      setIsOpen(true);
    }
  }, []);
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Скопировано в буфер обмена');
      })
      .catch(err => {
        console.error('Ошибка при копировании в буфер обмена:', err);
      });
  };
  
  return (
    <LoggerContainer $isOpen={isOpen}>
      <LoggerHeader onClick={() => setIsOpen(!isOpen)}>
        <LoggerTitle>
          Debug Info {isOpen ? '▼' : '▲'}
        </LoggerTitle>
      </LoggerHeader>
      
      <LoggerBody $isOpen={isOpen}>
        <LoggerSection>
          <LoggerSectionTitle>React & Next.js</LoggerSectionTitle>
          <LogEntry>
            <LogLabel>React:</LogLabel>
            <LogValue>{React.version}</LogValue>
          </LogEntry>
          <LogEntry>
            <LogLabel>Next.js:</LogLabel>
            <LogValue>
              {process.env.NEXT_PUBLIC_VERSION || 'Unknown'}
            </LogValue>
          </LogEntry>
          <LogEntry>
            <LogLabel>Build mode:</LogLabel>
            <LogValue $color={process.env.NODE_ENV === 'production' ? COLORS.error : COLORS.success}>
              {process.env.NODE_ENV}
            </LogValue>
          </LogEntry>
          <LogEntry>
            <LogLabel>Node.js:</LogLabel>
            <LogValue>{nodeVersion}</LogValue>
          </LogEntry>
        </LoggerSection>
        
        <LoggerSection>
          <LoggerSectionTitle>Browser</LoggerSectionTitle>
          <LogEntry>
            <LogLabel>Window:</LogLabel>
            <LogValue>{browserInfo.width}x{browserInfo.height} (Pixel Ratio: {browserInfo.pixelRatio})</LogValue>
          </LogEntry>
          <LogEntry>
            <LogLabel>Language:</LogLabel>
            <LogValue>{browserInfo.language}</LogValue>
          </LogEntry>
          <LogEntry>
            <LogLabel>User Agent:</LogLabel>
            <LogValue style={{ fontSize: '10px' }}>{browserInfo.userAgent}</LogValue>
          </LogEntry>
        </LoggerSection>
        
        <NodeButton onClick={() => copyToClipboard(JSON.stringify({
          react: React.version,
          nextjs: process.env.NEXT_PUBLIC_VERSION || 'Unknown',
          nodeEnv: process.env.NODE_ENV,
          nodeVersion,
          browser: browserInfo
        }, null, 2))}>
          Copy All Debug Info
        </NodeButton>
      </LoggerBody>
    </LoggerContainer>
  );
};

export default Logger; 