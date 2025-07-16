import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import { styled } from 'styled-components';
import { useState } from 'react';
import brFlag from '@assets/br.svg';
import usFlag from '@assets/us.svg';

const StyledDropdown = styled(Dropdown)`
  .p-dropdown {
    border: none;
    background: transparent;
  }

  .p-dropdown-label {
    display: flex;
    align-items: center;
    padding: 0.5rem;
  }

  .p-dropdown-trigger {
    width: 2rem;
  }

  .p-dropdown-item {
    display: flex;
    align-items: center;
  }

  img.flag {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    border-radius: 50%;
    object-fit: cover;
    background-size: cover;
  }

  .flag-emoji {
    font-size: 20px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }

  &.p-dropdown {
    border: none;
    background: transparent;
  }

  .p-dropdown-panel {
    .p-dropdown-items {
      padding: 0.5rem;

      .p-dropdown-item {
        img.flag {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .flag-emoji {
          font-size: 20px;
          margin-right: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }
      }
    }
  }
`;

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [imageErrors, setImageErrors] = useState({});
  
  const languages = [
    { code: 'en', name: 'English', flag: usFlag, emoji: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: brFlag, emoji: '🇧🇷' },
  ];
  
  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  const handleImageError = (code) => {
    setImageErrors(prev => ({ ...prev, [code]: true }));
  };

  const selectedLanguageTemplate = (option) => {
    if (option) {
      const showEmoji = imageErrors[option.code];
      
      return (
        <div className="flex align-items-center">
          {showEmoji ? (
            <span className="flag-emoji">{option.emoji}</span>
          ) : (
            <img 
              alt={option.name} 
              src={option.flag}
              className={`flag flag-${option.code}`}
              style={{ background: '#fff', border: '1px solid #eee', width: 24, height: 24, objectFit: 'contain', borderRadius: '50%' }}
              onError={() => handleImageError(option.code)}
            />
          )}
        </div>
      );
    }
    return <span>Idioma</span>;
  };

  const languageOptionTemplate = (option) => {
    const showEmoji = imageErrors[option.code];
    
    return (
      <div className="flex align-items-center">
        {showEmoji ? (
          <span className="flag-emoji">{option.emoji}</span>
        ) : (
          <img 
            alt={option.name} 
            src={option.flag}
            className={`flag flag-${option.code}`}
            style={{ background: '#fff', border: '1px solid #eee', width: 24, height: 24, objectFit: 'contain', borderRadius: '50%' }}
            onError={() => handleImageError(option.code)}
          />
        )}
        <span style={{ marginLeft: 8 }}>{option.name}</span>
      </div>
    );
  };
  
  return (
    <StyledDropdown
      value={languages.find(lang => lang.code === i18n.language)}
      options={languages}
      onChange={(e) => changeLanguage(e.value.code)}
      optionLabel="name"
      valueTemplate={selectedLanguageTemplate}
      itemTemplate={languageOptionTemplate}
      className="w-14rem"
    />
  );
}

export default LanguageSelector;