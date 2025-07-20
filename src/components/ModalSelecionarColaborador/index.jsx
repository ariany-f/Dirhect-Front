import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import CheckboxContainer from '@components/CheckboxContainer'
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import { RiCloseFill } from 'react-icons/ri'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import styles from './ModalSelecionarColaborador.module.css'
import { useDepartamentoContext } from "@contexts/Departamento"
import { Overlay, DialogEstilizado } from '@components/Modal/styles'
import http from '@http'
import Loading from '@components/Loading'

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`

const Col6 = styled.div`
    padding: 20px;
    flex: 1 1 50%;
`

const Col4 = styled.div`
    padding: 20px;
    flex: 1 1 25%;
`

const Col4Centered = styled.div`
    display: flex;
    flex: 1 1 25%;
    justify-content: center;
    align-items: center;
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
`;

const Item = styled.div`
    cursor: pointer;
    border-width: 1px;
    border-style: solid;
    border-radius: 16px;
    display: flex;
    padding: 20px;
    justify-content: space-between;
    align-items: center;
    width: 94%;
    border-color: ${ props => props.$active ? 'var(--primaria)' : 'var(--neutro-200)' };
`;

const ListaColaboradores = styled.div`
    max-height: 400px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
    padding-right: 8px;

    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 3px;
    }
`;

const ItemColaborador = styled.div`
    padding: 12px 16px;
    border: 1px solid ${({ $selecionado }) => $selecionado ? 'var(--vermilion-principal)' : '#ddd'};
    background-color: ${({ $selecionado }) => $selecionado ? 'var(--vermilion-100)' : '#fff'};
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: #f9f9f9;
        border-color: var(--vermilion-principal);
    }
`;

const NomeColaborador = styled.span`
    font-weight: 600;
    color: #333;
`;

const ChapaColaborador = styled.span`
    font-size: 12px;
    color: #777;
    margin-left: 8px;
`;

const SearchContainer = styled.div`
    position: relative;
    width: 100%;
    .p-inputgroup {
        width: 100%;
    }
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding: 8px 0;
    border-top: 1px solid #eee;
`;

const PaginationButton = styled.button`
    padding: 6px 12px;
    border: 1px solid #ddd;
    background: ${({ $active }) => $active ? 'var(--primaria)' : '#fff'};
    color: ${({ $active }) => $active ? '#fff' : '#333'};
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s;

    &:hover {
        background: ${({ $active }) => $active ? 'var(--primaria)' : '#f5f5f5'};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const PaginationInfo = styled.span`
    font-size: 12px;
    color: #666;
    margin: 0 8px;
`;

function ModalSelecionarColaborador({ opened = false, aoFechar, aoSelecionar }) {
    const [colaboradores, setColaboradores] = useState([]);
    const [busca, setBusca] = useState('');
    const [colaboradorSelecionado, setColaboradorSelecionado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const loadColaboradores = (currentPage, searchTerm = '') => {
        setLoading(true);
        const searchParam = searchTerm ? `&search=${searchTerm}` : '';
        http.get(`funcionario/?format=json&page=${currentPage}&page_size=${pageSize}${searchParam}`)
            .then(response => {
                setColaboradores(response.results || response);
                setTotalRecords(response.count || 0);
                setTotalPages(response.total_pages || 0);
            })
            .catch(erro => console.error("Erro ao buscar colaboradores", erro))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (opened) {
            setPage(1);
            setBusca('');
            setColaboradorSelecionado(null);
            loadColaboradores(1);
        }
    }, [opened]);

    // Debounce para busca
    useEffect(() => {
        if (!opened) return;

        const timeoutId = setTimeout(() => {
            setPage(1);
            loadColaboradores(1, busca);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [busca, opened]);

    const handleSelecionar = () => {
        if (colaboradorSelecionado) {
            aoSelecionar(colaboradorSelecionado);
        } else {
            alert('Por favor, selecione um colaborador.');
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        loadColaboradores(newPage, busca);
        setColaboradorSelecionado(null); // Reset selection when changing page
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Botão anterior
        pages.push(
            <PaginationButton
                key="prev"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
            >
                Anterior
            </PaginationButton>
        );

        // Primeira página
        if (startPage > 1) {
            pages.push(
                <PaginationButton
                    key="1"
                    onClick={() => handlePageChange(1)}
                >
                    1
                </PaginationButton>
            );
            if (startPage > 2) {
                pages.push(<span key="dots1">...</span>);
            }
        }

        // Páginas do meio
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <PaginationButton
                    key={i}
                    $active={page === i}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </PaginationButton>
            );
        }

        // Última página
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="dots2">...</span>);
            }
            pages.push(
                <PaginationButton
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </PaginationButton>
            );
        }

        // Botão próximo
        pages.push(
            <PaginationButton
                key="next"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
            >
                Próximo
            </PaginationButton>
        );

        return pages;
    };

    return (
        <>
            {opened &&
                <Overlay onClick={aoFechar}>
                    <DialogEstilizado open={opened} onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <Loading opened={loading} />
                        <Frame>
                            <Titulo>
                                <button className="close" onClick={aoFechar}>
                                    <RiCloseFill size={20} className="fechar" />
                                </button>
                                <h6>Selecionar Colaborador</h6>
                            </Titulo>
                        </Frame>

                        <Frame padding="12px 24px">
                            <SearchContainer>
                               <CampoTexto
                                    valor={busca}
                                    setValor={setBusca}
                                    placeholder="Buscar por nome ou chapa..."
                                />
                            </SearchContainer>
                            <ListaColaboradores>
                                {colaboradores.map(colab => (
                                    <ItemColaborador
                                        key={colab.id}
                                        $selecionado={colaboradorSelecionado?.id === colab.id}
                                        onClick={() => setColaboradorSelecionado(colab)}
                                    >
                                        <NomeColaborador>{colab.funcionario_pessoa_fisica?.nome}</NomeColaborador>
                                        <ChapaColaborador>Chapa: {colab.chapa}</ChapaColaborador>
                                    </ItemColaborador>
                                ))}
                                {colaboradores.length === 0 && !loading && (
                                    <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                        Nenhum colaborador encontrado
                                    </div>
                                )}
                            </ListaColaboradores>
                            
                            {totalRecords > 0 && (
                                <PaginationContainer>
                                    <PaginationInfo>
                                        {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, totalRecords)} de {totalRecords}
                                    </PaginationInfo>
                                    {renderPagination()}
                                </PaginationContainer>
                            )}
                        </Frame>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px', borderTop: '1px solid #eee', gap: '12px' }}>
                            <Botao
                                aoClicar={aoFechar}
                                estilo="neutro"
                                size="medium"
                            >
                                Cancelar
                            </Botao>
                            <Botao
                                aoClicar={handleSelecionar}
                                estilo="vermilion"
                                size="medium"
                                filled
                                disabled={!colaboradorSelecionado}
                            >
                                Selecionar
                            </Botao>
                        </div>
                    </DialogEstilizado>
                </Overlay>
            }
        </>
    )
}

export default ModalSelecionarColaborador