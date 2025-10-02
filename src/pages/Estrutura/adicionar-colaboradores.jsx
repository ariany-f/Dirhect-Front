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
import styles from '@pages/Estrutura/Departamento.module.css'
import './AdicionarColaboradores.css'
import { Toast } from 'primereact/toast'
import { DataTable } from 'primereact/datatable'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import styled from 'styled-components';
import { useDepartamentoContext } from '@contexts/Departamento';
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario";
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

function EstruturaAdicionarColaboradores() {

    let { id, tipo } = useParams() // Adicionar parâmetro tipo
    const navegar = useNavigate()
    
    // Adicionar logs para debugar
    console.log('Parâmetros capturados:', { id, tipo });
    console.log('useParams completo:', useParams());
    
    const { 
        usuario,
        dadosUsuario,
        retornarCompanySession
    } = useSessaoUsuarioContext()
    
    const {
        departamento,
        setDepartamento,
        setColaboradores,
        setNome,
        submeterDepartamento,
        setDepartamentoCompanyPublicId
    } = useDepartamentoContext()

    const [loading, setLoading] = useState(false)
    const [edicaoAberta, setEdicaoAberta] = useState(false)
    const [listaColaboradores, setListaColaboradores] = useState([])
    const [listaColaboradoresSelecionados, setListaColaboradoresSelecionados] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState('')
    const [rowClick, setRowClick] = useState(true)
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [paginaAtual, setPaginaAtual] = useState(1)
    const [totalRegistros, setTotalRegistros] = useState(0)
    const [registrosPorPagina] = useState(20)
    const [estrutura, setEstrutura] = useState(null) // Estado para armazenar dados da estrutura
    const toast = useRef(null)

    // Adicionar useEffect para debugar
    useEffect(() => {
        console.log('useEffect executado!');
        console.log('id:', id, 'tipo:', tipo);
        console.log('Condição id && tipo:', id && tipo);
    }, []); // Executa apenas uma vez na montagem

    useEffect(() => {
        console.log('useEffect com dependências executado!');
        console.log('id:', id, 'tipo:', tipo);
        console.log('Condição id && tipo:', id && tipo);
        
        if(id && tipo) {
            console.log('Entrando no if - carregando estrutura e colaboradores');
            carregarEstrutura();
            carregarColaboradores();
        } else {
            console.log('Não entrou no if - id ou tipo estão undefined/null');
        }
    }, [id, tipo, paginaAtual, globalFilterValue])

    const carregarEstrutura = async () => {
        try {
            let endpoint = '';
            switch(tipo) {
                case 'filial':
                    endpoint = `filial/${id}/`;
                    break;
                case 'departamento':
                    endpoint = `departamento/${id}/`;
                    break;
                case 'secao':
                    endpoint = `secao/${id}/`;
                    break;
                case 'cargo':
                    endpoint = `cargo/${id}/`;
                    break;
                case 'funcao':
                    endpoint = `funcao/${id}/`;
                    break;
                case 'sindicato':
                    endpoint = `sindicato/${id}/`;
                    break;
                case 'horario':
                    endpoint = `horario/${id}/`;
                    break;
                case 'centro-custo':
                    endpoint = `centro_custo/${id}/`;
                    break;
                default:
                    console.error('Tipo de estrutura não reconhecido:', tipo);
                    return;
            }

            const response = await http.get(endpoint);
            setEstrutura(response);
        } catch (error) {
            console.error('Erro ao carregar estrutura:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível carregar os dados da estrutura',
                life: 3000
            });
        }
    };

    const carregarColaboradores = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: paginaAtual,
                page_size: registrosPorPagina
            });

            // Adicionar filtro baseado no tipo de estrutura
            if (tipo === 'filial') {
                params.append('filial__id', id);
            } else if (tipo === 'departamento') {
                params.append('departamento__id', id);
            } else if (tipo === 'secao') {
                params.append('id_secao__id', id);
            } else if (tipo === 'cargo') {
                params.append('id_funcao__id_cargo', id);
            } else if (tipo === 'funcao') {
                params.append('id_funcao__id', id);
            } else if (tipo === 'sindicato') {
                params.append('sindicato', id);
            } else if (tipo === 'horario') {
                params.append('horario', id);
            } else if (tipo === 'centro-custo') {
                params.append('centro_custo__id', id);
            }

            if (globalFilterValue.trim()) {
                params.append('search', globalFilterValue.trim());
            }

            const response = await http.get(`funcionario/?${params.toString()}`);
            console.log(response)
            if (response.results) {
                setListaColaboradores(response.results);
                setTotalRegistros(response.count || 0);
            } else {
                setListaColaboradores(response);
                setTotalRegistros(response.length || 0);
            }
        } catch (error) {
            console.error('Erro ao carregar colaboradores:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível carregar os colaboradores',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onPageChange = (event) => {
        setPaginaAtual(event.page + 1);
    };

    const editarEstrutura = (evento) => {
        if (evento.key === 'Enter') {
            evento.preventDefault()
            setEdicaoAberta(false)
        }
    }

    const adicionarColaborador = () => {
        // Implementar lógica específica para cada tipo de estrutura
        setLoading(true)
        
        // Aqui você pode implementar a lógica específica para cada tipo
        // Por exemplo, para departamento:
        if (tipo === 'departamento') {
            let colaboradoresSimplificados = {};
            if(listaColaboradoresSelecionados) {
                colaboradoresSimplificados = listaColaboradoresSelecionados.map(colaborador => (
                    colaborador.public_id
                ));
            }
           
            setColaboradores(colaboradoresSimplificados)
            setDepartamentoCompanyPublicId(departamento.public_company_id)
            
            if(departamento.public_company_id) {
                submeterDepartamento()
                .then((response) => {
                    if(response.success) {
                        toast.current.show({ severity: 'info', summary: 'Sucesso', detail: 'Colaborador Adicionado', life: 3000 });
                        setTimeout(() => {
                            navegar(`/estrutura/departamento/detalhes/${id}`)
                        }, "700");
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar colaborador', life: 3000 });
                    }
                })
                .catch(erro => {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: erro.data.message })
                })
                .finally(() => {
                    setLoading(false)
                })
            }
        } else {
            // Para outros tipos de estrutura, implementar lógica específica
            toast.current.show({ 
                severity: 'info', 
                summary: 'Info', 
                detail: `Funcionalidade para ${tipo} em desenvolvimento`, 
                life: 3000 
            });
            setLoading(false);
        }
    }
    
    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        setPaginaAtual(1);
    };

    const getNomeEstrutura = () => {
        if (!estrutura) return '---';
        
        switch(tipo) {
            case 'filial':
                return estrutura.nome;
            case 'departamento':
                return estrutura.nome;
            case 'secao':
                return estrutura.nome;
            case 'cargo':
                return estrutura.nome;
            case 'funcao':
                return estrutura.nome;
            case 'sindicato':
                return estrutura.descricao || estrutura.nome;
            case 'horario':
                return estrutura.descricao || estrutura.nome;
            case 'centro-custo':
                return estrutura.nome;
            default:
                return '---';
        }
    };

    const getTituloEstrutura = () => {
        const tipos = {
            'filial': 'Filial',
            'departamento': 'Departamento',
            'secao': 'Seção',
            'cargo': 'Cargo',
            'funcao': 'Função',
            'sindicato': 'Sindicato',
            'horario': 'Horário',
            'centro-custo': 'Centro de Custo'
        };
        return tipos[tipo] || 'Estrutura';
    };

    // Templates para exibir os dados dos colaboradores
    const nomeTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {rowData.imagem && (
                    <img 
                        src={rowData.imagem} 
                        alt="Foto" 
                        style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }} 
                    />
                )}
                <div>
                    <div style={{ fontWeight: '600', color: '#495057' }}>
                        {rowData.funcionario_pessoa_fisica?.nome || '---'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        Chapa: {rowData.chapa || '---'}
                    </div>
                </div>
            </div>
        );
    };

    const cargoTemplate = (rowData) => {
        return (
            <div>
                <div style={{ fontWeight: '500', color: '#495057' }}>
                    {rowData.funcao_nome || '---'}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                    {rowData.tipo_funcionario_descricao || '---'}
                </div>
            </div>
        );
    };

    const situacaoTemplate = (rowData) => {
        return (
            <div>
                <div style={{ 
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500',
                    backgroundColor: rowData.tipo_situacao_cor_tag || '#6c757d',
                    color: 'white'
                }}>
                    {rowData.tipo_situacao_descricao || '---'}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                    Adm: {rowData.dt_admissao ? new Date(rowData.dt_admissao).toLocaleDateString('pt-BR') : '---'}
                </div>
            </div>
        );
    };

    return (
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <Texto weight={500} size="12px">Nome da {getTituloEstrutura().toLowerCase()}</Texto>
            {estrutura ?
                <>
                    <BotaoGrupo align="space-between">
                        {
                            edicaoAberta ? 
                                <div style={{display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '8px'}}>
                                    <input 
                                        autoFocus 
                                        onKeyUp={(evento) => editarEstrutura(evento)} 
                                        style={{fontSize: '28px',fontWeight: '700', width: '70%', boxSizing: 'border-box', height: '35px'}} 
                                        type="text" 
                                        value={getNomeEstrutura()} 
                                        onChange={(evento) => {
                                            // Implementar lógica de edição específica para cada tipo
                                        }} 
                                        placeholder={getNomeEstrutura()}
                                    />
                                    <MdCancel style={{cursor: 'pointer', fill: 'var(--primaria)'}} size={24} onClick={() => setEdicaoAberta(false)} />
                                </div>
                            :
                            <>
                                <Titulo>
                                    <h3>{getNomeEstrutura()}</h3>
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
                            Os colaboradores selecionados serão incluídos nesta {getTituloEstrutura().toLowerCase()}
                        </SubTitulo>
                    </Titulo>
                    <div className="flex justify-content-end">
                        <span className="p-input-icon-left">
                            <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar colaborador" />
                        </span>
                    </div>
                    <DataTable 
                        value={listaColaboradores} 
                        filters={filters} 
                        globalFilterFields={['funcionario_pessoa_fisica__nome', 'chapa']} 
                        emptyMessage="Não foram encontrados colaboradores" 
                        selectionMode={rowClick ? null : 'checkbox'} 
                        selection={listaColaboradoresSelecionados} 
                        onSelectionChange={(e) => {
                            setListaColaboradoresSelecionados(e.value);
                        }} 
                        tableStyle={{ minWidth: '68vw' }}
                        paginator
                        rows={registrosPorPagina}
                        totalRecords={totalRegistros}
                        first={(paginaAtual - 1) * registrosPorPagina}
                        onPage={onPageChange}
                        lazy
                        dataKey="id"
                        loading={loading}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column body={nomeTemplate} header="Colaborador" style={{ width: '25%' }}></Column>
                        <Column body={cargoTemplate} header="Função/Tipo" style={{ width: '25%' }}></Column>
                        <Column body={situacaoTemplate} header="Situação" style={{ width: '25%' }}></Column>
                        <Column field="filial_nome" header="Filial" style={{ width: '25%' }}></Column>
                    </DataTable>
                    <ContainerButton>
                        <Botao aoClicar={() => navegar(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Cancelar</Botao>
                        <LadoALado>
                            <span>Selecionado&nbsp;<Texto color='var(--primaria)' weight={700}>{listaColaboradoresSelecionados.length}</Texto></span>
                            <Botao aoClicar={adicionarColaborador} estilo="vermilion" size="medium" filled>Adicionar Colaboradores</Botao>
                        </LadoALado>
                    </ContainerButton>
                </>
            : <Skeleton variant="rectangular" width={300} height={60} />
            }
        </Frame>
    )
}

export default EstruturaAdicionarColaboradores