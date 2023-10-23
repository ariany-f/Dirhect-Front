import styles from './CamposVerificacao.module.css'
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

    &:active {
        outline-color: var(--primaria);
        background: var(--white);
    }

    &:focus {
        outline-color: var(--primaria);
        background: var(--white);
    }
`

function CamposVerificacao({ label, valor, setValor }) {
    
    const digitosDisponiveis = [
        {
            'id': 1,
            'preenchimento': valor[0]?.preenchimento
        },
        
        {
            'id': 2,
            'preenchimento': valor[1]?.preenchimento
        },
        
        {
            'id': 3,
            'preenchimento': valor[2]?.preenchimento
        },
        
        {
            'id': 4,
            'preenchimento': valor[3]?.preenchimento
        },
        
        {
            'id': 5,
            'preenchimento': valor[4]?.preenchimento
        },
        
        {
            'id': 6,
            'preenchimento': valor[5]?.preenchimento
        }
    ]

    function changeValores(value, id) {
        
        setValor(digitosDisponiveis.map(campo => {
            if(campo.id === id) {
                campo.preenchimento = value;
            }
            return campo;
        }))

        const active = document.activeElement;
        if (active?.nextElementSibling) {
            console.log(active.nextElementSibling);
            active.nextElementSibling.focus();
        }

    }

    return (
        <div className={styles.inputContainer}>
            <label className={styles.label}>{label}</label>
            <div className={styles.inputs}>
                {digitosDisponiveis.map((digito, index) => {
                    return (
                        <Campo key={index+1} maxLength={1} name="digito" id={index+1} type="text" value={valor[index]?.preenchimento} onChange={evento => changeValores(evento.target.value, index+1)}></Campo>
                    )
                })}
            </div>    
        </div>
    )
}

export default CamposVerificacao