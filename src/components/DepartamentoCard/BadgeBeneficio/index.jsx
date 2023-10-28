import { RiBusFill, RiComputerLine, RiShoppingCartFill } from 'react-icons/ri'
import { PiForkKnifeFill } from 'react-icons/pi'
import styles from './../Departamento.module.css'

const icones = [
    {
        "id": 1,
        "name": "Alimentação",
        "icone": <RiShoppingCartFill />
    },
    {
        "id": 2,
        "name": "Refeição",
        "icone": <PiForkKnifeFill />
    },
    {
        "id": 3,
        "name": "Mobilidade",
        "icone": <RiBusFill />
    },
    {
        "id": 4,
        "name": "Home Office",
        "icone": <RiComputerLine />
    }
]

function BadgeBeneficio({ nomeBeneficio }) {
    return (
        icones.map(item => {
            if(item.name == nomeBeneficio)
            {
                return (
                    <div key={item.id} className={styles.beneficio}>
                        {item.icone}
                        <p>{item.name}</p>
                    </div>
                )
            }
        })
    )
}

export default BadgeBeneficio