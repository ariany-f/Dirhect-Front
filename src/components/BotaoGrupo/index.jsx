import styled from "styled-components"

const Grupo = styled.div`
    display: flex;
    gap: 16px;
    justify-content: ${ props => props.$align ? props.$align : 'center'};
    align-items: ${ props => props.$verticalalign ? props.$verticalalign : 'center'};
`

function BotaoGrupo({ children, align = 'start', verticalalign= 'center'}) {
    return (
        <Grupo $verticalalign={verticalalign} $align={align}>
            {children}
        </Grupo>
    )
}
export default BotaoGrupo