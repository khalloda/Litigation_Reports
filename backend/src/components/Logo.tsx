/**
 * Logo Component
 *
 * Displays Sarieldin and Partners law firm logo with proper branding.
 */

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'primary' | 'white' | 'dark';
  type?: 'full' | 'emblem' | 'stamp';
  language?: 'ar' | 'en' | 'both';
}

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  variant = 'primary',
  type = 'full',
  language = 'both',
}) => {
  const sizeMap = {
    sm: { width: 40, height: 40, fontSize: '0.875rem', logoHeight: 30 },
    md: { width: 60, height: 60, fontSize: '1rem', logoHeight: 45 },
    lg: { width: 80, height: 80, fontSize: '1.25rem', logoHeight: 60 },
  };

  const colorMap = {
    primary: { bg: '#2c5530', color: '#ffd700', border: '#ffd700' },
    white: { bg: '#ffffff', color: '#2c5530', border: '#2c5530' },
    dark: { bg: '#2c5530', color: '#ffffff', border: '#ffffff' },
  };

  const styles = sizeMap[size];
  const colors = colorMap[variant];

  // Determine which logo image to use
  const getLogoSrc = () => {
    if (type === 'emblem') return '/assets/logos/emblem_green_gold.png';
    if (type === 'stamp') return '/assets/logos/stamp_green_gold.png';

    // For full logos, prefer Arabic but can show English
    if (language === 'en') return '/assets/logos/english_green_gold_logo.png';
    return '/assets/logos/arabic_green_gold_logo.png';
  };

  const logoSrc = getLogoSrc();

  // For full logos with text, show just the logo image
  if (type === 'full') {
    return (
      <div className='d-flex align-items-center justify-content-center'>
        <img
          src={logoSrc}
          alt='سري الدين وشركاه - للاستشارات القانونية - Sarieldin and Partners - Legal Advisors'
          style={{ height: styles.logoHeight, width: 'auto' }}
          className='img-fluid'
        />
      </div>
    );
  }

  // For emblems and stamps, show with optional text
  return (
    <div className='d-flex align-items-center justify-content-center'>
      {/* Logo Emblem/Stamp */}
      <div className='me-2'>
        <img
          src={logoSrc}
          alt='شعار سري الدين وشركاه - Sarieldin and Partners Logo'
          width={styles.width}
          height={styles.height}
          className='img-fluid'
        />
      </div>

      {/* Logo Text */}
      {showText && (
        <div className='text-start'>
          <div
            className='fw-bold mb-0'
            style={{
              color: colors.color === '#ffffff' ? colors.color : colors.bg,
              fontSize: styles.fontSize,
              lineHeight: 1.2,
            }}
          >
            سري الدين وشركاه
          </div>
          <div className='small text-muted' style={{ fontSize: `calc(${styles.fontSize} * 0.8)` }}>
            للاستشارات القانونية
          </div>
          <div
            className='small text-muted'
            style={{ fontSize: `calc(${styles.fontSize} * 0.75)`, fontStyle: 'italic' }}
          >
            Sarieldin and Partners - Legal Advisors
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
