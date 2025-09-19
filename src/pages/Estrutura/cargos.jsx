import styles from '@pages/Estrutura/Departamento.module.css'
import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react'
import http from '@http'
import DataTableCargos from '@components/DataTableCargos'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Loading from '@components/Loading'
import { GrAddCircle } from 'react-icons/gr'
import Management from '@assets/Management.svg'
import ModalAdicionarDepartamento from '@components/ModalAdicionarDepartamento'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Toast } from 'primereact/toast'
import { ArmazenadorToken } from '@utils'

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


function CargosLista() {

    const [loading, setLoading] = useState(false)
    const [cargos, setCargos] = useState([])
    const [modalOpened, setModalOpened] = useState(false)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalRecords, setTotalRecords] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [first, setFirst] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortField, setSortField] = useState('')
    const [sortOrder, setSortOrder] = useState('')
    const toast = useRef(null)
    const navegar = useNavigate()
    
    const loadData = (currentPage, currentPageSize, search = '', sort = '-id', order = '') => {
        setLoading(true);
        const orderParam = (sort && order) ? `&ordering=${order === 'desc' ? '-' : ''}${sort}` : '&ordering=-id';
        http.get(`cargo/?format=json&page=${currentPage}&page_size=${currentPageSize}${search ? `&search=${search}` : ''}${orderParam}`)
            .then(response => {
                setCargos(response.results);
                setTotalRecords(response.count);
                setTotalPages(response.total_pages);
            })
            .catch(erro => {
                // Tratar erro
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadData(page, pageSize, searchTerm, sortField, sortOrder);
    }, []);

    const onPage = (event) => {
        const newPage = event.page + 1;
        const newPageSize = event.rows;
        
        setFirst(event.first);
        setPage(newPage);
        setPageSize(newPageSize);
        
        loadData(newPage, newPageSize, searchTerm, sortField, sortOrder);
    };

    const onSearch = (search) => {
        setSearchTerm(search);
        setPage(1);
        setFirst(0);
        loadData(1, pageSize, search, sortField, sortOrder);
    };

    const onSort = ({ field, order }) => {
        setSortField(field);
        setSortOrder(order);
        loadData(page, pageSize, searchTerm, field, order);
    };

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
                        <Botao estilo={''} size="small" tab>Centros de Custo</Botao>
                    </Link>
                    <Link to="/estrutura/cargos">
                        <Botao estilo={'black'} size="small" tab>Cargos</Botao>
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
                {ArmazenadorToken.hasPermission('add_cargo') &&
                    <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Criar um cargo</Botao>
                }
            </BotaoGrupo>
            {
                    <DataTableCargos 
                        cargos={cargos}
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
               
            }
        </ConteudoFrame>
        <ModalAdicionarDepartamento aoSalvar={() => true} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}

export default CargosLista