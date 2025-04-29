import styles from './Pedidos.module.css'
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
import DataTablePedidosDetalhes from '@components/DataTablePedidosDetalhes'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { addLocale } from 'primereact/api'
import events from '@json/pedidos.json'
import FrameVertical from '@components/FrameVertical'
import { Tag } from 'primereact/tag'
import { Real } from '@utils/formats'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function DetalhesPedidos() {

    let { id } = useParams()
    const location = useLocation();
    const [pedido, setPedido] = useState([])
    const toast = useRef(null)
    const [loading, setLoading] = useState(false)
   
    useEffect(() => {
        if(pedido.length == 0)
        {
            let cc = events.filter(evento => evento.id == id);
            if(cc.length > 0)
            {
                setPedido(cc[0])
            }
        }
    }, [pedido])


    function representativSituacaoTemplate() {
        let status = pedido?.status;
        
        switch(pedido?.status)
        {
            case 'Em preparação':
                status = <Tag severity="neutral" value="Em preparação"></Tag>;
                break;
            case 'Em validação':
                status = <Tag severity="warning" value="Em validação"></Tag>;
                break;
            case 'Em aprovação':
                status = <Tag severity="info" value="Em aprovação"></Tag>;
                break;
            case 'Pedido Realizado':
                status = <Tag severity="success" value="Pedido Realizado"></Tag>;
                break;
            case 'Cancelado':
                status = <Tag severity="danger" value="Cancelado"></Tag>;
                break;
        }
        return status
    }
    
    return (
        <>
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            <Container gap="32px">
                <BotaoVoltar linkFixo="/pedidos" />
                {pedido && pedido?.tipo ?
                    <>
                    <BotaoGrupo align="space-between">
                        <FrameVertical gap="10px">
                            <h3>{pedido.tipo} - {pedido.data_referencia}</h3>
                            {representativSituacaoTemplate()}
                        </FrameVertical>
                        <BotaoGrupo align="center">
                            <BotaoSemBorda color="var(--primaria)">
                                <FaDownload/><Link onClick={() => setModalOpened(true)} className={styles.link}>Importar planilha</Link>
                            </BotaoSemBorda>
                        </BotaoGrupo>
                    </BotaoGrupo>
                    <div className={styles.card_dashboard}>
                        <Texto>Data de Pagamento</Texto>
                        {pedido?.data ?
                            <Texto weight="800">{pedido?.data}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                        }
                    </div>
                    </>
                    : <></>
                }
                <DataTablePedidosDetalhes pedidos={pedido?.detalhes} />
            </Container>
        </Frame>
        </>
    )
}

export default DetalhesPedidos