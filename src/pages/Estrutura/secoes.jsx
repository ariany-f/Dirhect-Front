import styles from '@pages/Estrutura/Departamento.module.css'
import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react'
import http from '@http'
import DataTableSecoes from '@components/DataTableSecoes'
import CardText from '@components/CardText'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Loading from '@components/Loading'
import { GrAddCircle } from 'react-icons/gr'
import Management from '@assets/Management.svg'
import ModalAdicionarSecao from '@components/ModalAdicionarSecao'
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

function SecoesLista() {
    const [loading, setLoading] = useState(false)
    const [secoes, setSecoes] = useState(null)
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
        http.get(`secao/?format=json&page=${currentPage}&page_size=${currentPageSize}${search ? `&search=${search}` : ''}`)
            .then(response => {
                setSecoes(response.results)
                setTotalRecords(response.count)
                setTotalPages(response.total_pages)
            })
            .catch(erro => {
                console.error('Erro ao carregar seções:', erro)
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar seções'
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

    const adicionarSecao = (nome, codigo, descricao, departamentoId) => {
        setLoading(true)
        
        const data = {
            nome,
            codigo,
            descricao,
            departamento: departamentoId
        }

        http.post('secao/', data)
            .then(response => {
                if(response.id) {
                    setModalOpened(false)
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Seção criada com sucesso!'
                    })
                }
            })
            .catch(erro => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao criar seção'
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
                        <Botao estilo={'black'} size="small" tab>Seções</Botao>
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
                        <Botao estilo={''} size="small" tab>Sindicatos</Botao>
                    </Link>
                    <Link to="/estrutura/horarios">
                        <Botao estilo={''} size="small" tab>Horários</Botao>
                    </Link>
                </BotaoGrupo>
                <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab>
                    <GrAddCircle className={styles.icon}/> Criar uma seção
                </Botao>
            </BotaoGrupo>
            
            {secoes && secoes.length > 0 ?
                <DataTableSecoes 
                    secoes={secoes}
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
                        <img src={Management} alt="Sem seções" />
                        <h6>Não há seções registradas</h6>
                        <p>Aqui você verá todas as seções registradas.</p>
                    </section>
                </ContainerSemRegistro>
            }
        </ConteudoFrame>
        <ModalAdicionarSecao 
            aoSalvar={adicionarSecao} 
            aoSucesso={toast} 
            aoFechar={() => setModalOpened(false)} 
            opened={modalOpened} 
        />
        </>
    )
}

export default SecoesLista