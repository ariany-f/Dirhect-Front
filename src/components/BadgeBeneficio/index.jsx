import { RiBusFill, RiComputerLine, RiShoppingCartFill, RiGasStationFill, RiEBike2Fill } from 'react-icons/ri'
import { FaCar, FaCoins, FaQuestion, FaTheaterMasks, FaTooth, FaRunning } from 'react-icons/fa'
import { BiBookReader } from 'react-icons/bi'
import { PiForkKnifeFill } from 'react-icons/pi'
import { MdOutlineMedicalServices, MdOutlineFastfood, MdSecurity, MdPets } from 'react-icons/md'
import styles from '@components/BadgeBeneficio/BadgeBeneficio.module.css'
import { IoFastFoodSharp } from 'react-icons/io5'
import { FaHeartPulse, FaMoneyBillTransfer } from 'react-icons/fa6'
import { MdDirectionsBike } from "react-icons/md";
import { FaHome } from 'react-icons/fa'
import IconeBeneficio from '@components/IconeBeneficio'

const iconMap = {
    // Alimentação
    'RiShoppingCartFill': RiShoppingCartFill,
    'Alimentação': RiShoppingCartFill,
    'Vale Alimentação': RiShoppingCartFill,
    
    // Refeição
    'IoFastFoodSharp': IoFastFoodSharp,
    'Refeição': IoFastFoodSharp,
    'Vale Refeição': IoFastFoodSharp,
    
    // Mobilidade
    'RiBusFill': RiBusFill,
    'Mobilidade': RiBusFill,
    
    // Home Office
    'RiComputerLine': RiComputerLine,
    'Home Office': RiComputerLine,
    
    // Combustível
    'RiGasStationFill': RiGasStationFill,
    'Combustível': RiGasStationFill,
    'Vale Combustível': RiGasStationFill,
    
    // Cultura
    'FaTheaterMasks': FaTheaterMasks,
    'Cultura': FaTheaterMasks,
    'Vale Cultura': FaTheaterMasks,
    
    // Educação
    'BiBookReader': BiBookReader,
    'Educação': BiBookReader,
    
    // Saúde
    'FaHeartPulse': FaHeartPulse,
    'Saúde': FaHeartPulse,
    'Saude': FaHeartPulse,
    
    // Auxílio Alimentação
    'PiForkKnifeFill': PiForkKnifeFill,
    'Auxílio Alimentação': PiForkKnifeFill,
    
    // Seguro de Vida
    'MdSecurity': MdSecurity,
    'Seguro de Vida': MdSecurity,
    
    // Empréstimo Consignado
    'FaMoneyBillTransfer': FaMoneyBillTransfer,
    'Empréstimo Consignado': FaMoneyBillTransfer,
    
    // Previdência Privada
    'FaCoins': FaCoins,
    'Previdência Privada': FaCoins,
    
    // Saúde Odonto
    'FaTooth': FaTooth,
    'Saúde Odonto': FaTooth,
    'Odonto': FaTooth,
    
    // Seguro Bike
    'MdDirectionsBike': MdDirectionsBike,
    'Seguro Bike': MdDirectionsBike,
    
    // Seguro Moto
    'RiEBike2Fill': RiEBike2Fill,
    'Seguro Moto': RiEBike2Fill,
    
    // Seguro Automotivo
    'FaCar': FaCar,
    'Seguro Automotivo': FaCar,

    // Saúde e Bem-estar
    'FaRunning': FaRunning,
    'Academia': FaRunning,
    'FaHome': FaHome,
    'Moradia': FaHome,
    'Pets': MdPets,
    'MdPets': MdPets,

    // Ícone padrão para quando não encontrado
    'default': FaQuestion
};

function BadgeBeneficio({ nomeBeneficio, layout = 'inline', icone }) {
    const renderizarIcone = () => {
        const IconComponent = iconMap[icone] || iconMap[nomeBeneficio] || iconMap['default'];
        return <IconComponent size={20} />;
    };

    if(layout == 'inline') {
        return (
            <div key={nomeBeneficio} className={styles.beneficio}>
                {renderizarIcone()}
                <p>{nomeBeneficio}</p>
            </div>
        )
    }
    else if(layout == 'grid') {
        return (
            <div key={nomeBeneficio} className={styles.beneficio_grid}>
                <div className={styles.inside_grid}>
                    {renderizarIcone()}
                    <p>{nomeBeneficio}</p>
                </div>
            </div>
        )
    }
}

export default BadgeBeneficio