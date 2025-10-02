import styles from './Calendarios.module.css'
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
// import DataTableCalendariosDetalhes from '@components/DataTableCalendariosDetalhes'
// import ModalCalendarioBeneficios from '@components/ModalCalendarioBeneficio'
import { Real } from '@utils/formats'
import { useTranslation } from 'react-i18next'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function DetalhesCalendarios() {

    let { id } = useParams()
    const location = useLocation();
    const [calendario, setCalendario] = useState(false)
    const toast = useRef(null)
    const [loading, setLoading] = useState(false)
    const [modalOpened, setModalOpened] = useState(false)
    const { t } = useTranslation('common');
   
    useEffect(() => {
        if(!calendario) {
            http.get(`calendario/${id}/?format=json`)
            .then(response => {
                setCalendario(response)
            })
            .catch(erro => console.log(erro))
        }
    }, [calendario, modalOpened])

    const vincularBeneficio = (beneficio) => {
        const data = {};
        data.calendario = parseInt(id);
        data.beneficio = parseInt(beneficio.code);

        http.post('beneficio_calendario/', data)
        .then(response => {
            if(response.id)
            {
                calendario.beneficios_vinculados.push({id: beneficio.code, beneficio:beneficio})
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
                <BotaoVoltar linkFixo="/calendarios" />
                {calendario && calendario?.nome ?
                    <>
                    <BotaoGrupo align="space-between">
                        <FrameVertical gap="10px">
                            <ContainerHorizontal padding={'0px'} align="start" gap={'10px'} key={calendario.id}>
                                <CustomImage src={calendario?.imagem_url} alt={calendario?.nome} width={90} height={45} title={calendario?.nome} />
                                <b>{calendario?.nome}</b>
                            </ContainerHorizontal>
                        </FrameVertical>
                        <Botao aoClicar={() => {setModalOpened(true);}} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon} fill="var(--secundaria)" color="var(--secundaria)"/> {t('add')} Benefício</Botao>
                    </BotaoGrupo>
                    </>
                    : <></>
                }
                {/* <DataTableCalendariosDetalhes beneficios={calendario?.beneficios_vinculados} /> */}
                {/* <ModalCalendarioBeneficios aoSalvar={vincularBeneficio} beneficiosCalendario={calendario?.beneficios_vinculados} opened={modalOpened} aoFechar={() => setModalOpened(false)} /> */}
            </Container>
        </Frame>
        </>
    )
}

export default DetalhesCalendarios