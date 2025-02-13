import styles from './Contratos.module.css'
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
import contratos from '@json/contratos.json'
import FrameVertical from '../../components/FrameVertical'
import { Tag } from 'primereact/tag'
import DataTableContratosDetalhes from '../../components/DataTableContratosDetalhes'

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

function DetalhesContratos() {

    let { id } = useParams()
    const location = useLocation();
    const [contrato, setContrato] = useState([])
    const toast = useRef(null)
    const [loading, setLoading] = useState(false)
   
    useEffect(() => {
        if(contrato.length == 0)
        {
            let cc = contratos.filter(evento => evento.id == id);
            if(cc.length > 0)
            {
                setContrato(cc[0])
            }
        }
    }, [contrato])


    function representativSituacaoTemplate() {
        let status = contrato?.status;
        
        switch(contrato?.status)
        {
            case 'Aprovado':
                status = <Tag severity="success" value="Aprovado"></Tag>;
                break;
            case 'Aguardando':
                status = <Tag severity="warning" value="Aguardando"></Tag>;
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
                <BotaoVoltar linkFixo="/contratos" />
                {contrato && contrato?.nome_fornecedor ?
                    <>
                    <BotaoGrupo align="space-between">
                        <FrameVertical gap="10px">
                            <h3>{contrato.nome_fornecedor}</h3>
                        </FrameVertical>
                    </BotaoGrupo>
                    <div className={styles.card_dashboard}>
                        <Texto>Descritivo</Texto>
                        {contrato?.descritivo ?
                            <Texto weight="800">{contrato?.descritivo}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                        }
                    </div>
                    </>
                    : <></>
                }
                <DataTableContratosDetalhes beneficios={contrato?.beneficios} />
            </Container>
        </Frame>
        </>
    )
}

export default DetalhesContratos