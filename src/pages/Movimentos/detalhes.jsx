import styles from './Movimentos.module.css'
import styled from "styled-components"
import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import Botao from '@components/Botao'
import { Skeleton } from 'primereact/skeleton'
import Container from "@components/Container"
import { FaArrowAltCircleRight, FaDownload, FaTrash } from 'react-icons/fa'
import BotaoVoltar from "@components/BotaoVoltar"
import Loading from '@components/Loading'
import BotaoGrupo from "@components/BotaoGrupo"
import BotaoSemBorda from "@components/BotaoSemBorda"
import { Toast } from 'primereact/toast'
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import DataTableMovimentosDetalhes from '@components/DataTableMovimentosDetalhes'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { addLocale } from 'primereact/api'
import movimentos from '@json/movimentos.json'
import FrameVertical from '../../components/FrameVertical'
import { Tag } from 'primereact/tag'
import { HiUserRemove, HiUserAdd } from "react-icons/hi";

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

function DetalhesMovimentos() {

    let { id } = useParams()
    const location = useLocation();
    const [movimento, setMovimento] = useState([])
    const toast = useRef(null)
    const [loading, setLoading] = useState(false)
   
    useEffect(() => {
        if(movimento.length == 0)
        {
            let cc = movimentos.filter(movimento => movimento.id == id);
            if(cc.length > 0)
            {
                setMovimento(cc[0])
            }
        }
    }, [movimento])


    const representativSituacaoTemplate = (rowData) => {
        let status = movimento?.status;

        switch(movimento?.status)
        {
            case 'Aprovado':
                status = <Tag severity={'success'} value="Aprovado"></Tag>;
                break;
            case 'Aguardando':
                status = <Tag severity={'warning'} value="Aguardando"></Tag>;
                break;
        }
        return <Frame alinhamento="center">{status}</Frame>
    }
    
    return (
        <>
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            <Container gap="32px">
                <BotaoVoltar linkFixo="/movimentos" />
                {movimento && movimento?.tipo ?
                    <>
                    <BotaoGrupo align="space-between">
                        <FrameVertical gap="10px">
                            <h3>{movimento.tipo}</h3>
                            {representativSituacaoTemplate()}
                        </FrameVertical>
                        <BotaoGrupo align="center">
                            <BotaoSemBorda color="var(--primaria)">
                                <FaDownload/><Link onClick={() => setModalOpened(true)} className={styles.link}>Importar planilha</Link>
                            </BotaoSemBorda>
                        </BotaoGrupo>
                    </BotaoGrupo>
                    <div className={styles.card_dashboard}>
                        <Texto>Data do Movimento</Texto>
                        {movimento?.data ?
                            <Texto weight="800">{movimento?.data}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                        }
                    </div>
                    </>
                    : <></>
                }
                <DataTableMovimentosDetalhes movimentos={movimento?.detalhes} />
            </Container>
        </Frame>
        </>
    )
}

export default DetalhesMovimentos