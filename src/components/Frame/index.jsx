import styled from 'styled-components';
import './Frame.css'

const DivFrame = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: ${ props => props.$alinhamento ? props.$alinhamento : 'flex-start' };
    align-items: ${ props => props.$alinhamento ? props.$alinhamento : 'flex-start' };
    padding: ${ props => props.$padding ? props.$padding : '0' };
    gap: ${ props => props.$gap ? props.$gap : '0' };
    overflow-y: ${ props => props.$overflowY ? props.$overflowY : 'visible' };
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    text-align: ${ props => props.$alinhamentoLabel ? props.$alinhamentoLabel : 'center' };
    
    /* Ocultar setas do scroll quando overflowY estiver ativo */
    ${props => props.$overflowY && props.$overflowY !== 'visible' && `
        scrollbar-width: thin;
        scrollbar-color: transparent transparent;
        
        &::-webkit-scrollbar {
            width: 6px;
        }
        
        &::-webkit-scrollbar-track {
            background: transparent;
        }
        
        &::-webkit-scrollbar-thumb {
            background: transparent;
            border-radius: 3px;
        }
        
        &::-webkit-scrollbar-thumb:hover {
            background: transparent;
        }
    `}
`

function Frame({ children, overflowY = "visible", estilo = "", alinhamento, padding, gap="0", alinhamentoLabel="center"}) {

    const estiloAplicado = 'frame' + ' ' + estilo;
    
    return (
        <DivFrame $gap={gap} $overflowY={overflowY} $alinhamento={alinhamento} $padding={padding} $alinhamentoLabel={alinhamentoLabel} className={estiloAplicado}>
            {children}
        </DivFrame>
    )
}

export default Frame