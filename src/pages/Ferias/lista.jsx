import http from '@http'
import { useEffect, useState, useRef } from "react"
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'

import { GrAddCircle } from 'react-icons/gr'
import styles from './Contratos.module.css'
import styled from "styled-components"
import { Link, useOutletContext } from "react-router-dom"
import Management from '@assets/Management.svg'
import CampoTexto from '@components/CampoTexto'
import DataTableFerias from '@components/DataTableFerias'
import ModalSelecionarColaborador from '@components/ModalSelecionarColaborador'
import ModalDetalhesFerias from '@components/ModalDetalhesFerias'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import CalendarFerias from './calendar_ferias'
import { FaListUl, FaRegCalendarAlt, FaUmbrellaBeach, FaSpinner } from 'react-icons/fa';
import Texto from '@components/Texto';
import { ArmazenadorToken } from '@utils';
import DropdownItens from '@components/DropdownItens';
import { Toast } from 'primereact/toast';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`

const ContainerSemRegistro = styled.div`
    display: flex;
    padding: 96px 12px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
    width: 100%;
    text-align: center;
    & p {
        margin: 0 auto;
    }

    & h6 {
        width: 60%;
    }
`

const HeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
`;

const TabPanel = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 0;
    padding-top: 2px;
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

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    
    &::-webkit-scrollbar {
        height: 8px;
        width: 8px;
        background: #f5f5f5;
        border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background: #b0b7c3;
    }
    &::-webkit-scrollbar-button {
        display: none;
        width: 0;
        height: 0;
    }
