import { createGlobalStyle } from 'styled-components'
import BrandColors from '@utils/brandColors'

const brandColors = BrandColors.getBrandColors();
const colorVariations = BrandColors.generateColorVariations(brandColors.primary);
const secondaryColorVariations = BrandColors.generateColorVariations(brandColors.secondary);

const EstilosGlobais = createGlobalStyle`
  :root {
      /* Cores da marca - configuráveis via .env */
      --primaria: ${colorVariations['--primaria']};
      --vermilion-50: ${colorVariations['--vermilion-50']};
      --vermilion-100: ${colorVariations['--vermilion-100']};
      --vermilion-200: ${colorVariations['--vermilion-200']};
      --vermilion-300: ${colorVariations['--vermilion-300']};
      --vermilion-400: ${colorVariations['--vermilion-400']};
      --vermilion-500: ${colorVariations['--vermilion-500']};
      --vermilion-600: ${colorVariations['--vermilion-600']};
      --vermilion-700: ${colorVariations['--vermilion-700']};
      --vermilion-800: ${colorVariations['--vermilion-800']};
      --vermilion-900: ${colorVariations['--vermilion-900']};
      --vermilion-950: ${colorVariations['--vermilion-950']};
      
      /* Cores secundárias - configuráveis via .env */
      --gradient-secundaria: ${brandColors.secondary};
      --secundaria: ${brandColors.accent};
      --secundaria-50: ${secondaryColorVariations['--secundaria-50']};
      --secundaria-100: ${secondaryColorVariations['--secundaria-100']};
      --secundaria-200: ${secondaryColorVariations['--secundaria-200']};
      --secundaria-300: ${secondaryColorVariations['--secundaria-300']};
      --secundaria-400: ${secondaryColorVariations['--secundaria-400']};
      --secundaria-500: ${secondaryColorVariations['--secundaria-500']};
      --secundaria-600: ${secondaryColorVariations['--secundaria-600']};

      --terciaria: ${brandColors.tertiary};
      
      /* Cores fixas (não mudam com a marca) */
      --astra-50: #FCFBEA;
      --astra-100: #FAF3AE;
      --astra-200: #F6EC92;
      --astra-300: #F0DA54;
      --astra-400: #EAC725;
      --astra-500: #DAAF18;
      --astra-600: #BC8912;
      --astra-700: #966312;
      --astra-800: #7D4F16;
      --astra-900: #6A4119;
      --astra-950: #3E220A;
      --green-50: #EBFEF5;
      --green-100: #CFFCE4;
      --green-200: #A4F6CE;
      --green-300: #81EFC1;
      --green-400: #2DDA97;
      --green-500: #09C07F;
      --green-600: #009C68;
      --green-700: #007D56;
      --green-800: #026346;
      --green-900: #03513A;
      --green-950: #002E22;
      --black: #1A1A1A;
      --white: #FFF;
      --neutro-50: #FAFAFA;
      --neutro-100: #F5F5F5;
      --neutro-200: #E8E8E8;
      --neutro-300: #D6D6D6;
      --neutro-400: #A5A5A5;
      --neutro-500: #757575;
      --neutro-600: #575757;
      --neutro-700: #444;
      --neutro-800: #2B2B2B;
      --neutro-900: #1C1C1C;
      --neutro-950: #0A0A0A;
      --bg-white: #FEFEFE;
      --bg-cinza: #FAFAFA;
      --alert-success: #61B96E;
      --alert-success-50: #F0FDF5;
      --alert-success-100: #E9F7EE;
      --alert-success-200: #BCF6D2;
      --alert-success-300: #88EDB1;
      --alert-success-400: #4DDB87;
      --alert-success-500: #25C265;
      --alert-success-600: #1AAA55;
      --alert-success-700: #177E41;
      --alert-success-800: #176437;
      --alert-success-900: #0B4322;
      --alert-success-950: #062D18;
      --warning: #D2AE4A;
      --warning-50: #FFFAEA;
      --warning-100: #FFFAE6;
      --warning-200: #FFE287;
      --warning-300: #FFCE48;
      --warning-400: #FFB81E;
      --warning-500: #FC9403;
      --warning-600: #DF6D00;
      --warning-700: #B94A04;
      --warning-800: #96390A;
      --warning-900: #4B3009;
      --warning-950: #471601;
      --info: #1F5FAC;
      --info-50: #F1F7FE;
      --info-100: #E9F2FB;
      --info-200: #BFD9F8;
      --info-300: #87BBF2;
      --info-400: #4899E8;
      --info-500: #1F78D1;
      --info-600: #1260B7;
      --info-700: #104C94;
      --info-800: #11427B;
      --info-900: #0B2E50;
      --info-950: #0D2444;
      --info-2: #1F5FAC;
      --info-2-50:  #EAF3FD;
      --info-2-100: #b8daf6;
      --info-2-200: #9ac9f4;
      --info-2-300: #36a2cb;
      --info-2-400: #5ea9eb;
      --info-2-500: #3d8edc;
      --info-2-600: #2a74c4;
      --info-2-700: #1F5FAC;
      --info-2-800: #184984;
      --info-2-900: #12355F;
      --info-2-950: #0D2444;
      --error: #D66161;
      --error-50: #FEF4F2;
      --error-100: #FCECE9;
      --error-200: #FFD1C9;
      --error-300: #FDB0A4;
      --error-400: #F98370;
      --error-500: #F15A42;
      --error-600: #DB3B21;
      --error-700: #BB311A;
      --error-800: #9A2C1A;
      --error-900: #691B10;
      --error-950: #461209;
      --background-label: #FCFCFC;
      --fonte-primaria: Plus Jakarta Sans;
      --fonte-secundaria: Poppins;
  }

  /* Modo Dark */
  .dark-mode {
      --black: #E5E5E5;
      --white: #2A2A2A;
      --neutro-50: #1A1A1A;
      --neutro-100: #2A2A2A;
      --neutro-200: #3A3A3A;
      --neutro-300: #4A4A4A;
      --neutro-400: #5A5A5A;
      --neutro-500: #6A6A6A;
      --neutro-600: #7A7A7A;
      --neutro-700: #8A8A8A;
      --neutro-800: #9A9A9A;
      --neutro-900: #AAAAAA;
      --neutro-950: #BABABA;
      --bg-white: #2A2A2A;
      --bg-cinza: #1A1A1A;
      --background-label: #3A3A3A;
      
      /* Ajustar cores de alerta para modo dark */
      --alert-success-50: #0A2A15;
      --alert-success-100: #0F3A1F;
      --alert-success-200: #1A4A2A;
      --alert-success-300: #1F5A3A;
      --alert-success-400: #2A6A4A;
      --alert-success-500: #2F7A5A;
      --alert-success-600: #4A8A6A;
      --alert-success-700: #6A9A7A;
      --alert-success-800: #8AAA8A;
      --alert-success-900: #AABA9A;
      --alert-success-950: #BACA9A;
      
      --warning-50: #2A1A0A;
      --warning-100: #3A2A0F;
      --warning-200: #4A3A1A;
      --warning-300: #5A4A1F;
      --warning-400: #6A5A2A;
      --warning-500: #7A6A2F;
      --warning-600: #8A7A4A;
      --warning-700: #9A8A6A;
      --warning-800: #AA9A8A;
      --warning-900: #BAAA9A;
      --warning-950: #CABA9A;
      
      --info-50: #1A2A3A;
      --info-100: #2A3A4A;
      --info-200: #3A4A5A;
      --info-300: #4A5A6A;
      --info-400: #5A6A7A;
      --info-500: #6A7A8A;
      --info-600: #7A8A9A;
      --info-700: #8A9AAA;
      --info-800: #9AAA9A;
      --info-900: #AABA9A;
      --info-950: #BACA9A;
      
      --error-50: #2A1A1A;
      --error-100: #3A2A2A;
      --error-200: #4A3A3A;
      --error-300: #5A4A4A;
      --error-400: #6A5A5A;
      --error-500: #7A6A6A;
      --error-600: #8A7A7A;
      --error-700: #9A8A8A;
      --error-800: #AA9A9A;
      --error-900: #BAAA9A;
      --error-950: #CABA9A;
  }

html {
  line-height: 1.15; 
  -webkit-text-size-adjust: 100%;
  font-family: var(--fonte-primaria);
}
body {
  margin: 0;
  min-height: 100vh;
  background-color: var(--bg-white);
  color: var(--black);
  transition: background-color 0.3s ease, color 0.3s ease;
}
main {
  display: block;
}
h1 {
  font-size: 2em;
  margin: 0.67em 0;
}
hr {
  box-sizing: content-box; 
  height: 0; 
  overflow: visible; 
}
a {
  background-color: transparent;
  text-decoration: none; 
}
abbr[title] {
  border-bottom: none; 
  text-decoration: underline; 
  text-decoration: underline dotted; 
}
b,
strong {
  font-weight: bolder;
}
code,
kbd,
samp {
  font-family: monospace, monospace; 
  font-size: 1em; 
}
small {
  font-size: 80%;
}
sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}
sub {
  bottom: -0.25em;
}
sup {
  top: -0.5em;
}
img {
  border-style: none;
}
button,
input,
optgroup,
select,
textarea {
  font-family: inherit; 
  font-size: 100%; 
  line-height: 1.15; 
  margin: 0; 
}
button,
input { 
  overflow: visible;
}
button,
select { 
  text-transform: none;
}
button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}
button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}
button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}
fieldset {
  padding: 0.35em 0.75em 0.625em;
}
legend {
  box-sizing: border-box; 
  color: inherit; 
  display: table; 
  max-width: 100%; 
  padding: 0; 
  white-space: normal; 
}
progress {
  vertical-align: baseline;
}
textarea {
  overflow: auto;
}
[type="checkbox"],
[type="radio"] {
  box-sizing: border-box; 
  padding: 0; 
}
[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}
[type="search"] {
  -webkit-appearance: textfield; 
  outline-offset: -2px; 
}
[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}
::-webkit-file-upload-button {
  -webkit-appearance: button; 
  font: inherit; 
}
details {
  display: block;
}
summary {
  display: list-item;
}
template {
  display: none;
}
[hidden] {
  display: none;
}
.p-tag-value {
  color: var(--white);
  font-weight: 400;
}
.p-highlight .p-stepper-number {
  background-color: var(--primaria);
  color: var(--secundaria);
}
.p-stepper .p-stepper-panels {
  padding: 5px 0px 0px 0px;
}
.p-stepper.p-stepper-vertical .p-stepper-panel .p-stepper-content {
  padding-top: 1rem;
}
.p-stepper .p-stepper-header:has(~ .p-highlight) .p-stepper-separator {
  background-color: var(--primaria);
}
.p-toast-message-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
.p-checkbox.p-highlight .p-checkbox-box {
  background-color: var(--primaria);
}
.p-tabview .p-tabview-nav li .p-tabview-nav-link {
  background-color: var(--neutro-300);
  color: var(--black);
  border-radius: 8px;
  padding: 8px 12px;
  & .p-tabview-title {
    color: var(--black);
    font-family: var(--fonte-primaria);
    font-size: 12px;
    font-weight: 600;
  }
}
.p-dialog-title {
  font-family: var(--fonte-secundaria);
  font-size: 18px;
  font-weight: 800;
}
.p-dialog-header {
  border-radius: 16px 16px 0 0;
}
.p-dialog-footer {
  border-radius: 0 0 16px 16px;
}
.p-dialog {
  font-family: var(--fonte-primaria);
  border-radius: 16px;
}
.p-tabview .p-tabview-nav li:not(.p-highlight):not(.p-disabled):hover .p-tabview-nav-link {
  cursor: pointer;
}
.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  background-color: var(--black);
  border: none;
  color: var(--white);
  border-radius: 8px;
  padding: 8px 12px;
  & .p-tabview-title {
    color: var(--white);
    font-family: var(--fonte-primaria);
    font-size: 12px;
    font-weight: 600;
  }
}
.p-tabview-nav{
  gap: 16px;
  border: none;
}
.p-tabview-panels {
  padding: 0px
}
.p-datatable .p-datatable-tbody>tr>td {
  border: none!important;
}
.p-datatable-tbody {
  & .p-highlight {
    & > td > div > p { 
      color: var(--info-2-500) !important;
      background-color: var(--info-2-50) !important;
      padding: 4px 6px !important;
      font-weight: 500 !important;
      border-radius: 4px !important;
    }
  }
}
.p-datatable-tbody {
  & .p-highlight {
    & > td > div > div > p > div > div { 
      color: var(--info-2-500) !important;
      background-color: var(--info-2-50) !important;
      padding: 4px 6px !important;
      font-weight: 500 !important;
      border-radius: 4px !important;
    }
  }
}
.p-radiobutton.p-highlight .p-radiobutton-box {
  background-color: var(--white);
  border-color: var(--primaria);
}
.p-inputswitch.p-highlight .p-inputswitch-slider {
  background-color: var(--primaria);
}
.p-tooltip-text	{
  color: var(--white);
}
.cursor-pointer{
  cursor: pointer;
}
.p-megamenu .p-menuitem.p-highlight > .p-menuitem-content
{
  background-color: transparent;
}

.p-multiselect-select-all .p-checkbox {
  margin-right: 10px;
}
.p-multiselect-filter-container .p-multiselect-filter-icon {
 display: none!important;
}

.p-multiselect-items .p-multiselect-checkbox {
  margin-right: 10px;
}
/* Lista de grupos */
.listaGrupos {
    width: 100%;
    margin-bottom: 20px;
    max-height: 200px;
    overflow-y: auto;
}

/* Item de grupo */
.itemGrupo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    margin-bottom: 8px;
    background-color: var(--neutro-100);
    border-radius: 4px;
    border-left: 4px solid var(--primaria);
}

.grupoInfo {
    display: flex;
    gap: 8px;
}

.grupoTipo {
    font-weight: bold;
    color: var(--primaria);
}

.botaoRemover {
    background: none;
    border: none;
    color: var(--error);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 8px;
}

/* Efeito de arrastar */
.itemGrupo:active {
    background-color: var(--neutro-200);
}
.p-scrollpanel-wrapper {
    z-index:0;
}
.p-inputtext, .p-icon-field {
  width: 100% !important;
  height: 46px !important;
  line-height: 30px !important;
}
.w-full {
  width: 100% !important;
}
.p-icon-field > .p-input-icon {
  margin-top: -0.5rem!important;
}
.text-left {
  text-align: left!important;
}

/* Classes para tags de processos/tarefas */
.tag-processo {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 400;
  color: white;
}

.tag-admissao {
  background-color: #1a73e8;
}

.tag-demissao {
  background-color: #dc3545;
}

.tag-ferias {
  background-color: #ffa000;
}

.tag-envio-variaveis {
  background-color: #28a745;
}

.tag-adiantamento {
  background-color: #f39c12;
}

.tag-encargos {
  background-color: #27ae60;
}

.tag-folha {
  background-color: #9b59b6;
}

.tag-generico {
  background-color: #666;
}

/* Estilos para dashboard cards */
.dashboard-rh-card {
    background-color: var(--bg-white);
    border: 1px solid var(--neutro-200);
    border-radius: 8px;
    padding: 16px;
    transition: all 0.3s ease;
}

.dark-mode .dashboard-rh-card {
    background-color: var(--neutro-100);
    border-color: var(--neutro-300);
}
  
.Toastify__toast {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  box-shadow: 0 4px 24px 0 rgba(25, 42, 78, 0.10);
  min-width: 300px;
  max-width: 400px;
  padding: 18px 28px;
  background: var(--bg-white) !important;
  align-items: center;
  display: flex;
  gap: 16px;
  border: none !important;
  border-radius: 14px;
  color: var(--black);
}
@media (min-width: 1024px) {
  .Toastify__toast {
    min-width: 400px;
    max-width: 520px;
    font-size: 1.1rem;
    padding: 26px 40px;
  }
}
.Toastify__toast--error {
  background: var(--bg-white) !important;
}
.Toastify__toast--success {
  background: var(--bg-white) !important;
}
.Toastify__close-button {
  color: var(--black) !important;
  opacity: 1 !important;
}
.Toastify__progress-bar {
  background: var(--primaria) !important;
  box-shadow: none !important;
  height: 4px !important;
  border-radius: 0 0 6px 6px;
}
[data-pc-section="sort"] svg *, .p-column-filter-menu-button.p-link svg * {
  fill: var(--primaria) !important;
}
  
[data-pc-section="sort"] svg, .p-column-filter-menu-button.p-link svg {
  margin-left: 2px !important;
}

/* Estilos para cabeçalho no modo dark */
.dark-mode header {
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2) !important;
}

/* Garantir que o sidebar nunca mude de cor */
.sidebar, .barra-lateral, [class*="sidebar"], [class*="BarraLateral"] {
    background-color: var(--primaria) !important;
    color: var(--secundaria) !important;
}

.dark-mode .sidebar, 
.dark-mode .barra-lateral, 
.dark-mode [class*="sidebar"], 
.dark-mode [class*="BarraLateral"] {
    background-color: var(--primaria) !important;
    color: var(--secundaria) !important;
}
`

export default EstilosGlobais