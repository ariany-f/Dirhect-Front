# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# 🎨 Sistema White Label

Este documento explica como configurar e usar o sistema white label da aplicação.

## 📋 Variáveis de Ambiente

Para personalizar a marca, configure as seguintes variáveis no arquivo `.env`:

```env
# Cores da marca (formato hexadecimal)
VITE_BRAND_PRIMARY_COLOR=#0c004c
VITE_BRAND_SECONDARY_COLOR=#5d0b62
VITE_BRAND_ACCENT_COLOR=#fd95ff

# Logo da marca (URL ou caminho local)
VITE_BRAND_LOGO_URL=/imagens/logo.png

# Nome da marca
VITE_BRAND_NAME=Dirhect
```

## 🎯 Como Funciona

### 1. **Cores Primárias**
- `VITE_BRAND_PRIMARY_COLOR`: Cor principal da marca
- O sistema gera automaticamente 12 variações desta cor (vermilion-50 até vermilion-950)
- Todas as variações mantêm o mesmo matiz e saturação, apenas alterando a luminosidade

### 2. **Cores Secundárias**
- `VITE_BRAND_SECONDARY_COLOR`: Cor secundária (usada em gradientes)
- `VITE_BRAND_ACCENT_COLOR`: Cor de destaque/accent

### 3. **Logo e Nome**
- `VITE_BRAND_LOGO_URL`: URL ou caminho para o logo da marca
- `VITE_BRAND_NAME`: Nome da marca (usado em títulos, etc.)

## 🔧 Exemplos de Configuração

### Empresa Azul
```env
VITE_BRAND_PRIMARY_COLOR=#1e40af
VITE_BRAND_SECONDARY_COLOR=#3b82f6
VITE_BRAND_ACCENT_COLOR=#60a5fa
VITE_BRAND_LOGO_URL=https://exemplo.com/logo.png
VITE_BRAND_NAME=Minha Empresa
```

### Empresa Verde
```env
VITE_BRAND_PRIMARY_COLOR=#059669
VITE_BRAND_SECONDARY_COLOR=#10b981
VITE_BRAND_ACCENT_COLOR=#34d399
VITE_BRAND_LOGO_URL=/imagens/logo-verde.png
VITE_BRAND_NAME=Empresa Verde
```

### Empresa Vermelha
```env
VITE_BRAND_PRIMARY_COLOR=#dc2626
VITE_BRAND_SECONDARY_COLOR=#ef4444
VITE_BRAND_ACCENT_COLOR=#f87171
VITE_BRAND_LOGO_URL=https://cdn.exemplo.com/logo-vermelho.png
VITE_BRAND_NAME=Empresa Vermelha
```

## 🛠️ Uso no Código

### 1. **Usando o Utilitário BrandColors**

```javascript
import BrandColors from '@utils/brandColors'

// Obter cores da marca
const colors = BrandColors.getBrandColors()
console.log(colors.primary) // #1e40af

// Obter logo da marca
const logo = BrandColors.getBrandLogo()
console.log(logo) // https://exemplo.com/logo.png

// Obter nome da marca
const name = BrandColors.getBrandName()
console.log(name) // Minha Empresa

// Verificar se está em modo white label
const isWhiteLabel = BrandColors.isWhiteLabel()
console.log(isWhiteLabel) // true

// Aplicar cores dinamicamente (para mudanças em runtime)
BrandColors.applyBrandColors()
```

### 2. **Usando CSS Variables**

```css
/* As cores são automaticamente aplicadas como CSS variables */
.my-component {
  background-color: var(--primaria);
  color: var(--secundaria);
  border: 1px solid var(--vermilion-300);
}
```

### 3. **Usando em Componentes Styled**

```javascript
import styled from 'styled-components'

const StyledButton = styled.button`
  background-color: var(--primaria);
  color: var(--white);
  
  &:hover {
    background-color: var(--vermilion-600);
  }
`
```

## 📱 Componentes que Usam o Sistema

### 1. **BarraLateral**
- Background: `var(--primaria)` até `var(--gradient-secundaria)`
- Logo: `BrandColors.getBrandLogo()`

### 2. **Cabecalho**
- Logo: `BrandColors.getBrandLogo()`
- Nome da empresa: `BrandColors.getBrandName()`

### 3. **Stepper (PrimeReact)**
- Cor ativa: `var(--primaria)`
- Separadores: `var(--primaria)`

### 4. **Botões**
- Botões primários: `var(--primaria)`
- Botões secundários: `var(--secundaria)`

## 🔄 Mudanças Dinâmicas

Para mudar as cores em runtime (sem recarregar a página):

```javascript
import BrandColors from '@utils/brandColors'

// Mudar para uma nova cor
BrandColors.applyBrandColors()
```

## 🎨 Paleta de Cores Gerada

Para cada cor primária, o sistema gera automaticamente:

- `--vermilion-50`: Muito claro (98% luminosidade)
- `--vermilion-100`: Claro (92% luminosidade)
- `--vermilion-200`: Médio-claro (85% luminosidade)
- `--vermilion-300`: Médio (75% luminosidade)
- `--vermilion-400`: Médio-escuro (65% luminosidade)
- `--vermilion-500`: Médio (55% luminosidade)
- `--vermilion-600`: Médio-escuro (45% luminosidade)
- `--vermilion-700`: Escuro (35% luminosidade)
- `--vermilion-800`: Muito escuro (25% luminosidade)
- `--vermilion-900`: Quase preto (15% luminosidade)
- `--vermilion-950`: Quase preto (8% luminosidade)

## ⚠️ Considerações

1. **Cores Fixas**: Algumas cores (como verde, vermelho, cinza) não mudam com a marca
2. **Contraste**: Certifique-se de que as cores escolhidas tenham contraste adequado
3. **Acessibilidade**: Teste as cores com ferramentas de acessibilidade
4. **Performance**: As cores são calculadas em build time, não afetam performance

## 🚀 Deploy

Para diferentes clientes, crie diferentes arquivos `.env`:

```bash
# Cliente A
cp .env.example .env.cliente-a
# Edite .env.cliente-a com as cores do cliente A

# Cliente B  
cp .env.example .env.cliente-b
# Edite .env.cliente-b com as cores do cliente B
```

Ou use variáveis de ambiente no servidor de produção. 