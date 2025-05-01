import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import { styled } from 'styled-components';

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
      }
    }
  }
`;

function LanguageSelector() {
  const { i18n } = useTranslation();
  
  const languages = [
    { code: 'en', name: 'English', flag: 'us' },
    { code: 'pt', name: 'Português', flag: 'br' },
  ];
  
  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  const selectedLanguageTemplate = (option) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <img 
            alt={option.name} 
            src={`https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png`}
            className={`flag flag-${option.flag}`}
          />
        </div>
      );
    }
    return <span>Idioma</span>;
  };

  const languageOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <img 
          alt={option.name} 
          src={`https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png`}
          className={`flag flag-${option.flag}`}
        />
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