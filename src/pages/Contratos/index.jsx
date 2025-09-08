import styled from "styled-components"
import { Link, Outlet, useLocation } from "react-router-dom"
import { useState, useEffect } from 'react'
// import contratos from '@json/contratos.json'
import React, { createContext, useContext } from 'react';
import http from '@http'
import Loading from '@components/Loading'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const Contratos = () => {
    const location = useLocation();
    const [contratos, setContratos] = useState(null)
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalRecords, setTotalRecords] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [first, setFirst] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [refreshKey, setRefreshKey] = useState(0); // Chave para forçar refresh

    const loadData = (currentPage, currentPageSize, search = '', sort = '-id') => {
        setLoading(true)  
        const orderParam = (sort && sort !== '-null') ? `&ordering=${sort}` : '&ordering=id';
        http.get(`contrato/?format=json&page=${currentPage}&page_size=${currentPageSize}${search ? `&search=${search}` : ''}${orderParam}`)
            .then(response => {
                setContratos(response.results)
                setTotalRecords(response.count)
                setTotalPages(response.total_pages)
            })
            .catch(erro => {
                console.error('Erro ao carregar contratos:', erro)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    // Recarregar dados quando voltar da página de detalhes
    useEffect(() => {
        // Verifica se estamos na rota principal de contratos (não em detalhes)
        if (location.pathname === '/contratos') {
            loadData(page, pageSize, searchTerm)
        }
    }, [location.pathname, refreshKey])

    useEffect(() => {
        loadData(page, pageSize, searchTerm)
    }, [])

    const contextValue = {
        contratos,
        page,
        pageSize,
        totalRecords,
        totalPages,
        first,
        searchTerm,
        sortField,
        sortOrder,
        setPage,
        setPageSize,
        setFirst,
        setSearchTerm,
        setSortField,
        setSortOrder,
        loadData,
        refreshData: () => setRefreshKey(prev => prev + 1), // Função para forçar refresh
        push: (newContrato) => {
            setContratos(prevContratos => {
                if (!prevContratos) return [newContrato];
                return [...prevContratos, newContrato];
            });
        }
    }

    return (
        <ConteudoFrame>
            <Loading opened={loading} />
            <Outlet context={contextValue} />
        </ConteudoFrame>
    );
};

export default Contratos; 