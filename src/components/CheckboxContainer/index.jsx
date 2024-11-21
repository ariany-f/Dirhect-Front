import styled from "styled-components";
import Texto from "../Texto";
import styles from './CheckboxContainer.module.css'

const ChBtn = styled.input`
    cursor: pointer;
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid var(--neutro-300);
    transition: 0.2s all linear;
    position: relative;
    border-radius: 2px;
    ~ label {
        font-weight: 800;
        font-size: ${ props => props.$fontSize ? props.$fontSize : '12px' };
        cursor: pointer;
    }
    &:checked {
        accent-color: var(--primaria);
        border: 5px solid var(--primaria);
    }
    &::after {
        content: '';
    }
`;

function CheckboxContainer({ valor, setValor, label, name, fontSize='12px' }) {

    return (
        <div className={styles.checkboxContainer}>
            <ChBtn $fontSize={fontSize} value={valor} id={name} onChange={evento => setValor(evento.target.checked)} type="checkbox"></ChBtn>
            {(label) ?
                <label htmlFor={name} className={styles.label}>{label}</label>
            : ''}
        </div>
    )
}

export default CheckboxContainer