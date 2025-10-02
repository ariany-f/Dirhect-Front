import { useEffect, useRef, useState } from "react"
import styles from './Operadoras.module.css'
import styled from "styled-components"
import { Link, useOutletContext } from "react-router-dom"
import Management from '@assets/Management.svg'
import { GrAddCircle } from 'react-icons/gr'
import Botao from '@components/Botao'
import { Toast } from 'primereact/toast'
import http from "@http"
import axios from 'axios';
import BotaoGrupo from '@components/BotaoGrupo'
import Container from '@components/Container'
import DataTableOperadoras from '@components/DataTableOperadoras'
import ModalOperadoras from "../../components/ModalOperadoras"
import DataTableOperadorasDetalhes from '@components/DataTableOperadorasDetalhes'
import ModalOperadoraBeneficio from '@components/ModalOperadoraBeneficio'
import { Col12, Col6 } from '@components/Colunas'
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

// Extensão do Col4 para adicionar a transição
const Col6Expandable = styled(Col6)`
    width: ${(props) => (props.$expanded ? "calc(50% - 8px)" : "100%")};
    min-width: calc(50% - ${props => props.$gap || '8px'});
    flex: 1 1 calc(50% - ${props => props.$gap || '8px'});
    max-width: calc(50% - ${props => props.$gap || '8px'});
    transition: all 0.3s ease;
    padding: 0px;
`;

