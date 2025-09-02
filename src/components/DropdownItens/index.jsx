import { useState } from 'react'
import styles from './DropdownItens.module.css'
import styled, { createGlobalStyle } from 'styled-components'
import * as Yup from 'yup'
import {Dropdown} from 'primereact/dropdown'
import { useTranslation } from 'react-i18next'

const GlobalPanelStyle = createGlobalStyle`
    .dropdown-panel-wrapping {
        max-width: 550px;
    }
    .dropdown-panel-wrapping .p-dropdown-item,
    .dropdown-panel-wrapping .p-dropdown-item span {
        white-space: normal !important;
        word-break: break-word !important;
    }
`

const Select = styled(Dropdown)`
    border-radius: 4px;
    border: 1px solid var(--neutro-400);
    background: var(--background-label);
    padding: 12px 16px;
    outline: none;
    display: flex;
    align-items: center;
    text-align: left;
    align-self: stretch;
    font-weight: 700;
    font-size: 14px;
    width: ${ props => props.$width ?  props.$width : '100%' };
    height: ${ props => props.$height ?  props.$height : '46px' };
    max-width: ${ props => props.$maxWidth ?  props.$maxWidth : '100%' };
    margin-bottom: ${ props => props.$margin ?  props.$margin : '0px' };
    ${props => props.$hasError && `
        border: 1px solid #dc2626;
        outline: none;
    `}

    & .p-dropdown-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }



    ~ .icon {
        box-sizing: initial;
        bottom: 22px;
        cursor: pointer;
        position: absolute;
        fill: var(--neutro-600);
    }

    & ~.icon.start {
        left: 16px;
    }
    & ~.icon.end {
        right: 16px;
    }

    &[type=email],
    &[type=search] {
        padding-left: 50px;
    }

    &::placeholder {
        color: var(--neutro-200);
        font-feature-settings: 'clig' off, 'liga' off;
        font-family: var(--font-secondaria);
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
    }
    
    &::-ms-input-placeholder {
        color: var(--neutro-200);
        font-feature-settings: 'clig' off, 'liga' off;
        font-family: var(--font-secondaria);
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
    }

    &:active {
        border-color: var(--primaria);
        background: var(--white);
    }

    &:focus {
        border-color: var(--primaria);
        background: var(--white);
    }

    /* Esconde o ícone de dropdown quando há valor selecionado */
    &.p-dropdown-has-value .p-dropdown-trigger {
        opacity: 0 !important;
        pointer-events: none !important;
        visibility: hidden !important;
    }

    /* Esconde o ícone de dropdown quando há botão de limpar visível */
    & .p-dropdown-clear-icon ~ .p-dropdown-trigger {
        opacity: 0 !important;
        pointer-events: none !important;
        visibility: hidden !important;
    }
    & .p-dropdown-filter-container .p-dropdown-filter.p-inputtext {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Ajusta a posição do botão de limpar */
    & .p-dropdown-clear-icon {
        top: 55% !important;
        transform: translateY(-50%) !important;
    }

    & .p-dropdown-filter-icon {
        top: 35%;
    }
`

function DropdownItens({ 
    valor, 
    setValor, 
    options = [], 
    placeholder, 
    name, 
    $width,
    $height,
    label, 
    $margin,
    filter = false,
    camposVazios = [],
    optionTemplate, // Nova prop para o template personalizado
    disabled = false, // Adiciona a prop disabled
    allowClear = false, // Adiciona a prop allowClear
    required = false, // Adiciona a prop required
    onFilter,
    emptyFilterMessage,
    emptyMessage,
    optionLabel = "name" // Adiciona prop para customizar o campo de label
}) {

    const { t } = useTranslation('common')
    const [erro, setErro] = useState('')
    const classeCampoVazio = camposVazios.filter((val) => {
        return val === name
    })
    


    const validationSchema = Yup.object().shape({})

    function changeValor(evento) {
        const valorCampo = evento.value // Alterado para evento.value (PrimeReact usa value em vez de target.value)

        setValor(valorCampo)

        const CampoObject = {
            [name]: valorCampo
        }

        validationSchema
            .validate(CampoObject, { abortEarly: false })
            .then(valid => {
                if(!!valid) {
                    document.getElementById(name).classList.remove('error')
                    setErro('')
                }
            })
            .catch(function (erro) {
                if(typeof erro.inner == 'object') {
                    document.getElementById(name).classList.add('error')
                    setErro(Object.values(erro.inner)[0].message)
                }
            })
    }

    return (
        <div style={{ width: '100%', maxWidth: '100%', minWidth: 0, overflow: 'hidden', flexShrink: 1, flexGrow: 0, boxSizing: 'border-box'}}>
            <GlobalPanelStyle />
            <div className={styles.inputContainer}>
                {(label) ?
                <label htmlFor={name} className={styles.label} style={{ marginBottom: '4px', display: 'block' }}>
                    {label}{required && <span style={{color: 'var(--error)'}}> *</span>}
                </label>
                : ''}
                {
                    filter ?  
                        <Select 
                            $width={$width}
                            $height={$height}
                            filter
                            id={name}
                            $margin={$margin}
                            $hasError={classeCampoVazio.length > 0}
                            placeholder={placeholder} 
                            options={options} 
                            value={valor} 
                            optionLabel={optionLabel || "name"}
                            onChange={changeValor}
                            itemTemplate={optionTemplate} // Template para os itens da lista
                            valueTemplate={optionTemplate} // Template para o valor selecionado
                            disabled={disabled}
                            showClear={allowClear && valor}
                            onFilter={onFilter}
                            emptyFilterMessage={emptyFilterMessage || t('noAvailableOptions')}
                            emptyMessage={emptyMessage || t('noAvailableOptions')}
                            panelClassName="dropdown-panel-wrapping"
                        />
                    :
                    <Select 
                        $width={$width}
                        $height={$height}
                        $margin={$margin}
                        $hasError={classeCampoVazio.length > 0}
                        id={name}
                        placeholder={placeholder} 
                        options={options} 
                        value={valor} 
                        optionLabel={optionLabel || "name"}
                        onChange={changeValor}
                        itemTemplate={optionTemplate} // Template para os itens da lista
                        valueTemplate={optionTemplate} // Template para o valor selecionado
                        disabled={disabled}
                        showClear={allowClear && valor}
                        emptyMessage={emptyMessage || t('noAvailableOptions')}
                        panelClassName="dropdown-panel-wrapping"
                    />
                }
            </div>
            {classeCampoVazio.includes(name) ?
                <p className={styles.erroMessage}>Você deve preencher esse campo</p>
                : (erro ?
                    <p className={styles.erroMessage}>{erro}</p>
                    : <p className={styles.erroMessage}>&nbsp;</p>
                )
            }
        </div>       
    )
}

export default DropdownItens