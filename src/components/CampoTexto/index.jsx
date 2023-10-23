import { useState } from 'react'
import styles from './CampoTexto.module.css'
import styled from 'styled-components'

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

function CampoTexto({ label, type='text', placeholder }) {
    const [email, setEmail] = useState('')

    return (
        <div className={styles.inputContainer}>
            <label className={styles.label}>{label}</label>
            <Campo type={type} value={email} onChange={evento => setEmail(evento.target.value)} placeholder={placeholder}></Campo>
        </div>
    )
}

export default CampoTexto