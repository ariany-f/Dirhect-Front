import styled from 'styled-components'
import styles from './Titulo.module.css'

const DivContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: ${ props => props.$align ? props.$align : 'left' };
    gap: 8px;
`

function Titulo({ children, align='left' }) {
    return (
        <DivContainer $align={align} className={styles.texto}>
            {children}
        </DivContainer>
    )
}

export default Titulo