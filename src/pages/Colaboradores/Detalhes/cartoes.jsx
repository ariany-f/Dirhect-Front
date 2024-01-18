import { Skeleton } from 'primereact/skeleton'
import SwitchInput from '@components/SwitchInput'
import Titulo from '@components/Titulo'
import Texto from '@components/Texto'
import styles from './Detalhes.module.css'
import styled from "styled-components"
import { PiCardsFill } from 'react-icons/pi'
import { MdOutlineChevronRight } from 'react-icons/md'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ModalBloquearCartao from '../../../components/ModalBloquearCartao'

const CardLine = styled.div`
    padding: 24px 0px;
    border-bottom: 1px solid var(--neutro-200);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:nth-child(1) {
        padding-top: 8px;
    }
    &:last-of-type {
        border-bottom: none;
        padding-bottom: 8px;
    }
`
function ColaboradorCartoes() {

    const [cartoes, setCartoes] = useState({})
    const [checked, setChecked] = useState(false)
    const [modalOpened, setModalOpened] = useState(false)

    function bloquearCartao()
    {
        if(!checked)
        {
            setModalOpened(true)
        }
        else
        {
            setChecked(false)
        }
    }

    return (
        <>
            <Titulo><h6>Cartão disponível</h6></Titulo>
            {cartoes.length ?
                <></>
            : <Skeleton variant="rectangular" width={400} height={200} />
            }
            <div className={styles.card_dashboard}>
                <CardLine>
                    <Texto size="18px" weight="800">Gerenciar Cartão</Texto>
                </CardLine>
                <CardLine>
                    <Texto weight="800">
                        <PiCardsFill size={18} />
                        &nbsp;2ª via do cartão
                    </Texto>
                    <Link to="/cartao/solicitar-segunda-via/123">
                        <MdOutlineChevronRight size={20} />
                    </Link>
                </CardLine>
                <CardLine>
                    <Texto weight="800">Bloquear temporariamente</Texto>
                    <SwitchInput checked={checked} onChange={bloquearCartao} />
                </CardLine>
            </div>
            <ModalBloquearCartao opened={modalOpened} aoClicar={() => setChecked(true)} aoFechar={() => setModalOpened(false)}/>
        </>
    )
}

export default ColaboradorCartoes