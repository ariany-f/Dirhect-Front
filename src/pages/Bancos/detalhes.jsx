import styles from './Bancos.module.css'
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
// import DataTableBancosDetalhes from '@components/DataTableBancosDetalhes'
// import ModalBancoBeneficios from '@components/ModalBancoBeneficio'
import { Real } from '@utils/formats'
import { useTranslation } from 'react-i18next'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function DetalhesBancos() {

    let { id } = useParams()
    const location = useLocation();
    const [banco, setBanco] = useState(false)
    const toast = useRef(null)
    const [loading, setLoading] = useState(false)
    const [modalOpened, setModalOpened] = useState(false)
    const { t } = useTranslation('common');
   
    useEffect(() => {
        if(!banco) {
            http.get(`banco/${id}/?format=json`)
            .then(response => {
                setBanco(response)
            })
            .catch(erro => console.log(erro))
        }
    }, [banco, modalOpened])

    const vincularBeneficio = (beneficio) => {
        const data = {};
        data.banco = parseInt(id);
        data.beneficio = parseInt(beneficio.code);

        http.post('beneficio_banco/', data)
        .then(response => {
            if(response.id)
            {
                banco.beneficios_vinculados.push({id: beneficio.code, beneficio:beneficio})
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
                <BotaoVoltar linkFixo="/bancos" />
                {banco && banco?.nome ?
                    <>
                    <BotaoGrupo align="space-between">
                        <FrameVertical gap="10px">
                            <ContainerHorizontal padding={'0px'} align="start" gap={'10px'} key={banco.id}>
                                <CustomImage src={banco?.imagem_url} alt={banco?.nome} width={90} height={45} title={banco?.nome} />
                                <b>{banco?.nome}</b>
                            </ContainerHorizontal>
                        </FrameVertical>
                        <Botao aoClicar={() => {setModalOpened(true);}} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon} fill="var(--secundaria)" color="var(--secundaria)"/> {t('add')} Benefício</Botao>
                    </BotaoGrupo>
                    </>
                    : <></>
                }
                {/* <DataTableBancosDetalhes beneficios={banco?.beneficios_vinculados} /> */}
                {/* <ModalBancoBeneficios aoSalvar={vincularBeneficio} beneficiosBanco={banco?.beneficios_vinculados} opened={modalOpened} aoFechar={() => setModalOpened(false)} /> */}
            </Container>
        </Frame>
        </>
    )
}

export default DetalhesBancos