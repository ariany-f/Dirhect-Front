import http from '@http'
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom'
import BotaoGrupo from "@components/BotaoGrupo"
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import CampoTexto from "@components/CampoTexto"
import BotaoSemBorda from "@components/BotaoSemBorda"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import { Skeleton } from 'primereact/skeleton'
import { FaPencilAlt } from 'react-icons/fa'
import { MdCancel } from "react-icons/md"
import Loading from "@components/Loading"
import styles from './Departamento.module.css'
import './AdicionarColaboradores.css'
import { Toast } from 'primereact/toast'
import { DataTable } from 'primereact/datatable'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import styled from 'styled-components';
import { useDepartamentoContext } from '../../contexts/Departamento';
import DottedLine from '@components/DottedLine';

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

const LadoALado = styled.div`
    display: flex;
    gap: 24px;
    & span {
        display: flex;
        align-items: center;
    }
`

function DepartamentoAdicionarColaboradores() {

    let { id } = useParams()
    const navegar = useNavigate()
    const {
        departamento,
        setDepartamento,
        setColaboradores,
        setNome,
        submeterDepartamento
    } = useDepartamentoContext()

    const [loading, setLoading] = useState(false)
    const [edicaoAberta, setEdicaoAberta] = useState(false)
    const [listaColaboradores, setListaColaboradores] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState('')
    const [rowClick, setRowClick] = useState(true)
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const toast = useRef(null)

    useEffect(() => {
        
        if(id && typeof id !== undefined && id !== null)
        {
            if(departamento.public_id !== id || departamento.status === 10)
            {
                setLoading(true)
                http.get(`api/dashboard/department/${id}`)
                    .then(response => {
                        if(response.status === 'success')
                        {
                            setDepartamento(response.department[0])
                            setColaboradores(response.department.collaborators)
                            
                            setLoading(false)
                        }
                    })
                    .catch(erro => console.log(erro))
            }
        }
        

        if(listaColaboradores.length === 0)
        {
            http.get('api/dashboard/collaborator')
                .then(response => {
                    if(response.data && response.data.collaborators)
                    {
                        setListaColaboradores(response.data.collaborators)
                    }
                })
                .catch(erro => console.log(erro))
        }
    }, [id, edicaoAberta])

    const editarDepartamento = (evento) => {
        if (evento.key === 'Enter') {
            evento.preventDefault()
            setEdicaoAberta(false)
        }
    }

    const adicionarColaborador = () => {
        setLoading(true)
        setColaboradores(departamento.collaborators)
        submeterDepartamento().then(response => {0
            if(response.status)
            {
                if(response.status === 'success')
                {
                    toast.current.show({ severity: 'info', summary: 'Sucesso', detail: 'Colaborador Adicionado', life: 3000 });
                    if(id && typeof id !== undefined && id !== null)
                    {
                        setTimeout(() => {
                            navegar(`/departamento/detalhes/${id}`)
                        }, "700");
                    }
                    else
                    {
                        setTimeout(() => {
                            navegar(`/departamento/detalhes/${response.public_id}`)
                        }, "700");
                    }
                }
            }
            else
            {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar adicionar colaborador', life: 3000 });
            }
        })
    }
    
    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    return (
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <Texto weight={500} size="12px">Nome do departamento</Texto>
            {departamento && ( (!id) || departamento.public_id === id) ?
                <>
                    <BotaoGrupo align="space-between">
                        {
                            edicaoAberta ? 
                                <div style={{display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '8px'}}>
                                    <input autoFocus onKeyUp={(evento) => editarDepartamento(evento)} style={{fontSize: '28px',fontWeight: '700', width: '70%', boxSizing: 'border-box', height: '35px'}} type="text" value={departamento.name} onChange={(evento) => setNome(evento.target.value)} placeholder={departamento.name}/>
                                    <MdCancel style={{cursor: 'pointer', fill: 'var(--primaria)'}} size={24} onClick={() => setEdicaoAberta(false)} />
                                </div>
                            :
                            <>
                                <Titulo>
                                    <h3>{departamento?.name}</h3>
                                </Titulo>
                                <BotaoSemBorda $color="var(--error)">
                                    <FaPencilAlt /><Link onClick={() => setEdicaoAberta(true)} className={styles.link}>Editar</Link>
                                </BotaoSemBorda>
                            </>
                        }
                    
                    </BotaoGrupo>
                    <DottedLine />
                    <Titulo>
                        <h6>Selecione os colaboradores</h6>
                        <SubTitulo>
                            Os colaboradores selecionados serão incluídos nesse novo departamento
                        </SubTitulo>
                    </Titulo>
                    <div className="flex justify-content-end">
                        <span className="p-input-icon-left">
                            <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar colaborador" />
                        </span>
                    </div>
                    <DataTable value={listaColaboradores} filters={filters} globalFilterFields={['name']} emptyMessage="Não foram encontrados colaboradores" selectionMode={rowClick ? null : 'checkbox'} selection={( (!id) || departamento.public_id === id) ? departamento.collaborators : []} onSelectionChange={(e) => setColaboradores(e.value)} tableStyle={{ minWidth: '68vw' }}>
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="name" header="Nome Completo" style={{ width: '100%' }}></Column>
                    </DataTable>
                    <ContainerButton>
                        <Botao aoClicar={() => navegar(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Cancelar</Botao>
                        <LadoALado>
                            <span>Selecionado&nbsp;<Texto color='var(--primaria)' weight={700}>{(departamento.collaborators_count && ( (!id) || departamento.public_id === id)) ? departamento.collaborators_count : 0}</Texto></span>
                            <Botao aoClicar={adicionarColaborador} estilo="vermilion" size="medium" filled>Adicionar Colaboradores</Botao>
                        </LadoALado>
                    </ContainerButton>
                </>
            : <Skeleton variant="rectangular" width={300} height={60} />
            }
        </Frame>
    )
}

export default DepartamentoAdicionarColaboradores