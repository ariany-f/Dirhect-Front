import styles from './Pedidos.module.css'
import styled from "styled-components"
import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import Botao from '@components/Botao'
import BadgeGeral from '@components/BadgeGeral'
import { Skeleton } from 'primereact/skeleton'
import Container from "@components/Container"
import { FaArrowAltCircleRight, FaDownload, FaTrash } from 'react-icons/fa'
import BotaoVoltar from "@components/BotaoVoltar"
import Loading from '@components/Loading'
import BotaoGrupo from "@components/BotaoGrupo"
import BotaoSemBorda from "@components/BotaoSemBorda"
import { Toast } from 'primereact/toast'
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import DataTableElegibilidadeDetalhes from '@components/DataTableElegibilidadeDetalhes'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { addLocale } from 'primereact/api'
import elegibilidades from '@json/elegibilidade.json'
import FrameVertical from '@components/FrameVertical'
import { Tag } from 'primereact/tag'

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function DetalhesElegibilidade() {

    let { id } = useParams()
    const location = useLocation();
    const [elegibilidade, setElegibilidade] = useState([])
    const toast = useRef(null)
    const [loading, setLoading] = useState(false)
   
    useEffect(() => {
        if(elegibilidade.length == 0)
        {
            let cc = elegibilidades.filter(evento => evento.id == id);
            if(cc.length > 0)
            {
                setElegibilidade(cc[0])
            }
        }
    }, [elegibilidade])
    
    return (
        <>
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            <Container gap="32px">
                <BotaoVoltar linkFixo="/elegibilidade" />
                {elegibilidade && elegibilidade?.tipo ?
                    <>
                    <BotaoGrupo align="space-between">
                        <FrameVertical gap="10px">
                            <h3>{elegibilidade.referencia}</h3>
                            <BadgeGeral nomeBeneficio={elegibilidade.tipo}></BadgeGeral>
                            {/* {representativSituacaoTemplate()} */}
                        </FrameVertical>
                        <BotaoGrupo align="center">
                            <BotaoSemBorda color="var(--primaria)">
                                <FaDownload/><Link onClick={() => setModalOpened(true)} className={styles.link}>Importar planilha</Link>
                            </BotaoSemBorda>
                        </BotaoGrupo>
                    </BotaoGrupo>
                    <div className={styles.card_dashboard}>
                        <Texto>Total de Colaboradores</Texto>
                        {elegibilidade?.total_colaboradores ?
                            <Texto weight="800">{elegibilidade?.total_colaboradores}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                        }
                    </div>
                    </>
                    : <></>
                }
                <DataTableElegibilidadeDetalhes elegibilidade={elegibilidade?.contratos} />
            </Container>
        </Frame>
        </>
    )
}

export default DetalhesElegibilidade