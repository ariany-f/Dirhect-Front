import { useEffect, useRef, useState } from "react"
import styles from './Calendarios.module.css'
import styled from "styled-components"
import { Link, useOutletContext } from "react-router-dom"
import Management from '@assets/Management.svg'
import { Toast } from 'primereact/toast'
import http from "@http"
import DataTableCalendarios from '@components/DataTableCalendarios'
import DataTableFeriados from "@components/DataTableFeriados"
import ModalAdicionarCalendario from '@components/ModalAdicionarCalendario'
import ModalAdicionarFeriado from '@components/ModalAdicionarFeriado'
import { Col12, Col5, Col7 } from '@components/Colunas'
import { confirmDialog } from 'primereact/confirmdialog';
import { ArmazenadorToken } from '@utils';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const ContainerSemRegistro = styled.div`
    display: flex;
    padding: 96px 12px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 32px;
    width: 100%;
    text-align: center;
    & p {
        margin: 0 auto;
    }

    & h6 {
        width: 60%;
    }
`

const Col12Expandable = styled(Col12)`
    width: ${(props) => (props.$expanded ? "calc(100% - 8px)" : "100%")};
    transition: all 0.3s ease;
    padding: 0px;
    justify-content: center;
`

const Col5Expandable = styled(Col5)`
    width: ${(props) => (props.$expanded ? "calc(41.66% - 8px)" : "100%")};
    min-width: calc(41.66% - ${props => props.$gap || '8px'});
    flex: 1 1 calc(41.66% - ${props => props.$gap || '8px'});
    max-width: calc(41.66% - ${props => props.$gap || '8px'});
    transition: all 0.3s ease;
    padding: 0px;
`;

const Col7Expandable = styled(Col7)`
    width: ${(props) => (props.$expanded ? "calc(58.33% - 8px)" : "100%")};
    min-width: calc(58.33% - ${props => props.$gap || '8px'});
    flex: 1 1 calc(58.33% - ${props => props.$gap || '8px'});
    max-width: calc(58.33% - ${props => props.$gap || '8px'});
    transition: all 0.3s ease;
    padding: 0px;
`;