`

// Configurar o localizador com Moment.js
const localizer = momentLocalizer(moment);

function FeriasListagem() {

    const [ferias, setFerias] = useState(null)
    const [loading, setLoading] = useState(true)
    const [anoSelecionado, setAnoSelecionado] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [periodoAberto, setPeriodoAberto] = useState(true) // true = apenas abertos, false = apenas fechados, null = todos
    const [totalRecords, setTotalRecords] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [forceUpdate, setForceUpdate] = useState(0)
    const context = useOutletContext()
    const [modalSelecaoColaboradorOpened, setModalSelecaoColaboradorOpened] = useState(false)
    const [eventoSelecionado, setEventoSelecionado] = useState(null)
    const { usuario } = useSessaoUsuarioContext()
    const [tab, setTab] = useState('calendario') // 'lista' ou 'calendario'
    const toast = useRef(null);

    // Lista de anos disponíveis (últimos 5 anos + próximos 2)
    const currentYear = new Date().getFullYear()
    const anosDisponiveis = [
        { name: 'Todos os anos', value: null },
        { name: 'Últimos 2 anos', value: 'ultimos_2' },
        { name: 'Últimos 3 anos', value: 'ultimos_3' },
        { name: 'Últimos 4 anos', value: 'ultimos_4' },
        ...Array.from({ length: 9 }, (_, i) => {
            const year = currentYear - 6 + i
            return { name: year.toString(), value: year }
        })
    ]

    // Opções do filtro de período aberto
    const opcoesPeriodoAberto = [
        { name: 'Apenas Abertos', value: true },
        { name: 'Apenas Fechados', value: false },
        { name: 'Todos os Períodos', value: null }
    ]

    useEffect(() => {
        setLoading(true)
        
        let url = `ferias/?format=json`
        
        // Adiciona parâmetro de busca se houver termo de pesquisa
        if (searchTerm.trim()) {
            url += `&funcionario_nome=${encodeURIComponent(searchTerm.trim())}`
        }
        
        // Se estiver na aba calendário, adiciona filtro de período aberto
        if (tab === 'calendario') {
            url += `&periodo_aberto=true`
            url += `&incluir_finalizadas=true`
            url += `&dt_inicio__gte=${new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0]}`
        }
        // Se estiver na aba lista, adiciona parâmetros de paginação
        else if (tab === 'lista') {
            url += `&page=${currentPage}&page_size=${pageSize}`
            // Adiciona filtro de ano baseado na seleção
            if (anoSelecionado !== null && typeof anoSelecionado != 'object') {
                if (anoSelecionado === 'ultimos_2') {
                    url += `&dt_inicio__gte=${new Date(currentYear - 1, 0, 1).toISOString().split('T')[0]}`
                } else if (anoSelecionado === 'ultimos_3') {
                    url += `&dt_inicio__gte=${new Date(currentYear - 2, 0, 1).toISOString().split('T')[0]}`
                } else if (anoSelecionado === 'ultimos_4') {
                    url += `&dt_inicio__gte=${new Date(currentYear - 3, 0, 1).toISOString().split('T')[0]}`
                } else {
                    url += `&ano=${anoSelecionado}`
                }
            }

            if(!periodoAberto || periodoAberto === false || periodoAberto === 'false') {
                url += `&incluir_finalizadas=true`
            }
            // Adiciona filtro de período aberto se especificado
            if (periodoAberto !== null && typeof periodoAberto != 'object') {
                url += `&periodo_aberto=${periodoAberto}`
            }
        }
        
        http.get(url)
        .then(response => {
            setFerias(response.results || response)
            setTotalRecords(response.count || (response.results ? response.results.length : 0))
        })
        .catch(erro => {
            console.log(erro)
            setLoading(false)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [anoSelecionado, searchTerm, periodoAberto, tab, currentPage, pageSize, forceUpdate])

    const handleColaboradorSelecionado = async (colaborador) => {
        setModalSelecaoColaboradorOpened(false);

        try {
            const ferias = await http.get(`ferias/?format=json&funcionario=${colaborador.id}`)
            const feria = ferias[0]

            if(!feria) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Não há férias disponíveis para este colaborador', life: 3000 });
                return
            }

            let [anoRow, mesRow, diaRow] = feria.fimperaquis.split('T')[0].split('-').map(Number);
            // Subtrai 1 ano
            let dataInicioRow = new Date(anoRow - 1, mesRow - 1, diaRow);
            // Soma 1 dia
            dataInicioRow.setDate(dataInicioRow.getDate() + 1);
            
            const evento = {
                colab: {
                    id: colaborador.id,
                    nome: colaborador.nome || colaborador.funcionario_nome || colaborador.funcionario_pessoa_fisica?.nome,
                    gestor: colaborador.gestor,
                },
                evento: {
                    periodo_aquisitivo_inicio: dataInicioRow,
                    periodo_aquisitivo_fim: feria.fimperaquis,
                    saldo_dias: feria.nrodiasferias,
                    limite: feria.fimperaquis,
                    aviso_ferias: feria.aviso_ferias || null,
                    abono_pecuniario: feria.abono_pecuniario || false,
                    ferias_coletivas: feria.ferias_coletivas || false,
                    tarefas: feria.tarefas
                },
                tipo: 'aSolicitar'
            };
            setEventoSelecionado(evento);
        } catch (error) {
            console.error('Erro ao buscar férias do colaborador:', error)
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar férias do colaborador', life: 3000 });
        }
    }

    const fecharModal = (resultado) => {
        setEventoSelecionado(null);
        if (resultado) {
            if (resultado.sucesso) {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: resultado.mensagem, life: 3000 });
                // Atualiza a lista para refletir a nova solicitação
                setForceUpdate(p => p + 1);
            } else if (resultado.erro) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: resultado.mensagem, life: 3000 });
            } else if (resultado.aviso) {
                toast.current.show({ severity: 'warn', summary: 'Atenção', detail: resultado.mensagem, life: 3000 });
            } else if (resultado.info) {
                toast.current.show({ severity: 'info', summary: 'Aviso', detail: resultado.mensagem, life: 3000 });
            }
        }
    };

    // Função para lidar com mudança de aba
    const handleTabChange = (newTab) => {
        setTab(newTab)
        // Reset paginação quando mudar para lista
        if (newTab === 'lista') {
            setCurrentPage(1)
        }
    }

    // Reset paginação quando ano, busca ou período aberto mudar
    useEffect(() => {
        setCurrentPage(1)
    }, [anoSelecionado, searchTerm, periodoAberto])



    return (
        <ConteudoFrame>
            <Toast ref={toast} />
            <HeaderRow>
                <TabPanel>
                    <TabButton active={tab === 'calendario'} onClick={() => handleTabChange('calendario')}>
                        <FaRegCalendarAlt fill={tab === 'calendario' ? 'white' : '#000'} />
                        <Texto color={tab === 'calendario' ? 'white' : '#000'}>Calendário</Texto>
                    </TabButton>
                    <TabButton active={tab === 'lista'} onClick={() => handleTabChange('lista')}>
                        <FaListUl fill={tab === 'lista' ? 'white' : '#000'} />
                        <Texto color={tab === 'lista' ? 'white' : '#000'}>Lista</Texto>
                    </TabButton>
                </TabPanel>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', paddingTop: '2px' }}>
                    <BotaoGrupo verticalalign='flex-start'>
                        {loading && (
                            <div style={{
                                display: 'flex',
                                marginTop: '10px',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FaSpinner 
                                    size={24} 
                                    color="var(--gradient-secundaria)" 
                                    style={{
                                        animation: 'spin 1s linear infinite'
                                    }}
                                />
                            </div>
                        )}
                        {tab === 'lista' && 
                            <>
                                <DropdownItens
                                    valor={anoSelecionado}
                                    setValor={setAnoSelecionado}
                                    options={anosDisponiveis}
                                    placeholder="Todos os anos"
                                    name="ano"
                                    $height="40px"
                                    allowClear={false}
                                />
                                <DropdownItens
                                    valor={periodoAberto}
                                    setValor={setPeriodoAberto}
                                    options={opcoesPeriodoAberto}
                                    placeholder="Apenas Abertos"
                                    name="periodo_aberto"
                                    $height="40px"
                                    allowClear={false}
                                />
                            </>
                        }
                        <div style={{ width: '250px' }}>
                            <CampoTexto
                                valor={searchTerm}
                                setValor={setSearchTerm}
                                placeholder="Buscar por colaborador..."
                                type="search"
                                padding="8px 16px"
                            />
                        </div>
                        {(ArmazenadorToken.hasPermission('add_ferias') || usuario.tipo === 'colaborador') && (
                            <Botao aoClicar={() => setModalSelecaoColaboradorOpened(true)} estilo="vermilion" size="small" tab><FaUmbrellaBeach fill='var(--secundaria)' color='var(--secundaria)' className={styles.icon}/> Solicitar Férias</Botao>
                        )}
                    </BotaoGrupo>
                </div>
            </HeaderRow>
            <Wrapper>
                {loading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '200px',
                        fontSize: '16px',
                        color: 'var(--neutro-500)',
                        fontWeight: '500'
                    }}>
                        Carregando...
                    </div>
                ) : (ferias ? (
                    <>
                        {tab === 'calendario' && <CalendarFerias 
                            colaboradores={ferias} 
                            anoSelecionado={anoSelecionado} 
                            onUpdate={() => setForceUpdate(p => p + 1)}
                        />}
                        {tab === 'lista' && <DataTableFerias 
                            ferias={ferias} 
                            totalRecords={totalRecords}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            onUpdate={() => setForceUpdate(p => p + 1)}
                        />}
                    </>
                ) : (
                    <ContainerSemRegistro>
                        <section className={styles.container}>
                            <img src={Management} />
                            <h6>Não há férias registrados</h6>
                            <p>Aqui você verá todas as ausências registradas.</p>
                        </section>
                    </ContainerSemRegistro>
                ))}
            </Wrapper>
            <ModalSelecionarColaborador 
                opened={modalSelecaoColaboradorOpened} 
                aoFechar={() => setModalSelecaoColaboradorOpened(false)} 
                aoSelecionar={handleColaboradorSelecionado}
            />
            <ModalDetalhesFerias 
                opened={!!eventoSelecionado} 
                evento={eventoSelecionado} 
                aoFechar={(resultado) => {
                    setEventoSelecionado(null);
                    if (resultado) {
                        if (resultado.sucesso) {
                            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: resultado.mensagem, life: 3000 });
                            setForceUpdate(p => p + 1);
                        } else if (resultado.erro) {
                            toast.current.show({ severity: 'error', summary: 'Erro', detail: resultado.mensagem, life: 3000 });
                        } else if (resultado.aviso) {
                            toast.current.show({ severity: 'warn', summary: 'Atenção', detail: resultado.mensagem, life: 3000 });
                        } else if (resultado.info) {
                            toast.current.show({ severity: 'info', summary: 'Aviso', detail: resultado.mensagem, life: 3000 });
                        }
                    }
                }}
            />
        </ConteudoFrame>
    )
}

export default FeriasListagem