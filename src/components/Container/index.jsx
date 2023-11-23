import styled from 'styled-components'
import styles from './Container.module.css'

const DivContainer = styled.div`
    gap: ${ props => props.$gap ? props.$gap : '48px' };
    justify-content: ${ props => props.$align ? props.$align : 'center' };
`

function Container({ children, align, gap = '48px' }) {
    return (
        <DivContainer $align={align} $gap={gap} className={styles.container}>
            {children}
        </DivContainer>
    )
}

export default Container