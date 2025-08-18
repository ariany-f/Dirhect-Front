import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import { styled } from 'styled-components';
import { useState, useEffect } from 'react';
import brFlag from '@assets/br.svg';
import usFlag from '@assets/us.svg';
import { locale } from 'primereact/api';

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

        &:hover {
          background-color: var(--neutro-100) !important;
        }

        &.p-highlight {
          background-color: var(--primaria-50) !important;
          color: var(--primaria) !important;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .p-dropdown-trigger {
      width: .5rem;
    }
    img.flag, .flag-emoji {
      margin-right: 2px;
    }
  }
`;

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [imageErrors, setImageErrors] = useState({});
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  
  const languages = [
    { code: 'en', name: 'English', flag: usFlag, emoji: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: brFlag, emoji: '🇧🇷' },
  ];

  // Sincronizar estado local com i18n
  useEffect(() => {
    setCurrentLanguage(i18n.language);
    locale(i18n.language);
  }, [i18n.language]);
  
  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setCurrentLanguage(code);
    locale(code);
  };

  const handleImageError = (code) => {
    setImageErrors(prev => ({ ...prev, [code]: true }));
  };

  // Função para obter a linguagem atual
  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[1]; // fallback para PT
  };

  const selectedLanguageTemplate = (option) => {
    // Sempre usar a linguagem atual, não depender do option passado
    const currentLang = getCurrentLanguage();
    const showEmoji = imageErrors[currentLang.code];
    
    return (
      <div className="flex align-items-center" style={{ minWidth: '24px', minHeight: '24px', display: 'flex' }}>
        {showEmoji ? (
          <span className="flag-emoji" style={{ fontSize: '20px' }}>{currentLang.emoji}</span>
        ) : (
          <img 
            alt={currentLang.name} 
            src={currentLang.flag}
            className={`flag flag-${currentLang.code}`}
            style={{ 
              background: '#fff', 
              border: '1px solid #eee', 
              width: 24, 
              height: 24, 
              objectFit: 'contain', 
              borderRadius: '50%',
              display: 'block',
              flexShrink: 0
            }}
            onError={() => handleImageError(currentLang.code)}
            onLoad={() => {
              // Limpar erro quando a imagem carrega com sucesso
              if (imageErrors[currentLang.code]) {
                setImageErrors(prev => ({ ...prev, [currentLang.code]: false }));
              }
            }}
          />
        )}
      </div>
    );
  };

  const languageOptionTemplate = (option) => {
    const showEmoji = imageErrors[option.code];
    const isSelected = option.code === currentLanguage;
    
    return (
      <div className="flex align-items-center" style={{ 
        padding: '8px 12px',
        backgroundColor: isSelected ? 'var(--primaria-50)' : 'transparent',
        borderRadius: '4px',
        fontWeight: isSelected ? '600' : '400'
      }}>
        {showEmoji ? (
          <span className="flag-emoji">{option.emoji}</span>
        ) : (
          <img 
            alt={option.name} 
            src={option.flag}
            className={`flag flag-${option.code}`}
            style={{ 
              background: '#fff', 
              border: '1px solid #eee', 
              width: 24, 
              height: 24, 
              objectFit: 'contain', 
              borderRadius: '50%' 
            }}
            onError={() => handleImageError(option.code)}
          />
        )}
        <span style={{ 
          marginLeft: 8, 
          color: isSelected ? 'var(--primaria)' : 'inherit',
          fontWeight: isSelected ? '600' : '400'
        }}>
          {option.name}
          {isSelected && <span style={{ marginLeft: 8, fontSize: '12px', opacity: 0.7 }}>✓</span>}
        </span>
      </div>
    );
  };
  
  return (
    <StyledDropdown
      value={getCurrentLanguage()}
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