import { useState } from 'react'
import styles from './DropdownItens.module.css'
import styled from 'styled-components'
import * as Yup from 'yup'

const Select = styled.select`
    border-radius: 8px;
    outline: .4px solid var(--neutro-200);
    background: var(--background-label);
    padding: 22px 16px;
    border: none;
    display: flex;
    align-items: center;
    align-self: stretch;
    font-weight: 700;
    margin-top: 10px;
    font-size: 14px;
    width: ${ props => props.$width ?  props.$width : 'inherit' };
    & option {
        font-family: var(--fonte-primaria);
        font-size: 18px;
        font-weight: 500;
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
        line-height: 20px; /* 142.857% */
    }
    
    &::-ms-input-placeholder { /* Edge 12 -18 */
        color: var(--neutro-200);
        font-feature-settings: 'clig' off, 'liga' off;
        font-family: var(--font-secondaria);
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px; /* 142.857% */
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

function DropdownItens({ valor, setValor, options=[], placeholder, name, label, camposVazios = []}) {

    const [erro, setErro] = useState('')
    const classeCampoVazio = camposVazios.filter((val) => {
        return val === name
    })

    const validationSchema = Yup.object().shape({})

    function changeValor(evento)
    {
        const valorCampo = evento.target.value

        setValor(valorCampo)

        const CampoObject = {
            [name]: valorCampo

        }

        validationSchema
            .validate(CampoObject, { abortEarly: false })
            .then(valid => {
                if(!!valid)
                {
                    document.getElementById(name).classList.remove('error')
                    setErro('')
                }
            })
            .catch(function (erro) {
                if(typeof erro.inner == 'object')
                {
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
            <Select placeholder={placeholder} name={name} value={valor} onChange={(evento) => changeValor(evento)}>
                {options.map((item, index) => {
                    return <option key={index} value={item.code}>{item.name}</option>
                })}
            </Select>
        </div>
        {classeCampoVazio.includes(name)?
            <p className={styles.erroMessage}>Você deve preencher esse campo</p>
            : (erro &&
                <p className={styles.erroMessage}>{erro}</p>
            )
        }
        </>       
    )
}
export default DropdownItens