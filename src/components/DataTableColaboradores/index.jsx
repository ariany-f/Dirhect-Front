import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import BotaoGrupo from '@components/BotaoGrupo';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import ModalDemissao from '../ModalDemissao';
import ModalImportarPlanilha from '@components/ModalImportarPlanilha'
import ModalSelecionarColaborador from '../ModalSelecionarColaborador';
import ModalEncaminharVaga from '@components/ModalEncaminharVaga';
import { Tag } from 'primereact/tag';
import { FaTrash, FaUserTimes, FaUmbrella, FaDownload, FaUmbrellaBeach, FaCheck } from 'react-icons/fa';
import { MdFilterAltOff } from 'react-icons/md';
import { Tooltip } from 'primereact/tooltip';
import { GrAddCircle } from 'react-icons/gr';
import http from '@http';
import { Dropdown } from 'primereact/dropdown';
import { ArmazenadorToken } from '@utils';
import { Toast } from 'primereact/toast';
import CheckboxContainer from '@components/CheckboxContainer';
import { RadioButton } from 'primereact/radiobutton';

function DataTableColaboradores({ colaboradores, paginator, rows, totalRecords, first, onPage, totalPages, onSearch, showSearch = true, onSort, sortField, sortOrder, onFilter, filters, situacoesUnicas }) {
    const[selectedCollaborator, setSelectedCollaborator] = useState(0)
    const [modalOpened, setModalOpened] = useState(false)
    const [modalFeriasOpened, setModalSelecionarColaboradorOpened] = useState(false)
    const [modalEncaminharAberto, setModalEncaminharAberto] = useState(false);
    const [colaboradorParaEncaminhar, setColaboradorParaEncaminhar] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filiais, setFiliais] = useState([]);
    const [funcoes, setFuncoes] = useState([]);
    const [key, setKey] = useState(0); // Chave para forçar re-renderização
    const [dadosCarregados, setDadosCarregados] = useState(false);
    const toast = useRef(null);

    const navegar = useNavigate()
    const {usuario} = useSessaoUsuarioContext()

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        onSearch(value);
    };

    function verDetalhes(value)
    {
        setSelectedCollaborator(value)
        navegar(`/colaborador/detalhes/${value.id}`)
    }
    
    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    const representativeNumeroDependentesTemplate = (rowData) => {
    
        return (
            <Texto weight={600}>{rowData?.dependentes.length}</Texto>
        )
    }
    
    const representativeCPFTemplate = (rowData) => {
    
        return (
            <Texto weight={600}>{formataCPF(rowData?.funcionario_pessoa_fisica?.cpf)}</Texto>
        )
    }

    const representativeChapaTemplate = (rowData) => {
        
        return (
            <div style={{display: 'flex', alignItems: 'center'}}>
                <Texto weight={600}>{rowData?.chapa}</Texto>
            </div>
        )
    }
    
    const representativeFilialTemplate = (rowData) => {
        
        return (
            <div style={{display: 'flex', alignItems: 'center'}}>
                <Texto weight={500}>{rowData.filial_nome ? rowData.filial_nome : '---'}</Texto>
            </div>
        );
    }

    const representativeFuncaoTemplate = (rowData) => {
        
        return (
            <div key={rowData.id}>
                <Texto weight={500}>{rowData.funcao_nome ? rowData.funcao_nome : '---'}</Texto>
                <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                    Tipo:&nbsp;<p style={{fontWeight: '400', color: 'var(--neutro-500)'}}>{rowData?.tipo_funcionario_descricao}</p>
                </div>
            </div>
        )
    }
    
    const representativeAdmissaoTemplate = (rowData) => {
        
        return ( 
            rowData?.dt_admissao ?
            <Texto weight={500}>{new Date(rowData?.dt_admissao).toLocaleDateString('pt-BR')}</Texto>
            : '---'
        )
    }

    const representativeDataNascimentoTemplate = (rowData) => {

        return (
            rowData?.funcionario_pessoa_fisica?.data_nascimento ?
            <Texto weight={500}>{new Date(rowData?.funcionario_pessoa_fisica?.data_nascimento ).toLocaleDateString('pt-BR')}</Texto>
            : '---'
        )
    }
    
    const representativeNomeTemplate = (rowData) => {
        const cpf = rowData?.funcionario_pessoa_fisica?.cpf ?
        formataCPF(rowData?.funcionario_pessoa_fisica?.cpf)
        : '---';
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.funcionario_pessoa_fisica?.nome}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                CPF:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{cpf}</p>
            </div>
        </div>
    }

    const representativSituacaoTemplate = (rowData) => {
       
        let situacao = rowData?.tipo_situacao_descricao;
        let cor = rowData?.tipo_situacao_cor_tag;
        
        if(!rowData?.tipo_situacao_descricao) {
            return (
                <>
                    <Texto weight={600}><Tag severity={null} style={{backgroundColor: cor}} value={'Não informado'}></Tag></Texto>
                    <small>{rowData?.dependentes.length} dependente(s)</small>
                </>
            );
        }
        
        situacao = (
            <>
            <Texto weight={600}><Tag severity={null} style={{backgroundColor: cor}} value={situacao}></Tag></Texto>
            <small>{rowData?.dependentes.length} dependente(s)</small>
            </>
        );
        return situacao
    }

    const handleEncaminhar = async (rowData) => {
        setColaboradorParaEncaminhar(rowData);
        setModalEncaminharAberto(true);
    };

    const handleModalSalvar = async (payload) => {
        try {
            // Aqui você pode usar o endpoint específico para colaboradores se existir
            // Por enquanto, vou usar o mesmo endpoint de vagas como exemplo
            await http.post(`vagas_candidato/${payload.candidato}/seguir/`, payload);
            
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Colaborador encaminhado com sucesso!',
                life: 3000
            });

            // Notifica o componente pai para atualizar os dados
            if (onColaboradoresUpdate) {
                onColaboradoresUpdate();
            }

            setModalEncaminharAberto(false);
        } catch (error) {
            console.error('Erro ao encaminhar colaborador:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao encaminhar colaborador',
                life: 3000
            });
        }
    };

    const representativeActionsTemplate = (rowData) => {
        if (!ArmazenadorToken.hasPermission('view_funcionario')) {
            return null;
        }

        return (
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <Tooltip target=".encaminhar" mouseTrack mouseTrackLeft={10} />
                <FaCheck 
                    className="encaminhar" 
                    data-pr-tooltip="Encaminhar Colaborador" 
                    size={16} 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEncaminhar(rowData);
                    }}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--primaria)'
                    }}
                />

                <Tooltip target=".demissao" mouseTrack mouseTrackLeft={10} />
                <FaUserTimes 
                    className="demissao" 
                    data-pr-tooltip="Solicitação de Demissão" 
                    size={16} 
                    onClick={(e) => {
                        e.stopPropagation();
                        setModalOpened(true);
                    }}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--erro)'
                    }}
                />

                <Tooltip target=".ferias" mouseTrack mouseTrackLeft={10} />
                <FaUmbrellaBeach 
                    className="ferias" 
                    data-pr-tooltip="Solicitação de Férias" 
                    size={16} 
                    onClick={(e) => {
                        e.stopPropagation();
                        setModalSelecionarColaboradorOpened(true);
                    }}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--primaria)'
                    }}
                />
            </div>
        );
    };

    const totalColaboradoresTemplate = () => {
        return 'Total de Colaboradores: ' + (totalRecords ?? 0);
    };

    // Template para filtro de filial
    const filialFilterTemplate = (options) => (
        <Dropdown
            value={options.value}
            options={filiais}
            onChange={e => options.filterApplyCallback(e.value)}
            optionLabel="nome"
            optionValue="id"
            placeholder="Filial"
            showClear
            style={{ minWidth: '12rem' }}
        />
    );

    const filterClearTemplate = (options) => {
        return (
            <button 
                type="button" 
                onClick={options.filterClearCallback} 
                style={{
                    width: '2.5rem', 
                    height: '2.5rem', 
                    color: 'var(--white)',
                    backgroundColor: 'var(--surface-600)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <MdFilterAltOff fill="var(--white)" />
            </button>
        );
    };

    const filterApplyTemplate = (options) => {
        return (
            <button 
                type="button" 
                onClick={options.filterApplyCallback} 
                style={{
                    width: '2.5rem', 
                    height: '2.5rem', 
                    color: 'var(--white)',
                    backgroundColor: 'var(--green-500)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <FaCheck fill="var(--white)" />
            </button>
        );
    };

    const SituacaoFilterContent = ({ options, situacoesUnicas }) => {
        const [filtroSituacao, setFiltroSituacao] = useState('');

        const onSituacaoChange = (e) => {
            options.filterCallback(e.value);
        };

        const situacoesOrdenadas = [...(situacoesUnicas || [])].sort((a, b) => a.label.localeCompare(b.label));

        const situacoesFiltradas = situacoesOrdenadas.filter(situacao => 
            situacao.label.toLowerCase().includes(filtroSituacao.toLowerCase())
        );

        return (
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <CampoTexto
                    valor={filtroSituacao}
                    setValor={setFiltroSituacao}
                    placeholder="Buscar situação..."
                    width="100%"
                />
                <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '10px' }}>
                    <div className="flex align-items-center">
                        <RadioButton
                            inputId="situacao-nenhuma"
                            name="situacao"
                            value={null}
                            onChange={onSituacaoChange}
                            checked={options.value === null}
                        />
                        <label htmlFor="situacao-nenhuma" style={{ marginLeft: '8px', cursor: 'pointer' }}>Nenhuma</label>
                    </div>
                    {situacoesFiltradas.map(situacao => (
                        <div key={situacao.value} className="flex align-items-center">
                            <RadioButton
                                inputId={`situacao-${situacao.value}`}
                                name="situacao"
                                value={situacao.value}
                                onChange={onSituacaoChange}
                                checked={options.value === situacao.value}
                            />
                            <label 
                                htmlFor={`situacao-${situacao.value}`} 
                                style={{ marginLeft: '8px', cursor: 'pointer' }}
                            >
                                {situacao.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const situacaoFilterTemplate = (options) => {
        return <SituacaoFilterContent options={options} situacoesUnicas={situacoesUnicas} />;
    };

    return (
        <>
            <Toast ref={toast} />
            <BotaoGrupo align={showSearch ? 'space-between' : 'end'} wrap>
                {showSearch && (
                    <>
                    <div className="flex justify-content-end">
                        <span className="p-input-icon-left">
                            <CampoTexto width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar colaborador" />
                        </span>
                    </div>
                    </>
                )}
            </BotaoGrupo>
            <DataTable 
                key={key}
                selection={selectedCollaborator} 
                onSelectionChange={(e) => verDetalhes(e.value)}
                selectionMode="single"
                value={colaboradores} 
                filters={filters}
                onFilter={onFilter}
                emptyMessage="Não foram encontrados colaboradores" 
                paginator={paginator}
                lazy
                rows={rows} 
                totalRecords={totalRecords} 
                globalfilterfields={['funcionario_pessoa_fisica.nome', 'chapa', 'filial']}
                first={first} 
                onPage={onPage} 
                onSort={onSort}
                removableSort 
                tableStyle={{ minWidth: '68vw' }}
                showGridlines
                stripedRows
                sortField={sortField}
                sortOrder={sortOrder === 'desc' ? -1 : 1}
                footerColumnGroup={
                    <ColumnGroup>
                        <Row>
                            <Column footer={totalColaboradoresTemplate} style={{ textAlign: 'right', fontWeight: 600 }} />
                        </Row>
                    </ColumnGroup>
                }
            >
                <Column body={representativeChapaTemplate} field="chapa" header="Matrícula" sortable style={{ width: '10%' }}></Column>
                <Column body={representativeNomeTemplate} field="funcionario_pessoa_fisica.nome" sortField="id_pessoafisica__nome" header="Nome Completo" sortable style={{ width: '25%' }}></Column>
                <Column 
                    body={representativeFilialTemplate} 
                    field="filial" 
                    header="Filial" 
                    sortable 
                    style={{ width: '10%' }} 
                    filter 
                    sortField="filial__nome" 
                    filterField="filial" 
                    filterElement={filialFilterTemplate} 
                    showFilterMenu={false} 
                />
                <Column body={representativeFuncaoTemplate} filter showFilterMenu={false} field="id_funcao" sortable sortField="id_funcao_id" header="Função" style={{ width: '25%' }}></Column>
                <Column body={representativeAdmissaoTemplate} field="dt_admissao" header="Admissão" style={{ width: '10%' }}></Column>
                <Column body={representativeDataNascimentoTemplate} field="funcionario_pessoa_fisica.data_nascimento" header="Nascimento" style={{ width: '10%' }}></Column>
                <Column 
                    body={representativSituacaoTemplate} 
                    field="situacao" 
                    header="Situação" 
                    style={{ width: '15%' }}
                    filter
                    filterField="situacao"
                    showFilterMenu={true}
                    filterElement={situacaoFilterTemplate}
                    filterMatchMode="custom"
                    showFilterMatchModes={false}
                    showFilterOperator={false}
                    showAddButton={false}
                    filterClear={filterClearTemplate}
                    filterApply={filterApplyTemplate}
                ></Column>
                {usuario.tipo === 'cliente' || usuario.tipo === 'equipeFolhaPagamento' && 
                    <Column header="" style={{ width: '15%' }} body={representativeActionsTemplate}></Column>
                }
            </DataTable>
            <ModalDemissao opened={modalOpened} aoFechar={() => setModalOpened(false)}/>
            <ModalSelecionarColaborador opened={modalFeriasOpened} aoFechar={() => setModalSelecionarColaboradorOpened(false)}/>
            <ModalEncaminharVaga
                opened={modalEncaminharAberto}
                aoFechar={() => setModalEncaminharAberto(false)}
                aoSalvar={handleModalSalvar}
                candidato={colaboradorParaEncaminhar ? {
                    id: colaboradorParaEncaminhar.id,
                    nome: colaboradorParaEncaminhar.funcionario_pessoa_fisica?.nome,
                    email: colaboradorParaEncaminhar.funcionario_pessoa_fisica?.email,
                    cpf: colaboradorParaEncaminhar.funcionario_pessoa_fisica?.cpf,
                    telefone: colaboradorParaEncaminhar.funcionario_pessoa_fisica?.telefone,
                    dt_nascimento: colaboradorParaEncaminhar.funcionario_pessoa_fisica?.data_nascimento
                } : null}
                vagaId={null} // Você pode passar o vagaId se necessário
            />
        </>
    )
}

export default DataTableColaboradores