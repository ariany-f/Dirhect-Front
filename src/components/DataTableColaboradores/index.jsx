import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { MdOutlineKeyboardArrowRight, MdTag } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import styles from '@pages/Colaboradores/Colaboradores.module.css'
import BadgeGeral from '@components/BadgeGeral';
import BotaoGrupo from '@components/BotaoGrupo';
import Botao from '@components/Botao';
import BotaoSemBorda from '@components/BotaoSemBorda';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ContextMenu } from 'primereact/contextmenu';
import { IoEllipsisVertical } from 'react-icons/io5';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import ModalDemissao from '../ModalDemissao';
import ModalImportarPlanilha from '@components/ModalImportarPlanilha'
import ModalFerias from '../ModalFerias';
import { Tag } from 'primereact/tag';
import { FaTrash, FaUserTimes, FaUmbrella, FaDownload } from 'react-icons/fa';
import { Tooltip } from 'primereact/tooltip';
import { GrAddCircle } from 'react-icons/gr';
import { formatCPF } from '@utils/formats';
import http from '@http';
import { Dropdown } from 'primereact/dropdown';

function DataTableColaboradores({ colaboradores, paginator, rows, totalRecords, first, onPage, totalPages, onSearch, showSearch = true, onSort }) {
    const[selectedCollaborator, setSelectedCollaborator] = useState(0)
    const [modalOpened, setModalOpened] = useState(false)
    const [modalFeriasOpened, setModalFeriasOpened] = useState(false)
    const [modalImportarPlanilhaOpened, setModalImportarPlanilhaOpened] = useState(false)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filiais, setFiliais] = useState([]);
    
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const navegar = useNavigate()
    const {usuario} = useSessaoUsuarioContext()

    useEffect(() => {
        http.get('filial/?format=json')
            .then(response => {
                setFiliais(response);
            })
            .catch(error => {
                console.error('Erro ao carregar filiais:', error);
            });
    }, []);

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
            <Texto weight={600}>{rowData?.chapa}</Texto>
        )
    }
    
    const representativeFilialTemplate = (rowData) => {
        const filial = filiais.find(f => f.id === rowData.filial);
        return (
            <Texto weight={500}>{filial ? filial.nome : '---'}</Texto>
        );
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
        let situacao = rowData?.situacao;
        switch(rowData?.situacao)
        {
            case 'A':
                situacao = <Tag severity="success" value="Ativo"></Tag>;
                break;
            case 'F':
                situacao = <Tag severity="primary" value="Férias"></Tag>;
                break;
            case 'P':
                situacao = <Tag severity="danger" value="Previdência"></Tag>;
                break;
            case 'I':
                situacao = <Tag severity="warning" value="Invalidez"></Tag>;
                break;
            case 'D':
                situacao = <Tag severity="warning" value="Demitido"></Tag>;
                break;
        }
        return (
            <>
                <Texto weight={600}>{situacao}</Texto>
                <small>{rowData?.dependentes.length} dependente(s)</small>
            </>
        )
    }

    const representativeActionsTemplate = (rowData) => {
        if (usuario.tipo !== 'cliente' && usuario.tipo !== 'equipeFolhaPagamento') {
            return null;
        }

        return (
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
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
                <FaUmbrella 
                    className="ferias" 
                    data-pr-tooltip="Solicitação de Férias" 
                    size={16} 
                    onClick={(e) => {
                        e.stopPropagation();
                        setModalFeriasOpened(true);
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
        return 'Total de Colaboradores: ' + totalRecords;
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
            <BotaoGrupo align={showSearch ? 'space-between' : 'end'} wrap>
                {showSearch && (
                    <>
                    <div className="flex justify-content-end">
                        <span className="p-input-icon-left">
                            <CampoTexto width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar colaborador" />
                        </span>
                    </div>
                    <BotaoGrupo align="end" gap="8px">
                        <BotaoSemBorda color="var(--primaria)">
                            <FaDownload/><Link onClick={() => setModalImportarPlanilhaOpened(true)} className={styles.link}>Importar planilha</Link>
                        </BotaoSemBorda>
                        <Link to="/colaborador/registro">
                            <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Cadastrar Individualmente</Botao>
                        </Link>
                    </BotaoGrupo>
                    </>
                )}
            </BotaoGrupo>
            <DataTable 
                selection={selectedCollaborator} 
                onSelectionChange={(e) => verDetalhes(e.value)}
                selectionMode="single"
                value={colaboradores} 
                emptyMessage="Não foram encontrados colaboradores" 
                paginator={paginator}
                lazy
                rows={rows} 
                totalRecords={totalRecords} 
                GlobalFilterFields={['funcionario_pessoa_fisica.nome', 'chapa', 'filial']}
                first={first} 
                onPage={onPage} 
                onSort={handleSort}
                removableSort 
                tableStyle={{ minWidth: '68vw' }}
                showGridlines
                stripedRows
                footerColumnGroup={
                    <ColumnGroup>
                        <Row>
                            <Column footer={totalColaboradoresTemplate} style={{ textAlign: 'right', fontWeight: 600 }} />
                        </Row>
                    </ColumnGroup>
                }
            >
                <Column body={representativeChapaTemplate} field="chapa" header="Matrícula" sortable style={{ width: '10%' }}></Column>
                <Column body={representativeNomeTemplate} field="funcionario_pessoa_fisica.nome" header="Nome Completo" sortable style={{ width: '30%' }}></Column>
                <Column 
                    body={representativeFilialTemplate} 
                    field="filial" 
                    header="Filial" 
                    sortable 
                    style={{ width: '15%' }} 
                    filter 
                    filterField="filial" 
                    filterElement={filialFilterTemplate} 
                    showFilterMenu={false} 
                />
                <Column body={representativeAdmissaoTemplate} field="dt_admissao" header="Data de Admissão" sortable style={{ width: '15%' }}></Column>
                <Column body={representativeDataNascimentoTemplate} field="funcionario_pessoa_fisica.data_nascimento" header="Data de Nascimento" sortable style={{ width: '15%' }}></Column>
                <Column body={representativSituacaoTemplate} field="situacao" header="Situação" sortable style={{ width: '15%' }}></Column>
                <Column header="" style={{ width: '15%' }} body={representativeActionsTemplate}></Column>
            </DataTable>
            <ModalDemissao opened={modalOpened} aoFechar={() => setModalOpened(false)}/>
            <ModalFerias opened={modalFeriasOpened} aoFechar={() => setModalFeriasOpened(false)}/>
            <ModalImportarPlanilha opened={modalImportarPlanilhaOpened} aoFechar={() => setModalImportarPlanilhaOpened(false)} />
        </>
    )
}

export default DataTableColaboradores