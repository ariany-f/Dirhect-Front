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
import { GrAddCircle } from 'react-icons/gr'
import { Toast } from 'primereact/toast'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import FrameVertical from '@components/FrameVertical'
import { Tag } from 'primereact/tag'
import DataTableOperadorasDetalhes from '@components/DataTableOperadorasDetalhes'
import ModalOperadoraBeneficios from '../../components/ModalOperadoraBeneficio'

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

function DetalhesOperadoras() {

    let { id } = useParams()
    const location = useLocation();
    const [operadora, setOperadora] = useState(false)
    const toast = useRef(null)
    const [loading, setLoading] = useState(false)
    const [modalOpened, setModalOpened] = useState(false)
   
    useEffect(() => {
        if(!operadora) {
            http.get(`operadora/${id}/?format=json`)
            .then(response => {
                setOperadora(response)
            })
            .catch(erro => console.log(erro))
        }
    }, [operadora, modalOpened])

    const vincularBeneficio = (id_beneficio) => {
       
        const data = {};
        data.operadora = parseInt(id);
        data.beneficio = parseInt(id_beneficio);

        http.post('beneficio_operadora/', data)
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
                <BotaoVoltar linkFixo="/operadoras" />
                {operadora && operadora?.nome ?
                    <>
                    <BotaoGrupo align="space-between">
                        <FrameVertical gap="10px">
                            <h3>{operadora.nome}</h3>
                        </FrameVertical>
                        <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon} fill="white" color="white"/> Adicionar Benefício</Botao>
                    </BotaoGrupo>
                    </>
                    : <></>
                }
                <DataTableOperadorasDetalhes beneficios={operadora?.beneficios_vinculados} />
                <ModalOperadoraBeneficios aoSalvar={vincularBeneficio} opened={modalOpened} aoFechar={() => setModalOpened(false)} />
            </Container>
        </Frame>
        </>
    )
}

export default DetalhesOperadoras