import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import CustomImage from '@components/CustomImage';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Tag } from 'primereact/tag';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DataTableContratos({ 
    contratos,
    paginator = true,
    rows,
    totalRecords,
    first,
    onPage,
    onSearch
}) {
    const [selectedVaga, setSelectedVaga] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const navegar = useNavigate()

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        onSearch(value);
    };

    function verDetalhes(value) {
        navegar(`/contratos/detalhes/${value.id}`)
    }

    const representativeInicioTemplate = (rowData) => {
        if(rowData.dt_inicio) {
            return <p style={{fontWeight: '400'}}>{new Date(rowData.dt_inicio).toLocaleDateString("pt-BR")}</p>
        } 
        return 'Não definida'
    }

    const representativeFimTemplate = (rowData) => {
        if(rowData.dt_fim) {
            return <p style={{fontWeight: '400'}}>{new Date(rowData.dt_fim).toLocaleDateString("pt-BR")}</p>
        }
        return 'Não definida'
    }

    const representativeFornecedorTemplate = (rowData) => {
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.dados_operadora?.nome}
            </Texto>
        </div>
    }

    function representativSituacaoTemplate(rowData) {
        const status = rowData.status;
        if (rowData?.dt_fim) {
            let partesData = rowData.dt_fim.split('-');
            let dataFim = new Date(partesData[0], partesData[1] - 1, partesData[2]);
            
            let hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
    
            if (dataFim.getTime() < hoje.getTime()) {
                return <Tag severity="danger" value="Vencido"></Tag>;
            }
            if (dataFim.getFullYear() === hoje.getFullYear() && dataFim.getMonth() === hoje.getMonth()) {
                return <Tag severity="warning" value="Vencimento Próximo"></Tag>;
            }
            if(status == 'A') {
                return <Tag severity="info" value="Em andamento"></Tag>;
            }
            return <Tag severity="danger" value="Inativo"></Tag>;
        }
        return <Tag severity="neutral" value="A definir"></Tag>;
    }    
    
    function representativStatusTemplate(rowData) {
        let status = rowData?.status;
    
        switch (status) {
            case 'A':
                return <Tag severity="success" value="Ativo"></Tag>;
            case 'I':
                return <Tag severity="danger" value="Inativo"></Tag>;
            default:
                return status;
        }
    }    
    
    const representativeNomeTemplate = (rowData) => {
        if(rowData?.dados_operadora) {
            return <CustomImage 
                src={rowData?.dados_operadora?.imagem_url} 
                alt={rowData?.dados_operadora?.nome} 
                width={'70px'} 
                height={35} 
                size={90} 
                title={rowData?.dados_operadora?.nome} 
            />
        }
        return '';
    }
    
    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto 
                        width={'320px'} 
                        valor={globalFilterValue} 
                        setValor={onGlobalFilterChange} 
                        type="search" 
                        label="" 
                        placeholder="Buscar contratos" 
                    />
                </span>
            </div>
            <DataTable 
                value={contratos} 
                emptyMessage="Não foram encontrados contratos" 
                selection={selectedVaga} 
                onSelectionChange={(e) => verDetalhes(e.value)} 
                selectionMode="single" 
                paginator={paginator}
                lazy
                rows={rows}
                totalRecords={totalRecords}
                first={first}
                onPage={onPage}
                tableStyle={{ minWidth: '68vw' }}
            >
                <Column body={representativeNomeTemplate} header="Operadora" style={{ width: '8%' }}></Column>
                <Column body={representativeFornecedorTemplate} field="operadora" style={{ width: '20%' }}></Column>
                <Column field="observacao" header="Observação" style={{ width: '22%' }}></Column>
                <Column body={representativeInicioTemplate} field="dt_inicio" header="Data Início" style={{ width: '10%' }}></Column>
                <Column body={representativeFimTemplate} field="dt_fim" header="Data Fim" style={{ width: '10%' }}></Column>
                <Column body={representativStatusTemplate} field="status" header="Status" style={{ width: '10%' }}></Column>
                <Column body={representativSituacaoTemplate} header="Situação" style={{ width: '20%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableContratos