// Utilitário para gerenciar cores da marca (White Label)
export class BrandColors {

    static defaultColors = {
      primary: '#0c004c',
      secondary: '#5d0b62',
      accent: '#fd95ff',
      tertiary: '#000000'
    };
    
    // Obter cores do localStorage, .env ou usar padrão
    static getBrandColors() {
      const storedColors = JSON.parse(localStorage.getItem('brandColors')) || {};
      const layoutColors = JSON.parse(localStorage.getItem('layoutColors')) || {};
      const envPrimary = import.meta.env.VITE_BRAND_PRIMARY_COLOR;
      const envSecondary = import.meta.env.VITE_BRAND_SECONDARY_COLOR;
      const envAccent = import.meta.env.VITE_BRAND_ACCENT_COLOR;
      const envTertiary = import.meta.env.VITE_BRAND_TERTIARY_COLOR;
      
      return {
        primary: layoutColors.COR_PRIMARIA || storedColors.primary || envPrimary || this.defaultColors.primary,
        secondary: layoutColors.COR_SECUNDARIA || storedColors.secondary || envSecondary || this.defaultColors.secondary,
        accent: layoutColors.COR_ACENTO || storedColors.accent || envAccent || this.defaultColors.accent,
        tertiary: layoutColors.COR_TERCIARIA || storedColors.tertiary || envTertiary || this.defaultColors.tertiary
      };
    }

    // Salvar e aplicar novas cores
    static setBrandColors(colors) {
        localStorage.setItem('brandColors', JSON.stringify(colors));
        this.applyBrandColors();
    }

    // Gerar variações de cores baseadas na cor primária
    static generateColorVariations(primaryColor) {
      // Função auxiliar para converter hex para RGB
      const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
      };

      // Função auxiliar para converter RGB para hex
      const rgbToHex = (r, g, b) => {
        const toHex = (n) => {
          const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      };

      // Função para ajustar luminosidade mantendo a saturação
      const adjustBrightness = (color, factor) => {
        const [r, g, b] = hexToRgb(color);
        
        // Calcular o brilho atual
        const brightness = Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b);
        
        // Ajustar cada canal proporcionalmente
        const newR = r + (255 - r) * factor;
        const newG = g + (255 - g) * factor;
        const newB = b + (255 - b) * factor;
        
        return rgbToHex(newR, newG, newB);
      };

      // Função para escurecer mantendo a saturação
      const adjustDarkness = (color, factor) => {
        const [r, g, b] = hexToRgb(color);
        
        // Ajustar cada canal proporcionalmente para escurecer
        const newR = r * (1 - factor);
        const newG = g * (1 - factor);
        const newB = b * (1 - factor);
        
        return rgbToHex(newR, newG, newB);
      };

