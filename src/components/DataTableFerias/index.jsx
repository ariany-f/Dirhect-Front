import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import Container from '@components/Container';
import BotaoGrupo from '@components/BotaoGrupo';
import Frame from '@components/Frame';
import Botao from '@components/Botao';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import ModalFerias from '../ModalFerias';
import { useSessaoUsuarioContext } from '../../contexts/SessaoUsuario';
import { GrAddCircle } from 'react-icons/gr';

function DataTableFerias({ ferias }) {

    const[selectedFerias, setSelectedFerias] = useState(0)
    const [modalOpened, setModalOpened] = useState(false)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const navegar = useNavigate()
    const {usuario} = useSessaoUsuarioContext()

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(value)
    {
        setSelectedFerias(value.id)
    }
    
    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    return (
        <>
            <Frame alinhamento="center" gap="20px">
                <DataTable value={ferias} filters={filters} globalFilterFields={[]}  emptyMessage="Não foram encontrados férias registradas" selection={selectedFerias} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={6}  tableStyle={{ minWidth: '68vw' }}>
                    <Column field="data_inicio" header="Data Início" style={{ width: '15%' }}></Column>
                    <Column field="data_fim" header="Data Fim" style={{ width: '15%' }}></Column>
                    <Column field="data_inicio_aquisicao" header="Data Inicio Aquisição" style={{ width: '15%' }}></Column>
                    <Column field="data_fim_aquisicao" header="Data Fim Aquisição" style={{ width: '15%' }}></Column>
                    <Column field="dias" header="Dias Calculados" style={{ width: '15%' }}></Column>
                    <Column field="13" header="13º" style={{ width: '15%' }}></Column>
                    <Column field="abono" header="Abono Pecuniário" style={{ width: '15%' }}></Column>
                </DataTable>
                <ModalFerias opened={modalOpened} aoFechar={() => setModalOpened(false)} />
            </Frame>
        </>
    )
}

export default DataTableFerias