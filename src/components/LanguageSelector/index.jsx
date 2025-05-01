import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';

function LanguageSelector() {
  const { i18n } = useTranslation();
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' },
  ];
  
  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    // Atualizar locale do PrimeReact
    locale(code);
  };
  
  return (
    <Dropdown
      value={i18n.language}
      options={languages}
      onChange={(e) => changeLanguage(e.value)}
      optionLabel="name"
      optionValue="code"
      placeholder="Idioma"
    />
  );
}

export default LanguageSelector;