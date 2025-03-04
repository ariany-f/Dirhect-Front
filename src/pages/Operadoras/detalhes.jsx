import styles from './Operadoras.module.css'
import styled from "styled-components"
import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import Frame from '@components/Frame'
import http from "@http"
import Container from "@components/Container"
import BotaoVoltar from "@components/BotaoVoltar"
import Loading from '@components/Loading'
import BotaoGrupo from "@components/BotaoGrupo"
import { Toast } from 'primereact/toast'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import FrameVertical from '@components/FrameVertical'
import { Tag } from 'primereact/tag'
import DataTableOperadorasDetalhes from '@components/DataTableOperadorasDetalhes'

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
   
    useEffect(() => {
        if(!operadora) {
            http.get(`operadora/${id}/?format=json`)
            .then(response => {
                setOperadora(response)
            })
            .catch(erro => console.log(erro))
        }
    }, [operadora])


    function representativSituacaoTemplate() {
        let status = operadora?.status;
        
        switch(operadora?.status)
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
                <BotaoVoltar linkFixo="/operadoras" />
                {operadora && operadora?.nome ?
                    <>
                    <BotaoGrupo align="space-between">
                        <FrameVertical gap="10px">
                            <h3>{operadora.nome}</h3>
                        </FrameVertical>
                    </BotaoGrupo>
                    </>
                    : <></>
                }
                <DataTableOperadorasDetalhes beneficios={operadora?.beneficios_vinculados} />
            </Container>
        </Frame>
        </>
    )
}

export default DetalhesOperadoras