import DataTableColaboradores from '@components/DataTableColaboradores'
import http from '@http'
import Loading from '@components/Loading'
import { useEffect, useState, useMemo } from "react";
import styles from './Colaboradores.module.css'
import { useOutletContext } from 'react-router-dom';
import styled from "styled-components"
import Management from '@assets/Management.svg'

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

function ColaboradoresCadastrados() {
    
    const [loading, setLoading] = useState(false)
    const [colaboradores, setColaboradores] = useState(null)
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [first, setFirst] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [situacoesUnicas, setSituacoesUnicas] = useState([]);
    const [filters, setFilters] = useState({
        'situacao': { value: null, matchMode: 'custom' }
    });

    const loadData = (currentPage, currentPageSize, search = '', sort = '', currentFilters) => {
        setLoading(true);
        let url = `funcionario/?format=json&page=${currentPage}&page_size=${currentPageSize}`;
        
        console.log('🔍 loadData chamado com:', { currentPage, currentPageSize, search, sort, currentFilters });
        
        if (search) {
            url += `&search=${search}`;
        }
        
        // Melhorar o tratamento da ordenação
        if (sort && sort !== '' && sort.trim() !== '') {
            console.log('🔍 Adicionando ordenação à URL:', sort);
            url += `&ordering=${encodeURIComponent(sort)}`;
        } else {
            console.log('🔍 Sem ordenação aplicada');
        }
        
        console.log('🔍 URL final:', url);
    
        console.log('🔍 currentFilters:', currentFilters);

        const situacaoFilter = currentFilters?.['situacao']?.value;
        if (situacaoFilter) {
            if (Array.isArray(situacaoFilter)) {
                // Múltiplos valores - usar __in
                const situacoesString = situacaoFilter.join(',');
                url += `&tipo_situacao__in=${encodeURIComponent(situacoesString)}`;
            } else {
                // Valor único
                url += `&tipo_situacao=${encodeURIComponent(situacaoFilter)}`;
            }
        }


        http.get(url)
            .then(response => {
                setColaboradores(response.results);
                setTotalRecords(response.count);
                setTotalPages(response.total_pages);
            })
            .catch(erro => {
                console.error("Erro ao carregar dados", erro);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        const fetchSituacoes = async () => {
            try {
                const response = await http.get('tabela_dominio/tipo_situacao/');
                const registros = response.registros || [];
                const unicas = registros.map(s => ({ label: s.descricao, value: s.id }));
                setSituacoesUnicas(unicas);
            } catch (error) {
                console.error("Erro ao buscar situações:", error);
            }
        };
        
        fetchSituacoes();
        // Carregar dados iniciais sem ordenação
        loadData(1, 10, '', '', {});
    }, []);
     
    const onPage = (event) => {
        const newPage = event.page + 1;
        const newPageSize = event.rows;
        
        setFirst(event.first);
        setPage(newPage);
        setPageSize(newPageSize);
        
        // Usar os novos valores diretamente para evitar problemas de estado
        const currentSort = (sortField && sortOrder) ? `${sortOrder === 'desc' ? '-' : ''}${sortField}` : '';
        loadData(newPage, newPageSize, searchTerm, currentSort, filters);
    };

    const onSearch = (search) => {
        setSearchTerm(search);
        setPage(1);
        setFirst(0);
        
        // Usar os estados atuais para ordenação
        const currentSort = (sortField && sortOrder) ? `${sortOrder === 'desc' ? '-' : ''}${sortField}` : '';
        loadData(1, pageSize, search, currentSort, filters);
    };

    const getSortParam = () => {
        if (!sortField || !sortOrder || sortField === '') {
            return '';
        }
        
        const sortParam = `${sortOrder === 'desc' ? '-' : ''}${sortField}`;
        return sortParam;
    };

    const onSort = ({ field, order }) => {
        console.log('🔍 onSort recebido:', { field, order });
        console.log('🔍 Estados atuais:', { sortField, sortOrder, page, pageSize, searchTerm });
        
        // Se field ou order estão vazios, remover ordenação
        if (!field || !order || field === '' || order === '') {
            console.log('🔍 Removendo ordenação (field ou order vazios)');
            setSortField(null);
            setSortOrder(null);
            loadData(page, pageSize, searchTerm, '', filters);
            return;
        }
        
        console.log('🔍 Definindo novos estados de ordenação:', { field, order });
        setSortField(field);
        setSortOrder(order);
        
        // Construir o parâmetro de ordenação diretamente com os novos valores
        const sortParam = `${order === 'desc' ? '-' : ''}${field}`;
        console.log('🔍 sortParam construído:', sortParam);
        console.log('🔍 Chamando loadData com sortParam:', sortParam);
        
        loadData(page, pageSize, searchTerm, sortParam, filters);
    };
    
    const onFilter = (event) => {
        const newFilters = { ...event.filters };
        setFilters(newFilters);
        setPage(1);
        setFirst(0);
        
        // Usar os estados atuais para ordenação
        const currentSort = (sortField && sortOrder) ? `${sortOrder === 'desc' ? '-' : ''}${sortField}` : '';
        loadData(1, pageSize, searchTerm, currentSort, newFilters);
    };

    return (
        <>
            <Loading opened={loading} />
            
            {
                colaboradores ?
                <DataTableColaboradores 
                    colaboradores={colaboradores} 
                    paginator={true} 
                    rows={pageSize} 
                    totalRecords={totalRecords} 
                    totalPages={totalPages}
                    first={first} 
                    onPage={onPage}
                    onSearch={onSearch}
                    onSort={onSort}
                    sortField={sortField}
                    sortOrder={sortOrder === 'asc' ? 1 : sortOrder === 'desc' ? -1 : 0}
                    onFilter={onFilter}
                    filters={filters}
                    situacoesUnicas={situacoesUnicas}
                />
                :
                <ContainerSemRegistro>
                    <section className={styles.container}>
                        <img src={Management} />
                        <h6>Não há colaboradores registrados</h6>
                        <p>Aqui você verá todos os colaboradores registradas.</p>
                    </section>
                </ContainerSemRegistro>
            }
        </>
    )
}

export default ColaboradoresCadastrados