import styles from '@pages/Estrutura/Departamento.module.css'
import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react'
import http from '@http'
import DataTableSindicatos from '@components/DataTableSindicatos'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Loading from '@components/Loading'
import { GrAddCircle } from 'react-icons/gr'
import Management from '@assets/Management.svg'
import ModalAdicionarSindicato from '@components/ModalAdicionarSindicato'
import { Link } from 'react-router-dom'
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

function SindicatosLista() {
    const [loading, setLoading] = useState(false)
    const [sindicatos, setSindicatos] = useState(null)
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalRecords, setTotalRecords] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [first, setFirst] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')

    const loadData = (currentPage, currentPageSize, search = '') => {
        setLoading(true)
        http.get(`sindicato/?format=json&page=${currentPage}&page_size=${currentPageSize}${search ? `&search=${search}` : ''}`)
            .then(response => {
                setSindicatos(response.results)
                setTotalRecords(response.count)
                setTotalPages(response.total_pages)
            })
            .catch(erro => {
                console.error('Erro ao carregar sindicatos:', erro)
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar sindicatos'
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        loadData(page, pageSize, searchTerm)
    }, [modalOpened])

    const onPage = (event) => {
        const newPage = event.page + 1
        const newPageSize = event.rows
        
        setFirst(event.first)
        setPage(newPage)
        setPageSize(newPageSize)
        
        loadData(newPage, newPageSize, searchTerm)
    }

    const onSearch = (search) => {
        setSearchTerm(search)
        setPage(1)
        setFirst(0)
        loadData(1, pageSize, search)
    }

    const removerMascaraCNPJ = (cnpj) => {
        return cnpj.replace(/[^\d]/g, '');
    }

    const adicionarSindicato = (nome, cnpj) => {
        setLoading(true)
       
        const data = {
            nome,
            cnpj: removerMascaraCNPJ(cnpj)
        }

        http.post('sindicato/', data)
            .then(response => {
                if(response.id) {
                    setModalOpened(false)
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Sindicato criado com sucesso!'
                    })
                }
            })
            .catch(erro => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao criar sindicato'
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
                <BotaoGrupo>
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
                        <Botao estilo={''} size="small" tab>Cargos</Botao>
                    </Link>
                    <Link to="/estrutura/funcoes">
                        <Botao estilo={''} size="small" tab>Funções</Botao>
                    </Link>
                    <Link to="/estrutura/sindicatos">
                        <Botao estilo={'black'} size="small" tab>Sindicatos</Botao>
                    </Link>
                    <Link to="/estrutura/horarios">
                        <Botao estilo={''} size="small" tab>Horários</Botao>
                    </Link>
                </BotaoGrupo>
                <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab>
                    <GrAddCircle className={styles.icon}/> Criar um sindicato
                </Botao>
            </BotaoGrupo>
            
            {sindicatos && sindicatos.length > 0 ?
                <DataTableSindicatos 
                    sindicatos={sindicatos}
                    paginator={true}
                    rows={pageSize}
                    totalRecords={totalRecords}
                    totalPages={totalPages}
                    first={first}
                    onPage={onPage}
                    onSearch={onSearch}
                />
                :
                <ContainerSemRegistro>
                    <section className={styles.container}>
                        <img src={Management} alt="Sem sindicatos" />
                        <h6>Não há sindicatos registrados</h6>
                        <p>Aqui você verá todos os sindicatos registrados.</p>
                    </section>
                </ContainerSemRegistro>
            }
        </ConteudoFrame>
        <ModalAdicionarSindicato 
            aoSalvar={adicionarSindicato} 
            aoSucesso={toast} 
            aoFechar={() => setModalOpened(false)} 
            opened={modalOpened} 
        />
        </>
    )
}

export default SindicatosLista