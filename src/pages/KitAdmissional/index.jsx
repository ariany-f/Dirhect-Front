import styled from "styled-components"
import { Link, Outlet, useLocation } from "react-router-dom"
import { useState, useEffect } from 'react'
// import contratos from '@json/contratos.json'
import React, { createContext, useContext } from 'react';
import http from '@http'
import Loading from '@components/Loading'
import kitsMock from '@json/kit_admissional.json';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const KitAdmissional = () => {
    const location = useLocation();
    const [kits, setKits] = useState(null)
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalRecords, setTotalRecords] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [first, setFirst] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    // Carrega do mock
    const loadData = (currentPage, currentPageSize, search = '', sort = '-id') => {
        setLoading(true)
        // Simula busca paginada e filtro
        let data = kitsMock;
        if (search) {
            data = data.filter(k => k.nome.toLowerCase().includes(search.toLowerCase()));
        }
        setKits(data);
        setTotalRecords(data.length);
        setTotalPages(1);
        setLoading(false);
    }

    useEffect(() => {
        loadData(page, pageSize, searchTerm)
    }, [])

    const contextValue = {
        kits,
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
        push: (newKit) => {
            setKits(prevKits => {
                if (!prevKits) return [newKit];
                return [...prevKits, newKit];
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

export default KitAdmissional; 