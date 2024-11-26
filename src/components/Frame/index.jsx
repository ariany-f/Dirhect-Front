import styled from 'styled-components';
import './Frame.css'

const DivFrame = styled.div`
    align-items: ${ props => props.$alinhamento ? props.$alinhamento : 'flex-start' };
    padding: ${ props => props.$padding ? props.$padding : '0' };
    gap: ${ props => props.$gap ? props.$gap : '0' };
`

function Frame({ children, estilo = "", alinhamento, padding, gap="0"}) {

    const estiloAplicado = 'frame' + ' ' + estilo;
    
    return (
        <DivFrame $gap={gap} $alinhamento={alinhamento} $padding={padding} className={estiloAplicado}>
            {children}
        </DivFrame>
    )
}

export default Frame