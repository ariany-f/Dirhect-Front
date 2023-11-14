import styles from './SubTitulo.module.css'
import styled from 'styled-components'

const SubTituloContent = styled.p`
    font-size: ${ props => props.$fontSize ? props.$fontSize : '16px' }!important;
    color: ${ props => props.$color ? props.$color : 'var(--neutro-600)' }!important;
    font-weight: ${ props => props.$fontWeight ? props.$fontWeight : 300 }!important;
`

function SubTitulo({ children, fontSize = '16px', color = 'var(--neutro-600)', weight= 300 }) {
    return (
        <div className={styles.texto}>
            <SubTituloContent $fontSize={fontSize} $fontWeight={weight} $color={color}>{children}</SubTituloContent>
        </div>
    )
}

export default SubTitulo