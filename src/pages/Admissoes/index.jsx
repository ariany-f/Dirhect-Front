import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Titulo from '@components/Titulo'
import BotaoVoltar from '@components/BotaoVoltar'
import Loading from '@components/Loading'
import { GrAddCircle } from 'react-icons/gr'
import styled from "styled-components"
import { Link, Outlet, useLocation } from "react-router-dom"
import { FaDownload } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import React, { createContext, useContext } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import DataTableAdmissao from '@components/DataTableAdmissao'
import http from '@http'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const Admissoes = () => {

    const location = useLocation();
    const [admissoes, setAdmissoes] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [first, setFirst] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const loadData = (currentPage, currentPageSize, search = '', sort = '-id') => {
        setLoading(true);
        const orderParam = (sort && sort !== '-null') ? `&ordering=${sort}` : '';
        http.get(`admissao/?format=json&page=${currentPage}&page_size=${currentPageSize}${search ? `&search=${search}` : ''}${orderParam}`)
            .then(response => {
                setAdmissoes(response.results || response);
                setTotalRecords(response.count || 0);
                setTotalPages(response.total_pages || 0);
            })
            .catch(error => {   
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadData(page, pageSize, searchTerm);
    }, []);
   
    const { 
        vagas
    } = useVagasContext()

    const onPage = (event) => {
        const newPage = event.page + 1;
        const newPageSize = event.rows;
        
        setLoading(true);
        setFirst(event.first);
        setPage(newPage);
        setPageSize(newPageSize);
        
        loadData(newPage, newPageSize, searchTerm, getSortParam());
    };

    const onSearch = (search) => {
        setLoading(true);
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
        setLoading(true);
        setSortField(field);
        setSortOrder(order);
        loadData(page, pageSize, searchTerm, `${order === 'desc' ? '-' : ''}${field}`);
    };

    if (loading) {
        return <Loading opened={loading} />
    }

    return (
        <ConteudoFrame>
            <DataTableAdmissao 
                vagas={admissoes} 
                paginator={true}
                rows={pageSize}
                totalRecords={totalRecords}
                first={first}
                onPage={onPage}
                onSearch={onSearch}
                onSort={onSort}
                sortField={sortField}
                sortOrder={sortOrder}
            />
        </ConteudoFrame>
    );
};

export default Admissoes; 