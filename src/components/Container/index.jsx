import styled from 'styled-components'
import styles from './Container.module.css'

const DivContainer = styled.div`
    justify-content: ${ props => props.$align ? props.$align : 'center' };
`

function Container({ children, align }) {
    return (
        <DivContainer $align={align} className={styles.container}>
            {children}
        </DivContainer>
    )
}

export default Container