import styled from 'styled-components'
import styles from './Titulo.module.css'

const DivContainer = styled.div`
    text-align: ${ props => props.$align ? props.$align : 'left' };
`

function Titulo({ children, align='left' }) {
    return (
        <DivContainer $align={align} className={styles.texto}>
            {children}
        </DivContainer>
    )
}

export default Titulo