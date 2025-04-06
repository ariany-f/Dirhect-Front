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

function DataTableContratos({ contratos }) {

    const[selectedVaga, setSelectedVaga] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const navegar = useNavigate()

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };


    function verDetalhes(value)
    {
        navegar(`/contratos/detalhes/${value.id}`)
    }

    const representativeInicioTemplate = (rowData) => {
        if(rowData.dt_inicio)
        {
            return <p style={{fontWeight: '400'}}>{new Date(rowData.dt_inicio).toLocaleDateString("pt-BR")}</p>
        } 
        return 'Não definida'
    }
    

    const representativeFimTemplate = (rowData) => {
        if(rowData.dt_fim)
        {
            return <p style={{fontWeight: '400'}}>{new Date(rowData.dt_fim).toLocaleDateString("pt-BR")}</p>
        }
        return 'Não definida'
    }

    const representativeFornecedorTemplate = (rowData) => {
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.dados_operadora?.nome}
            </Texto>
            {/* <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                Benefícios:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.beneficios.length}</p>
            </div> */}
        </div>
    }

    function representativSituacaoTemplate(rowData) {
        
        if (rowData?.dt_fim) {
            // Criar a data de fim considerando apenas a parte da data (ignorar hora)
            let partesData = rowData.dt_fim.split('-'); // Divide "YYYY-MM-DD"
            let dataFim = new Date(partesData[0], partesData[1] - 1, partesData[2]); // Ano, Mês (0-indexado), Dia
            
            // Criar a data de hoje sem hora, minutos, segundos ou milissegundos
            let hoje = new Date();
            hoje.setHours(0, 0, 0, 0); // Zera as horas, minutos, segundos e milissegundos
    
            if (dataFim.getTime() < hoje.getTime()) {
                return <Tag severity="danger" value="Vencido"></Tag>;
            }
            // Verificar se o vencimento é neste mês
            if (dataFim.getFullYear() === hoje.getFullYear() && dataFim.getMonth() === hoje.getMonth()) {
                return <Tag severity="warning" value="Vencimento Próximo"></Tag>;
            }
        }
        return <Tag severity="info" value="A definir"></Tag>;
    }    
    
    function representativStatusTemplate(rowData) {
        let status = rowData?.status;
    
        switch (status) {
            case 'A':
                return <Tag severity="success" value="Ativo"></Tag>;
            case 'I':
                return <Tag severity="danger" value="Inativo"></Tag>;
            default:
                return status; // Retorna o valor original se não houver correspondência
        }
    }    
    
    const representativeNomeTemplate = (rowData) => {
        if(rowData?.dados_operadora)
        {
            return  <CustomImage src={rowData?.dados_operadora?.imagem} alt={rowData?.dados_operadora?.nome} width={'70px'} height={35} size={90} title={rowData?.dados_operadora?.nome} />
        }
        else
        {
            return '';
        }
    }
    
    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar" />
                </span>
            </div>
            <DataTable value={contratos} filters={filters} globalFilterFields={['nome_fornecedor']}  emptyMessage="Não foram encontrados contratos" selection={selectedVaga} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeNomeTemplate} header="Operadora" style={{ width: '6%' }}></Column>
                <Column body={representativeFornecedorTemplate} field="operadora" style={{ width: '20%' }}></Column>
                <Column field="observacao" header="Observação" style={{ width: '24%' }}></Column>
                <Column body={representativeInicioTemplate} field="dt_inicio" header="Data Início" style={{ width: '10%' }}></Column>
                <Column body={representativeFimTemplate} field="dt_fim" header="Data Fim" style={{ width: '10%' }}></Column>
                <Column body={representativStatusTemplate} field="status" header="Status" style={{ width: '20%' }}></Column>
                <Column body={representativSituacaoTemplate} header="Situação" style={{ width: '20%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableContratos