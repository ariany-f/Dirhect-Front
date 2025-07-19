import { useState } from 'react'
import styles from './DropdownItens.module.css'
import styled from 'styled-components'
import * as Yup from 'yup'
import {Dropdown} from 'primereact/dropdown'

const Select = styled(Dropdown)`
    border-radius: 4px;
    outline: .4px solid var(--neutro-400);
    background: var(--background-label);
    padding: 12px 16px;
    border: none;
    display: flex;
    align-items: center;
    text-align: left;
    align-self: stretch;
    font-weight: 700;
    margin-top: ${ props => props.$marginTop ?  props.$marginTop : '2px' };
    font-size: 14px;
    width: ${ props => props.$width ?  props.$width : 'inherit' };
    height: ${ props => props.$height ?  props.$height : '46px' };
    margin-bottom: ${ props => props.$margin ?  props.$margin : '0px' };

    & span {
        display: flex;
        align-items: center;
        justify-content: start;
        white-space: nowrap;
        overflow: visible;
        text-overflow: unset;
        max-width: none;
        width: auto;
    }

    & .p-dropdown-label,
    & .p-dropdown-item {
        white-space: nowrap;
        overflow: visible;
        text-overflow: unset;
        max-width: none;
        width: auto;
        display: block;
    }

    &.error {
        outline: 1px solid var(--error);
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
        outline-color: var(--primaria);
        background: var(--white);
    }

    &:focus {
        outline-color: var(--primaria);
        background: var(--white);
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
    $marginTop = '2px',
    filter = false,
    camposVazios = [],
    optionTemplate, // Nova prop para o template personalizado
    disabled = false, // Adiciona a prop disabled
    allowClear = false // Adiciona a prop allowClear
}) {

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
        <>
            <div className={styles.inputContainer}>
                {(label) ?
                <label htmlFor={name} className={styles.label}>{label}</label>
                : ''}
                {
                    filter ?  
                        <Select 
                            $width={$width}
                            $height={$height}
                            filter
                            id={name}
                            $margin={$margin}
                            $marginTop={$marginTop}
                            placeholder={placeholder} 
                            options={options} 
                            value={valor} 
                            optionLabel="name" 
                            onChange={changeValor}
                            itemTemplate={optionTemplate} // Template para os itens da lista
                            valueTemplate={optionTemplate} // Template para o valor selecionado
                            disabled={disabled}
                            showClear={allowClear}
                        />
                    :
                    <Select 
                        $width={$width}
                        $height={$height}
                        $margin={$margin}
                        $marginTop={$marginTop}
                        id={name}
                        placeholder={placeholder} 
                        options={options} 
                        value={valor} 
                        optionLabel="name" 
                        onChange={changeValor}
                        itemTemplate={optionTemplate} // Template para os itens da lista
                        valueTemplate={optionTemplate} // Template para o valor selecionado
                        disabled={disabled}
                        showClear={allowClear}
                    />
                }
            </div>
            {classeCampoVazio.includes(name) ?
                <p className={styles.erroMessage}>Você deve preencher esse campo</p>
                : (erro &&
                    <p className={styles.erroMessage}>{erro}</p>
                )
            }
        </>       
    )
}

export default DropdownItens