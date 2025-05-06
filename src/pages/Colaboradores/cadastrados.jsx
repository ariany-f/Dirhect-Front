import DataTableColaboradores from '@components/DataTableColaboradores'
import http from '@http'
import Loading from '@components/Loading'
import { useEffect, useState } from "react";
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

    const loadData = (currentPage, currentPageSize, search = '', sort = '') => {
        setLoading(true);
        const orderParam = sort ? `&ordering=${sort}` : '';
        http.get(`funcionario/?format=json&page=${currentPage}&page_size=${currentPageSize}${search ? `&search=${search}` : ''}${orderParam}`)
            .then(response => {
                setColaboradores(response.results);
                setTotalRecords(response.count);
                setTotalPages(response.total_pages);
            })
            .catch(erro => {
                // Tratar erro
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadData(page, pageSize, searchTerm);
    }, []);

    const onPage = (event) => {
        const newPage = event.page + 1;
        const newPageSize = event.rows;
        
        setFirst(event.first);
        setPage(newPage);
        setPageSize(newPageSize);
        
        loadData(newPage, newPageSize, searchTerm, getSortParam());
    };

    const onSearch = (search) => {
        setSearchTerm(search);
        setPage(1);
        setFirst(0);
        loadData(1, pageSize, search, getSortParam());
    };

    const getSortParam = () => {
        if (!sortField) return '';
        return `${sortOrder === 'desc' ? '-' : ''}${sortField}`;
    };

    const onSort = ({ field, order }) => {
        setSortField(field);
        setSortOrder(order);
        loadData(page, pageSize, searchTerm, `${order === 'desc' ? '-' : ''}${field}`);
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