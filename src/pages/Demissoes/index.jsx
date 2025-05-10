import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Titulo from '@components/Titulo'
import BotaoVoltar from '@components/BotaoVoltar'
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
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
   
    const { 
        vagas
    } = useVagasContext()

    useEffect(() => {
        if(!demissoes)
        {
            carregarDemissoes(sortField, sortOrder);
        }
    }, [demissoes, sortField, sortOrder])

    const carregarDemissoes = (sort = '', order = '') => {
        let url = 'funcionario/?format=json&situacao=D';
        if (sort && order) {
            url += `&ordering=${order === 'desc' ? '-' : ''}${sort}`;
        }
        http.get(url)
            .then(response => {
                setDemissoes(response);
            })
            .catch(erro => console.log(erro))
    }

    const onSort = ({ field, order }) => {
        setSortField(field);
        setSortOrder(order);
        setDemissoes(null);
        carregarDemissoes(field, order);
    };

    return (
        <ConteudoFrame>
            <DataTableDemissao demissoes={demissoes} sortField={sortField} sortOrder={sortOrder} onSort={onSort} />
        </ConteudoFrame>
    );
};

export default Demissoes; 