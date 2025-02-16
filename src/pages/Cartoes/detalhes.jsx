import { Link, useParams } from "react-router-dom"
import { Skeleton } from 'primereact/skeleton'
import Frame from '@components/Frame'
import Texto from '@components/Texto'
import Titulo from '@components/Titulo'
import Container from '@components/Container'
import BotaoGrupo from '@components/BotaoGrupo'
import BotaoVoltar from '@components/BotaoVoltar'
import SwitchInput from '@components/SwitchInput'
import BotaoSemBorda from '@components/BotaoSemBorda'
import { GrAddCircle } from "react-icons/gr"
import styles from './Cartoes.module.css'
import styled from "styled-components"
import { MdOutlineChevronRight } from "react-icons/md"
import { PiCardsFill } from "react-icons/pi"
import { useState } from "react"
import ModalBloquearCartao from "@components/ModalBloquearCartao"

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

function CartaoDetalhes() {

    const { id } = useParams()
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
      
       <Frame>
            <Container gap="24px">
                <BotaoVoltar linkFixo="/elegibilidade" />
                <BotaoGrupo align="start">
                    <Titulo>
                        <h3>Maria Eduarda</h3>
                    </Titulo>
                    <BotaoSemBorda $color="var(--error)">
                        <Link onClick={() => {}} className={styles.link}>
                            Detalhes do colaborador&nbsp;
                            <GrAddCircle className={styles.icon} />
                        </Link>
                    </BotaoSemBorda>
                </BotaoGrupo>
                <Texto weight={700}>Cartão disponível</Texto>
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
                        <Link to="/elegibilidade/solicitar-segunda-via/123">
                            <MdOutlineChevronRight size={20} />
                        </Link>
                    </CardLine>
                    <CardLine>
                        <Texto weight="800">Bloquear temporariamente</Texto>
                        <SwitchInput checked={checked} onChange={bloquearCartao} />
                    </CardLine>
                </div>
            </Container>
            <ModalBloquearCartao opened={modalOpened} aoClicar={() => setChecked(true)} aoFechar={() => setModalOpened(false)}/>
        </Frame>
    )
}

export default CartaoDetalhes