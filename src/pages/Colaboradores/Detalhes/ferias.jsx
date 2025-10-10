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
import DataTableFerias from '@components/DataTableFerias'
import DataTablePeriodoAquisitivo from '@components/DataTablePeriodoAquisitivo'
import { useSessaoUsuarioContext } from '../../../contexts/SessaoUsuario'
import { GrAddCircle } from 'react-icons/gr'
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
    const [ferias, setFerias] = useState(null)
    const [periodosAquisitivos, setPeriodosAquisitivos] = useState(null)
    const [tab, setTab] = useState('ferias_gozadas') // 'periodo_aquisitivo' ou 'ferias_gozadas'
    const [forceUpdate, setForceUpdate] = useState(0)
    const {usuario} = useSessaoUsuarioContext()
    
    // Situações dinâmicas para filtro (busca da API)
    const [situacoesFerias, setSituacoesFerias] = useState([]);

    const colaborador = colaboradorDoContexto ? {
        ...colaboradorDoContexto
    } : null;

    // Buscar períodos aquisitivos (para verificar se pode solicitar férias)
    useEffect(() => {
        http.get(`feriasperiodoaquisitivo/?format=json&funcionario=${id}&periodo_aberto=true`)
        .then(response => {
            setPeriodosAquisitivos(response)
        })
        .catch(erro => {
            console.log(erro)
        })
    }, [id, forceUpdate])

    // Buscar dados baseado na aba ativa
    useEffect(() => {
        setLoading(true)
        
        if (tab === 'periodo_aquisitivo') {
            // Busca períodos aquisitivos
            http.get(`feriasperiodoaquisitivo/?format=json&funcionario=${id}`)
            .then(response => {
                setFerias(response)
                setLoading(false)
            })
            .catch(erro => {
                console.log(erro)
                setLoading(false)
            })
        } else {
            // Busca férias gozadas
            http.get(`feriasperiodogozo/?format=json&funcionario=${id}`)
            .then(response => {
                setFerias(response)
                setLoading(false)
            })
            .catch(erro => {
                console.log(erro)
                setLoading(false)
            })
        }
    }, [id, tab, forceUpdate])


    // Buscar situações disponíveis da API
    useEffect(() => {
        const fetchSituacoes = async () => {
            try {
                const response = await http.get('ferias/situacoes/');
                // A resposta já vem no formato correto: [{value, label}, ...]
                setSituacoesFerias(response || []);
            } catch (error) {
                console.error('Erro ao buscar situações de férias:', error);
                // Fallback para as situações básicas se a API falhar
                const situacoesFallback = [
                    { value: 'I', label: 'Iniciada Solicitação' },
                    { value: 'E', label: 'Em Análise' },
                    { value: 'A', label: 'Aprovado' },
                    { value: 'F', label: 'Finalizada' },
                    { value: 'M', label: 'Marcada' },
                    { value: 'P', label: 'Pagas' }
                ];
                setSituacoesFerias(situacoesFallback);
            }
        };

        fetchSituacoes();
    }, []);

    const handleTabChange = (newTab) => {
        setTab(newTab)
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
                <TabButton active={tab === 'ferias_gozadas'} onClick={() => handleTabChange('ferias_gozadas')}>
                    <Texto color={tab === 'ferias_gozadas' ? 'white' : '#000'}>Lista</Texto>
                </TabButton>
                <TabButton active={tab === 'periodo_aquisitivo'} onClick={() => handleTabChange('periodo_aquisitivo')}>
                    <Texto color={tab === 'periodo_aquisitivo' ? 'white' : '#000'}>Período Aquisitivo</Texto>
                </TabButton>
            </TabPanel>
            
            {tab === 'periodo_aquisitivo' ? (
                <DataTablePeriodoAquisitivo 
                    colaborador={id} 
                    ferias={ferias}
                    situacoesUnicas={situacoesFerias}
                    onUpdate={() => setForceUpdate(prev => prev + 1)}
                />
            ) : (
                <DataTableFerias 
                    colaborador={id} 
                    ferias={ferias}
                    situacoesUnicas={situacoesFerias}
                    onUpdate={() => setForceUpdate(prev => prev + 1)}
                />
            )}
        </>
    )
}

export default ColabroadorFerias