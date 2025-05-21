import { Link, useLocation } from 'react-router-dom';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import { RiUser3Fill, RiFileListFill } from 'react-icons/ri';
import { LuSparkles } from 'react-icons/lu';
import { FaUser } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import './BottomMenu.css';

function BottomMenu() {
    const { usuarioEstaLogado } = useSessaoUsuarioContext();
    const location = useLocation();

    // Só mostra se estiver autenticado e em tela pequena
    if (!usuarioEstaLogado || window.innerWidth > 760) return null;

    const items = [
        {
            to: '/colaborador',
            label: 'Colaborador',
            icon: <RiUser3Fill size={22} />,
            active: location.pathname.startsWith('/colaborador'),
        },
        {
            to: '/elegibilidade',
            label: 'Elegibilidade',
            icon: <LuSparkles size={22} />,
            active: location.pathname.startsWith('/elegibilidade'),
        },
        {
            to: '/contratos',
            label: 'Contratos',
            icon: <RiFileListFill size={22} />,
            active: location.pathname.startsWith('/contratos'),
        },
        {
            to: '/usuario',
            label: 'Usuário',
            icon: <FaUser size={22} />,
            active: location.pathname.startsWith('/usuario'),
        },
    ];

    return (
        <nav className="bottom-menu">
            {items.map(item => (
                <Link key={item.to} to={item.to} className={item.active ? 'active' : ''}>
                    {item.icon}
                    <span>{item.label}</span>
                </Link>
            ))}
        </nav>
    );
}

export default BottomMenu;
