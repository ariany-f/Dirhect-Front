import styles from '@pages/Estrutura/Departamento.module.css'
import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react'
import http from '@http'
import DataTableDepartamentos from '@components/DataTableDepartamentos'
import departments from '@json/departments.json'
import CardText from '@components/CardText'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Loading from '@components/Loading'
import { FaFileExcel } from 'react-icons/fa'
import { GrAddCircle } from 'react-icons/gr'
import ModalAdicionarFeriado from '@components/ModalAdicionarFeriado'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Toast } from 'primereact/toast'
import DataTableFeriados from '@components/DataTableFeriados'
import { ArmazenadorToken } from '@utils'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function FeriadosLista() {
    const [loading, setLoading] = useState(false)
    const [feriados, setFeriados] = useState(null)
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [first, setFirst] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [exportingExcel, setExportingExcel] = useState(false);

    const loadData = (currentPage, currentPageSize, search = '', sort = '', order = '') => {
        setLoading(true);
        const orderParam = (sort && order) ? `&ordering=${order === 'desc' ? '-' : ''}${sort}` : '';
        http.get(`feriados/?format=json&page=${currentPage}&page_size=${currentPageSize}${search ? `&search=${search}` : ''}${orderParam}`)
            .then(response => {
                setFeriados(response.results);
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
    }, [modalOpened]);

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

    const adicionarFeriado = (data) => {
        setLoading(true);
        console.log(data);
        http.post('feriados/', data)
            .then(response => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Feriado criado com sucesso!',
                    life: 3000
                });
            })
            .catch(erro => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao criar feriado',
                    life: 3000
                });
            })
            .finally(() => {
                setModalOpened(false);
                loadData(page, pageSize, searchTerm, sortField, sortOrder);
            });
    }

    const editarFeriado = (data, id) => {
        setLoading(true);
        http.put(`feriados/${id}/?format=json`, data)
            .then(response => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Feriado atualizado com sucesso!',
                    life: 3000
                });
            })
            .catch(erro => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao atualizar feriado',
                    life: 3000
                });
            })
            .finally(() => {
                setLoading(false);
                loadData(page, pageSize, searchTerm, sortField, sortOrder);
            });
    }

    const exportarExcel = () => {
        http.get('feriados/export-excel/', {
            responseType: 'blob'
        })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `feriados_${dataFormatada}_${horaFormatada}.xlsx`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Planilha exportada com sucesso!',
                    life: 3000
                });
            })
            .catch(erro => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao exportar Excel',
                    life: 3000
                });
            })
            .finally(() => {
                setExportingExcel(false);
            });
    }

    return (
        <>
        <ConteudoFrame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <BotaoGrupo align="space-between">
                <BotaoGrupo tabs>
                    <Link to="/auxiliar">
                        <Botao estilo={'black'} size="small" tab>Feriados</Botao>
                    </Link>
                </BotaoGrupo>
                <BotaoGrupo>
                    <Botao 
                        aoClicar={exportarExcel} 
                        estilo="vermilion" 
                        size="small" 
                        tab
                        disabled={exportingExcel}
                    >
                        <FaFileExcel 
                            fill={exportingExcel ? '#9ca3af' : 'var(--secundaria)'} 
                            color={exportingExcel ? '#9ca3af' : 'var(--secundaria)'} 
                            size={16}
                        />
                        {exportingExcel ? 'Exportando...' : 'Exportar Excel'}
                    </Botao>
                    {ArmazenadorToken.hasPermission('add_feriados') &&
                        <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Criar um feriado</Botao>
                    }
                </BotaoGrupo>
            </BotaoGrupo>
            
            {
                <DataTableFeriados 
                    feriados={feriados}
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
                    onExportExcel={exportarExcel}
                    exportingExcel={exportingExcel}
                    onUpdate={() => loadData(page, pageSize, searchTerm, sortField, sortOrder)}
                />
            }
        </ConteudoFrame>
        <ModalAdicionarFeriado aoSalvar={adicionarFeriado} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}

export default FeriadosLista