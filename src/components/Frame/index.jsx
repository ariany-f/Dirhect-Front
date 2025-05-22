import styled from 'styled-components';
import './Frame.css'

const DivFrame = styled.div`
    align-items: ${ props => props.$alinhamento ? props.$alinhamento : 'flex-start' };
    padding: ${ props => props.$padding ? props.$padding : '0' };
    gap: ${ props => props.$gap ? props.$gap : '0' };
    text-align: ${ props => props.$alinhamentoLabel ? props.$alinhamentoLabel : 'center' };
`

function Frame({ children, estilo = "", alinhamento, padding, gap="0", alinhamentoLabel="center"}) {

    const estiloAplicado = 'frame' + ' ' + estilo;
    
    return (
        <DivFrame $gap={gap} $alinhamento={alinhamento} $padding={padding} $alinhamentoLabel={alinhamentoLabel} className={estiloAplicado}>
            {children}
        </DivFrame>
    )
}

export default Frame