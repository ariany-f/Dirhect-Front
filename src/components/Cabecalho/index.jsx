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

const Cabecalho = ({ titulo, nomeEmpresa }) => {
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