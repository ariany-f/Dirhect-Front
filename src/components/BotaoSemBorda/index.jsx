import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    color: ${ props => props.$color ? props.$color : 'var(--primaria)' };
    font-family: var(--secundaria);
    align-items: center;
    font-size: 12px;
    cursor: pointer;
    font-weight: 700;
    gap: 8px;
    & svg {
        fill: ${ props => props.$color ? props.$color : 'var(--primaria)' };
    }
    & a{
        color: ${ props => props.$color ? props.$color : 'var(--primaria)' };
    }
`

function BotaoSemBorda({ children, color = 'var(--primaria)', aoClicar=() => {}}) {
    return (
        <Container $color={color} onClick={aoClicar}>
            {children}
        </Container>
    )
}
export default BotaoSemBorda