function CalendariosListagem() {
    // Estados para calendários
    const [calendarios, setCalendarios] = useState([])
    const [loading, setLoading] = useState(false)
    const [paginaAtual, setPaginaAtual] = useState(1)
    const [totalRegistros, setTotalRegistros] = useState(0)
    const [registrosPorPagina] = useState(10)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortField, setSortField] = useState('')
    const [sortOrder, setSortOrder] = useState('')
    
    // Estados para feriados
    const [feriados, setFeriados] = useState([])
    const [loadingFeriados, setLoadingFeriados] = useState(false)
    const [paginaAtualFeriados, setPaginaAtualFeriados] = useState(1)
    const [totalRegistrosFeriados, setTotalRegistrosFeriados] = useState(0)
    const [searchTermFeriados, setSearchTermFeriados] = useState('')
    const [sortFieldFeriados, setSortFieldFeriados] = useState('')
    const [sortOrderFeriados, setSortOrderFeriados] = useState('')
    
    // Estados para modais e seleção
    const [modalCalendarioOpened, setModalCalendarioOpened] = useState(false)
    const [modalFeriadoOpened, setModalFeriadoOpened] = useState(false)
    const [selectedCalendario, setSelectedCalendario] = useState(null)
    const [calendarioEditando, setCalendarioEditando] = useState(null)
    
    const toast = useRef(null)
    
    // Carregar calendários quando os parâmetros mudarem
    useEffect(() => {
        carregarCalendarios();
    }, [paginaAtual, searchTerm, sortField, sortOrder])

    // Carregar feriados quando um calendário for selecionado
    useEffect(() => {
        if (selectedCalendario) {
            carregarFeriados();
        } else {
            setFeriados([]);
            setTotalRegistrosFeriados(0);
        }
    }, [selectedCalendario, paginaAtualFeriados, searchTermFeriados, sortFieldFeriados, sortOrderFeriados])

    const carregarCalendarios = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: paginaAtual,
                page_size: registrosPorPagina
            });

            if (searchTerm.trim()) {
                params.append('search', searchTerm.trim());
            }

            if (sortField && sortOrder) {
                const orderParam = sortOrder === 'desc' ? '-' : '';
                params.append('ordering', `${orderParam}${sortField}`);
            }

            const response = await http.get(`calendario/?${params.toString()}`);
            
            if (response.results) {
                setCalendarios(response.results);
                setTotalRegistros(response.count || 0);
            } else {
                setCalendarios(response);
                setTotalRegistros(response.length || 0);
            }
        } catch (error) {
            console.error('Erro ao carregar calendários:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível carregar os calendários',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const carregarFeriados = async () => {
        if (!selectedCalendario) return;
        
        setLoadingFeriados(true);
        try {
            const params = new URLSearchParams({
                page: paginaAtualFeriados,
                page_size: registrosPorPagina,
                calendario: selectedCalendario.id
            });

            if (searchTermFeriados.trim()) {
                params.append('search', searchTermFeriados.trim());
            }

            if (sortFieldFeriados && sortOrderFeriados) {
                const orderParam = sortOrderFeriados === 'desc' ? '-' : '';
                params.append('ordering', `${orderParam}${sortFieldFeriados}`);
            }

            const response = await http.get(`feriados/?${params.toString()}`);
            
            if (response.results) {
                setFeriados(response.results);
                setTotalRegistrosFeriados(response.count || 0);
            } else {
                setFeriados(response);
                setTotalRegistrosFeriados(response.length || 0);
            }
        } catch (error) {
            console.error('Erro ao carregar feriados:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível carregar os feriados',
                life: 3000
            });
        } finally {
            setLoadingFeriados(false);
        }
    };

    // Handlers para paginação, busca e ordenação
    const onPage = (event) => {
        setPaginaAtual(event.page + 1);
    };

    const onPageFeriados = (event) => {
        setPaginaAtualFeriados(event.page + 1);
    };

    const onSearch = (search) => {
        setSearchTerm(search);
        setPaginaAtual(1);
    };

    const onSearchFeriados = (search) => {
        setSearchTermFeriados(search);
        setPaginaAtualFeriados(1);
    };

    const onSort = ({ field, order }) => {
        setSortField(field);
        setSortOrder(order);
        setPaginaAtual(1);
    };

    const onSortFeriados = ({ field, order }) => {
        setSortFieldFeriados(field);
        setSortOrderFeriados(order);
        setPaginaAtualFeriados(1);
    };

    const handleCalendarioSelection = (calendario) => {
        console.log('Calendário selecionado:', calendario); // Debug
        setSelectedCalendario(calendario);
        setPaginaAtualFeriados(1);
        setSearchTermFeriados('');
    };
    
    // Funções CRUD
    const adicionarCalendario = async (calendario) => {
        try {
            const response = await http.post('calendario/', calendario);
            
            if (response) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Calendário adicionado com sucesso!',
                    life: 3000
                });
                setModalCalendarioOpened(false);
                carregarCalendarios();
                return true;
            }
        } catch (error) {
            console.error('Erro ao adicionar calendário:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao adicionar calendário!',
                life: 3000
            });
            return false;
        }
    };

    const adicionarFeriado = async (feriado) => {
        try {
            const response = await http.post('feriados/', feriado);
            
            if (response) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Feriado adicionado com sucesso!',
                    life: 3000
                });
                setModalFeriadoOpened(false);
                carregarFeriados();
                return true;
            }
        } catch (error) {
            console.error('Erro ao adicionar feriado:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao adicionar feriado!',
                life: 3000
            });
            return false;
        }
    };

    const editarCalendario = (calendario) => {
        setCalendarioEditando(calendario);
        setModalCalendarioOpened(true);
    };

    const salvarEdicaoCalendario = async (calendario) => {
        try {
            const response = await http.put(`calendario/${calendarioEditando.id}/`, calendario);
            
            if (response) {
                setCalendarioEditando(null);
                setModalCalendarioOpened(false);
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Calendário editado com sucesso!',
                    life: 3000
                });
                carregarCalendarios();
                return true;
            }
        } catch (error) {
            console.error('Erro ao editar calendário:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao editar calendário!',
                life: 3000
            });
            return false;
        }
    };

    const deletarCalendario = (calendario) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir este calendário?',
            header: 'Confirmação',
            icon: 'pi pi-info-circle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: async () => {
                try {
                    await http.delete(`calendario/${calendario.id}/`);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Calendário excluído com sucesso!',
                        life: 3000
                    });
                    carregarCalendarios();
                    if (selectedCalendario && selectedCalendario.id === calendario.id) {
                        setSelectedCalendario(null);
                    }
                } catch (error) {
                    console.error('Erro ao excluir calendário:', error);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: `Erro ao excluir calendário: ${error.response?.data?.detail || error.message}`,
                        life: 3000
                    });
                }
            }
        });
    };
    
    return (
        <ConteudoFrame>
            <Toast ref={toast} />
            {calendarios && calendarios.length > 0 ? (
                <Col12Expandable $gap="8px">
                    <Col5Expandable $expanded={!!selectedCalendario}>
                        <DataTableCalendarios 
                            showSearch={false} // Desabilitar busca
                            calendarios={calendarios} 
                            rows={registrosPorPagina}
                            totalRecords={totalRegistros}
                            first={(paginaAtual - 1) * registrosPorPagina}
                            onPage={onPage}
                            onSearch={onSearch}
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={onSort}
                            onSelectionChange={handleCalendarioSelection}
                            calendarioSelecionado={selectedCalendario}
                            onAddClick={() => { setCalendarioEditando(null); setModalCalendarioOpened(true); }}
                            onEditClick={editarCalendario}
                            onDeleteClick={deletarCalendario}
                            onUpdate={carregarCalendarios}
                        />
                    </Col5Expandable>
                    {selectedCalendario ? 
                        <Col7Expandable $expanded={!!selectedCalendario}>
                            <DataTableFeriados
                                feriados={feriados}
                                calendario={selectedCalendario}
                                showSearch={false} // Desabilitar busca
                                rows={registrosPorPagina}
                                totalRecords={totalRegistrosFeriados}
                                first={(paginaAtualFeriados - 1) * registrosPorPagina}
                                onPage={onPageFeriados}
                                onSearch={onSearchFeriados}
                                sortField={sortFieldFeriados}
                                sortOrder={sortOrderFeriados}
                                onSort={onSortFeriados}
                                onAddClick={() => setModalFeriadoOpened(true)}
                                onUpdate={carregarFeriados}
                            />
                        </Col7Expandable>
                    : null}
                </Col12Expandable>
            ) : (
                <ContainerSemRegistro>
                    <section className={styles.container}>
                        <img src={Management} />
                        <h6>Não há calendários registrados</h6>
                        <p>Aqui você verá todos os calendários registrados.</p>
                    </section>
                </ContainerSemRegistro>
            )}

            <ModalAdicionarCalendario 
                opened={modalCalendarioOpened} 
                aoFechar={() => { setModalCalendarioOpened(false); setCalendarioEditando(null); }} 
                aoSalvar={calendarioEditando ? salvarEdicaoCalendario : adicionarCalendario} 
                calendario={calendarioEditando}
            />
            <ModalAdicionarFeriado 
                opened={modalFeriadoOpened} 
                aoFechar={() => setModalFeriadoOpened(false)} 
                aoSalvar={adicionarFeriado} 
                calendarioSelecionado={selectedCalendario}
            />
        </ConteudoFrame>
    )
}

export default CalendariosListagem