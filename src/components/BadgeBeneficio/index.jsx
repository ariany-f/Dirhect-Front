import { RiBusFill, RiComputerLine, RiShoppingCartFill, RiGasStationFill } from 'react-icons/ri'
import { FaTheaterMasks } from 'react-icons/fa'
import { BiBookReader } from 'react-icons/bi'
import { PiForkKnifeFill } from 'react-icons/pi'
import { MdOutlineMedicalServices, MdOutlineFastfood } from 'react-icons/md'
import styles from '@components/BadgeBeneficio/BadgeBeneficio.module.css'

const icones = [
    {
        "id": 1,
        "name": "Alimentação",
        "flexible_value": false,
        "food_meal_one_category": false,
        "icone": <RiShoppingCartFill />
    },
    {
        "id": 2,
        "name": "Refeição",
        "flexible_value": false,
        "food_meal_one_category": false,
        "icone": <MdOutlineFastfood />
    },
    {
        "id": 3,
        "name": "Mobilidade",
        "flexible_value": true,
        "food_meal_one_category": false,
        "icone": <RiBusFill />
    },
    {
        "id": 4,
        "name": "Home Office",
        "flexible_value": true,
        "food_meal_one_category": false,
        "icone": <RiComputerLine />
    },
    {
        "id": 5,
        "name": "Combustível",
        "flexible_value": true,
        "food_meal_one_category": false,
        "icone": <RiGasStationFill />
    },
    {
        "id": 6,
        "name": "Cultura",
        "flexible_value": true,
        "food_meal_one_category": false,
        "icone": <FaTheaterMasks />
    },
    {
        "id": 7,
        "name": "Educação",
        "flexible_value": true,
        "food_meal_one_category": false,
        "icone": <BiBookReader  />
    },
    {
        "id": 8,
        "name": "Saúde",
        "flexible_value": true,
        "food_meal_one_category": false,
        "icone": <MdOutlineMedicalServices />
    },
    {
        "id": 9,
        "name": "Auxílio Alimentação",
        "flexible_value": false,
        "food_meal_one_category": true,
        "icone": <PiForkKnifeFill />
    }
]

function BadgeBeneficio({ nomeBeneficio, layout = 'inline' }) {
    return (
        icones.map(item => {
            if(item.name == nomeBeneficio)
            {
                if(layout == 'inline')
                {
                    return (
                        <div key={item.id} className={styles.beneficio}>
                            {item.icone}
                            <p>{item.name}</p>
                        </div>
                    )
                }
                else if(layout == 'grid')
                {
                    return (
                        <div key={item.id} className={styles.beneficio_grid}>
                            {item.icone}
                            <p>{item.name}</p>
                        </div>
                    )
                }
            }
        })
    )
}

export default BadgeBeneficio