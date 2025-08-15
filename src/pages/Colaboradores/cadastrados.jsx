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
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [situacoesUnicas, setSituacoesUnicas] = useState([]);
    const [filters, setFilters] = useState({
        'situacao': { value: null, matchMode: 'custom' }
    });

    const loadData = (currentPage, currentPageSize, search = '', sort = '', currentFilters) => {
        setLoading(true);
        let url = `funcionario/?format=json&page=${currentPage}&page_size=${currentPageSize}`;
        
        if (search) {
            url += `&search=${search}`;
        }
        
        const orderParam = (sort && sort !== '-null') ? `&ordering=${sort}` : '';
        url += orderParam;
    
        console.log('🔍 currentFilters:', currentFilters);

        const situacaoFilter = currentFilters?.['situacao']?.value;
        if (situacaoFilter) {
            url += `&tipo_situacao=${encodeURIComponent(situacaoFilter)}`;
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
        loadData(page, pageSize, searchTerm, getSortParam(), filters);
    }, []);
     
    const onPage = (event) => {
        const newPage = event.page + 1;
        const newPageSize = event.rows;
        
        setFirst(event.first);
        setPage(newPage);
        setPageSize(newPageSize);
        
        loadData(newPage, newPageSize, searchTerm, getSortParam(), filters);
    };

    const onSearch = (search) => {
        setSearchTerm(search);
        setPage(1);
        setFirst(0);
        loadData(1, pageSize, search, getSortParam(), filters);
    };

    const getSortParam = () => {
        if (!sortField) return '';
        return `${sortOrder === 'desc' ? '-' : ''}${sortField}`;
    };

    const onSort = ({ field, order }) => {
        setSortField(field);
        setSortOrder(order);
        loadData(page, pageSize, searchTerm, `${order === 'desc' ? '-' : ''}${field}`, filters);
    };
    
    const onFilter = (event) => {
        console.log("Filtro aplicado:", event.filters);
        const newFilters = { ...event.filters };
        setFilters(newFilters);
        setPage(1);
        setFirst(0);
        loadData(1, pageSize, searchTerm, getSortParam(), newFilters);
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
                    sortOrder={sortOrder}
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