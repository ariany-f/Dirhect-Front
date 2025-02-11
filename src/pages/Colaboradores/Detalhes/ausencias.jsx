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
import DataTableFerias from '../../../components/DataTableFerias'
import { useSessaoUsuarioContext } from '../../../contexts/SessaoUsuario'
import { GrAddCircle } from 'react-icons/gr'
import ModalFerias from '../../../components/ModalFerias'
import DataTableAusencias from '../../../components/DataTableAusencias'

const DivPrincipal = styled.div`
    width: 65vw;
`

function ColaboradorAusencias() {

    let { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [modalOpened, setModalOpened] = useState(false)
    const [ausencias, setAusencias] = useState(null)
    const {usuario} = useSessaoUsuarioContext()

    useEffect(() => {
            
    }, [ausencias])

    return (
        <DivPrincipal>
            <Loading opened={loading} />
            <Titulo>
                <QuestionCard alinhamento="start" element={<h6>Ausências</h6>}>
                    <AiFillQuestionCircle className="question-icon" size={20} />
                </QuestionCard>
            </Titulo>
            {(usuario.tipo == 'cliente' || usuario.tipo == 'equipeFolhaPagamento') && 
                <BotaoGrupo align="end">
                    <BotaoGrupo align="center">
                        <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon} fill="white" color="white"/> Registrar Ausência</Botao>
                    </BotaoGrupo>
                </BotaoGrupo>}
            <DataTableAusencias colaborador={id} ausencias={ausencias}/>
            <ModalFerias opened={modalOpened} colaborador={id} aoFechar={() => setModalOpened(false)} />
        </DivPrincipal>
    )
}

export default ColaboradorAusencias