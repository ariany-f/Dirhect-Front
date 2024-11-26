import styled from 'styled-components'
import styles from './MainContainer.module.css'

const DivContainer = styled.div`
    align-self: auto;
    flex-shrink: 1;
    flex-grow: 1;
    flex-basis: auto;
    margin: 0 auto;
    flex-wrap: initial;
    justify-content: center;
    align-items: stretch;
    max-width: min(100%, 428px);
`

function MainContainer({ children, align, padding = '0 10vw', aoClicar = null }) {
    return (
        <DivContainer onClick={aoClicar ? (evento) => aoClicar(evento) : null} $align={align} $padding={padding} className={styles.main}>
            {children}
        </DivContainer>
    )
}

export default MainContainer