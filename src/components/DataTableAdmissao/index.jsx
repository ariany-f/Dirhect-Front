import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Real } from '@utils/formats'
import { FaHistory } from 'react-icons/fa';
import { Tooltip } from 'primereact/tooltip';
import ModalHistoricoAdmissao from '@components/ModalHistoricoAdmissao';
import ModalDadosCandidato from '@components/ModalDadosCandidato';
import { RiUser3Line } from 'react-icons/ri';
import { CgDetailsMore } from "react-icons/cg";
import { Tag } from 'primereact/tag';


function DataTableAdmissao({ vagas }) {
    const[selectedVaga, setSelectedVaga] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [showHistorico, setShowHistorico] = useState(false);
    const [selectedCandidato, setSelectedCandidato] = useState(null);
    const [showDadosCandidato, setShowDadosCandidato] = useState(false);
    const navegar = useNavigate()

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(value)
    {
        navegar(`/admissao/registro/${value.candidato.id}`)
    }

    const handleHistorico = (e, rowData) => {
        e.stopPropagation();
        setSelectedCandidato(rowData);
        setShowHistorico(true);
    };

    const handleDadosCandidato = (e, rowData) => {
        e.stopPropagation();
        setSelectedCandidato(rowData);
        setShowDadosCandidato(true);
    };

    const representativeCandidatoTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{rowData.candidato.nome}</p>
    }

    const representativeLgpdTemplate = (rowData) => {
        const aceito = rowData.candidato.statusLgpd;
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
        let status = "Preenchido"; 
        let pendencias = "";
        if(rowData.candidato.arquivos)
        {
            for (let arquivo of rowData.candidato.arquivos) {
                // Se o status do arquivo não for "Anexado", muda o status
                if (arquivo.status !== "Anexado") {
                    pendencias += `Pendente anexo de: ${arquivo.nome}<br />`;
                }
            }

            for (let [chave, dado] of Object.entries(rowData.candidato)) {
                // Verifica se o dado está vazio ("" ou null ou undefined)
                if (dado === "" || dado === null || dado === undefined) {
                    pendencias += `Pendente preenchimento de: ${chave}<br />`;  // Exibe o nome do campo
                }
            }
        }

        return <p style={{fontWeight: '400'}} dangerouslySetInnerHTML={{ __html: pendencias || status }}></p>
    }
    
    const representativeDevolucaoTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.candidato.dataDevolucao).toLocaleDateString("pt-BR")}</p>
    }

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
                <Tooltip target=".details" mouseTrack mouseTrackLeft={10} />
                <CgDetailsMore
                    className="details"
                    data-pr-tooltip="Ver Detalhes"
                    size={16}
                    onClick={(e) => handleDetalhes(e, rowData)}
                />
            </div>
        );
    };

    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar por candidato" />
                </span>
            </div>
            <DataTable value={vagas} filters={filters} globalFilterFields={['titulo']}  emptyMessage="Não foram encontradas admissões pendentes" selection={selectedVaga} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={10}  tableStyle={{ minWidth: '68vw' }}>
                <Column field="vaga" header="Titulo" style={{ width: '18%' }}></Column>
                <Column body={representativeCandidatoTemplate} header="Candidato" style={{ width: '20%' }}></Column>
                <Column body={representativeStatusTemplate} header="Status" style={{ width: '25%' }}></Column>
                <Column body={representativeDevolucaoTemplate} header="Data Devolução" style={{ width: '15%' }}></Column>
                <Column body={representativeLgpdTemplate} header="LGPD" style={{ width: '15%' }}></Column>
                <Column body={representativeActionsTemplate} header="" style={{ width: '12%' }}></Column>
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
        </>
    )
}

export default DataTableAdmissao