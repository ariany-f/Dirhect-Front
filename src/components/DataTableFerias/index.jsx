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

function formatarDataBr(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

const fakeData = [
    {
        id: 1,
        data_inicio: formatarDataBr("2025-02-01"),
        data_fim: formatarDataBr("2025-02-10"),
        data_inicio_aquisicao: formatarDataBr("2024-02-01"),
        data_fim_aquisicao: formatarDataBr("2024-02-10"),
        dias: 10,
        "13": "Sim",
        abono: "6"
    },
    {
        id: 2,
        data_inicio: formatarDataBr("2025-03-05"),
        data_fim: formatarDataBr("2025-03-15"),
        data_inicio_aquisicao: formatarDataBr("2024-03-05"),
        data_fim_aquisicao: formatarDataBr("2024-03-15"),
        dias: 11,
        "13": "Não",
        abono: "5"
    },
    {
        id: 3,
        data_inicio: formatarDataBr("2025-04-10"),
        data_fim: formatarDataBr("2025-04-20"),
        data_inicio_aquisicao: formatarDataBr("2024-04-10"),
        data_fim_aquisicao: formatarDataBr("2024-04-20"),
        dias: 11,
        "13": "Sim",
        abono: "10"
    },
    {
        id: 4,
        data_inicio: formatarDataBr("2025-05-01"),
        data_fim: formatarDataBr("2025-05-10"),
        data_inicio_aquisicao: formatarDataBr("2024-05-01"),
        data_fim_aquisicao: formatarDataBr("2024-05-10"),
        dias: 10,
        "13": "Sim",
        abono: "5"
    },
    {
        id: 5,
        data_inicio: formatarDataBr("2025-06-15"),
        data_fim: formatarDataBr("2025-06-25"),
        data_inicio_aquisicao: formatarDataBr("2024-06-15"),
        data_fim_aquisicao: formatarDataBr("2024-06-25"),
        dias: 11,
        "13": "Não",
        abono: "5"
    },
    {
        id: 6,
        data_inicio: formatarDataBr("2025-07-01"),
        data_fim: formatarDataBr("2025-07-10"),
        data_inicio_aquisicao: formatarDataBr("2024-07-01"),
        data_fim_aquisicao: formatarDataBr("2024-07-10"),
        dias: 10,
        "13": "Sim",
        abono: "10"
    }
];


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
                <DataTable value={fakeData} filters={filters} globalFilterFields={[]}  emptyMessage="Não foram encontrados férias registradas" selection={selectedFerias} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={6}  tableStyle={{ minWidth: '68vw' }}>
                    <Column field="data_inicio_aquisicao" header="Data Inicio Aquisição" style={{ width: '15%' }}></Column>
                    <Column field="data_fim_aquisicao" header="Data Fim Aquisição" style={{ width: '15%' }}></Column>
                    <Column field="data_inicio" header="Data Início" style={{ width: '15%' }}></Column>
                    <Column field="data_fim" header="Data Fim" style={{ width: '15%' }}></Column>
                    <Column field="dias" header="Dias de Férias" style={{ width: '15%' }}></Column>
                    <Column field="13" header="13º" style={{ width: '15%' }}></Column>
                    <Column field="abono" header="Dias de Abono" style={{ width: '15%' }}></Column>
                </DataTable>
                <ModalFerias opened={modalOpened} aoFechar={() => setModalOpened(false)} />
            </Frame>
        </>
    )
}

export default DataTableFerias