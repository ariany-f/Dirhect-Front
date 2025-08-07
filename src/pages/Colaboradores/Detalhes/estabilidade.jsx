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
import DataTableEstabilidade from '@components/DataTableEstabilidade'
import { useSessaoUsuarioContext } from '../../../contexts/SessaoUsuario'
import { GrAddCircle } from 'react-icons/gr'
import ModalSelecionarColaborador from '@components/ModalSelecionarColaborador'

const DivPrincipal = styled.div`
    width: 65vw;
`

function ColaboradorEstabilidade() {

    let { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [modalOpened, setModalOpened] = useState(false)
    const [estabilidades, setEstabilidades] = useState(null)
    const {usuario} = useSessaoUsuarioContext()

    useEffect(() => {
        const buscarEstabilidades = async () => {
            setLoading(true)
            try {
                const response = await http.get(`estabilidade/por-funcionario/?funcionario_id=${id}`)
                setEstabilidades(response)
            } catch (error) {
                console.error('Erro ao buscar estabilidades:', error)
                setEstabilidades([])
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            buscarEstabilidades()
        }
    }, [id])

    return (
        <>
            <Loading opened={loading} />
            <Titulo>
                <QuestionCard alinhamento="start" element={<h6>Estabilidade</h6>}>
                    <AiFillQuestionCircle className="question-icon" size={20} />
                </QuestionCard>
            </Titulo>
            {(usuario.tipo == 'cliente' || usuario.tipo == 'equipeFolhaPagamento') && 
                <BotaoGrupo align="end">
                    <BotaoGrupo align="center">
                        <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon} fill="var(--secundaria)" color="var(--secundaria)"/> Registrar Estabilidade</Botao>
                    </BotaoGrupo>
                </BotaoGrupo>}
            <DataTableEstabilidade colaborador={id} estabilidades={estabilidades}/>
            <ModalSelecionarColaborador opened={modalOpened} colaborador={id} aoFechar={() => setModalOpened(false)} />
        </>
    )
}

export default ColaboradorEstabilidade
