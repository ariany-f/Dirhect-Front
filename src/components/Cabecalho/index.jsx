import { styled } from "styled-components"
import PrecisoDeAjuda from "@components/PrecisoDeAjuda"
import { RiNotificationLine } from "react-icons/ri"
import styles from './Cabecalho.module.css'
import { Link, useLocation, useNavigate } from "react-router-dom"
import { BsArrowLeftRight } from 'react-icons/bs'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import Menu from "@components/Menu"
import { ArmazenadorToken } from './../../utils'
import { useEffect, useState } from "react"
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"

const HeaderEstilizado = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: fit-content;
    top: 0;
    padding: 0 6vw;
    flex-wrap: wrap;
`

const RightItems = styled.nav`
    display: flex;
    align-items: center;
    gap: 48px;
    flex-wrap: wrap;
`

const ItemEmpresa = styled.button`
    font-family: var(--fonte-secundaria);
    background-color: var(--white);
    color: var(--black);
    padding: 11px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 8px;
    border: 1px solid var(--neutro-200);
    font-size: 14px;
    font-weight: 700;
    line-height: 20px; /* 142.857% */
    cursor: pointer;
`

const ItemUsuario = styled.div`
    font-family: var(--fonte-secundaria);
    color: var(--black);
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px; /* 142.857% */
    cursor: pointer;
    & .user {
        background-color: var(--neutro-100);
        border-radius: 20px;
        justify-content: center;
        align-items: center;
        display: flex;
        width: 40px;
        height: 40px;
    }
`
const Cabecalho = ({ menuOpened, setMenuOpened, nomeEmpresa, aoClicar = null }) => {
    
    const location = useLocation()
    const navegar = useNavigate()
    
    const {
        usuario,
        setCompanies,
        usuarioEstaLogado
    } = useSessaoUsuarioContext()
 
    useEffect(() => {
        console.log(usuario)
        // setUsuarioEstaLogado(!!ArmazenadorToken.AccessToken)
    }, [])

    const titulos = [
        {
            "id": 1,
            "url": "",
            "pageTitulo": "Dirhect"
        },
        {
            "id": 2,
            "url": "extrato",
            "pageTitulo": "Extrato da conta"
        },
        {
            "id": 3,
            "url": "colaborador",
            "pageTitulo": "Colaboradores"
        },
        {
            "id": 4,
            "url": "estrutura",
            "pageTitulo": "Estrutura Organizacional"
        },
        {
            "id": 5,
            "url": "elegibilidade",
            "pageTitulo": "Elegibilidade"
        },
        {
            "id": 6,
            "url": "beneficio",
            "pageTitulo": "Benefícios"
        },
        {
            "id": 7,
            "url": "linhas-transporte",
            "pageTitulo": "Linhas de Transporte"
        },
        {
            "id": 8,
            "url": "despesa",
            "pageTitulo": "Despesas"
        },
        {
            "id": 9,
            "url": "operador",
            "pageTitulo": "Operadores"
        },
        {
            "id": 10,
            "url": "usuario",
            "pageTitulo": "Meus dados"
        },
        {
            "id": 11,
            "url": "dependentes",
            "pageTitulo": "Dependentes"
        }
    ];

    const titulo = titulos.map((item) => {
        if(item.url == location.pathname.split("/")[1].split("/"))
        {
            return item.pageTitulo
        }
    });

    function toggleMenu(){
        setMenuOpened(!menuOpened)
    }

    return (
        <>
        <HeaderEstilizado>
            <h6>{titulo}</h6>
            <RightItems>
                <div className={styles.divisor}>
                    {/* <PrecisoDeAjuda /> */}
                    {/* <RiNotificationLine size={18} className={styles.icon} /> */}
                </div>
                <div className={styles.divisor}>
                    {usuario.tipo !== "candidato" &&
                        <ItemEmpresa onClick={aoClicar}>{nomeEmpresa}<BsArrowLeftRight /></ItemEmpresa>
                    }
                    <ItemUsuario onClick={toggleMenu}>
                        <div className="user">{usuario.name.charAt(0)}</div>
                        <MdOutlineKeyboardArrowDown />
                    </ItemUsuario>
                </div>
            </RightItems>
            <Menu opened={menuOpened} aoFechar={toggleMenu} />
        </HeaderEstilizado>
        </>
    )
}

export default Cabecalho