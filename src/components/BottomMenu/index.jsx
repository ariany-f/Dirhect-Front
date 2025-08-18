import { Link, useLocation } from 'react-router-dom';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import { ArmazenadorToken } from '@utils';
import { RiUser3Fill, RiFileListFill } from 'react-icons/ri';
import { LuSparkles } from 'react-icons/lu';
import { FaUser } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { GoTasklist } from 'react-icons/go';
import './BottomMenu.css';

function BottomMenu() {
    const { usuarioEstaLogado, usuario } = useSessaoUsuarioContext();
    const location = useLocation();

    // Só mostra se estiver autenticado e em tela pequena
    if (!usuarioEstaLogado || window.innerWidth > 760) return null;

    // Buscar permissões do grupo do usuário logado diretamente (igual BarraLateral)
    let grupos = ArmazenadorToken.UserPermissions || [];
    let grupo = grupos.find(g => g.name === usuario.tipo);
    let userPermissions = grupo ? grupo.permissions.map(p => p.codename) : [];

    // Gambiarra igual BarraLateral
    if (grupo && grupo.name && grupo.name.includes('Benefícios')) {
        userPermissions.push('view_pedido');
    } else if (grupo && grupo.name && grupo.name.includes('Colaborador')) {
        userPermissions.push('view_cadastro');
    }

    // Menus possíveis
    const menus = [
        {
            to: '/colaborador',
            label: 'Colaborador',
            icon: <RiUser3Fill size={22} />,
            active: location.pathname.startsWith('/colaborador'),
            permission: 'view_funcionario',
            always: true,
        },
        {
            to: '/elegibilidade',
            label: 'Elegibilidade',
            icon: <LuSparkles size={22} />,
            active: location.pathname.startsWith('/elegibilidade'),
            permission: 'view_contratobeneficioitem',
        },
        {
            to: '/contratos',
            label: 'Contratos',
            icon: <RiFileListFill size={22} />,
            active: location.pathname.startsWith('/contratos'),
            permission: 'view_contrato',
        },
        {
            to: '/admissao',
            label: 'Admissões',
            icon: <HiOutlineDocumentText size={22} />,
            active: location.pathname.startsWith('/admissao'),
            permission: 'view_admissao',
        },
        {
            to: '/tarefas',
            label: 'Processos',
            icon: <GoTasklist size={22} />,
            active: location.pathname.startsWith('/tarefas'),
            permission: 'view_tarefa',
        },
        {
            to: '/usuario',
            label: 'Usuário',
            icon: <FaUser size={22} />,
            active: location.pathname.startsWith('/usuario'),
            always: true,
        },
    ];

    // Lógica de exibição:
    // Se tem permissão para elegibilidade ou contratos, mostra esses.
    // Se não, mostra admissões e processos (se tiver permissão).
    let filteredItems = [menus[0]]; // Colaborador sempre
    if (userPermissions.includes('view_contratobeneficioitem') || userPermissions.includes('view_contrato')) {
        if (userPermissions.includes('view_contratobeneficioitem')) filteredItems.push(menus[1]);
        if (userPermissions.includes('view_contrato')) filteredItems.push(menus[2]);
    } else {
        if (userPermissions.includes('view_admissao')) filteredItems.push(menus[3]);
        if (userPermissions.includes('view_tarefa')) filteredItems.push(menus[4]);
    }
    filteredItems.push(menus[5]); // Usuário sempre

    return (
        <nav className="bottom-menu">
            {filteredItems.map(item => (
                <Link key={item.to} to={item.to} className={item.active ? 'active' : ''}>
                    {item.icon}
                    <span>{item.label}</span>
                </Link>
            ))}
        </nav>
    );
}

export default BottomMenu;
