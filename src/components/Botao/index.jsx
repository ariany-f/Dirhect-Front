import './Botao.css';
import styled from "styled-components";
import { Ripple } from 'primereact/ripple';

const BotaoEstilizado = styled.button`
    display: flex;
    border-radius: 40px;
    cursor: pointer;
    transition: all .1s linear;
    border: none;
    gap: 8px;
    padding: 16px 24px;
    font-weight: 600;
    font-family: var(--fonte-primaria);
    font-size: ${ props => props.$fontSize ? props.$fontSize : '16px'};
    max-width: 300px;
    // max-width: ${ props => props.$size ? (props.$size === 'small' ? '180px' : props.$size === 'medium' ? '200px' : '100%') : '100%'};
    line-height: 150%; /* 24px */
    justify-content: center;
    align-items: center;
    ${props => props.$style ? props.$style : ''};
`

function Botao( {children, extraclasses = '',estilo = 'vermilion', model = 'filled', size = 'medium', tab = false, aoClicar = null, weight = 'bold', fontSize='16px', outStyle='' } ) {

    const classes = `${estilo} ${model} ${size} ${weight} ${extraclasses} ${tab ? 'tab' : ''} p-ripple`;
   
    return (
        aoClicar ?
            <BotaoEstilizado $style={outStyle} $fontSize={fontSize} $size={size} onClick={aoClicar} className={classes}>
                {children}
                <Ripple />
            </BotaoEstilizado>
        :
            <BotaoEstilizado $style={outStyle} $fontSize={fontSize} $size={size} className={classes}>
                {children}
                <Ripple />
            </BotaoEstilizado>
    )
}

export default Botao