      // Calcular o brilho da cor original
      const [r, g, b] = hexToRgb(primaryColor);
      const brightness = Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b);
      const isDark = brightness < 128;
      
      return {
        '--primaria': primaryColor,
        '--vermilion-50': isDark ? adjustBrightness(primaryColor, 0.95) : adjustDarkness(primaryColor, 0.05),
        '--vermilion-100': isDark ? adjustBrightness(primaryColor, 0.90) : adjustDarkness(primaryColor, 0.10),
        '--vermilion-200': isDark ? adjustBrightness(primaryColor, 0.80) : adjustDarkness(primaryColor, 0.20),
        '--vermilion-300': isDark ? adjustBrightness(primaryColor, 0.70) : adjustDarkness(primaryColor, 0.30),
        '--vermilion-400': isDark ? adjustBrightness(primaryColor, 0.60) : adjustDarkness(primaryColor, 0.40),
        '--vermilion-500': isDark ? adjustBrightness(primaryColor, 0.50) : adjustDarkness(primaryColor, 0.50),
        '--vermilion-600': isDark ? adjustBrightness(primaryColor, 0.40) : adjustDarkness(primaryColor, 0.60),
        '--vermilion-700': isDark ? adjustBrightness(primaryColor, 0.30) : adjustDarkness(primaryColor, 0.70),
        '--vermilion-800': isDark ? adjustBrightness(primaryColor, 0.20) : adjustDarkness(primaryColor, 0.80),
        '--vermilion-900': isDark ? adjustBrightness(primaryColor, 0.10) : adjustDarkness(primaryColor, 0.90),
        '--vermilion-950': isDark ? adjustBrightness(primaryColor, 0.05) : adjustDarkness(primaryColor, 0.95),
        '--secundaria-50': isDark ? adjustBrightness(primaryColor, 0.95) : adjustDarkness(primaryColor, 0.05),
        '--secundaria-100': isDark ? adjustBrightness(primaryColor, 0.90) : adjustDarkness(primaryColor, 0.10),
        '--secundaria-200': isDark ? adjustBrightness(primaryColor, 0.80) : adjustDarkness(primaryColor, 0.20),
        '--secundaria-300': isDark ? adjustBrightness(primaryColor, 0.70) : adjustDarkness(primaryColor, 0.30),
        '--secundaria-400': isDark ? adjustBrightness(primaryColor, 0.60) : adjustDarkness(primaryColor, 0.40),
        '--secundaria-500': isDark ? adjustBrightness(primaryColor, 0.50) : adjustDarkness(primaryColor, 0.50),
        '--secundaria-600': isDark ? adjustBrightness(primaryColor, 0.40) : adjustDarkness(primaryColor, 0.60),
        '--secundaria-700': isDark ? adjustBrightness(primaryColor, 0.30) : adjustDarkness(primaryColor, 0.70),
        '--secundaria-800': isDark ? adjustBrightness(primaryColor, 0.20) : adjustDarkness(primaryColor, 0.80),
        '--secundaria-900': isDark ? adjustBrightness(primaryColor, 0.10) : adjustDarkness(primaryColor, 0.90),
        '--secundaria-950': isDark ? adjustBrightness(primaryColor, 0.05) : adjustDarkness(primaryColor, 0.95),
      };
    }
  
    // Aplicar cores da marca dinamicamente (para mudanças em runtime)
    static applyBrandColors() {
      // Verificar se o DOM está pronto
      if (typeof document === 'undefined') {
        return;
      }

      const brandColors = this.getBrandColors();
      const colorVariations = this.generateColorVariations(brandColors.primary);
      
      const root = document.documentElement;
      
      // Aplicar cores primárias e suas variações
      Object.entries(colorVariations).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
      
      // Aplicar cores secundárias
      root.style.setProperty('--gradient-secundaria', brandColors.secondary);
      root.style.setProperty('--secundaria', brandColors.accent);
      root.style.setProperty('--terciaria', brandColors.tertiary);

      // Log apenas em desenvolvimento
      if (import.meta.env.DEV) {
        console.log('🎨 Cores da marca aplicadas:', {
          primary: brandColors.primary,
          secondary: brandColors.secondary,
          accent: brandColors.accent,
          tertiary: brandColors.tertiary
        });
        console.log('🎨 Variações geradas:', colorVariations);
      }
    }

    // Aplicar cores da marca quando o DOM estiver pronto
    static applyBrandColorsWhenReady() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.applyBrandColors();
        });
      } else {
        this.applyBrandColors();
      }
    }

    // Obter logo da marca
    static getPoweredByLogo() {
      const layoutColors = JSON.parse(localStorage.getItem('layoutColors')) || {};
      return layoutColors.LOGO_POWERED_BY || import.meta.env.VITE_BRAND_LOGO_POWERED_BY || '/imagens/powered_by.png';
    }

    // Obter logo da marca
    static getBrandLogo() {
      const layoutColors = JSON.parse(localStorage.getItem('layoutColors')) || {};
      const storedLogo = localStorage.getItem('brandLogo');
      return storedLogo || layoutColors.LOGO_URL || import.meta.env.VITE_BRAND_LOGO_URL || '/imagens/logo.png';
    }

    static getLoadingLogo() {
      const layoutColors = JSON.parse(localStorage.getItem('layoutColors')) || {};
      return layoutColors.LOGO_LOADING || import.meta.env.VITE_BRAND_LOGO_LOADING || '/imagens/loading.png';
    }

    // Salvar logo da marca
    static setBrandLogo(logoUrl) {
      console.log('🔄 setBrandLogo chamado com:', logoUrl);
        if (logoUrl) {
            localStorage.setItem('brandLogo', logoUrl);
            
            // Atualizar também nos layoutColors
            const currentLayout = JSON.parse(localStorage.getItem('layoutColors')) || {};
            const updatedLayout = {
                ...currentLayout,
                LOGO_URL: logoUrl
            };
            localStorage.setItem('layoutColors', JSON.stringify(updatedLayout));
        } else {
            localStorage.removeItem('brandLogo');
            
            // Remover também dos layoutColors
            const currentLayout = JSON.parse(localStorage.getItem('layoutColors')) || {};
            const updatedLayout = { ...currentLayout };
            delete updatedLayout.LOGO_URL;
            localStorage.setItem('layoutColors', JSON.stringify(updatedLayout));
        }
    }

    // Obter nome da marca
    static getBrandName() {
      const storedName = localStorage.getItem('brandName');
      const layoutColors = JSON.parse(localStorage.getItem('layoutColors')) || {};
      return storedName || layoutColors.NOME_SISTEMA || import.meta.env.VITE_BRAND_NAME || 'Dirhect';
    }

    static setBrandName(name) {
        if (name) {
            localStorage.setItem('brandName', name);
            
            // Atualizar também nos layoutColors
            const currentLayout = JSON.parse(localStorage.getItem('layoutColors')) || {};
            const updatedLayout = {
                ...currentLayout,
                NOME_SISTEMA: name
            };
            localStorage.setItem('layoutColors', JSON.stringify(updatedLayout));
        } else {
            localStorage.removeItem('brandName');
            
            // Remover também dos layoutColors
            const currentLayout = JSON.parse(localStorage.getItem('layoutColors')) || {};
            const updatedLayout = { ...currentLayout };
            delete updatedLayout.NOME_SISTEMA;
            localStorage.setItem('layoutColors', JSON.stringify(updatedLayout));
        }
    }
  
    // Verificar se está em modo white label
    static isWhiteLabel() {
      return !!(
        import.meta.env.VITE_BRAND_PRIMARY_COLOR ||
        import.meta.env.VITE_BRAND_SECONDARY_COLOR ||
        import.meta.env.VITE_BRAND_ACCENT_COLOR ||
        import.meta.env.VITE_BRAND_LOGO_URL ||
        import.meta.env.VITE_BRAND_NAME
      );
    }

    // Obter URL base do favicon
    static getBrandFaviconBaseUrl() {
        const layoutColors = JSON.parse(localStorage.getItem('layoutColors')) || {};
        return layoutColors.FAVICON_URL || import.meta.env.VITE_BRAND_FAVICON || '/imagens/cropped-Favicon';
    }

    // Limpar dados do layout
    static clearLayoutData() {
        localStorage.removeItem('layoutColors');
    }

    // Salvar dados do layout
    static setLayoutData(layoutData) {
        localStorage.setItem('layoutColors', JSON.stringify(layoutData));
        // Aplicar as cores automaticamente
        this.applyBrandColors();
    }

    // Atualizar layoutColors após confirmar alterações
    static updateLayoutColors(newColors, newName, newLogo) {
        const currentLayout = JSON.parse(localStorage.getItem('layoutColors')) || {};
        
        const updatedLayout = {
            ...currentLayout,
            COR_PRIMARIA: newColors.primary,
            COR_SECUNDARIA: newColors.secondary,
            COR_ACENTO: newColors.accent,
            COR_TERCIARIA: newColors.tertiary,
            NOME_SISTEMA: newName,
            LOGO_URL: newLogo || currentLayout.LOGO_URL
        };

        localStorage.setItem('layoutColors', JSON.stringify(updatedLayout));
        // Aplicar as cores automaticamente
        this.applyBrandColors();
    }
  }
  
  export default BrandColors; 