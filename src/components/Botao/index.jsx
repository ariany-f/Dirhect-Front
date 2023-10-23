import './Botao.css';
import styled from "styled-components";

const BotaoEstilizado = styled.button`
    border-radius: 8px;
    cursor: pointer;
    border: none;
    padding: 16px 24px;
    font-family: var(--fonte-primaria);
    font-size: 16px;
    font-weight: 700;
    line-height: 150%; /* 24px */
`

function Botao( {children, estilo = 'vermilion', model = 'filled', size = 'medium'} ) {

    const classes = `${estilo} ${model} ${size}`;
    
    return (
        <BotaoEstilizado className={classes}>
            {children}
        </BotaoEstilizado>
    )
}

export default Botao