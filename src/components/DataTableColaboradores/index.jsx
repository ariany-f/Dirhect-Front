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
import { Tooltip } from 'primereact/tooltip';
import { GrAddCircle } from 'react-icons/gr';
import http from '@http';
import { Dropdown } from 'primereact/dropdown';
import { ArmazenadorToken } from '@utils';
import { Toast } from 'primereact/toast';

function DataTableColaboradores({ colaboradores, paginator, rows, totalRecords, first, onPage, totalPages, onSearch, showSearch = true, onSort, sortField, sortOrder, onColaboradoresUpdate }) {
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

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

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

    const handleSort = (event) => {
        if (onSort) {
            onSort({
                field: event.sortField,
                order: event.sortOrder === 1 ? 'asc' : 'desc'
            });
        }
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
                emptyMessage="Não foram encontrados colaboradores" 
                paginator={paginator}
                lazy
                rows={rows} 
                totalRecords={totalRecords} 
                globalfilterfields={['funcionario_pessoa_fisica.nome', 'chapa', 'filial']}
                first={first} 
                onPage={onPage} 
                onSort={handleSort}
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
                <Column body={representativSituacaoTemplate} field="situacao" header="Situação" style={{ width: '15%' }}></Column>
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