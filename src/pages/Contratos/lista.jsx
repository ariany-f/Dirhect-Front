import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Titulo from '@components/Titulo'
import BotaoVoltar from '@components/BotaoVoltar'
import styles from './Contratos.module.css'
import { GrAddCircle } from 'react-icons/gr'
import styled from "styled-components"
import { Link, Outlet, useLocation, useOutlet, useOutletContext } from "react-router-dom"
import { FaDownload } from 'react-icons/fa'
import { useState, useEffect, useRef } from 'react'
import React, { createContext, useContext } from 'react';
import DataTableContratos from '@components/DataTableContratos'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const ContratosLista = () => {
    const location = useLocation();
    const context = useOutletContext()
    
    const onPage = (event) => {
        const newPage = event.page + 1
        const newPageSize = event.rows
        
        context.setFirst(event.first)
        context.setPage(newPage)
        context.setPageSize(newPageSize)
        
        context.loadData(newPage, newPageSize, context.searchTerm, getSortParam())
    }

    const onSearch = (search) => {
        context.setSearchTerm(search)
        context.setPage(1)
        context.setFirst(0)
        context.loadData(1, context.pageSize, search, getSortParam());
    };

    const getSortParam = () => {
        if (!context.sortField) return '';
        return `${context.sortOrder === 'desc' ? '-' : ''}${context.sortField}`;
    };

    const onUpdate = () => {
        context.loadData(context.page, context.pageSize, context.searchTerm)
    }

    const onSort = ({ field, order }) => {
        context.setSortField(field);
        context.setSortOrder(order);
        context.loadData(context.page, context.pageSize, context.searchTerm, `${order === 'desc' ? '-' : ''}${field}`);
    };

    return (
        <ConteudoFrame>
            <DataTableContratos 
                contratos={context.contratos}
                paginator={true}
                rows={context.pageSize}
                totalRecords={context.totalRecords}
                totalPages={context.totalPages}
                first={context.first}
                onPage={onPage}
                onSearch={onSearch}
                onUpdate={onUpdate}
                onSort={onSort}
                sortField={context.sortField}
                sortOrder={context.sortOrder}
            />
        </ConteudoFrame>
    );
};

export default ContratosLista; 