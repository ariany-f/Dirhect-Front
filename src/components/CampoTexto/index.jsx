import { useState } from 'react'
import styles from './CampoTexto.module.css'
import styled from 'styled-components'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { FaEnvelope } from 'react-icons/fa'
import { BsSearch } from 'react-icons/bs'
import {FloatLabel} from 'primereact/floatlabel'
import * as Yup from 'yup'
import { currency, mask as masker, unMask } from "remask"

const Campo = styled.input`
    border-radius: 8px;
    outline: .4px solid var(--neutro-200);
    background: var(--background-label);
    padding: ${ props => props.$padding ?  props.$padding : '22px 16px' };
    border: none;
    display: flex;
    align-items: center;
    align-self: stretch;
    font-weight: 600;
    margin-top: 10px;
    width: ${ props => props.$width ?  props.$width : 'inherit' };

    &:disabled {
        background-color: #e9ecef;
        color:#bdbdbd;
    }

    &.error {
        outline: 1px solid var(--error);
    }

    ~ .icon {
        box-sizing: initial;
        top: 30%;
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

    &[type=file]{
       display: none; 
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
    &:not(:disabled) {
        &:active {
            outline-color: var(--primaria);
            background: var(--white);
        }

        &:focus {
            outline-color: var(--primaria);
            background: var(--white);
        }
    }
`

function CampoTexto({ label, disabled = false, type='text',  setFocus, placeholder, valor, setValor, name, width = 'inherit', camposVazios = [], patternMask = [], reference=null, required = true, numeroCaracteres = null, onEnter = null, padding = null}) {

    const classeCampoVazio = camposVazios.filter((val) => {
        return val === name
    })
    const [caracteresDigitados, setCaracteresDigitados] = useState(0)
    const [visibilityPassword, setvisibilityPassword] = useState(false)
    const [erro, setErro] = useState('')

    function passwordVisibilityChange() {
       setvisibilityPassword(!visibilityPassword);
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('E-mail inválido'),
    })

    function validateKey(evento) {
        if (evento.key === 'Enter') {
            evento.preventDefault()
            onEnter()
        }
    }

    function changeValor(evento, patternMask)
    {
        let valorCampo = null
        if(type !== 'file')
        {
           valorCampo = evento.target.value
        }
        else {
            valorCampo = evento.target.files[0]
        }
        
        if(patternMask.length > 0)
        {
            if(patternMask === 'BRL')
            {
                if(valorCampo.length > 0)
                {
                    setValor(currency.mask({ locale: 'pt-BR', currency: 'BRL', value: currency.unmask({ locale: 'pt-BR', currency: 'BRL', value: valorCampo }) }), evento.target.name)
                }
                else
                {
                    setValor(currency.mask({ locale: 'pt-BR', currency: 'BRL', value: currency.unmask({ locale: 'pt-BR', currency: 'BRL', value: 0 }) }), evento.target.name)
                }
            }
            else
            {
                setValor(masker(unMask(valorCampo), patternMask), evento.target.name)
            }
        }
        else
        {
            setValor(valorCampo, evento.target.name)
        }
        
        if(valorCampo)
        {
            setCaracteresDigitados(valorCampo.length)

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
        else{
            setCaracteresDigitados(0)
        }
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
               
                {label && type!= 'date' ?
                <FloatLabel className={styles.lb}>
                    <Campo ref={reference} disabled={disabled} className={(classeCampoVazio.includes(name) ? 'error' : '')} onFocus={(setFocus) ? (evento) => setFocus(evento) : null} onKeyDown={(evento) => validateKey(evento)} $padding={padding} $width={width} id={name} name={name} type={type == 'password' ? (visibilityPassword ? 'text' : type) : type} value={valor} onChange={(evento) => changeValor(evento, patternMask)} placeholder={placeholder} autoComplete="on"></Campo>
                    <label htmlFor={name} className={styles.label}>{label}</label>
                </FloatLabel>
                : 
                    label && type == 'date' ?
                    <>
                        <label htmlFor={name} className={styles.label}>{label}</label>
                        <Campo ref={reference} disabled={disabled} className={(classeCampoVazio.includes(name) ? 'error' : '')} onFocus={(setFocus) ? (evento) => setFocus(evento) : null} onKeyDown={(evento) => validateKey(evento)} $padding={padding} $width={width} id={name} name={name} type={type == 'password' ? (visibilityPassword ? 'text' : type) : type} value={valor} onChange={(evento) => changeValor(evento, patternMask)} placeholder={placeholder} autoComplete="on"></Campo>
                    </>
                    :
                    <Campo ref={reference} disabled={disabled} className={(classeCampoVazio.includes(name) ? 'error' : '')} onFocus={(setFocus) ? (evento) => setFocus(evento) : null} onKeyDown={(evento) => validateKey(evento)} $padding={padding} $width={width} id={name} name={name} type={type == 'password' ? (visibilityPassword ? 'text' : type) : type} value={valor} onChange={(evento) => changeValor(evento, patternMask)} placeholder={placeholder} autoComplete="on"></Campo>
                }
                {temIcone(type, visibilityPassword)}
                {numeroCaracteres &&
                    <div style={{ fontSize: '12px',display: 'flex', justifyContent: 'end', width: '100%'}} >{caracteresDigitados}/{numeroCaracteres}</div>
                }
                
                {classeCampoVazio.includes(name)?
                    <p className={styles.erroMessage}>Você deve preencher esse campo</p>
                    : (erro ?
                        <p className={styles.erroMessage}>{erro}</p>
                        : <p className={styles.erroMessage}>&nbsp;</p>
                    )
                }
            </div>
        </>
    )
}

export default CampoTexto