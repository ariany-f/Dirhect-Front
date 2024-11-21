import styled from 'styled-components'
import styles from './CardText.module.css'

const DivCard = styled.div`
    background: ${ props => props.$background ? props.$background : 'var(--neutro-100)' };
    padding: ${ props => props.$padding ? props.$padding : '10px 16px'};
    gap: ${ props => props.$gap ? props.$gap : '8px'};
`

function CardText({ children, background, padding, gap = '8px' }){
    return (
        <DivCard $gap={gap} $padding={padding} $background={background} className={styles.cardText}>
            {children}
        </DivCard>
    )
}

export default CardText