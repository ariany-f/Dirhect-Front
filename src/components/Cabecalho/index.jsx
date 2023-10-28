import { styled } from "styled-components"
import PrecisoDeAjuda from "@components/PrecisoDeAjuda"
import { RiNotificationLine } from "react-icons/ri"
import styles from './Cabecalho.module.css'
import { Link, useLocation } from "react-router-dom"
import { BsArrowLeftRight } from 'react-icons/bs'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'

const HeaderEstilizado = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: fit-content;
    top: 0;
`

const RightItems = styled.nav`
    display: flex;
    align-items: center;
    gap: 48px;
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
const Cabecalho = ({ nomeEmpresa }) => {
    
    const location = useLocation();

    const titulos = [
        {
            "id": 1,
            "url": "",
            "pageTitulo": "Plataforma RH"
        },
        {
            "id": 2,
            "url": "extrato",
            "pageTitulo": "Extrato"
        },
        {
            "id": 3,
            "url": "colaborador",
            "pageTitulo": "Colaboradores"
        },
        {
            "id": 4,
            "url": "departamento",
            "pageTitulo": "Departamentos"
        },
        {
            "id": 5,
            "url": "cartao",
            "pageTitulo": "Cartões"
        },
        {
            "id": 6,
            "url": "beneficio",
            "pageTitulo": "Benefícios"
        },
        {
            "id": 7,
            "url": "premiacao",
            "pageTitulo": "Premiações"
        },
        {
            "id": 8,
            "url": "despesa",
            "pageTitulo": "Despesas"
        }
    ];

    const titulo = titulos.map((item) => {
        if(item.url == location.pathname.split("/")[1].split("/"))
        {
            return item.pageTitulo
        }
    });

    return (
        <HeaderEstilizado>
            <h6>{titulo}</h6>
            <RightItems>
                <div className={styles.divisor}>
                    <PrecisoDeAjuda />
                    <RiNotificationLine size={18} className={styles.icon} />
                </div>
                <div className={styles.divisor}>
                    <Link className={styles.link} to="/login/selecionar-empresa">
                        <ItemEmpresa>{nomeEmpresa}<BsArrowLeftRight /></ItemEmpresa>
                    </Link>
                    <ItemUsuario>
                        <div className="user">{'S'}</div>
                        <MdOutlineKeyboardArrowDown />
                    </ItemUsuario>
                </div>
            </RightItems>
        </HeaderEstilizado>
    )
}

export default Cabecalho