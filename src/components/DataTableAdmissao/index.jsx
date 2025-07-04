import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Real } from '@utils/formats'
import { FaCalendarAlt, FaHistory, FaExternalLinkAlt } from 'react-icons/fa';
import { Tooltip } from 'primereact/tooltip';
import ModalHistoricoAdmissao from '@components/ModalHistoricoAdmissao';
import ModalDadosCandidato from '@components/ModalDadosCandidato';
import ModalImportarPlanilha from '@components/ModalImportarPlanilha';
import Texto from '@components/Texto';
import { RiUser3Line } from 'react-icons/ri';
import { CgDetailsMore } from "react-icons/cg";
import { Tag } from 'primereact/tag';
import ModalExameMedico from '@components/ModalExameMedico';
import { ProgressBar } from 'primereact/progressbar';
import BotaoGrupo from '@components/BotaoGrupo';
import BotaoSemBorda from '@components/BotaoSemBorda';
import Botao from '@components/Botao';
import { FaDownload } from 'react-icons/fa';
import { GrAddCircle } from 'react-icons/gr';
import styles from '@pages/Colaboradores/Colaboradores.module.css'
import { formatCurrency, formatNumber } from '@utils/formats';
import http from '@http';

function DataTableAdmissao({ vagas }) {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [showHistorico, setShowHistorico] = useState(false);
    const [selectedCandidato, setSelectedCandidato] = useState(null);
    const [showDadosCandidato, setShowDadosCandidato] = useState(false);
    const [modalExameAberto, setModalExameAberto] = useState(false);
    const [candidatoExame, setCandidatoExame] = useState(null);    
    const [modalImportarPlanilhaOpened, setModalImportarPlanilhaOpened] = useState(false)

    const navegar = useNavigate()

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(value) {
        navegar(`/admissao/registro/${value.id}`)
    }

    const handleHistorico = (e, rowData) => {
        e.stopPropagation();
        setSelectedCandidato(rowData);
        setShowHistorico(true);
    };

    const handleDadosCandidato = (e, rowData) => {
        e.stopPropagation();
        setSelectedCandidato(rowData?.dados_candidato);
        setShowDadosCandidato(true);
    };

    function formataCPF(cpf) {
        if (!cpf) return '---';
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    const representativeCandidatoTemplate = (rowData) => {
        const nome = rowData?.dados_candidato?.nome;
        return <div key={rowData?.id}>
            <Texto weight={700} width={'100%'}>
                {nome}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                CPF:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData?.dados_candidato?.cpf ? formataCPF(rowData?.dados_candidato?.cpf) : '---'}</p>
            </div>
        </div>
    }

    const representativeLgpdTemplate = (rowData) => {
        const aceito = rowData?.aceite_lgpd;
        return (
            <Tag
                value={aceito ? 'Aceito' : 'Não aceito'}
                style={{
                    backgroundColor: aceito ? 'var(--green-500)' : 'var(--neutro-400)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 13,
                    borderRadius: 8,
                    padding: '4px 12px',
                }}
            />
        );
    };

    const representativeStatusTemplate = (rowData) => {
        const total = rowData?.documentos_status?.total || 0;
        const enviados = rowData?.documentos_status?.enviados || 0;
        
        return <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                Documentos: &nbsp;<p style={{fontWeight: '400', color: 'var(--neutro-500)'}}> {enviados}/{total}</p>
            </div>;
    }

    const representativeSalarioTemplate = (rowData) => {
        const salarioVaga = rowData?.dados_vaga?.salario;
        const salarioCandidato = rowData?.dados_candidato?.salario || rowData?.salario;
        const salarioEfetivo = rowData?.salario || rowData?.dados_vaga?.salario || rowData?.dados_candidato?.salario;
        
        const getSalarioEfetivoTexto = () => {
            if (!salarioEfetivo) {
                return '----';
            }
            return formatCurrency(salarioEfetivo);
        };
        
        const getSalarioEfetivoCor = () => {
            if (!salarioEfetivo) {
                return '#666';
            }
            
            // Se o salário efetivo é igual ao da vaga, usar verde
            if (salarioEfetivo == salarioVaga) {
                return 'var(--neutro-600)';
            }
            
            // Se é diferente, usar azul
            return 'var(--vermilion-500)';
        };
        
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>
                    <span style={{ color: '#666', fontSize: 12 }}>Vaga: </span>
                    <span style={{ color: '#333' }}>
                        {salarioVaga ? formatCurrency(salarioVaga) : 'Não informado'}
                    </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>
                    <span style={{ color: '#666', fontSize: 12 }}>Efetivo: </span>
                    <span style={{ 
                        color: getSalarioEfetivoCor(), 
                        fontWeight: salarioEfetivo == salarioVaga ? 500 : 600
                    }}>
                        {getSalarioEfetivoTexto()}
                    </span>
                </div>
            </div>
        );
    };

    const representativeFilialTemplate = (rowData) => {
        const [filialEfetivaNome, setFilialEfetivaNome] = useState(null);
        const [carregandoFilial, setCarregandoFilial] = useState(false);
        
        const filial_vaga_id = rowData?.dados_vaga?.filial_id;
        const filial_vaga_nome = rowData?.dados_vaga?.filial_nome;
        const filial_efetiva_id = rowData?.filial;
        
        useEffect(() => {
            // Se a filial efetiva é diferente da filial da vaga, buscar o nome
            if (filial_efetiva_id && filial_efetiva_id != filial_vaga_id) {
                setCarregandoFilial(true);
                http.get(`/filial/${filial_efetiva_id}/`)
                    .then(response => {
                        setFilialEfetivaNome(response.nome);
                    })
                    .catch(error => {
                        console.error('Erro ao buscar filial:', error);
                        setFilialEfetivaNome('Erro ao carregar');
                    })
                    .finally(() => {
                        setCarregandoFilial(false);
                    });
            }
        }, [filial_efetiva_id, filial_vaga_id]);
        
        if (!filial_vaga_nome) {
            return <span style={{ color: '#888', fontStyle: 'italic' }}>Não informado</span>;
        }
        
        const getFilialEfetivaTexto = () => {
            if (!filial_efetiva_id) {
                return '----';
            }
            
            if (filial_efetiva_id == filial_vaga_id) {
                return filial_vaga_nome;
            }
            
            if (carregandoFilial) {
                return 'Carregando...';
            }
            
            return filialEfetivaNome || '----';
        };
        
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>
                    <span style={{ color: '#666', fontSize: 12 }}>Vaga: </span>
                    <span style={{ color: '#333' }}>
                        {filial_vaga_nome}
                    </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>
                    <span style={{ color: '#666', fontSize: 12 }}>Efetivo: </span>
                    <span style={{ 
                        color: filial_efetiva_id == filial_vaga_id ? 'var(--neutro-600)' : 'var(--vermilion-500)', 
                        fontWeight: filial_efetiva_id == filial_vaga_id ? 500 : 600
                    }}>
                        {getFilialEfetivaTexto()}
                    </span>
                </div>
            </div>
        );
    };

    const representativeAdiantamentoTemplate = (rowData) => {
        return (
            <span style={{ fontWeight: 500 }}>
                --
            </span>
        );
    };

    const representativeExameTemplate = (rowData) => {
        return (
            <span style={{ fontWeight: 500 }}>
                --
            </span>
        );
    };

    const representativeActionsTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', gap: '8px' }}>
                <Tooltip target=".dados-candidato" mouseTrack mouseTrackLeft={10} />
                <RiUser3Line
                    className="dados-candidato"
                    data-pr-tooltip="Ver Dados do Candidato"
                    size={18}
                    onClick={(e) => handleDadosCandidato(e, rowData)}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--primaria)',
                    }}
                />
                {rowData.log_tarefas?.length > 0 && (
                    <>
                        <Tooltip target=".history" mouseTrack mouseTrackLeft={10} />
                        <FaHistory
                            className="history"
                            data-pr-tooltip="Ver Histórico"
                            size={16}
                            onClick={(e) => handleHistorico(e, rowData)}
                            style={{
                                cursor: 'pointer',
                                color: 'var(--primaria)',
                            }}
                        />
                    </>
                )}
                <Tooltip target=".details" mouseTrack mouseTrackLeft={10} />
                <CgDetailsMore
                    className="details"
                    data-pr-tooltip="Ver Detalhes"
                    size={16}
                    onClick={(e) => verDetalhes(rowData)}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--primaria)',
                    }}
                />
            </div>
        );
    };

    const vagaTemplate = (rowData) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {rowData?.dados_vaga?.titulo ?
                <Link 
                    to={`/vagas/detalhes/${rowData?.dados_vaga?.id}`}
                    style={{ 
                        color: 'var(--primaria)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <span>{rowData?.dados_vaga?.titulo}</span>
                    <FaExternalLinkAlt size={12} />
                </Link>
            :
                <span>---</span>
            }
        </div>
    );

    return (
        <>
            <BotaoGrupo align="space-between">
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar por candidato" />
                    </span>
                </div>
                {/* <BotaoGrupo align="end" gap="8px">
                    <BotaoSemBorda color="var(--primaria)">
                        <FaDownload/><Link onClick={() => setModalImportarPlanilhaOpened(true)} className={styles.link}>Importar planilha</Link>
                    </BotaoSemBorda>
                    <Link to="/colaborador/registro">
                        <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Cadastrar Individualmente</Botao>
                    </Link>
                </BotaoGrupo>  */}
            </BotaoGrupo>

           
            <DataTable 
                value={vagas} 
                filters={filters} 
                globalFilterFields={['id']}  
                emptyMessage="Não foram encontradas admissões pendentes" 
                paginator 
                rows={10}  
                tableStyle={{ minWidth: '68vw' }}
            >
                <Column body={representativeCandidatoTemplate} header="Candidato" style={{ width: '16%' }}></Column>
                <Column body={vagaTemplate} header="Vaga" style={{ width: '14%' }}></Column>
                <Column body={representativeStatusTemplate} header="Preenchimento" style={{ width: '13%' }}></Column>
                <Column body={representativeSalarioTemplate} header="Salário" style={{ width: '14%' }}></Column>
                <Column body={representativeFilialTemplate} header="Filial" style={{ width: '12%' }}></Column>
                <Column body={representativeLgpdTemplate} header="LGPD" style={{ width: '11%' }}></Column>
                <Column body={representativeActionsTemplate} header="" style={{ width: '10%' }}></Column>
            </DataTable>

            <ModalHistoricoAdmissao 
                opened={showHistorico}
                aoFechar={() => setShowHistorico(false)}
                candidato={selectedCandidato}
            />
            <ModalDadosCandidato
                opened={showDadosCandidato}
                aoFechar={() => setShowDadosCandidato(false)}
                candidato={selectedCandidato}
            />
            <ModalExameMedico
                opened={modalExameAberto}
                aoFechar={() => setModalExameAberto(false)}
                aoAgendar={({ medico, data }) => {
                    setModalExameAberto(false);
                }}
            />
            <ModalImportarPlanilha opened={modalImportarPlanilhaOpened} aoFechar={() => setModalImportarPlanilhaOpened(false)} />
        </>
    )
}

export default DataTableAdmissao