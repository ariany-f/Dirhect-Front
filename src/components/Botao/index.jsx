import './Botao.css';
import styled from "styled-components";
import { Ripple } from 'primereact/ripple';

const BotaoEstilizado = styled.button`
    display: ${ props => props.$flex ? 'flex' : 'inline-block'};
    border-radius: 40px;
    cursor: pointer;
    transition: all .1s linear;
    border: none;
    gap: 8px;
    padding: 16px 24px;
    font-weight: 600;
    font-family: var(--fonte-primaria);
    font-size: ${ props => props.$fontSize ? props.$fontSize : '16px'};
    flex-wrap: ${ props => props.$wrap ? 'wrap' : 'nowrap'};
    width: ${ props => props.$size ? props.$size : '100%'};
    line-height: 150%; /* 24px */
    justify-content: center;
    align-items: center;
    ${props => props.$style ? props.$style : ''};

    &:disabled {
        opacity: 0.5;
        background-color: var(--neutro-200);
        cursor: not-allowed;
    }
`

function Botao( {children, flex = true,  wrap = false, extraclasses = '',estilo = 'vermilion', model = 'filled', size = 'medium', tab = false, aoClicar = null, weight = 'bold', fontSize='16px', outStyle='', disabled = false } ) {

    const classes = `${estilo} ${model} ${size} ${weight} ${extraclasses} ${tab ? 'tab' : ''} p-ripple`;

    if(size === 'small') {
        size = '200px';
    }
    else if(size === 'medium') {
        size = '300px';
    }
    else if(size === 'large') {
        size = '100%';
    }
   
    return (
        aoClicar ?
            <BotaoEstilizado $wrap={wrap} $flex={flex} $style={outStyle} $fontSize={fontSize} $size={size} onClick={aoClicar} className={classes} disabled={disabled}>
                {children}
                <Ripple />
            </BotaoEstilizado>
        :
            <BotaoEstilizado $wrap={wrap} $flex={flex} $style={outStyle} $fontSize={fontSize} $size={size} className={classes} disabled={disabled}>
                {children}
                <Ripple />
            </BotaoEstilizado>
    )
}

export default Botao