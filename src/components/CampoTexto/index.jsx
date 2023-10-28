import { useState } from 'react'
import styles from './CampoTexto.module.css'
import styled from 'styled-components'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { FaEnvelope } from 'react-icons/fa'
import { BsSearch } from 'react-icons/bs'

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

    ~ .icon {
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

function CampoTexto({ label, type='text', placeholder, valor, setValor, name, width = 'inherit' }) {
    const [visibilityPassword, setvisibilityPassword] = useState(false)

    function passwordVisibilityChange() {
       setvisibilityPassword(!visibilityPassword);
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
        <div className={styles.inputContainer}>
            {(label) ?
            <label className={styles.label}>{label}</label>
            : ''}
            <Campo $width={width} name={name} type={type == 'password' ? (visibilityPassword ? 'text' : type) : type} value={valor} onChange={evento => setValor(evento.target.value)} placeholder={placeholder}></Campo>
            {temIcone(type, visibilityPassword)}
        </div>
    )
}

export default CampoTexto