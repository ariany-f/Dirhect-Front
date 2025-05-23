import styled from 'styled-components'
import styles from './Container.module.css'

const DivContainer = styled.div`
    gap: ${ props => props.$gap ? props.$gap : '48px' };
    padding: ${ props => props.$padding ? props.$padding : 'inherit' };
    width: ${ props => props.$width ? props.$width : '100%' };
    justify-content: ${ props => props.$align ? props.$align : 'space-between' };
    align-items: center;
`

function Container({ children, align, gap = '48px', width='100%', padding='inherit' }) {
    return (
        <DivContainer $padding={padding} $align={align} $width={width} $gap={gap} className={styles.container}>
            {children}
        </DivContainer>
    )
}

export default Container