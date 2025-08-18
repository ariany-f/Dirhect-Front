import styles from './Operadoras.module.css'
import styled from "styled-components"
import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import Frame from '@components/Frame'
import http from "@http"
import Botao from "@components/Botao"
import Container from "@components/Container"
import BotaoVoltar from "@components/BotaoVoltar"
import Loading from '@components/Loading'
import BotaoGrupo from "@components/BotaoGrupo"
import CustomImage from "@components/CustomImage"
import ContainerHorizontal from "@components/ContainerHorizontal"
import { GrAddCircle } from 'react-icons/gr'
import { Toast } from 'primereact/toast'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import FrameVertical from '@components/FrameVertical'
import { Tag } from 'primereact/tag'
import DataTableOperadorasDetalhes from '@components/DataTableOperadorasDetalhes'
import ModalOperadoraBeneficios from '@components/ModalOperadoraBeneficio'
import { Real } from '@utils/formats'
import { useTranslation } from 'react-i18next'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function DetalhesOperadoras() {

    let { id } = useParams()
    const location = useLocation();
    const [operadora, setOperadora] = useState(false)
    const toast = useRef(null)
    const [loading, setLoading] = useState(false)
    const [modalOpened, setModalOpened] = useState(false)
    const { t } = useTranslation('common');
   
    useEffect(() => {
        if(!operadora) {
            http.get(`operadora/${id}/?format=json`)
            .then(response => {
                setOperadora(response)
            })
            .catch(erro => console.log(erro))
        }
    }, [operadora, modalOpened])

    const vincularBeneficio = (beneficio) => {
        const data = {};
        data.operadora = parseInt(id);
        data.beneficio = parseInt(beneficio.code);

        http.post('beneficio_operadora/', data)
        .then(response => {
            if(response.id)
            {
                operadora.beneficios_vinculados.push({id: beneficio.code, beneficio:beneficio})
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
            <ConfirmDialog  />
            <Container gap="32px">
                <BotaoVoltar linkFixo="/operadoras" />
                {operadora && operadora?.nome ?
                    <>
                    <BotaoGrupo align="space-between">
                        <FrameVertical gap="10px">
                            <ContainerHorizontal padding={'0px'} align="start" gap={'10px'} key={operadora.id}>
                                <CustomImage src={operadora?.imagem_url} alt={operadora?.nome} width={90} height={45} title={operadora?.nome} />
                                <b>{operadora?.nome}</b>
                            </ContainerHorizontal>
                        </FrameVertical>
                        <Botao aoClicar={() => {setModalOpened(true);}} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon} fill="var(--secundaria)" color="var(--secundaria)"/> {t('add')} Benefício</Botao>
                    </BotaoGrupo>
                    </>
                    : <></>
                }
                <DataTableOperadorasDetalhes beneficios={operadora?.beneficios_vinculados} />
                <ModalOperadoraBeneficios aoSalvar={vincularBeneficio} beneficiosOperadora={operadora?.beneficios_vinculados} opened={modalOpened} aoFechar={() => setModalOpened(false)} />
            </Container>
        </Frame>
        </>
    )
}

export default DetalhesOperadoras