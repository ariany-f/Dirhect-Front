import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import BotaoGrupo from '@components/BotaoGrupo';
import Botao from '@components/Botao';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import ModalDemissao from '../ModalDemissao';
import ModalImportarPlanilha from '@components/ModalImportarPlanilha'
import ModalSelecionarColaborador from '../ModalSelecionarColaborador';
import ModalEncaminharVaga from '@components/ModalEncaminharVaga';
import { Tag } from 'primereact/tag';
import { FaTrash, FaUserTimes, FaUmbrella, FaDownload, FaUmbrellaBeach, FaCheck, FaFileExcel } from 'react-icons/fa';
import { MdFilterAltOff } from 'react-icons/md';
import { Tooltip } from 'primereact/tooltip';
import { GrAddCircle } from 'react-icons/gr';
import http from '@http';
import { Dropdown } from 'primereact/dropdown';
import { ArmazenadorToken } from '@utils';
import { Toast } from 'primereact/toast';
import CheckboxContainer from '@components/CheckboxContainer';
import { RadioButton } from 'primereact/radiobutton';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const DependentesTag = styled(Tag)`
    color: var(--black) !important;
    background-color: var(--neutro-200) !important;
    font-size: 13px !important;
    padding: 4px 12px !important;
    
    .p-tag-value {
        color: var(--black) !important;
        font-weight: ${props => props.value === "Nenhum" ? "400" : "500"} !important;
    }
`;

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
    const [exportingExcel, setExportingExcel] = useState(false);
    const toast = useRef(null);
    const { t } = useTranslation('common');

    const navegar = useNavigate()
    const {usuario} = useSessaoUsuarioContext()

    // Configuração de larguras das colunas
    const exibeAcoes = usuario.tipo === 'cliente' || usuario.tipo === 'equipeFolhaPagamento';
    
    // Larguras base quando todas as colunas estão visíveis (incluindo ações)
    const larguraBase = [8, 22, 8, 22, 8, 5, 12, 15]; // chapa, nome, filial, funcao, admissao, dep, situacao, acoes
    
    // Calcula larguras redistribuídas
    const calcularLarguras = () => {
        if (exibeAcoes) {
            // Se exibe ações, usa as larguras normais
            return larguraBase;
        } else {
            // Se não exibe ações, remove a última coluna e redistribui
            const largurasSemAcoes = larguraBase.slice(0, -1); // Remove a última (ações)
            const totalSemAcoes = largurasSemAcoes.reduce((acc, val) => acc + val, 0);
            const fatorRedistribuicao = 100 / totalSemAcoes;
            
            return largurasSemAcoes.map(largura => Math.round(largura * fatorRedistribuicao * 100) / 100);
        }
    };
    
    const largurasColunas = calcularLarguras();

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        onSearch(value);
    };

    const exportarExcel = async () => {
        setExportingExcel(true);
        try {
            const response = await http.get('funcionario/export-excel/', {
                responseType: 'blob'
            });
            
            // Cria um link para download
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            
            // Gera um nome de arquivo com data/hora
            const dataAtual = new Date();
            const dataFormatada = dataAtual.toLocaleDateString('pt-BR').replace(/\//g, '-');
            const horaFormatada = dataAtual.toLocaleTimeString('pt-BR').replace(/:/g, '-');
            link.setAttribute('download', `colaboradores_${dataFormatada}_${horaFormatada}.xlsx`);
            
            // Adiciona ao DOM, clica e remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Limpa a URL criada
            window.URL.revokeObjectURL(url);
            
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Planilha exportada com sucesso!',
                life: 3000
            });
        } catch (error) {
            console.error('Erro ao exportar Excel:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao exportar planilha de colaboradores',
                life: 3000
            });
        } finally {
            setExportingExcel(false);
        }
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
        const numDependentes = rowData?.dependentes?.length || 0;
        
        if (numDependentes === 0) {
            return (
                <Texto weight={400} style={{ color: '#9ca3af', fontSize: '13px' }}>Nenhum</Texto>
            );
        }
        
        return (
            <DependentesTag 
                value={numDependentes.toString()} 
                severity="secondary" 
            />
        );
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
        
        return (
            <div key={rowData.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Imagem ou Avatar */}
                <div style={{ flexShrink: 0 }}>
                    {rowData.imagem ? (
                        <img 
                            src={rowData.imagem}
                            alt={`Foto de ${rowData.funcionario_pessoa_fisica?.nome}`}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid #f1f5f9',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    {/* Fallback com letra inicial */}
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#6b7280',
                        display: rowData.imagem ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        border: '2px solid #f1f5f9',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}>
                        {rowData?.funcionario_pessoa_fisica?.nome?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                </div>
                
                {/* Nome e CPF */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Texto weight={700} width={'100%'}>
                        {rowData?.funcionario_pessoa_fisica?.nome}
                    </Texto>
                    <div style={{marginTop: '6px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                        CPF:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{cpf}</p>
                    </div>
                </div>
            </div>
        );
    }

    const representativSituacaoTemplate = (rowData) => {
       
        let situacao = rowData?.tipo_situacao_descricao;
        let cor = rowData?.tipo_situacao_cor_tag;
        
        if(!rowData?.tipo_situacao_descricao) {
            return (
                <div style={{
                    backgroundColor: cor || '#f3f4f6',
                    color: '#6b7280',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'inline-block'
                }}>
                    N/A
                </div>
            );
        }
        
        situacao = (
            <Texto weight={600}><Tag severity={null} style={{backgroundColor: cor}} value={situacao}></Tag></Texto>
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
        const [selectedSituacoes, setSelectedSituacoes] = useState([]);

        // Inicializar com o valor atual do filtro
        useEffect(() => {
            if (options.value) {
                setSelectedSituacoes(Array.isArray(options.value) ? options.value : [options.value]);
            } else {
                setSelectedSituacoes([]);
            }
        }, [options.value]);

        const onSituacaoChange = (situacaoValue, checked) => {
            let newSelectedSituacoes;
            
            if (checked) {
                // Adicionar à seleção
                newSelectedSituacoes = [...selectedSituacoes, situacaoValue];
            } else {
                // Remover da seleção
                newSelectedSituacoes = selectedSituacoes.filter(val => val !== situacaoValue);
            }
            
            setSelectedSituacoes(newSelectedSituacoes);
            
            // Chamar o callback com o array de valores selecionados
            if (newSelectedSituacoes.length === 0) {
                options.filterCallback(null);
            } else {
                options.filterCallback(newSelectedSituacoes);
            }
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
                    {situacoesFiltradas.map(situacao => (
                        <div key={situacao.value} className="flex align-items-center">
                            <input
                                type="checkbox"
                                id={`situacao-${situacao.value}`}
                                checked={selectedSituacoes.includes(situacao.value)}
                                onChange={(e) => onSituacaoChange(situacao.value, e.target.checked)}
                                style={{ marginRight: '8px' }}
                            />
                            <label 
                                htmlFor={`situacao-${situacao.value}`} 
                                style={{ cursor: 'pointer', flex: 1 }}
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

    const handleSort = (event) => {
        console.log('🔍 handleSort event completo:', event);
        console.log('🔍 sortOrder valor:', event.sortOrder);
        console.log('🔍 sortField valor:', event.sortField);
        
        if (onSort) {
            // PrimeReact: 1 = asc, -1 = desc, 0 = sem ordenação
            let order = '';
            let field = event.sortField || '';
            
            if (event.sortOrder === 1) {
                order = 'asc';
                console.log('🔍 Definindo como ASC');
            } else if (event.sortOrder === -1) {
                order = 'desc';
                console.log('🔍 Definindo como DESC');
            } else {
                // sortOrder === 0 ou null - remover ordenação
                console.log('🔍 Removendo ordenação');
                onSort({ field: '', order: '' });
                return;
            }
            
            console.log('🔍 Enviando ordenação final:', { field, order });
            
            onSort({
                field: field,
                order: order
            });
        } else {
            console.log('🔍 onSort não está definido');
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <BotaoGrupo align={showSearch ? 'space-between' : 'end'} wrap>
                {showSearch && (
                    <>
                    <div className="flex justify-content-end">
                        <span className="p-input-icon-left">
                            <CampoTexto width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder={t('search_colaborators')} />
                        </span>
                    </div>
                    </>
                )}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {ArmazenadorToken.hasPermission('view_funcionario') && (
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
                    )}
                </div>
            </BotaoGrupo>
            <DataTable 
                key={key}
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} colaboradores"
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
                globalfilterfields={['funcionario_pessoa_fisica.nome', 'chapa', 'filial_nome']}
                first={first} 
                onPage={onPage} 
                onSort={handleSort}
                removableSort 
                tableStyle={{ minWidth: '68vw' }}
                showGridlines
                stripedRows
                sortField={sortField}
                sortOrder={sortOrder}
                // footerColumnGroup={
                //     <ColumnGroup>
                //         <Row>
                //             <Column footer={totalColaboradoresTemplate} style={{ textAlign: 'right', fontWeight: 600 }} />
                //         </Row>
                //     </ColumnGroup>
                // }
            >
                <Column body={representativeChapaTemplate} field="chapa" header={t('registration')} sortable style={{ width: `${largurasColunas[0]}%` }}></Column>
                <Column body={representativeNomeTemplate} field="funcionario_pessoa_fisica.nome" sortField="id_pessoafisica__nome" header={t('full_name')} sortable style={{ width: `${largurasColunas[1]}%` }}></Column>
                <Column 
                    body={representativeFilialTemplate} 
                    field="filial" 
                    header={t('branch')}
                    sortable 
                    style={{ width: `${largurasColunas[2]}%` }} 
                    filter 
                    sortField="filial__nome" 
                    filterField="filial" 
                    filterElement={filialFilterTemplate} 
                    showFilterMenu={false} 
                />
                <Column body={representativeFuncaoTemplate} filter showFilterMenu={false} field="id_funcao" sortField="id_funcao_id" header={t('function')} style={{ width: `${largurasColunas[3]}%` }}></Column>
                <Column body={representativeAdmissaoTemplate} field="dt_admissao" header={t('hire_date')} style={{ width: `${largurasColunas[4]}%` }}></Column>
                {/* <Column body={representativeDataNascimentoTemplate} field="funcionario_pessoa_fisica.data_nascimento" header="Nascimento" style={{ width: `${largurasColunas[4]}%` }}></Column> */}
                <Column body={representativeNumeroDependentesTemplate} field="dependentes.length" header="Dep." style={{ width: `${largurasColunas[5]}%` }}></Column>
                <Column 
                    body={representativSituacaoTemplate} 
                    field="situacao" 
                    header={t('situation')}
                    style={{ width: `${largurasColunas[6]}%` }}
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
                {exibeAcoes && 
                    <Column header="" style={{ width: `${largurasColunas[7]}%` }} body={representativeActionsTemplate}></Column>
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