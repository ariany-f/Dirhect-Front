import styles from './Tarefas.module.css'
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
import DataTableTarefasDetalhes from '@components/DataTableTarefasDetalhes'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { addLocale } from 'primereact/api'
import tarefas from '@json/tarefas.json'
import FrameVertical from '@components/FrameVertical'
import { Tag } from 'primereact/tag'
import { Real } from '@utils/formats'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function DetalhesTarefas() {

    let { id } = useParams()
    const location = useLocation();
    const [tarefa, setTarefa] = useState([])
    const toast = useRef(null)
    const [loading, setLoading] = useState(false)
   
    useEffect(() => {
        if(tarefa.length == 0)
        {
            let cc = tarefas.filter(tarefa => tarefa.id == id);
            if(cc.length > 0)
            {
                setTarefa(cc[0])
            }
        }
    }, [tarefa])


    function representativSituacaoTemplate() {
        let status = tarefa?.status;
        
        switch(tarefa?.status)
        {
            case 'Concluída':
                status = <Tag severity="success" value="Concluída"></Tag>;
                break;
            case 'Em andamento':
                status = <Tag severity="warning" value="Em andamento"></Tag>;
                break;
            case 'Aguardando':
                status = <Tag severity="danger" value="Aguardando Início"></Tag>;
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
                <BotaoVoltar linkFixo="/tarefas" />
                {tarefa && tarefa?.tipo ?
                    <>
                    <BotaoGrupo align="space-between">
                        <FrameVertical gap="10px">
                            <h3>{tarefa.tipo}</h3>
                            {representativSituacaoTemplate()}
                        </FrameVertical>
                    </BotaoGrupo>
                    <div className={styles.card_dashboard}>
                        <Texto>Itens</Texto>
                        {tarefa?.total_tarefas ?
                            <Texto weight="800">{tarefa?.feito}/{tarefa?.total_tarefas}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                        }
                    </div>
                    </>
                    : <></>
                }
                <DataTableTarefasDetalhes tarefas={tarefa?.checklist} />
            </Container>
        </Frame>
        </>
    )
}

export default DetalhesTarefas