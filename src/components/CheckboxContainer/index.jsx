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
    &:checked {
        accent-color: var(--primaria);
        border: 5px solid var(--primaria);
    }
    &::after {
        content: '';
    }
`;

function CheckboxContainer() {
    return (
        <div className={styles.checkboxContainer}>
            <ChBtn type="checkbox"></ChBtn>
            <Texto weight="800">Lembrar de mim</Texto>
        </div>
    )
}

export default CheckboxContainer