function OperadorasListagem() {
    // Estados para operadoras
    const [operadoras, setOperadoras] = useState([])
    const [loading, setLoading] = useState(false)
    const [paginaAtual, setPaginaAtual] = useState(1)
    const [totalRegistros, setTotalRegistros] = useState(0)
    const [registrosPorPagina] = useState(10)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortField, setSortField] = useState('')
    const [sortOrder, setSortOrder] = useState('')
    
    // Estados para benefícios
    const [beneficios, setBeneficios] = useState([])
    const [loadingBeneficios, setLoadingBeneficios] = useState(false)
    const [paginaAtualBeneficios, setPaginaAtualBeneficios] = useState(1)
    const [totalRegistrosBeneficios, setTotalRegistrosBeneficios] = useState(0)
    const [searchTermBeneficios, setSearchTermBeneficios] = useState('')
    const [sortFieldBeneficios, setSortFieldBeneficios] = useState('')
    const [sortOrderBeneficios, setSortOrderBeneficios] = useState('')
    
    // Estados para modais e seleção
    const [modalOpened, setModalOpened] = useState(false)
    const [modalBeneficioOpened, setModalBeneficioOpened] = useState(false)
    const [selectedOperadora, setSelectedOperadora] = useState(null)
    const [operadoraEditando, setOperadoraEditando] = useState(null);
    
    const toast = useRef(null)
    
    // Carregar operadoras quando os parâmetros mudarem
    useEffect(() => {
        carregarOperadoras();
    }, [paginaAtual, searchTerm, sortField, sortOrder])

    // Carregar benefícios quando uma operadora for selecionada
    useEffect(() => {
        if (selectedOperadora) {
            carregarBeneficios();
        } else {
            setBeneficios([]);
        }
    }, [selectedOperadora])

    const carregarOperadoras = async () => {
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

            const response = await http.get(`operadora/?${params.toString()}`);
            
            if (response.results) {
                setOperadoras(response.results);
                setTotalRegistros(response.count || 0);
            } else {
                setOperadoras(response);
                setTotalRegistros(response.length || 0);
            }
        } catch (error) {
            console.error('Erro ao carregar operadoras:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível carregar as operadoras',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const carregarBeneficios = async () => {
        if (!selectedOperadora) return;
        
        try {
            const response = await http.get(`operadora/${selectedOperadora.id}/?format=json`);
            setBeneficios(response.beneficios_vinculados || []);
        } catch (error) {
            console.error('Erro ao carregar benefícios:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível carregar os benefícios',
                life: 3000
            });
        }
    };

    // Handlers para paginação, busca e ordenação
    const onPage = (event) => {
        setPaginaAtual(event.page + 1);
    };

    const onPageBeneficios = (event) => {
        setPaginaAtualBeneficios(event.page + 1);
    };

    const onSearch = (search) => {
        setSearchTerm(search);
        setPaginaAtual(1);
    };

    const onSearchBeneficios = (search) => {
        setSearchTermBeneficios(search);
        setPaginaAtualBeneficios(1);
    };

    const onSort = ({ field, order }) => {
        setSortField(field);
        setSortOrder(order);
        setPaginaAtual(1);
    };

    const onSortBeneficios = ({ field, order }) => {
        setSortFieldBeneficios(field);
        setSortOrderBeneficios(order);
        setPaginaAtualBeneficios(1);
    };

    const handleOperadoraSelection = (operadora) => {
        setSelectedOperadora(operadora);
        setPaginaAtualBeneficios(1);
        setSearchTermBeneficios('');
    };
    
    const adicionarOperadora = async (operadora) => {
        const formData = new FormData();
        formData.append('nome', operadora.nome);
        if (operadora.imagem) {
            formData.append('imagem', operadora.imagem);
        }
        const API_BASE_DOMAIN = import.meta.env.VITE_API_BASE_DOMAIN || "dirhect.net";
        const PROTOCOL = import.meta.env.MODE === 'development' ? 'http' : 'https';
        const companyDomain = localStorage.getItem("company_domain") || 'dirhect';
        const baseUrl = `${PROTOCOL}://${companyDomain}.${API_BASE_DOMAIN}/api/`;            
        const response = await axios.post(`${baseUrl}operadora/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${ArmazenadorToken.AccessToken}`
            },
        });
        if(response?.data.id)
        {
            toast.current.show({
                message: 'Operadora adicionada com sucesso!',
                type: 'success',
            });
            setModalOpened(false)
            carregarOperadoras();
            return true;
        }
        else
        {
            toast.current.show({
                message: 'Erro ao adicionar operadora!',
                type: 'error',
            });
            return false;
        }
    }

    const adicionarBeneficio = () => {
        setModalBeneficioOpened(true)
    }

    const handleSalvarBeneficio = async (dadosBeneficio) => {
        try {
            const response = await http.post('beneficio_operadora/', {
                beneficio: dadosBeneficio.code,
                operadora: selectedOperadora.id
            })
            
            if (response) {
                toast.current.show({
                    message: 'Benefício adicionado com sucesso!',
                    type: 'success',
                })
                carregarBeneficios();
            }
        } catch (error) {
            console.error('Erro ao adicionar benefício:', error)
            toast.current.show({
                message: 'Erro ao adicionar benefício!',
                type: 'error',
            })
        } finally {
            setModalBeneficioOpened(false)
        }
    }

    // Função para abrir modal de edição
    const editarOperadora = (operadora) => {
        setOperadoraEditando(operadora);
        setModalOpened(true);
    };

    // Função para salvar edição
    const salvarEdicaoOperadora = async (operadora) => {
        const formData = new FormData();
        formData.append('nome', operadora.nome);
        formData.append('ativo', operadora.ativo);
        if (operadora.imagem) formData.append('imagem', operadora.imagem);
        const API_BASE_DOMAIN = import.meta.env.VITE_API_BASE_DOMAIN || "dirhect.net";
        const PROTOCOL = import.meta.env.MODE === 'development' ? 'http' : 'https';
        const companyDomain = localStorage.getItem("company_domain") || 'dirhect';
        const baseUrl = `${PROTOCOL}://${companyDomain}.${API_BASE_DOMAIN}/api/`;
        const response = await axios.put(`${baseUrl}operadora/${operadoraEditando.id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${ArmazenadorToken.AccessToken}`
            },
        });
        if(response?.data.id) {
            setOperadoraEditando(null);
            setModalOpened(false);
            toast.current.show({
                message: 'Operadora editada com sucesso!',
                type: 'success',
            });
            carregarOperadoras();
            return true;
        } else {
            toast.current.show({
                message: 'Erro ao editar operadora!',
                type: 'error',
            });
            return false;
        }
    };

    // Função para deletar operadora com confirmação
    const deletarOperadora = (operadora) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir esta operadora?',
            header: 'Confirmação',
            icon: 'pi pi-info-circle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: async () => {
                try {
                    await http.delete(`operadora/${operadora.id}/`);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Operadora excluída com sucesso!',
                        life: 3000
                    });
                    carregarOperadoras();
                    if (selectedOperadora && selectedOperadora.id === operadora.id) {
                        setSelectedOperadora(null);
                    }
                } catch (error) {
                    console.error('Erro ao excluir operadora:', error);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: `Erro ao excluir operadora: ${error.response?.data?.detail || error.message}`,
                        life: 3000
                    });
                }
            }
        });
    };

    // Função para deletar benefício vinculado à operadora
    const deletarBeneficioOperadora = (beneficioOperadora) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir este benefício da operadora?',
            header: 'Confirmação',
            icon: 'pi pi-info-circle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: async () => {
                try {
                    await http.delete(`beneficio_operadora/${beneficioOperadora.id}/`);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Benefício desvinculado com sucesso!',
                        life: 3000
                    });
                    carregarBeneficios();
                } catch (error) {
                    console.error('Erro ao excluir benefício:', error);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: `Erro ao excluir benefício: ${error.response?.data?.detail || error.message}`,
                        life: 3000
                    });
                }
            }
        });
    };
    
    return (
        <ConteudoFrame>
            <Toast ref={toast} />
            {operadoras && operadoras.length > 0 ? (
                <Col12Expandable $gap="8px">
                    <Col6Expandable $expanded={!!selectedOperadora}>
                        <DataTableOperadoras 
                            showSearch={false}
                            operadoras={operadoras} 
                            rows={registrosPorPagina}
                            totalRecords={totalRegistros}
                            first={(paginaAtual - 1) * registrosPorPagina}
                            onPage={onPage}
                            onSearch={onSearch}
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={onSort}
                            onSelectionChange={handleOperadoraSelection}
                            onAddClick={() => { setOperadoraEditando(null); setModalOpened(true); }}
                            onEditClick={editarOperadora}
                            onDeleteClick={deletarOperadora}
                            onUpdate={carregarOperadoras}
                        />
                    </Col6Expandable>
                    {selectedOperadora ? 
                        <Col6Expandable $expanded={!!selectedOperadora}>
                            <DataTableOperadorasDetalhes 
                                showSearch={false}
                                beneficios={beneficios}
                                onAddBeneficio={adicionarBeneficio}
                                operadora={selectedOperadora}
                                onDeleteBeneficio={deletarBeneficioOperadora}
                            />
                        </Col6Expandable>
                    : null}
                </Col12Expandable>
            ) : (
                <ContainerSemRegistro>
                    <section className={styles.container}>
                        <img src={Management} />
                        <h6>Não há operadoras registrados</h6>
                        <p>Aqui você verá todos os operadoras registradas.</p>
                    </section>
                </ContainerSemRegistro>
            )}

            <ModalOperadoras 
                opened={modalOpened} 
                aoFechar={() => { setModalOpened(false); setOperadoraEditando(null); }} 
                aoSalvar={operadoraEditando ? salvarEdicaoOperadora : adicionarOperadora} 
                operadora={operadoraEditando}
            />
            <ModalOperadoraBeneficio 
                opened={modalBeneficioOpened} 
                aoFechar={() => setModalBeneficioOpened(false)} 
                aoSalvar={handleSalvarBeneficio} 
            />
        </ConteudoFrame>
    )
}

export default OperadorasListagem