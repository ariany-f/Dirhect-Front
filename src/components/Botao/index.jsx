import './Botao.css';
import styled from "styled-components";

const BotaoEstilizado = styled.button`
    display: flex;
    border-radius: 8px;
    cursor: pointer;
    transition: all .1s linear;
    border: none;
    gap: 8px;
    padding: 16px 24px;
    font-family: var(--fonte-primaria);
    font-size: ${ props => props.$fontSize ? props.$fontSize : '16px'};
    width: ${ props => props.$size ? props.$size : '100%'};
    line-height: 150%; /* 24px */
    justify-content: center;
    align-items: center;
`

function Botao( {children, estilo = 'vermilion', model = 'filled', size = 'medium', tab = false, aoClicar = null, weight = 'bold', fontSize='16px' } ) {

    const classes = `${estilo} ${model} ${size} ${weight} ${tab ? 'tab' : ''}`;
   
    return (
        aoClicar ?
            <BotaoEstilizado $fontSize={fontSize} $size={size} onClick={aoClicar} className={classes}>
                {children}
            </BotaoEstilizado>
        :
            <BotaoEstilizado $fontSize={fontSize} $size={size} className={classes}>
                {children}
            </BotaoEstilizado>
    )
}

export default Botao