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
import { Real } from '@utils/formats'
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation('common');
   
    const carregarContrato = () => {
        setLoading(true);
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

    useEffect(() => {
        if(contrato.length == 0)
        {
            carregarContrato();
        }
    }, [contrato])

    const vincularBeneficio = (beneficio) => {
        
        const data = {};
        data.beneficio = parseInt(beneficio.code);
        data.contrato = parseInt(id);
        http.post('contrato_beneficio/', data)
        .then(response => {
            if(response.id)
            {
                contrato.beneficios.push(response)
                toast.current.show({severity:'success', summary: 'Sucesso', detail: 'Benefício vinculado com sucesso!', life: 3000});
                setContrato([]);
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
                        <Frame gap="15px">
                            <FrameVertical gap="10px">
                                <ContainerHorizontal padding={'0px'} align="start" gap={'10px'} key={contrato?.dados_operadora?.id}>
                                    <CustomImage src={contrato?.dados_operadora?.imagem_url} alt={contrato?.dados_operadora?.nome} width={90} height={45} title={contrato?.dados_operadora?.nome} />
                                    <b>{contrato?.dados_operadora?.nome} {contrato?.num_contrato_origem ? `- #${contrato?.num_contrato_origem}` : ``}</b>
                                    {
                                        contrato?.status == 'A' ?
                                        <Tag severity="success" value="Ativo"></Tag> :
                                        <Tag severity="danger" value="Inativo"></Tag>
                                    }
                                </ContainerHorizontal>
                            </FrameVertical>
                            {contrato?.dt_inicio && contrato?.dt_fim && 
                                <div>
                                <FrameVertical gap="10px" padding={"0px 0px 0px 5px"}>
                                    <ContainerHorizontal gap="10px">
                                        <Texto size={"12px"}>{contrato?.observacao}</Texto>
                                    </ContainerHorizontal>
                                </FrameVertical>
                                <FrameVertical gap="10px" padding={"0px 0px 0px 5px"}>
                                    <ContainerHorizontal gap="10px">
                                        <Texto size={"12px"}>De {new Date(contrato?.dt_inicio).toLocaleDateString('pt-BR')} a {new Date(contrato?.dt_fim).toLocaleDateString('pt-BR')}</Texto>
                                    </ContainerHorizontal>
                                </FrameVertical>
                                </div>
                            }
                        </Frame>
                        <Botao aoClicar={() => setModalOpened(true)} estilo="neutro" size="small" tab><GrAddCircle fill="black" color="black"/> {t('add')} Benefício ao Contrato</Botao>
                    </BotaoGrupo>
                    <div className={styles.card_dashboard}>
                       
                    </div>
                    </>
                    : <></>
                }
                <DataTableContratosDetalhes beneficios={contrato?.beneficios} onUpdate={carregarContrato} />
                <ModalContratoBeneficios beneficiosContrato={contrato?.beneficios} operadora={contrato?.dados_operadora} aoSalvar={vincularBeneficio} opened={modalOpened} aoFechar={() => setModalOpened(false)} />
            </Container>
        </Frame>
        </>
    )
}

export default DetalhesContratos