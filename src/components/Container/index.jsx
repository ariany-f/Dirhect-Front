import styled from 'styled-components'
import styles from './Container.module.css'

const DivContainer = styled.div`
    gap: ${ props => props.$gap ? props.$gap : '48px' };
    padding: ${ props => props.$padding ? props.$padding : 'inherit' };
    justify-content: ${ props => props.$align ? props.$align : 'center' };
`

function Container({ children, align, gap = '48px', padding = 'inherit' }) {
    return (
        <DivContainer $align={align} $padding={padding} $gap={gap} className={styles.container}>
            {children}
        </DivContainer>
    )
}

export default Container