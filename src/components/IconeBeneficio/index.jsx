// components/IconeBeneficio.jsx
import { 
    RiShoppingCartFill, 
    RiComputerLine, 
    RiBusFill, 
    RiGasStationFill,
    RiEBike2Fill
} from 'react-icons/ri';
import { 
    IoFastFoodSharp, 
    IoEllipsisVertical 
} from 'react-icons/io5';
import { 
    IoMdFitness
} from 'react-icons/io';
import { 
    BiBookReader, 
    BiShield 
} from 'react-icons/bi';
import { 
    PiForkKnifeFill 
} from 'react-icons/pi';
import { 
    FaCar, 
    FaCoins, 
    FaPen, 
    FaQuestion, 
    FaTheaterMasks, 
    FaTooth
} from 'react-icons/fa';
import { 
    FaHeartPulse,
    FaMoneyBillTransfer
} from 'react-icons/fa6';
import { 
    MdDirectionsBike,
    MdSecurity,
    MdOutlineMedicalServices,
    MdOutlineFastfood
} from 'react-icons/md';

const iconMap = {
    // Alimentação
    'RiShoppingCartFill': RiShoppingCartFill,
    // Refeição
    'IoFastFoodSharp': IoFastFoodSharp,
    // Mobilidade
    'RiBusFill': RiBusFill,
    // Home Office
    'RiComputerLine': RiComputerLine,
    // Combustível
    'RiGasStationFill': RiGasStationFill,
    // Cultura
    'FaTheaterMasks': FaTheaterMasks,
    // Educação
    'BiBookReader': BiBookReader,
    // Saúde
    'FaHeartPulse': FaHeartPulse,
    // Auxílio Alimentação
    'PiForkKnifeFill': PiForkKnifeFill,
    // Seguro de Vida
    'MdSecurity': MdSecurity,
    // Empréstimo Consignado
    'FaMoneyBillTransfer': FaMoneyBillTransfer,
    // Previdência Privada
    'FaCoins': FaCoins,
    // Saúde Odonto
    'FaTooth': FaTooth,
    // Seguro Bike
    'MdDirectionsBike': MdDirectionsBike,
    // Seguro Moto
    'RiEBike2Fill': RiEBike2Fill,
    // Seguro Automotivo
    'FaCar': FaCar,
    // Alimentação
    'Alimentação': RiShoppingCartFill,
    // Refeição
    'Refeição': IoFastFoodSharp,
    'Vale Refeição': IoFastFoodSharp,
    // Mobilidade
    'Mobilidade': RiBusFill,
    // Home Office
    'Home Office': RiComputerLine,
    // Combustível
    'Combustível': RiGasStationFill,
    'Vale Combustível': RiGasStationFill,
    // Cultura
    'Cultura': FaTheaterMasks,
    'Vale Cultura': FaTheaterMasks,
    // Educação
    'Educação': BiBookReader,
    // Saúde
    'Saúde': FaHeartPulse,
    'Saude': FaHeartPulse,
    // Auxílio Alimentação
    'Auxílio Alimentação': PiForkKnifeFill,
    'Vale Alimentação': PiForkKnifeFill,
    // Seguro de Vida
    'Seguro de Vida': MdSecurity,
    // Empréstimo Consignado
    'Empréstimo Consignado': FaMoneyBillTransfer,
    // Previdência Privada
    'Previdência Privada': FaCoins,
    // Academia
    'Academia': IoMdFitness,
    // Saúde Odonto
    'Saúde Odonto': FaTooth,
    // Seguro Bike
    'Seguro Bike': MdDirectionsBike,
    // Seguro Moto
    'Seguro Moto': RiEBike2Fill,
    // Seguro Automotivo
    'Seguro Automotivo': FaCar,
    // Ícone padrão para quando não encontrado
    'default': FaQuestion
};

const IconeBeneficio = ({ nomeIcone, size = 20, className }) => {
    const IconComponent = iconMap[nomeIcone] || iconMap['default'];
    
    return (
        <span className={className}>
            <IconComponent size={size} />
        </span>
    );
};

export default IconeBeneficio;