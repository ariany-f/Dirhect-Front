import styled from "styled-components"

const Grupo = styled.div`
    display: flex;
    gap: ${ props => props.$gap ? props.$gap : '16px' };
    justify-content: ${ props => props.$align ? props.$align : 'center'};
    align-items: ${ props => props.$verticalalign ? props.$verticalalign : 'center'};
`

function BotaoGrupo({ children, align = 'start', verticalalign= 'center', gap = '16px' }) {
    return (
        <Grupo $verticalalign={verticalalign} $align={align} $gap={gap}>
            {children}
        </Grupo>
    )
}
export default BotaoGrupo