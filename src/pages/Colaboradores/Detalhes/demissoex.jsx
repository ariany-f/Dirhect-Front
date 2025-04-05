import Titulo from '@components/Titulo'
import QuestionCard from '@components/QuestionCard'
import BotaoGrupo from '@components/BotaoGrupo'
import Botao from '@components/Botao'
import { AiFillQuestionCircle } from 'react-icons/ai'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import http from '@http'
import Loading from '@components/Loading'
import styles from './Detalhes.module.css'
import DataTableDependentes from '@components/DataTableDependentes'
import DataTableFerias from '@components/DataTableFerias'
import { useSessaoUsuarioContext } from '../../../contexts/SessaoUsuario'
import { GrAddCircle } from 'react-icons/gr'
import ModalFerias from '@components/ModalFerias'
import DataTableDemissao from '@components/DataTableDemissoes'
import ModalDemissao from '@components/ModalDemissao'

const DivPrincipal = styled.div`
    width: 65vw;
`

function ColabroadorDemissoes() {

    let { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [modalOpened, setModalOpened] = useState(false)
    const [demissoes, setDemissoes] = useState(null)
    const {usuario} = useSessaoUsuarioContext()

    useEffect(() => {
        if(!demissoes)
        {
            http.get(`funcionario/?format=json&situacao=D`)
            .then(response => {
                setDemissoes(response);
            })
            .catch(erro => console.log(erro))
        }
    }, [demissoes])

    return (
        <>
            <Loading opened={loading} />
            <Titulo>
                <h6>Demissões</h6>
            </Titulo>
            {(usuario.tipo == 'cliente' || usuario.tipo == 'equipeFolhaPagamento') && 
                <BotaoGrupo align="end">
                    <BotaoGrupo align="center">
                        <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon} fill="white" color="white"/> Criar solicitação de Demissão</Botao>
                    </BotaoGrupo>
                </BotaoGrupo>}
            {/* <DataTableDemissao colaborador={id} demissoes={demissoes}/> */}
            <ModalDemissao opened={modalOpened} colaborador={id} aoFechar={() => setModalOpened(false)} />
        </>
    )
}

export default ColabroadorDemissoes