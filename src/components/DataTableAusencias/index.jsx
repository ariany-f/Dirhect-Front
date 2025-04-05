import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import CampoTexto from '@components/CampoTexto';
import { useEffect, useState } from 'react';
import ModalFerias from '../ModalFerias';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';

function formatarDataBr(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function DataTableAusencias({ ausencias, colaborador = null }) {
    const [selectedFerias, setSelectedFerias] = useState(0);
    const [modalOpened, setModalOpened] = useState(false);
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

    const representativeColaboradorTemplate = (rowData) => {
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.funcionario_nome}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                Dias de Ausência:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.ausencia}</p>
            </div>
        </div>
    }

    const representativeInicioTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.dt_inicio).toLocaleDateString("pt-BR")}</p>
    }
    
    const representativeFimTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.dt_fim).toLocaleDateString("pt-BR")}</p>
    }
    
    return (
        <>
         {!colaborador &&
          <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar por colaborador" />
                </span>
            </div>}
            <DataTable value={ausencias} filters={filters} globalFilterFields={['funcionario']} emptyMessage="Não foram encontradas ausências registradas" selection={selectedFerias} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={6} tableStyle={{ minWidth: (!colaborador ? '68vw' : '48vw') }}>
                {!colaborador && <Column body={representativeColaboradorTemplate} field="funcionario" header="Colaborador" style={{ width: '35%' }}></Column>}
                <Column body={representativeInicioTemplate} field="dt_inicio" header="Data Início" style={{ width: '15%' }}></Column>
                <Column body={representativeFimTemplate} field="dt_fim" header="Data Fim" style={{ width: '15%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableAusencias;