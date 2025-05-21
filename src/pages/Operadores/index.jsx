import DataTableOperadores from '@components/DataTableOperadores'
import http from '@http'
import Botao from "@components/Botao"
import BotaoGrupo from '@components/BotaoGrupo'
import { GrAddCircle } from 'react-icons/gr'
import { useEffect, useState } from "react"
import styles from './Operadores.module.css'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function Operador() {
    
    const [operadores, setOperadores] = useState([])
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const carregarOperadores = (sort = '', order = '') => {
        const orderParam = (sort && order) ? `&ordering=${order === 'desc' ? '-' : ''}${sort}` : '';
        http.get(`usuario/?format=json${orderParam}&email__isnull=False`)
            .then(response => {
                setOperadores(response)
            })
            .catch(erro => console.log(erro))
    }

    useEffect(() => {
        if(!operadores.length) {
            carregarOperadores(sortField, sortOrder);
        }
    }, [])

    const excluirOperador = (operadorId, toast, confirmDialog) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir este operador?',
            header: 'Excluir Operador',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`/usuarios/${operadorId}/?format=json`)
                    .then(() => {
                        toast.current.show({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Operador excluído com sucesso',
                            life: 3000
                        });
                        carregarOperadores();
                    })
                    .catch(error => {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Não foi possível excluir o operador',
                            life: 3000
                        });
                    });
            },
            reject: () => {}
        });
    }

    const onSort = ({ field, order }) => {
        setSortField(field);
        setSortOrder(order);
        carregarOperadores(field, order);
    };

    return (
        <ConteudoFrame>
            <DataTableOperadores operadores={operadores} onDelete={excluirOperador} sortField={sortField} sortOrder={sortOrder} onSort={onSort} />
        </ConteudoFrame>
    )
}

export default Operador