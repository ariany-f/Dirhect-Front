import http from '@http'
import { useEffect, useRef, useState } from "react"
import BotaoGrupo from '@components/BotaoGrupo'
import BotaoSemBorda from '@components/BotaoSemBorda'
import Botao from '@components/Botao'
import Loading from '@components/Loading'
import Container from '@components/Container'
import { GrAddCircle } from 'react-icons/gr'
import styles from './Beneficios.module.css'
import { FaMapPin } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import DataTableBeneficios from '@components/DataTableBeneficios'
import styled from 'styled-components'
import ModalBeneficios from '../../components/ModalBeneficios'
import { Toast } from 'primereact/toast'

function Beneficios() {
    const [loading, setLoading] = useState(false)
    const [beneficios, setBeneficios] = useState([])
    const [modalOpened, setModalOpened] = useState(false)
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1
    })
    const [totalRecords, setTotalRecords] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const toast = useRef(null)
    const timeoutRef = useRef(null)

    const loadBeneficios = () => {
        setLoading(true)
        http.get(`beneficio/?format=json&page=${lazyParams.page}&page_size=${lazyParams.rows}${searchTerm ? `&search=${searchTerm}` : ''}`)
            .then(response => {
                setBeneficios(response.results)
                setTotalRecords(response.count)
            })
            .catch(erro => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar benefícios',
                    life: 3000
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        loadBeneficios()
    }, [lazyParams, searchTerm])

    const onPage = (event) => {
        setLazyParams(prevState => ({
            ...prevState,
            first: event.first,
            rows: event.rows,
            page: event.page + 1
        }))
    }

    const onSearch = (value) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            setSearchTerm(value)
            setLazyParams(prevState => ({
                ...prevState,
                first: 0,
                page: 1
            }))
        }, 500)
    }

    const adicionarBeneficio = (beneficio) => {
        if(beneficio.tipo == '' || beneficio.descricao == '') {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos', life: 3000 });
            return;
        }
        const data = beneficio;
       
        http.post('beneficio/', data)
            .then(response => {
                if(response.id) {
                    loadBeneficios()
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Benefício adicionado com sucesso',
                        life: 3000
                    });
                }
            })
            .catch(erro => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Benefício não pôde ser adicionado',
                    life: 3000
                });
            })
            .finally(function() {
                setModalOpened(false)
            })
    }

    return (
        <>
            <Loading opened={loading} />
            <>
                <Toast ref={toast} />
                <Container>
                    <DataTableBeneficios 
                        beneficios={beneficios}
                        paginator={true}
                        rows={lazyParams.rows}
                        totalRecords={totalRecords}
                        first={lazyParams.first}
                        onPage={onPage}
                        onSearch={onSearch}
                        onBeneficioDeleted={loadBeneficios}
                    />
                </Container>
                <ModalBeneficios aoSalvar={adicionarBeneficio} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
            </>
        </>
    )
}

export default Beneficios