import Texto from '@components/Texto'
import styles from '@components/BadgeGeral/BadgeGeral.module.css'

function BadgeGeral({ nomeBeneficio, layout = 'inline', iconeBeneficio, size = '14px'}) {
    return (
        (layout == 'inline') ?
        <div key={nomeBeneficio} className={styles.beneficio}>
            {iconeBeneficio}
            <Texto size={size}>{nomeBeneficio}</Texto>
        </div>
        : ((layout == 'grid') ?
        
            <div key={nomeBeneficio} className={styles.beneficio_grid}>
                <div className={styles.inside_grid}>
                    {iconeBeneficio}
                    <Texto size={size}>{nomeBeneficio}</Texto>
                </div>
            </div>
        : '')
    )
}

export default BadgeGeral