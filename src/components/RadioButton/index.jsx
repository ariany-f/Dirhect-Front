import styled from "styled-components";

const RdBtn = styled.input`
    cursor: pointer;
    appearance: none;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    border: 2px solid var(--neutro-300);
    transition: 0.2s all linear;
    margin-right: 5px;
    position: relative;
    top: 4px;
    &:checked {
        accent-color: var(--primaria);
        border: 5px solid var(--primaria);
    }
`;

function RadioButton({ value, checked, onSelected }) {
    return (
        <RdBtn
            type="radio"
            name="radio"
            value={value}
            checked={checked}
            onChange={event => onSelected(event.target.value)}
        />
    )
}

export default RadioButton