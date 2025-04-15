import { RiBusFill, RiComputerLine, RiShoppingCartFill, RiGasStationFill, RiEBike2Fill } from 'react-icons/ri'
import { FaCar, FaCoins, FaQuestion, FaTheaterMasks, FaTooth } from 'react-icons/fa'
import { BiBookReader } from 'react-icons/bi'
import { PiForkKnifeFill } from 'react-icons/pi'
import { MdOutlineMedicalServices, MdOutlineFastfood, MdSecurity } from 'react-icons/md'
import styles from '@components/BadgeBeneficio/BadgeBeneficio.module.css'
import { IoFastFoodSharp } from 'react-icons/io5'
import { FaHeartPulse, FaMoneyBillTransfer } from 'react-icons/fa6'
import { MdDirectionsBike } from "react-icons/md";
import IconeBeneficio from '@components/IconeBeneficio'

function BadgeBeneficio({ nomeBeneficio, layout = 'inline'}) {

    if(layout == 'inline')
    {
        return (
            <div key={nomeBeneficio} className={styles.beneficio}>
                 <IconeBeneficio 
                    nomeIcone={nomeBeneficio} 
                    size={20}
                />
                <p>{nomeBeneficio}</p>
            </div>
        )
    }
    else if(layout == 'grid')
    {
        return (
            <div key={nomeBeneficio} className={styles.beneficio_grid}>
                <div className={styles.inside_grid}>
                    <IconeBeneficio 
                        nomeIcone={nomeBeneficio} 
                        size={20}
                    />
                    <p>{nomeBeneficio}</p>
                </div>
            </div>
        )
    }
}

export default BadgeBeneficio