import styled from 'styled-components'
import styles from './MainContainer.module.css'

const DivContainer = styled.div`
    justify-content: ${ props => props.$align ? props.$align : 'center' };
`

function MainContainer({ children, align }) {
    return (
        <DivContainer $align={align} className={styles.main}>
            {children}
        </DivContainer>
    )
}

export default MainContainer