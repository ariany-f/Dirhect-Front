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
    FaTooth,
    FaRunning,           // Atividade física
    FaMedal,             // Recompensas
    FaSpa,               // Bem-estar
    FaSmile,             // Satisfação
    FaHospital,          // Planos de saúde
    FaPills,              // Medicamentos
    FaGraduationCap,     // Cursos
    FaLanguage,          // Idiomas
    FaLaptopCode,        // Cursos de TI
    FaBookOpen,           // Livros
    FaSubway,            // Transporte público
    FaPlane,             // Viagens
    FaTaxi,              // Táxi
    FaBicycle,            // Bicicleta
    FaCoffee,           // Cafés
    FaWineBottle,        // Bebidas
    FaIceCream,          // Sobremesas
    FaUtensils,           // Restaurantes
    FaHeadphones,        // Acessórios
    FaMobile,            // Celulares
    FaWifi,              // Internet
    FaPrint,              // Impressão
    FaGamepad,           // Jogos
    FaFilm,              // Cinema
    FaMusic,             // Música
    FaSwimmingPool,       // Atividades esportivas
    FaPiggyBank,         // Economias
    FaCreditCard,        // Cartões
    FaChartLine,         // Investimentos
    FaHandHoldingUsd,     // Empréstimos
    FaBaby,              // Benefícios infantis
    FaHome,              // Moradia
    FaDog,               // Pets
    FaChild,              // Crianças
    FaGift,              // Presentes
    FaTshirt,            // Vestuário
    FaBriefcase,         // Profissional
    FaUserTie            // Trabalho formal
} from 'react-icons/fa';
import { 
    FaHeartPulse,
    FaMoneyBillTransfer
} from 'react-icons/fa6';
import { 
    MdDirectionsBike,
    MdSecurity,
    MdOutlineMedicalServices,
    MdOutlineFastfood,
    MdPets
} from 'react-icons/md';

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
    'FaMedal': FaMedal,
    'Recompensas': FaMedal,
    'FaSpa': FaSpa,
    'BemEstar': FaSpa,
    'FaSmile': FaSmile,
    'SaudeMental': FaSmile,
    'FaHospital': FaHospital,
    'PlanoSaude': FaHospital,
    'FaPills': FaPills,
    'Medicamentos': FaPills,
    'MdPets': MdPets,
    'Pets': MdPets,
    
    // Educação
    'FaGraduationCap': FaGraduationCap,
    'Cursos': FaGraduationCap,
    'FaLanguage': FaLanguage,
    'Idiomas': FaLanguage,
    'FaLaptopCode': FaLaptopCode,
    'Tecnologia': FaLaptopCode,
    'FaBookOpen': FaBookOpen,
    'Livros': FaBookOpen,
    
    // Transporte
    'FaSubway': FaSubway,
    'TransportePublico': FaSubway,
    'FaPlane': FaPlane,
    'Viagens': FaPlane,
    'FaTaxi': FaTaxi,
    'Taxi': FaTaxi,
    'FaBicycle': FaBicycle,
    'Bicicleta': FaBicycle,
    
    // Alimentação
    'FaCoffee': FaCoffee,
    'Cafeteria': FaCoffee,
    'FaWineBottle': FaWineBottle,
    'Bebidas': FaWineBottle,
    'FaIceCream': FaIceCream,
    'Sobremesas': FaIceCream,
    'FaUtensils': FaUtensils,
    'Restaurante': FaUtensils,
    
    // Tecnologia
    'FaHeadphones': FaHeadphones,
    'Eletronicos': FaHeadphones,
    'FaMobile': FaMobile,
    'Celular': FaMobile,
    'FaWifi': FaWifi,
    'Internet': FaWifi,
    'FaPrint': FaPrint,
    'Impressao': FaPrint,
    
    // Lazer
    'FaGamepad': FaGamepad,
    'Jogos': FaGamepad,
    'FaFilm': FaFilm,
    'Cinema': FaFilm,
    'FaMusic': FaMusic,
    'Musica': FaMusic,
    'FaSwimmingPool': FaSwimmingPool,
    'Esportes': FaSwimmingPool,
    
    // Financeiro
    'FaPiggyBank': FaPiggyBank,
    'Economia': FaPiggyBank,
    'FaCreditCard': FaCreditCard,
    'Cartoes': FaCreditCard,
    'FaChartLine': FaChartLine,
    'Investimentos': FaChartLine,
    'FaHandHoldingUsd': FaHandHoldingUsd,
    'Emprestimos': FaHandHoldingUsd,
    
    // Família
    'FaBaby': FaBaby,
    'Infantil': FaBaby,
    'FaHome': FaHome,
    'Moradia': FaHome,
    'FaDog': FaDog,
    'Pets': FaDog,
    'FaChild': FaChild,
    'Criancas': FaChild,
    
    // Outros
    'FaGift': FaGift,
    'Presentes': FaGift,
    'FaTshirt': FaTshirt,
    'Vestuario': FaTshirt,
    'FaBriefcase': FaBriefcase,
    'Profissional': FaBriefcase,
    'FaUserTie': FaUserTie,
    'Executivo': FaUserTie,

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