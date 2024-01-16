import styled from "styled-components"

const Grupo = styled.div`
    display: flex;
    gap: 16px;
    justify-content: ${ props => props.$align ? props.$align : 'center'};
    align-items: ${ props => props.$align ? props.$align : 'center'};
`

function BotaoGrupo({ children, align = 'start'}) {
    return (
        <Grupo $align={align}>
            {children}
        </Grupo>
    )
}
export default BotaoGrupo