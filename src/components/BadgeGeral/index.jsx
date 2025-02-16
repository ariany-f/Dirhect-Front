import { RiBusFill, RiComputerLine, RiShoppingCartFill, RiGasStationFill } from 'react-icons/ri'
import { FaTheaterMasks } from 'react-icons/fa'
import { BiBookReader } from 'react-icons/bi'
import { PiForkKnifeFill } from 'react-icons/pi'
import { MdOutlineMedicalServices, MdOutlineFastfood } from 'react-icons/md'
import styles from '@components/BadgeGeral/BadgeGeral.module.css'

function BadgeGeral({ nomeBeneficio, layout = 'inline', iconeBeneficio}) {
    return (
        (layout == 'inline') ?
        <div key={nomeBeneficio} className={styles.beneficio}>
            {iconeBeneficio}
            <p>{nomeBeneficio}</p>
        </div>
        : ((layout == 'grid') ?
        
            <div key={nomeBeneficio} className={styles.beneficio_grid}>
                <div className={styles.inside_grid}>
                    {iconeBeneficio}
                    <p>{nomeBeneficio}</p>
                </div>
            </div>
        : '')
    )
}

export default BadgeGeral