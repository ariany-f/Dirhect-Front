import { createGlobalStyle } from 'styled-components'

const EstilosGlobais = createGlobalStyle`
  :root {
      --primaria: #0c004c;
      --vermilion-50: #FFF5EC;
      --vermilion-100: #FFE8D3;
      --vermilion-200: #FFCDA5;
      --vermilion-300: #FFAA6D;
      --vermilion-400: #192a4e;
      --vermilion-500: #FF570A;
      --vermilion-600: #190742;
      --vermilion-700: #CC2702;
      --vermilion-800: #A1200B;
      --vermilion-900: #821D0C;
      --vermilion-950: #460B04;
      --secundaria: #fd95ff;
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
      --terciaria: #81EFC1;
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
html {
  line-height: 1.15; 
  -webkit-text-size-adjust: 100%;
  font-family: var(--fonte-primaria);
}
body {
  margin: 0;
  min-height: 100vh;
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
  color: var(--white);
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
  border-radius: 50px;
  padding: 8px 12px;
  & .p-tabview-title {
    color: var(--black);
    font-family: var(--fonte-primaria);
    font-size: 12px;
    font-weight: 600;
  }
}
.p-tabview .p-tabview-nav li:not(.p-highlight):not(.p-disabled):hover .p-tabview-nav-link {
  cursor: pointer;
}
.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  background-color: var(--black);
  border: none;
  color: var(--white);
  border-radius: 50px;
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
  
.Toastify__toast {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  box-shadow: 0 4px 24px 0 rgba(25, 42, 78, 0.10);
  min-width: 300px;
  max-width: 400px;
  padding: 18px 28px;
  background: #fff !important;
  align-items: center;
  display: flex;
  gap: 16px;
  border: none !important;
  border-radius: 14px;
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
  background: #fff !important;
}
.Toastify__toast--success {
  background: #fff !important;
}
.Toastify__close-button {
  color: #222 !important;
  opacity: 1 !important;
}
.Toastify__progress-bar {
  background: var(--primaria) !important;
  box-shadow: none !important;
  height: 4px !important;
  border-radius: 0 0 6px 6px;
}
`


export default EstilosGlobais