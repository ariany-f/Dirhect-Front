import { useState } from 'react'
import styles from './CampoTexto.module.css'
import styled from 'styled-components'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { FaEnvelope } from 'react-icons/fa'
import { BsSearch } from 'react-icons/bs'
import * as Yup from 'yup'
import { mask as masker, unMask } from "remask"

const Campo = styled.input`
    border-radius: 8px;
    outline: .4px solid var(--neutro-200);
    background: var(--background-label);
    padding: 22px 16px;
    border: none;
    display: flex;
    align-items: center;
    align-self: stretch;
    font-weight: 600;
    margin-top: 10px;
    width: ${ props => props.$width ?  props.$width : 'inherit' };

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

function CampoTexto({ label, type='text', placeholder, valor, setValor, name, width = 'inherit', camposVazios = [], patternMask = [], required = true}) {

    const classeCampoVazio = camposVazios.filter((val) => {
        return val === name
    })
    
    const [visibilityPassword, setvisibilityPassword] = useState(false)
    const [erro, setErro] = useState('')

    function passwordVisibilityChange() {
       setvisibilityPassword(!visibilityPassword);
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('E-mail inválido'),
        password: Yup.string().min(8, 'A senha deve conter no mínimo 8 caracteres'),
    })

    function changeValor(evento, patternMask)
    {
        const valor = evento.target.value
        if(patternMask.length > 0)
        {
            setValor(masker(unMask(valor), patternMask))
        }
        else
        {
            setValor(valor)
        }

        const CampoObject = {
            [name]: valor

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

    const temIcone = (type, visibility) => {

        var element = '';
        switch(type)
        {
            case 'password':
               element = visibility ? <AiFillEyeInvisible onClick={passwordVisibilityChange} size={20} className="icon end" /> : <AiFillEye onClick={passwordVisibilityChange} size={20} className="icon end" />;
            break;
            case 'email':
                    element = <FaEnvelope size={20} className="icon start" />;
            break;
            case 'search':
                    element = <BsSearch size={20} className="icon start" />;
            break;
            default:
        }
        return element;
    };

    return (
        <>
            <div className={styles.inputContainer}>
                {(label) ?
                <label htmlFor={name} className={styles.label}>{label}</label>
                : ''}
                <Campo className={(classeCampoVazio.includes(name) ? 'error' : '')} $width={width} id={name} name={name} type={type == 'password' ? (visibilityPassword ? 'text' : type) : type} value={valor} onChange={(evento) => changeValor(evento, patternMask)} placeholder={placeholder} autoComplete="on"></Campo>
                {temIcone(type, visibilityPassword)}
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

export default CampoTexto