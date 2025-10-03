import { useEffect, useRef, useState } from "react"
import styles from './Bancos.module.css'
import styled from "styled-components"
import { Link, useOutletContext } from "react-router-dom"
import Management from '@assets/Management.svg'
import { Toast } from 'primereact/toast'
import http from "@http"
import DataTableBancos from '@components/DataTableBancos'
import DataTableAgencias from "@components/DataTableAgencias"
import ModalAdicionarBanco from '@components/ModalAdicionarBanco'
import ModalAdicionarAgencia from '@components/ModalAdicionarAgencia'
import { Col12, Col5, Col6, Col7 } from '@components/Colunas'
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

const Col6Expandable = styled(Col6)`
    width: ${(props) => (props.$expanded ? "calc(50% - 8px)" : "100%")};
    min-width: calc(50% - ${props => props.$gap || '8px'});
    flex: 1 1 calc(50% - ${props => props.$gap || '8px'});
    max-width: calc(50% - ${props => props.$gap || '8px'});
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

function BancosListagem() {
    // Estados para calendários
    const [bancos, setBancos] = useState([])
    const [loading, setLoading] = useState(false)
    const [paginaAtual, setPaginaAtual] = useState(1)
    const [totalRegistros, setTotalRegistros] = useState(0)
    const [registrosPorPagina] = useState(10)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortField, setSortField] = useState('')
    const [sortOrder, setSortOrder] = useState('')
    
    // Estados para agencias
    const [agencias, setAgencias] = useState([])
    const [loadingAgencias, setLoadingAgencias] = useState(false)
    const [paginaAtualAgencias, setPaginaAtualAgencias] = useState(1)
    const [totalRegistrosAgencias, setTotalRegistrosAgencias] = useState(0)
    const [searchTermAgencias, setSearchTermAgencias] = useState('')
    const [sortFieldAgencias, setSortFieldAgencias] = useState('')
    const [sortOrderAgencias, setSortOrderAgencias] = useState('')
    
    // Estados para modais e seleção
    const [modalBancoOpened, setModalBancoOpened] = useState(false)
    const [modalAgenciaOpened, setModalAgenciaOpened] = useState(false)
    const [selectedBanco, setSelectedBanco] = useState(null)
    const [bancoEditando, setBancoEditando] = useState(null)
    
    const toast = useRef(null)
    
    // Carregar calendários quando os parâmetros mudarem
    useEffect(() => {
        carregarBancos();
    }, [paginaAtual, searchTerm, sortField, sortOrder])

    // Carregar agencias quando um banco for selecionado
    useEffect(() => {
        if (selectedBanco) {
            carregarAgencias();
        } else {
            setAgencias([]);
            setTotalRegistrosAgencias(0);
        }
    }, [selectedBanco, paginaAtualAgencias, searchTermAgencias, sortFieldAgencias, sortOrderAgencias])

    const carregarBancos = async () => {
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

            const response = await http.get(`banco/?${params.toString()}`);
            
            if (response.results) {
                setBancos(response.results);
                setTotalRegistros(response.count || 0);
            } else {
                setBancos(response);
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

    const carregarAgencias = async () => {
        if (!selectedBanco) return;
        
        setLoadingAgencias(true);
        try {
            const params = new URLSearchParams({
                page: paginaAtualAgencias,
                page_size: registrosPorPagina,
                banco_id: selectedBanco.id
            });

            if (searchTermAgencias.trim()) {
                params.append('search', searchTermAgencias.trim());
            }

            if (sortFieldAgencias && sortOrderAgencias) {
                const orderParam = sortOrderAgencias === 'desc' ? '-' : '';
                params.append('ordering', `${orderParam}${sortFieldAgencias}`);
            }

            const response = await http.get(`agencia/?${params.toString()}`);
            
            if (response.results) {
                setAgencias(response.results);
                setTotalRegistrosAgencias(response.count || 0);
            } else {
                setAgencias(response);
                setTotalRegistrosAgencias(response.length || 0);
            }
        } catch (error) {
            console.error('Erro ao carregar agencias:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível carregar os agencias',
                life: 3000
            });
        } finally {
            setLoadingAgencias(false);
        }
    };

    // Handlers para paginação, busca e ordenação
    const onPage = (event) => {
        setPaginaAtual(event.page + 1);
    };

    const onPageAgencias = (event) => {
        setPaginaAtualAgencias(event.page + 1);
    };

    const onSearch = (search) => {
        setSearchTerm(search);
        setPaginaAtual(1);
    };

    const onSearchAgencias = (search) => {
        setSearchTermAgencias(search);
        setPaginaAtualAgencias(1);
    };

    const onSort = ({ field, order }) => {
        setSortField(field);
        setSortOrder(order);
        setPaginaAtual(1);
    };

    const onSortAgencias = ({ field, order }) => {
        setSortFieldAgencias(field);
        setSortOrderAgencias(order);
        setPaginaAtualAgencias(1);
    };

    const handleBancoSelection = (banco) => {
        console.log('Calendário selecionado:', banco); // Debug
        setSelectedBanco(banco);
        setPaginaAtualAgencias(1);
        setSearchTermAgencias('');
    };
    
    // Funções CRUD
    const adicionarBanco = async (banco) => {
        try {
            const response = await http.post('banco/', banco);
            
            if (response) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Calendário adicionado com sucesso!',
                    life: 3000
                });
                setModalBancoOpened(false);
                carregarBancos();
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

    const adicionarAgencia = async (agencia) => {
        try {
            const response = await http.post('agencia/', agencia);
            
            if (response) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Agencia adicionado com sucesso!',
                    life: 3000
                });
                setModalAgenciaOpened(false);
                carregarAgencias();
                return true;
            }
        } catch (error) {
            console.error('Erro ao adicionar agencia:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao adicionar agencia!',
                life: 3000
            });
            return false;
        }
    };

    const editarBanco = (banco) => {
        setBancoEditando(banco);
        setModalBancoOpened(true);
    };

    const salvarEdicaoBanco = async (banco) => {
        try {
            const response = await http.put(`banco/${bancoEditando.id}/`, banco);
            
            if (response) {
                setBancoEditando(null);
                setModalBancoOpened(false);
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Calendário editado com sucesso!',
                    life: 3000
                });
                carregarBancos();
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

    const deletarBanco = (banco) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir este calendário?',
            header: 'Confirmação',
            icon: 'pi pi-info-circle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: async () => {
                try {
                    await http.delete(`banco/${banco.id}/`);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Calendário excluído com sucesso!',
                        life: 3000
                    });
                    carregarBancos();
                    if (selectedBanco && selectedBanco.id === banco.id) {
                        setSelectedBanco(null);
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
                <Col12Expandable $gap="8px">
                    <Col6Expandable $expanded={!!selectedBanco}>
                        <DataTableBancos 
                            showSearch={false} // Desabilitar busca
                            bancos={bancos} 
                            rows={registrosPorPagina}
                            totalRecords={totalRegistros}
                            first={(paginaAtual - 1) * registrosPorPagina}
                            onPage={onPage}
                            onSearch={onSearch}
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={onSort}
                            onSelectionChange={handleBancoSelection}
                            bancoSelecionado={selectedBanco}
                            onAddClick={() => { setBancoEditando(null); setModalBancoOpened(true); }}
                            onEditClick={editarBanco}
                            onDeleteClick={deletarBanco}
                            onUpdate={carregarBancos}
                        />
                    </Col6Expandable>
                    {selectedBanco ? 
                        <Col6Expandable $expanded={!!selectedBanco}>
                            <DataTableAgencias
                                agencias={agencias}
                                banco={selectedBanco}
                                showSearch={true}
                                rows={registrosPorPagina}
                                totalRecords={totalRegistrosAgencias}
                                first={(paginaAtualAgencias - 1) * registrosPorPagina}
                                onPage={onPageAgencias}
                                onSearch={onSearchAgencias}
                                sortField={sortFieldAgencias}
                                sortOrder={sortOrderAgencias}
                                onSort={onSortAgencias}
                                onAddClick={() => setModalAgenciaOpened(true)}
                                onUpdate={carregarAgencias}
                            />
                        </Col6Expandable>
                    : null}
                </Col12Expandable>

            <ModalAdicionarBanco 
                opened={modalBancoOpened} 
                aoFechar={() => { setModalBancoOpened(false); setBancoEditando(null); }} 
                aoSalvar={bancoEditando ? salvarEdicaoBanco : adicionarBanco} 
                banco={bancoEditando}
            />
            <ModalAdicionarAgencia 
                opened={modalAgenciaOpened} 
                aoFechar={() => setModalAgenciaOpened(false)} 
                aoSalvar={adicionarAgencia} 
                bancoSelecionado={selectedBanco}
            />
        </ConteudoFrame>
    )
}

export default BancosListagem