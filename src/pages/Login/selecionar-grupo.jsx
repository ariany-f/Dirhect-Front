import Botao from "@components/Botao"
import Titulo from "@components/Titulo"
import RadioButton from "@components/RadioButton"
import styled from "styled-components"
import { useEffect, useRef, useState } from "react"
import { RiBuildingLine, RiErrorWarningLine, RiUserLine, RiTeamLine, RiGiftLine, RiUserSettingsLine, RiUserAddLine, RiHandHeartLine, RiListSettingsLine  } from "react-icons/ri"
import { FaUser, FaUsers, FaGift, FaUserCog, FaUserPlus, FaHandHoldingHeart } from "react-icons/fa"
import { HiUsers, HiGift, HiCog, HiUserAdd, HiHeart } from "react-icons/hi"
import { BsFillPersonVcardFill } from "react-icons/bs"
import Texto from "@components/Texto"
import styles from './Login.module.css'
import http from '@http';
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import { useNavigate } from "react-router-dom"
import { Toast } from 'primereact/toast'
import { ArmazenadorToken } from "@utils"
import Loading from "@components/Loading"
import { useTranslation } from "react-i18next"
import CustomImage from "@components/CustomImage"

const WrapperProfiles = styled.div`
    display: flex;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 600px) {
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 2px;
        overflow-y: auto;
        justify-items: center;
        text-align: center;
    }
`;

const ProfileCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex: 1 1 1 33%;
    width: calc(33% - 12px);
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 16px;
    border: 1px solid ${props => props.$active ? 'var(--primaria)' : 'transparent'};
    background: ${props => props.$active ? 'var(--primaria-50)' : '#fff'};
    margin-bottom: 0px;
    @media (max-width: 600px) {
        width: 49%;
    }
`;

const ProfileIcon = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.$active ? 'var(--primaria)' : 'var(--neutro-100)'};
    color: ${props => props.$active ? '#fff' : 'var(--neutro-600)'};
    font-size: 32px;
    transition: all 0.3s ease;
    border: 3px solid ${props => props.$active ? 'var(--primaria)' : 'var(--neutro-200)'};
    @media (max-width: 600px) {
        width: 56px;
        height: 56px;
        font-size: 22px;
        border-width: 2px;
    }
`;

const ProfileName = styled.h6`
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.$active ? 'var(--primaria)' : 'var(--neutro-800)'};
    text-align: center;
    margin: 0;
    transition: color 0.3s ease;
    @media (max-width: 600px) {
        font-size: 13px;
    }
    ${ProfileCard}:hover & {
        color: var(--primaria);
    }
`;

const WrapperOut = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    align-self: stretch;
    width: 100%;
    @media (max-width: 768px) {
        margin-left: 0px;
        margin-right: 0px;
        height: 100vh;
        overflow-y: auto;
        padding: 0 4vw;
    }
`;

// Array de perfis com ícones específicos
const perfisConfig = [
    {
        nome: 'RH',
        icone: RiTeamLine,
        cor: '#3B82F6'
    },
    {
        nome: 'Colaborador',
        icone: BsFillPersonVcardFill,
        cor: '#10B981'
    },
    {
        nome: 'Benefícios',
        icone: FaGift,
        cor: '#F59E0B'
    },
    {
        nome: 'Outsourcing',
        icone: RiListSettingsLine,
        cor: '#8B5CF6'
    },
    {
        nome: 'Candidato',
        icone: RiUserAddLine,
        cor: '#EF4444'
    },
    {
        nome: 'Corretor',
        icone: RiHandHeartLine,
        cor: '#EC4899'
    }
];

function SelecionarGrupo() {
    
    const { 
        usuario,
        setSessionCompany,
        setCompanyDomain,
        setCompanySymbol,
        setCompanyLogo,
        setTipo,
        setCompanies,
    } = useSessaoUsuarioContext()

    const [serversOut, setServersOut] = useState(false)
    const [grupos, setGrupos] = useState(null)
    const [selected, setSelected] = useState('')
    const [loading, setLoading] = useState(false)
    const toast = useRef(null)
    const navegar = useNavigate()
    const { t } = useTranslation('common');

    // Função para obter o ícone baseado no nome do grupo
    const getIconePerfil = (nomeGrupo) => {
        const perfil = perfisConfig.find(p => 
            nomeGrupo.toLowerCase().includes(p.nome.toLowerCase())
        );
        return perfil ? perfil.icone : RiUserLine;
    };

    // Função para obter a cor baseada no nome do grupo
    const getCorPerfil = (nomeGrupo) => {
        const perfil = perfisConfig.find(p => 
            nomeGrupo.toLowerCase().includes(p.nome.toLowerCase())
        );
        return perfil ? perfil.cor : 'var(--neutro-600)';
    };

    useEffect(() => {
        // Pegar os grupos do ArmazenadorToken apenas uma vez
        const gruposOriginais = ArmazenadorToken.UserGroups ?? null;
        
        if (gruposOriginais && gruposOriginais.length > 0) {
            // Filtrar grupos que não começam com "_"
            const gruposFiltrados = gruposOriginais.filter(grupo => !grupo.startsWith('_'));
            setGrupos(gruposFiltrados);
            
            // Selecionar o primeiro grupo válido apenas se não houver seleção atual
            if (gruposFiltrados.length > 0 && !selected) {
                setSelected(gruposFiltrados[0]);
            }
        }
    }, []) // Executar apenas uma vez na montagem do componente

    function handleSelectChange(value) {
        setSelected(value);
    }

    const handleSelectSave = (value) => {
        setTipo(selected)
        ArmazenadorToken.definirTipo(selected);
        http.get(`permissao_grupo/?format=json&name=${selected}`)
        .then(response => {
            ArmazenadorToken.definirPermissoes(response);
            navegar('/login/selecionar-empresa')
        })
        .catch(error => console.log('Erro ao buscar grupos:', error));
    }

    return (
        <WrapperOut>
            <Toast ref={toast} />
            <Loading opened={loading} />
            {grupos && grupos.length > 0 &&
                <>
                    <Titulo>
                        <h2>{t('select_group')}</h2>
                    </Titulo>
                    <WrapperProfiles>
                        {grupos.map((grupo, idx) => {
                            const IconeComponente = getIconePerfil(grupo) || FaUser;
                            const corPerfil = getCorPerfil(grupo);
                            
                            return (
                                <ProfileCard 
                                    key={idx} 
                                    $active={selected === grupo}
                                    onClick={() => handleSelectChange(grupo)}>
                                    <ProfileIcon $active={selected === grupo}>
                                        <IconeComponente 
                                            fill={selected === grupo ? '#fff' : corPerfil} 
                                            size={32}
                                        />
                                    </ProfileIcon>
                                    <ProfileName $active={selected === grupo}>
                                        {grupo}
                                    </ProfileName>
                                </ProfileCard>
                            )
                        })}
                    </WrapperProfiles>
                    <Botao estilo="vermilion" size="medium" filled aoClicar={handleSelectSave} >{t('confirm')}</Botao>
                </>
            }
        </WrapperOut>
    )
}

export default SelecionarGrupo