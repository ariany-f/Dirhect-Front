import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Titulo from '@components/Titulo'
import BotaoVoltar from '@components/BotaoVoltar'
import Loading from '@components/Loading'
import { GrAddCircle } from 'react-icons/gr'
import styled from "styled-components"
import http from '@http'
import { Link, Outlet, useLocation } from "react-router-dom"
import { FaDownload } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import React, { createContext, useContext } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import DataTableDemissao from '@components/DataTableDemissoes'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const Demissoes = () => {

    const location = useLocation();
    const [demissoes, setDemissoes] = useState(null)
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [first, setFirst] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [loading, setLoading] = useState(true);
   
    const { 
        vagas
    } = useVagasContext()

    const loadData = (currentPage, currentPageSize, search = '', sort = '') => {
        setLoading(true);
        const orderParam = (sort && sort !== '-null') ? `&ordering=${sort}` : '';
        http.get(`funcionario/?format=json&situacao=D&page=${currentPage}&page_size=${currentPageSize}${search ? `&search=${search}` : ''}${orderParam}`)
            .then(response => {
                setDemissoes(response.results);
                setTotalRecords(response.count);
                setTotalPages(response.total_pages);
            })
            .catch(erro => {
                console.log(erro);
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

    const aoAtualizar = () => {
        loadData(page, pageSize, searchTerm, getSortParam());
    };

    if (loading && !demissoes) {
        return <Loading opened={loading} />
    }

    return (
        <ConteudoFrame>
            <DataTableDemissao 
                demissoes={demissoes} 
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
                aoAtualizar={aoAtualizar}
            />
        </ConteudoFrame>
    );
};

export default Demissoes; 