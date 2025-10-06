import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Verificar se há preferência salva no localStorage
    // const savedTheme = localStorage.getItem('theme');
    // if (savedTheme) {
    //   return savedTheme === 'dark';
    // }
    // Por padrão, sempre começar com modo light
    return false;
  });

  useEffect(() => {
    // Salvar preferência no localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Aplicar classe no body
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 