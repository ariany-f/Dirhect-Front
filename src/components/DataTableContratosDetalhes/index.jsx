import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Tag } from 'primereact/tag';
import ModalAlterarRegrasBeneficio from '../ModalAlterar/regras_beneficio';
import { ContextMenu } from 'primereact/contextmenu';
import { IoEllipsisVertical } from 'react-icons/io5';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DataTableContratosDetalhes({ beneficios }) {

    const[selectedBeneficio, setSelectedBeneficio] = useState(0)
    const [modalOpened, setModalOpened] = useState(false)
    const [sendData, setSendData] = useState({})
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

    const representativeValorTemplate = (rowData) => {
        return (
            Real.format(rowData.valor)
        )
    }

    const representativeExtensivelTemplate = (rowData) => {
        return (
           rowData.extensivo_dependentes ? <Tag severity="success" value="Sim"/> : <Tag severity="danger" value="Não"/>
        )
    }

    const representativeEmpresaTemplate = (rowData) => {
        return (
            Real.format(rowData.empresa)
        )
    }
    
    const representativStatusTemplate = (rowData) => {
        let status = rowData?.status;
        switch(rowData?.status)
        {
            case 'Ativo':
                status = <Tag severity="success" value="Ativo"></Tag>;
                break;
            case 'Vencido':
                status = <Tag severity="warning" value="Vencido"></Tag>;
                break;
            case 'Cancelado':
                status = <Tag severity="danger" value="Cancelado"></Tag>;
                break;
        }
        return (
            <b>{status}</b>
        )
    }

    const cm = useRef(null);
    const menuModel = (selectedBeneficio) => {
        if (!selectedBeneficio) return [];
        return [
            { 
                label: <b>Editar</b>, 
                command: () => { 
                    setSendData(selectedBeneficio) 
                    setModalOpened(true)
                }
            }
        ];
    
    };
    return (
        <>
            {/* <ContextMenu model={menuModel(selectedBeneficio)} ref={cm} onHide={() => setSelectedBeneficio(null)} /> */}
            <DataTable 
                value={beneficios} 
                filters={filters} 
                globalFilterFields={['nome']} 
                emptyMessage="Não foram encontrados beneficios" 
                paginator rows={7}
                selection={selectedBeneficio} 
                onSelectionChange={(e) => {setSendData(e.value); setModalOpened(true)}} 
                selectionMode="single"
                tableStyle={{ minWidth: '68vw' }}
            >
                <Column field="nome" header="Benefício" style={{ width: '35%' }}></Column>
                <Column field="data_inicio" header="Data Inicio" style={{ width: '35%' }}></Column>
                <Column field="data_fim" header="Data Fim" style={{ width: '35%' }}></Column>
                <Column field="tempo_minimo" header="Tempo Mínimo" style={{ width: '35%' }}></Column>
                <Column body={representativeExtensivelTemplate} field="extensivo_dependentes" header="Extensível Dependente" style={{ width: '35%' }}></Column>
                <Column body={representativStatusTemplate} field="status" header="Status" style={{ width: '35%' }}></Column>
            </DataTable>
            <ModalAlterarRegrasBeneficio aoFechar={() => setModalOpened(false)} opened={modalOpened} dadoAntigo={sendData} />
        </>
    )
}

export default DataTableContratosDetalhes