import styled from 'styled-components';
import './Frame.css'

const DivFrame = styled.div`
    align-items: ${ props => props.$alinhamento ? props.$alinhamento : 'flex-start' };
    padding: ${ props => props.$padding ? props.$padding : '0' };
`

function Frame({ children, estilo = "", alinhamento, padding}) {

    const estiloAplicado = 'frame' + ' ' + estilo;
    
    return (
        <DivFrame $alinhamento={alinhamento} $padding={padding} className={estiloAplicado}>
            {children}
        </DivFrame>
    )
}

export default Frame