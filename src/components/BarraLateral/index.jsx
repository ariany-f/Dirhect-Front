import { styled } from "styled-components"
import ItemNavegacao from "./ItemNavegacao"
import { AiFillHome } from "react-icons/ai"
import { RiHandCoinFill, RiFilePaperFill, RiUser3Fill, RiTrophyFill, RiTeamFill, RiBankCardFill, RiFileListFill, RiLogoutCircleLine } from "react-icons/ri"
import { BiSolidDashboard } from "react-icons/bi"
import { LuSparkles } from "react-icons/lu"
import "./BarraLateral.css"
import { Link, useLocation } from "react-router-dom"
import logo from '/imagens/logo.png'
import { useEffect, useRef, useState } from "react"
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"

const ListaEstilizada = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    width: 246px;
`
const BarraLateralEstilizada = styled.aside`
    display: inline-flex;
    padding: 26px 0px;
    min-height: 100vh;
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
    flex-shrink: 0;
    background: #244078;
    
    @media screen and (max-width: 760px) {
        display: none;
    }
`
const NavTitulo = styled.p`
    color: var(--white);
    opacity: 0.5;
    display: flex;
    padding: 10px 30px;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    font-weight: 300;
`

const Logo = styled.img`
    padding: 0px 30px;
    max-width: 245px;
`


function BarraLateral() {

    const location = useLocation()
    const [image, setImage] = useState(false)
    const ref = useRef(null)
    const {
        usuario,
        setCompanies,
        usuarioEstaLogado
    } = useSessaoUsuarioContext()

    useEffect(() => {
        if(logo){
            setImage(true)
        }
    }, [logo])

    const itensMenu = () => {

        switch (usuario.tipo) {
            case 'cliente':
                return [
                    {
                        "id": 1,
                        "url": "/",
                        "pageTitulo": "Home",
                        "icone": <AiFillHome size={20} className="icon" />,
                        "itemTitulo": "Home"
                    },
                    {
                        "id": 2,
                        "url": "/vagas",
                        "pageTitulo": "Vagas",
                        "icone": <RiFilePaperFill size={20} className="icon" />,
                        "itemTitulo": "Vagas"
                    },
                    {
                        "id": 3,
                        "url": "/admissao",
                        "pageTitulo": "Admissão",
                        "icone": <RiUser3Fill size={20} className="icon" />,
                        "itemTitulo": "Admissão"
                    }
                ];
            case 'candidato':
                return [
                    {
                        "id": 1,
                        "url": "/candidato/registro/1",
                        "pageTitulo": "Meu Cadastro",
                        "icone": <RiFilePaperFill size={20} className="icon" />,
                        "itemTitulo": "Meu Cadastro"
                    }
                ];
            case 'equipeFolhaPagamento':
                return [
                    {
                        "id": 1,
                        "url": "/",
                        "pageTitulo": "Home",
                        "icone": <AiFillHome size={20} className="icon" />,
                        "itemTitulo": "Home"
                    },
                    {
                        "id": 2,
                        "url": "/admissao/validar",
                        "pageTitulo": "Admissões",
                        "icone": <RiUser3Fill size={20} className="icon" />,
                        "itemTitulo": "Admissões"
                    }
                ];
            case 'equipeBeneficios':
                return [
                    {
                        "id": 1,
                        "url": "/",
                        "pageTitulo": "Home",
                        "icone": <AiFillHome size={20} className="icon" />,
                        "itemTitulo": "Home"
                    },
                    {
                        "id": 6,
                        "url": "/colaborador",
                        "pageTitulo": "Colaboradores",
                        "icone": <BiSolidDashboard size={20} className="icon" />,
                        "itemTitulo": "Colaboradores"
                    },
                    {
                        "id": 7,
                        "url": "/dependentes",
                        "pageTitulo": "Dependentes",
                        "icone": <RiHandCoinFill size={20} className="icon" />,
                        "itemTitulo": "Dependentes"
                    },
                    {
                        "id": 8,
                        "url": "/beneficio",
                        "pageTitulo": "Tipos",
                        "icone": <RiFileListFill size={20} className="icon" />,
                        "itemTitulo": "Tipos"
                    },
                    {
                        "id": 9,
                        "url": "/beneficio",
                        "pageTitulo": "Contrato Fornecedor",
                        "icone": <RiFileListFill size={20} className="icon" />,
                        "itemTitulo": "Contrato Fornecedor"
                    },
                    {
                        "id": 10,
                        "url": "/beneficio",
                        "pageTitulo": "Linhas de Transporte",
                        "icone": <LuSparkles size={20} className="icon" />,
                        "itemTitulo": "Linhas de Transporte"
                    },
                    {
                        "id": 11,
                        "url": "/cartao",
                        "pageTitulo": "Elegibilidade",
                        "icone": <LuSparkles size={20} className="icon" />,
                        "itemTitulo": "Elegibilidade"
                    }
                ];
            default:
                return [];
        }
    };
    
    const home = [
        'adicionar-cnpj',
        'adicionar-email',
        'adicionar-celular'
    ]
    
    const titulos = {
        'equipeFolhaPagamento': 'BPO',
        'equipeBeneficios': 'Benefícios',
        'candidato': 'Candidato',
        'cliente': 'Cliente'
    }

    return (
        <BarraLateralEstilizada>
             {image ?
                <Logo src={logo} ref={ref} alt="Logo" />
                : ''
            }
            <nav>
                <NavTitulo>{titulos[usuario.tipo]}</NavTitulo>
                <ListaEstilizada>
                    {itensMenu().map((item) => {
                        return (
                            <Link key={item.id} className="link" to={item.url}>
                                <ItemNavegacao ativo={(('/'+location.pathname.split('/')[1]) === item.url) || (home.includes(location.pathname.split('/')[1]) && item.url == '/')}>
                                    {item.icone}
                                    {item.itemTitulo}
                                </ItemNavegacao>
                            </Link>
                        )
                    })}
                </ListaEstilizada>
            </nav>
        </BarraLateralEstilizada>
    )
}

export default BarraLateral