import styled from 'styled-components';
import './FrameVertical.css'

const DivFrame = styled.div`
    align-items: ${ props => props.$alinhamento ? props.$alinhamento : 'flex-start' };
    justify-content: ${ props => props.$alinhamento ? props.$alinhamento : 'center' };
    padding: ${ props => props.$padding ? props.$padding : '0' };
    gap: ${ props => props.$gap ? props.$gap : '5px' };
`

function FrameVertical({ children, estilo = "", alinhamento, padding, gap="0"}) {

    const estiloAplicado = 'frame-vertical' + ' ' + estilo;
    
    return (
        <DivFrame $gap={gap} $alinhamento={alinhamento} $padding={padding} className={estiloAplicado}>
            {children}
        </DivFrame>
    )
}

export default FrameVertical