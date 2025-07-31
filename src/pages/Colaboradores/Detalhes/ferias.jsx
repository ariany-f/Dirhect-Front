import Titulo from '@components/Titulo'
import QuestionCard from '@components/QuestionCard'
import BotaoGrupo from '@components/BotaoGrupo'
import Botao from '@components/Botao'
import { AiFillQuestionCircle } from 'react-icons/ai'
import styled from 'styled-components'
import { useParams, useOutletContext } from 'react-router-dom'
import { useEffect, useState } from 'react'
import http from '@http'
import Loading from '@components/Loading'
import styles from './Detalhes.module.css'
import DataTableDependentes from '@components/DataTableDependentes'
import DataTableFerias from '@components/DataTableFerias'
import { useSessaoUsuarioContext } from '../../../contexts/SessaoUsuario'
import { GrAddCircle } from 'react-icons/gr'
import ModalDetalhesFerias from '@components/ModalDetalhesFerias'
import { ArmazenadorToken } from '@utils'
import { FaUmbrellaBeach } from 'react-icons/fa'
import Texto from '@components/Texto'

const DivPrincipal = styled.div`
    width: 65vw;
`

const TabPanel = styled.div`
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 24px;
`

const TabButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${({ active }) => active ? 'linear-gradient(to left, var(--black), var(--gradient-secundaria))' : '#f5f5f5'};
    color: ${({ active }) => active ? '#fff' : '#333'};
    border: none;
    border-radius: 8px 8px 0 0;
    font-size: 16px;
    font-weight: 500;
    padding: 10px 22px;
    cursor: pointer;
    margin-right: 2px;
    box-shadow: ${({ active }) => active ? '0 2px 8px var(--gradient-secundaria)40' : 'none'};
    transition: background 0.2s, color 0.2s;
    outline: none;
    border-bottom: ${({ active }) => active ? '2px solid var(--gradient-secundaria)' : '2px solid transparent'};
    &:hover {
        background: ${({ active }) => active ? 'linear-gradient(to left, var(--black), var(--gradient-secundaria))' : '#ececec'};
    }
`

function ColabroadorFerias() {

    let { id } = useParams()
    const colaboradorDoContexto = useOutletContext();
    const [loading, setLoading] = useState(false)
    const [eventoSelecionado, setEventoSelecionado] = useState(null)
    const [ferias, setFerias] = useState(null)
    const [tab, setTab] = useState('abertas') // 'abertas' ou 'fechadas'
    const {usuario} = useSessaoUsuarioContext()

    const colaborador = colaboradorDoContexto ? {
        ...colaboradorDoContexto,
        feriasARequisitar: [
            {
                periodo_aquisitivo_inicio: '2024-01-01',
                periodo_aquisitivo_fim: '2024-12-31',
                saldo_dias: 30,
                limite: '2025-11-30',
            }
        ]
    } : null;

    useEffect(() => {
        setLoading(true)
        const periodoAberto = tab === 'abertas' ? true : false
        const incluirFinalizadas = (periodoAberto ? false : true)
        http.get(`ferias/?format=json&funcionario=${id}&periodo_aberto=${periodoAberto}&incluir_finalizadas=${incluirFinalizadas}`)
        .then(response => {
            setFerias(response)
            setLoading(false)
        })
        .catch(erro => {
            console.log(erro)
            setLoading(false)
        })
    }, [id, tab])

    const handleTabChange = (newTab) => {
        setTab(newTab)
    }

    const criarSolicitacao = () => {
        if (colaborador && colaborador.feriasARequisitar && colaborador.feriasARequisitar.length > 0) {
            const periodo = colaborador.feriasARequisitar[0];
            const evento = {
                colab: {
                    id: colaborador.id,
                    nome: colaborador.funcionario_pessoa_fisica?.nome,
                    gestor: colaborador.gestor,
                },
                evento: { ...periodo },
                tipo: 'aSolicitar'
            };
            setEventoSelecionado(evento);
        } else {
            alert("Não há períodos de férias disponíveis para solicitação no momento.");
        }
    }

    return (
        <>
            <Loading opened={loading} />
            <BotaoGrupo align="space-between">
                <Titulo>
                    <QuestionCard alinhamento="start" element={<h6>Férias</h6>}>
                        <AiFillQuestionCircle className="question-icon" size={20} />
                    </QuestionCard>
                </Titulo>
            </BotaoGrupo>
            <TabPanel>
                <TabButton active={tab === 'abertas'} onClick={() => handleTabChange('abertas')}>
                    <Texto color={tab === 'abertas' ? 'white' : '#000'}>Abertas</Texto>
                </TabButton>
                <TabButton active={tab === 'fechadas'} onClick={() => handleTabChange('fechadas')}>
                    <Texto color={tab === 'fechadas' ? 'white' : '#000'}>Fechadas</Texto>
                </TabButton>
            </TabPanel>
            <DataTableFerias colaborador={id} ferias={ferias}/>
            <ModalDetalhesFerias opened={!!eventoSelecionado} evento={eventoSelecionado} aoFechar={() => setEventoSelecionado(null)} />
        </>
    )
}

export default ColabroadorFerias