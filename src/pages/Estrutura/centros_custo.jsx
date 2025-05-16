import styles from '@pages/Estrutura/Departamento.module.css'
import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react'
import http from '@http'
import DataTableCentrosCusto from '@components/DataTableCentrosCusto'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Loading from '@components/Loading'
import { GrAddCircle } from 'react-icons/gr'
import Management from '@assets/Management.svg'
import ModalAdicionarCentroCusto from '@components/ModalAdicionarCentroCusto'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Toast } from 'primereact/toast'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const ContainerSemRegistro = styled.div`
    display: flex;
    padding: 96px 12px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
    width: 100%;
    text-align: center;
    & p {
        margin: 0 auto;
    }

    & h6 {
        width: 60%;
    }
`

function CentrosCustoLista() {
    const [loading, setLoading] = useState(false)
    const [centros_custo, setCentrosCusto] = useState(null)
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)
    const navegar = useNavigate()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalRecords, setTotalRecords] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [first, setFirst] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortField, setSortField] = useState('')
    const [sortOrder, setSortOrder] = useState('')

    const loadData = (currentPage, currentPageSize, search = '', sort = '', order = '') => {
        setLoading(true)
        const orderParam = (sort && order) ? `&ordering=${order === 'desc' ? '-' : ''}${sort}` : '';
        http.get(`centro_custo/?format=json&page=${currentPage}&page_size=${currentPageSize}${search ? `&search=${search}` : ''}${orderParam}`)
            .then(response => {
                setCentrosCusto(response.results)
                setTotalRecords(response.count)
                setTotalPages(response.total_pages)
            })
            .catch(erro => {
                console.error('Erro ao carregar centros de custo:', erro)
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar centros de custo'
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        loadData(page, pageSize, searchTerm, sortField, sortOrder)
    }, [modalOpened])

    const onPage = (event) => {
        const newPage = event.page + 1
        const newPageSize = event.rows
        
        setFirst(event.first)
        setPage(newPage)
        setPageSize(newPageSize)
        
        loadData(newPage, newPageSize, searchTerm, sortField, sortOrder)
    }

    const onSearch = (search) => {
        setSearchTerm(search)
        setPage(1)
        setFirst(0)
        loadData(1, pageSize, search, sortField, sortOrder)
    }

    const onSort = ({ field, order }) => {
        setSortField(field);
        setSortOrder(order);
        loadData(page, pageSize, searchTerm, field, order);
    };

    const adicionarCentroCusto = (nome, cc_pai) => {
        setLoading(true)
       
        const data = {};
        data.nome = nome;
        data.cc_pai = cc_pai.code;

        http.post('centro_custo/', data)
            .then(response => {
                if(response.id) {
                    setModalOpened(false)
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Centro de custo criado com sucesso!'
                    })
                }
            })
            .catch(erro => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao criar centro de custo'
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <>
        <ConteudoFrame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <BotaoGrupo align="space-between">
                <BotaoGrupo tabs>
                    <Link to="/estrutura">
                        <Botao estilo={''} size="small" tab>Filiais</Botao>
                    </Link>
                    <Link to="/estrutura/departamentos">
                        <Botao estilo={''} size="small" tab>Departamentos</Botao>
                    </Link>
                    <Link to="/estrutura/secoes">
                        <Botao estilo={''} size="small" tab>Seções</Botao>
                    </Link>
                    <Link to="/estrutura/centros-custo">
                        <Botao estilo={'black'} size="small" tab>Centros de Custo</Botao>
                    </Link>
                    <Link to="/estrutura/cargos">
                        <Botao estilo={''} size="small" tab>Cargos</Botao>
                    </Link>
                    <Link to="/estrutura/funcoes">
                        <Botao estilo={''} size="small" tab>Funções</Botao>
                    </Link>
                    <Link to="/estrutura/sindicatos">
                        <Botao estilo={''} size="small" tab>Sindicatos</Botao>
                    </Link>
                    <Link to="/estrutura/horarios">
                        <Botao estilo={''} size="small" tab>Horários</Botao>
                    </Link>
                </BotaoGrupo>
                <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab>
                    <GrAddCircle className={styles.icon}/> Criar um centro de custo
                </Botao>
            </BotaoGrupo>
            
            {centros_custo && centros_custo.length > 0 ?
                <DataTableCentrosCusto 
                    centros_custo={centros_custo}
                    paginator={true}
                    rows={pageSize}
                    totalRecords={totalRecords}
                    totalPages={totalPages}
                    first={first}
                    onPage={onPage}
                    onSearch={onSearch}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={onSort}
                />
                :
                <ContainerSemRegistro>
                    <section className={styles.container}>
                        <img src={Management} alt="Sem centros de custo" />
                        <h6>Não há centros de custo registrados</h6>
                        <p>Aqui você verá todos os centros de custo registrados.</p>
                    </section>
                </ContainerSemRegistro>
            }
        </ConteudoFrame>
        <ModalAdicionarCentroCusto 
            aoSalvar={adicionarCentroCusto} 
            aoSucesso={toast} 
            aoFechar={() => setModalOpened(false)} 
            centros_custo={centros_custo}
            opened={modalOpened} 
        />
        </>
    )
}

export default CentrosCustoLista