// Utilitário para gerenciar cores da marca (White Label)
export class BrandColors {

    static defaultColors = {
      primary: '#0c004c',
      secondary: '#5d0b62',
      accent: '#fd95ff'
    };
    
    // Obter cores do .env ou usar padrão
    static getBrandColors() {
      const envPrimary = import.meta.env.VITE_BRAND_PRIMARY_COLOR;
      const envSecondary = import.meta.env.VITE_BRAND_SECONDARY_COLOR;
      const envAccent = import.meta.env.VITE_BRAND_ACCENT_COLOR;
      
      return {
        primary: envPrimary || this.defaultColors.primary,
        secondary: envSecondary || this.defaultColors.secondary,
        accent: envAccent || this.defaultColors.accent
      };
    }
  
    // Gerar variações de cores baseadas na cor primária
    static generateColorVariations(primaryColor) {
      // Função auxiliar para converter hex para HSL
      const hexToHsl = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
  
        if (max === min) {
          h = s = 0;
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        return [h * 360, s * 100, l * 100];
      };
  
      // Função auxiliar para converter HSL para hex
      const hslToHex = (h, s, l) => {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
          const k = (n + h / 30) % 12;
          const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
          return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
      };
  
      const [h, s, l] = hexToHsl(primaryColor);
      
      return {
        '--primaria': primaryColor,
        '--vermilion-50': hslToHex(h, s, 98),
        '--vermilion-100': hslToHex(h, s, 92),
        '--vermilion-200': hslToHex(h, s, 85),
        '--vermilion-300': hslToHex(h, s, 75),
        '--vermilion-400': hslToHex(h, s, 65),
        '--vermilion-500': hslToHex(h, s, 55),
        '--vermilion-600': hslToHex(h, s, 45),
        '--vermilion-700': hslToHex(h, s, 35),
        '--vermilion-800': hslToHex(h, s, 25),
        '--vermilion-900': hslToHex(h, s, 15),
        '--vermilion-950': hslToHex(h, s, 8),
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

      // Log apenas em desenvolvimento
      if (import.meta.env.DEV) {
        console.log('🎨 Cores da marca aplicadas:', {
          primary: brandColors.primary,
          secondary: brandColors.secondary,
          accent: brandColors.accent
        });
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
    static getBrandLogo() {
      return import.meta.env.VITE_BRAND_LOGO_URL || '/imagens/logo.png';
    }
  
    // Obter nome da marca
    static getBrandName() {
      return import.meta.env.VITE_BRAND_NAME || 'Dirhect';
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
  }
  
  export default BrandColors; 