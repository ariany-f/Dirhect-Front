import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import Texto from '@components/Texto';
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import { Tag } from 'primereact/tag';

function formatarDataBr(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function DataTableFerias({ ferias, colaborador = null }) {
    const [colaboradores, setColaboradores] = useState(null)
    const [selectedFerias, setSelectedFerias] = useState(0);
    const [modalOpened, setModalOpened] = useState(false);
    const [filteredData, setFilteredData] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const navegar = useNavigate();
    const { usuario } = useSessaoUsuarioContext();

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(value) {
        setSelectedFerias(value.id);
    }

    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    
    const representativeInicioTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.dt_inicio).toLocaleDateString("pt-BR")}</p>
    }
    
    const representativeFimTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.dt_fim).toLocaleDateString("pt-BR")}</p>
    }
    
    const representativeInicioAquisicaoTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.datapagamento).toLocaleDateString("pt-BR")}</p>
    }
    
    const representativeFimAquisicaoTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.fimperaquis).toLocaleDateString("pt-BR")}</p>
    }
    
    const representativeColaboradorTemplate = (rowData) => {
       
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.dados_pessoa_fisica?.nome ?? rowData.funcionario_nome}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                Dias de Férias:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.nrodiasferias ?? 0}</p>
            </div>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                Dias de Abono:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.nrodiasabono ?? 0}</p>
            </div>
        </div>
    }

    
    const representativ13Template = (rowData) => {
        let tag = rowData?.decimo;
        switch(rowData?.decimo)
        {
            case 'Sim':
                tag = <Tag severity="success" value="Sim"></Tag>;
                break;
            case 'Não':
                tag = <Tag severity="danger" value="Não"></Tag>;
                break;
            default:
                tag = <Tag severity="danger" value="Não"></Tag>;
                break;
        }
        return (
            <b>{tag}</b>
        )
    }
    
    useEffect(() => {
        if(ferias)
        {
            if(colaborador)
            {
                setFilteredData(ferias.filter(feria => feria.funcionario.id == colaborador))
            }
            else
            {
                setFilteredData(ferias)
            }
        }
        
     }, [colaborador, ferias])

    return (
        <>
            {!colaborador &&
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar por colaborador" />
                </span>
            </div>}
            <DataTable value={filteredData} filters={filters} globalFilterFields={['colaborador_id']} emptyMessage="Não foram encontrados férias registradas" selection={selectedFerias} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={10} tableStyle={{ minWidth: (!colaborador ? '68vw' : '48vw') }}>
                {!colaborador && <Column body={representativeColaboradorTemplate} field="colaborador_id" header="Colaborador" style={{ width: '30%' }}></Column>}
                <Column body={representativeInicioAquisicaoTemplate} field="data_inicio_aquisicao" header="Data Inicio Aquisição" style={{ width: '15%' }}></Column>
                <Column body={representativeFimAquisicaoTemplate} field="data_fim_aquisicao" header="Data Fim Aquisição" style={{ width: '15%' }}></Column>
                <Column body={representativeInicioTemplate} field="data_inicio" header="Data Início" style={{ width: '15%' }}></Column>
                <Column body={representativeFimTemplate} field="data_fim" header="Data Fim" style={{ width: '15%' }}></Column>
                {colaborador && 
                <>
                    <Column field="nrodiasabono" header="Abono" style={{ width: '10%' }}></Column>
                    <Column field="nrodiasferias" header="Férias" style={{ width: '10%' }}></Column>
                </>
                }
                <Column body={representativ13Template} field="decimo" header="13º" style={{ width: '10%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableFerias;