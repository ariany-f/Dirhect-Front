import styles from './Contratos.module.css'
import styled from "styled-components"
import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import { GrAddCircle } from 'react-icons/gr'
import Botao from '@components/Botao'
import { Skeleton } from 'primereact/skeleton'
import Container from "@components/Container"
import { FaArrowAltCircleRight, FaDownload, FaTrash } from 'react-icons/fa'
import BotaoVoltar from "@components/BotaoVoltar"
import ContainerHorizontal from "@components/ContainerHorizontal"
import CustomImage from "@components/CustomImage"
import Loading from '@components/Loading'
import BotaoGrupo from "@components/BotaoGrupo"
import { Toast } from 'primereact/toast'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import http from "@http"
// import contratos from '@json/contratos.json'
import FrameVertical from '@components/FrameVertical'
import { Tag } from 'primereact/tag'
import DataTableContratosDetalhes from '@components/DataTableContratosDetalhes'
import ModalContratoBeneficios from '../../components/ModalContratoBeneficio'

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
    const [modalOpened, setModalOpened] = useState(false)
   
    useEffect(() => {
        if(contrato.length == 0)
        {
            http.get(`contrato/${id}/?format=json`)
            .then(response => {
                setContrato(response)
            })
            .catch(erro => {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar dados do contrato', life: 3000 });
            })
            .finally(function() {
                setLoading(false)
            })
        }

    }, [contrato])

    const vincularBeneficio = (id_beneficio) => {
       
        const data = {};
        data.contrato = parseInt(id);
        data.beneficio = parseInt(id_beneficio);

        http.post('contrato_beneficio/', data)
        .then(response => {
            if(response.id)
            {
                toast.current.show({severity:'success', summary: 'Sucesso', detail: 'Benefício vinculado com sucesso!', life: 3000});
            }
        })
        .catch(erro => {
            toast.current.show({severity:'error', summary: 'Erro', detail: 'Erro ao vincular benefício!', life: 3000});
        })
        .finally(function() {
            setModalOpened(false)
        })
    }
    
    return (
        <>
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            <Container gap="32px">
                <BotaoVoltar linkFixo="/contratos" />
                {contrato && contrato?.dados_operadora?.nome ?
                    <>
                    <BotaoGrupo align="space-between">
                        <FrameVertical gap="10px">
                            <ContainerHorizontal padding={'0px'} align="start" gap={'10px'} key={contrato?.dados_operadora?.id}>
                                <CustomImage src={contrato?.dados_operadora?.imagem} alt={contrato?.dados_operadora?.nome} width={90} height={45} title={contrato?.dados_operadora?.nome} />
                                <b>{contrato?.dados_operadora?.nome}</b>
                            </ContainerHorizontal>
                        </FrameVertical>
                        <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon} fill="white" color="white"/> Adicionar Benefício ao Contrato</Botao>
                    </BotaoGrupo>
                    <div className={styles.card_dashboard}>
                        <Texto>Observação</Texto>
                        {contrato?.observacao ?
                            <Texto weight="800">{contrato?.observacao}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                        }
                    </div>
                    </>
                    : <></>
                }
                <DataTableContratosDetalhes beneficios={contrato?.beneficios} />
                <ModalContratoBeneficios operadora={contrato?.dados_operadora} aoSalvar={vincularBeneficio} opened={modalOpened} aoFechar={() => setModalOpened(false)} />
            </Container>
        </Frame>
        </>
    )
}

export default DetalhesContratos