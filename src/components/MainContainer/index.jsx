import styled from 'styled-components'
import styles from './MainContainer.module.css'

const DivContainer = styled.div`
    justify-content: ${ props => props.$align ? props.$align : 'center' };
    align-items: ${ props => props.$align == 'center' ? props.$align : 'initial' };
    text-align: ${ props => props.$align ? props.$align : 'center' };
    padding: ${ props => props.$padding ? props.$padding : '5vw 10vw' };
`

function MainContainer({ children, align, padding = '10vw', aoClicar = null }) {
    return (
        <DivContainer onClick={aoClicar ? (evento) => aoClicar(evento) : null} $align={align} $padding={padding} className={styles.main}>
            {children}
        </DivContainer>
    )
}

export default MainContainer