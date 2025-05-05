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

    const [operadoras, setOperadoras] = useState(null)
    const context = useOutletContext()
    const [modalOpened, setModalOpened] = useState(false)
    const [modalBeneficioOpened, setModalBeneficioOpened] = useState(false)
    const toast = useRef(null)
    const [selectedOperadora, setSelectedOperadora] = useState(null)
    const [beneficios, setBeneficios] = useState(null)
    const [operadoraEditando, setOperadoraEditando] = useState(null);
    
    useEffect(() => {
        if(context)
        {
            setOperadoras(context)
        }
    }, [context])

    useEffect(() => {
        if (selectedOperadora) {
            http.get(`operadora/${selectedOperadora.id}/?format=json`)
                .then(response => {
                    setBeneficios(response.beneficios_vinculados)
                })
                .catch(erro => {
                    console.error('Erro ao carregar benefícios:', erro)
                })
        }
    }, [selectedOperadora])
    
    const adicionarOperadora = async (operadora) => {
        const formData = new FormData();
        formData.append('nome', operadora.nome);
        if (operadora.imagem) {
            formData.append('imagem', operadora.imagem);
        }
        const API_BASE_DOMAIN = import.meta.env.VITE_API_BASE_DOMAIN || "dirhect.net";
        const PROTOCOL = import.meta.env.MODE === 'development' ? 'http' : 'https';
        const companyDomain = sessionStorage.getItem("company_domain") || 'geral';
        const baseUrl = `${PROTOCOL}://${companyDomain}.${API_BASE_DOMAIN}/api/`;            
        const response = await axios.post(`${baseUrl}operadora/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if(response?.data.id)
        {
            context.push(response?.data)
            setModalOpened(false)
            toast.current.show({
                message: 'Operadora adicionada com sucesso!',
                type: 'success',
            });
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
                // Busca os benefícios atualizados da operadora
                const updatedBeneficios = await http.get(`operadora/${selectedOperadora.id}/?format=json`)
                    .then(response => response.beneficios_vinculados)
                
                setBeneficios(updatedBeneficios)
                
                toast.current.show({
                    message: 'Benefício adicionado com sucesso!',
                    type: 'success',
                })
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
        if (operadora.imagem) formData.append('imagem', operadora.imagem);
        const API_BASE_DOMAIN = import.meta.env.VITE_API_BASE_DOMAIN || "dirhect.net";
        const PROTOCOL = import.meta.env.MODE === 'development' ? 'http' : 'https';
        const companyDomain = sessionStorage.getItem("company_domain") || 'geral';
        const baseUrl = `${PROTOCOL}://${companyDomain}.${API_BASE_DOMAIN}/api/`;
        const response = await axios.put(`${baseUrl}operadora/${operadoraEditando.id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if(response?.data.id) {
            setOperadoras(operadoras.map(op => op.id === response.data.id ? response.data : op));
            setOperadoraEditando(null);
            setModalOpened(false);
            toast.current.show({
                message: 'Operadora editada com sucesso!',
                type: 'success',
            });
            return true;
        } else {
            toast.current.show({
                message: 'Erro ao editar operadora!',
                type: 'error',
            });
            return false;
        }
    };

    // Função para recarregar operadoras do backend
    const reloadOperadoras = async () => {
        const API_BASE_DOMAIN = import.meta.env.VITE_API_BASE_DOMAIN || "dirhect.net";
        const PROTOCOL = import.meta.env.MODE === 'development' ? 'http' : 'https';
        const companyDomain = sessionStorage.getItem("company_domain") || 'geral';
        const baseUrl = `${PROTOCOL}://${companyDomain}.${API_BASE_DOMAIN}/api/`;
        const response = await axios.get(`${baseUrl}operadora/`);
        if (response?.data) setOperadoras(response.data);
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
                const API_BASE_DOMAIN = import.meta.env.VITE_API_BASE_DOMAIN || "dirhect.net";
                const PROTOCOL = import.meta.env.MODE === 'development' ? 'http' : 'https';
                const companyDomain = sessionStorage.getItem("company_domain") || 'geral';
                const baseUrl = `${PROTOCOL}://${companyDomain}.${API_BASE_DOMAIN}/api/`;
                try {
                    await axios.delete(`${baseUrl}operadora/${operadora.id}/`);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Operadora excluída com sucesso!',
                        life: 3000
                    });
                    reloadOperadoras();
                } catch {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro ao excluir operadora!',
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
                const API_BASE_DOMAIN = import.meta.env.VITE_API_BASE_DOMAIN || "dirhect.net";
                const PROTOCOL = import.meta.env.MODE === 'development' ? 'http' : 'https';
                const companyDomain = sessionStorage.getItem("company_domain") || 'geral';
                const baseUrl = `${PROTOCOL}://${companyDomain}.${API_BASE_DOMAIN}/api/`;
                try {
                    await axios.delete(`${baseUrl}beneficio_operadora/${beneficioOperadora.id}/`);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Benefício desvinculado com sucesso!',
                        life: 3000
                    });
                    // Recarrega os benefícios da operadora selecionada
                    if (selectedOperadora) {
                        const updatedBeneficios = await http.get(`operadora/${selectedOperadora.id}/?format=json`)
                            .then(response => response.beneficios_vinculados)
                        setBeneficios(updatedBeneficios)
                    }
                } catch {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro ao excluir benefício!',
                        life: 3000
                    });
                }
            }
        });
    };
    
    return (
        <ConteudoFrame>
            <Toast ref={toast} />
            {operadoras ? (
                <Col12Expandable $gap="8px">
                    <Col6Expandable $expanded={!!selectedOperadora}>
                        <DataTableOperadoras 
                            search={false} 
                            operadoras={operadoras} 
                            onSelectionChange={setSelectedOperadora}
                            onAddClick={() => { setOperadoraEditando(null); setModalOpened(true); }}
                            onEditClick={editarOperadora}
                            onDeleteClick={deletarOperadora}
                            onReload={reloadOperadoras}
                        />
                    </Col6Expandable>
                    {selectedOperadora && beneficios ? 
                        <Col6Expandable $expanded={!!selectedOperadora}>
                            <DataTableOperadorasDetalhes 
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