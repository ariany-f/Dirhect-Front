import styled from "styled-components"
import { Link, Outlet, useLocation, useOutlet, useOutletContext } from "react-router-dom"
import React, { createContext, useContext, useState, useEffect } from 'react';
import DataTableTarefas from '@components/DataTableTarefas'
import http from '@http'
import Loading from '@components/Loading'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const TarefasLista = () => {

    const location = useLocation();
    const [loading, setLoading] = useState(false)
    const [tarefas, setTarefas] = useState(null)
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [first, setFirst] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('-id');
    const [sortOrder, setSortOrder] = useState('');
    const [filters, setFilters] = useState({
        'processo_codigo': { value: null, matchMode: 'custom' },
        'percentual_conclusao': { value: null, matchMode: 'custom' }
    });

    const loadData = (currentPage, currentPageSize, search = '', sort = '-id', currentFilters) => {
        setLoading(true);
        let url = `processos/?format=json&page=${currentPage}&page_size=${currentPageSize}`;
        
        if (search) {
            url += `&search=${search}`;
        }
        
        const orderParam = (sort && sort !== '-null') ? `&ordering=${sort}` : '';
        url += orderParam;

        // Adicionar filtro de processo_codigo
        const processoCodigoFilter = currentFilters?.['processo_codigo']?.value;
        if (processoCodigoFilter) {
            url += `&processo_codigo=${encodeURIComponent(processoCodigoFilter)}`;
        }

        // Adicionar filtro de percentual_conclusao
        const percentualConclusaoFilter = currentFilters?.['percentual_conclusao']?.value;
        if (percentualConclusaoFilter !== null && percentualConclusaoFilter !== undefined) {
            if (percentualConclusaoFilter === 'aguardando') {
                url += `&percentual_conclusao__lt=30&percentual_conclusao__gt=0`;
            } else if (percentualConclusaoFilter === 'em_andamento') {
                url += `&percentual_conclusao__gte=30&percentual_conclusao__lt=100`;
            } else {
                url += `&percentual_conclusao=${encodeURIComponent(percentualConclusaoFilter)}`;
            }
        }

        http.get(url)
            .then(response => {
                setTarefas(response.results);
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
        const newFilters = { ...event.filters };
        setFilters(newFilters);
        setPage(1);
        setFirst(0);
        loadData(1, pageSize, searchTerm, getSortParam(), newFilters);
    };

    return (
        <ConteudoFrame>
            <Loading opened={loading} />
            {tarefas && (
                <DataTableTarefas 
                    tarefas={tarefas} 
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
                    serverFilters={filters}
                />
            )}
        </ConteudoFrame>
    );
};

export default TarefasLista; 