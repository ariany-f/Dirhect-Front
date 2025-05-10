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
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

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
    const [sortField, setSortField] = useState('')
    const [sortOrder, setSortOrder] = useState('')
    const toast = useRef(null)
    const timeoutRef = useRef(null)
    const { usuario } = useSessaoUsuarioContext()

    const loadBeneficios = () => {
        setLoading(true)
        let url = `beneficio/?format=json&page=${lazyParams.page}&page_size=${lazyParams.rows}`;
        if (searchTerm) url += `&search=${searchTerm}`;
        if (sortField && sortOrder) url += `&ordering=${sortOrder === 'desc' ? '-' : ''}${sortField}`;
        if (usuario?.tipo !== 'global') url += `&ativo=true`;
        http.get(url)
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
    }, [lazyParams, searchTerm, sortField, sortOrder])

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

    const onSort = ({ sortField, sortOrder }) => {
        setSortField(sortField);
        setSortOrder(sortOrder === 1 ? 'asc' : 'desc');
    };

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
            <ConteudoFrame>
                <Toast ref={toast} />
                <DataTableBeneficios 
                    beneficios={beneficios}
                    paginator={true}
                    rows={lazyParams.rows}
                    totalRecords={totalRecords}
                    first={lazyParams.first}
                    onPage={onPage}
                    onSearch={onSearch}
                    onBeneficioDeleted={loadBeneficios}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={onSort}
                />
                <ModalBeneficios aoSalvar={adicionarBeneficio} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
            </ConteudoFrame>
        </>
    )
}

export default Beneficios