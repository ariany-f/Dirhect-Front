import { styled } from "styled-components"
import PrecisoDeAjuda from "@components/PrecisoDeAjuda"
import { RiNotificationLine } from "react-icons/ri"
import styles from './Cabecalho.module.css'

const HeaderEstilizado = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: fit-content;
    top: 0;
`

const RightItems = styled.div`
    display: flex;
    align-items: center;
    gap: 48px;
`

const ItemEmpresa = styled.p`
    font-family: var(--fonte-secundaria);
    color: var(--black);
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px; /* 142.857% */
`

const Cabecalho = ({ nomeEmpresa }) => {

    const titulos = [
        {
            "id": 1,
            "url": "/",
            "pageTitulo": "Plataforma RH"
        },
        {
            "id": 2,
            "url": "/extrato",
            "pageTitulo": "Extrato"
        },
        {
            "id": 3,
            "url": "/colaborador",
            "pageTitulo": "Colaboradores"
        },
        {
            "id": 4,
            "url": "/departamento",
            "pageTitulo": "Departamentos"
        },
        {
            "id": 5,
            "url": "/cartao",
            "pageTitulo": "Cartões"
        },
        {
            "id": 6,
            "url": "/beneficio",
            "pageTitulo": "Benefícios"
        },
        {
            "id": 7,
            "url": "/premiacao",
            "pageTitulo": "Premiações"
        },
        {
            "id": 8,
            "url": "/despesa",
            "pageTitulo": "Despesas"
        }
    ];

    const titulo = titulos.map((item) => {
        if(item.url == window.location.pathname)
        {
            return item.pageTitulo
        }
        return ''
    })

    console.log(titulo);
    return (
        <HeaderEstilizado>
            <h6>{titulo}</h6>
            <RightItems>
                <PrecisoDeAjuda />
                <RiNotificationLine size={18} className={styles.icon} />
                <ItemEmpresa>{nomeEmpresa}</ItemEmpresa>
            </RightItems>
        </HeaderEstilizado>
    )
}

export default Cabecalho