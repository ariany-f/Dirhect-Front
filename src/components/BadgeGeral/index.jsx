import Texto from '@components/Texto'
import styles from '@components/BadgeGeral/BadgeGeral.module.css'
import clsx from 'clsx' // Biblioteca para lidar com múltiplas classes dinamicamente

function BadgeGeral({ severity='', nomeBeneficio, layout = 'inline', iconeBeneficio, size = '14px', weight = 700 }) {
    const severityClass = severity ? styles[severity] : '';
    
    return (
        (layout == 'inline') ?
        <div key={nomeBeneficio} className={clsx(styles.beneficio, severityClass)}>
            {iconeBeneficio}
            <Texto weight={weight} size={size}>{nomeBeneficio}</Texto>
        </div>
        : ((layout == 'grid') ?
        
            <div key={nomeBeneficio} className={clsx(styles.beneficio_grid, severityClass)}>
                <div className={styles.inside_grid}>
                    {iconeBeneficio}
                    <Texto weight={weight} size={size}>{nomeBeneficio}</Texto>
                </div>
            </div>
        : '')
    )
}

export default BadgeGeral