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
import http from '@http'
import React, { createContext, useContext } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import DataTableContratos from '@components/DataTableContratos'
import ModalContratos from '@components/ModalContratos'
import { Toast } from 'primereact/toast'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const ContratosLista = () => {
    const location = useLocation();
    const [modalOpened, setModalOpened] = useState(false)
    const context = useOutletContext()
    const toast = useRef(null)
    
    const onPage = (event) => {
        const newPage = event.page + 1
        const newPageSize = event.rows
        
        context.setFirst(event.first)
        context.setPage(newPage)
        context.setPageSize(newPageSize)
        
        context.loadData(newPage, newPageSize, context.searchTerm)
    }

    const onSearch = (search) => {
        context.setSearchTerm(search)
        context.setPage(1)
        context.setFirst(0)
        context.loadData(1, context.pageSize, search)
    }

    const adicionarContrato = (operadora, observacao, dt_inicio, dt_fim) => {
        if(operadora == '' || observacao == '' || dt_inicio == '' || dt_fim == '') {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos', life: 3000 });
            return;
        }
        const data = {
            operadora,
            observacao,
            dt_inicio,
            dt_fim
        };

        http.post('contrato/', data)
            .then(response => {
                if(response.id) {
                    context.push(response)
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Contrato criado com sucesso', life: 3000 });
                    setModalOpened(false)
                    context.loadData(context.page, context.pageSize, context.searchTerm)
                }
            })
            .catch(erro => {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar contrato', life: 3000 });
            })
    }

    return (
        <ConteudoFrame>
            <Toast ref={toast} />
            <BotaoGrupo align="end">
                <BotaoGrupo align="center">
                    <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab>
                        <GrAddCircle className={styles.icon} fill="white" color="white"/> Criar Contrato
                    </Botao>
                </BotaoGrupo>
            </BotaoGrupo>

            <DataTableContratos 
                contratos={context.contratos}
                paginator={true}
                rows={context.pageSize}
                totalRecords={context.totalRecords}
                totalPages={context.totalPages}
                first={context.first}
                onPage={onPage}
                onSearch={onSearch}
            />

            <ModalContratos 
                aoSalvar={adicionarContrato} 
                opened={modalOpened} 
                aoFechar={() => setModalOpened(false)} 
            />
        </ConteudoFrame>
    );
};

export default ContratosLista; 