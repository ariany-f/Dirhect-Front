import styled from 'styled-components'
import styles from './MainContainer.module.css'

const DivContainer = styled.div`
    justify-content: ${ props => props.$align ? props.$align : 'center' };
    align-items: ${ props => props.$align == 'center' ? props.$align : 'initial' };
    text-align: ${ props => props.$align ? props.$align : 'center' };
    padding: ${ props => props.$padding ? props.$padding : '5vw 10vw' };
    overflow-y: auto;
    width: -webkit-fill-available;
    height: 100%;
    max-height: 100vh;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: white;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 5px;
    }
`

function MainContainer({ children, align, padding = '0 10vw', aoClicar = null }) {
    return (
        <DivContainer onClick={aoClicar ? (evento) => aoClicar(evento) : null} $align={align} $padding={padding} className={styles.main}>
            {children}
        </DivContainer>
    )
}

export default MainContainer