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
import ModalSelecionarColaborador from '../ModalSelecionarColaborador';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';

function DataTableESocial({ historico }) {

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
                {(usuario.tipo == 'cliente' || usuario.tipo == 'equipeFolhaPagamento') && 
                    <Container width="100%">
                        <BotaoGrupo align="space-between">
                            <div></div>
                            <div></div>
                        </BotaoGrupo>
                    </Container>
                }
                <DataTable value={historico} filters={filters} globalFilterFields={[]}  emptyMessage="Não foram encontrados registros" selection={selectedFerias} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={6}  tableStyle={{ minWidth: '68vw' }}>
                    <Column field="tipo" header="Tipo de Evento" style={{ width: '35%' }}></Column>
                    <Column field="data_fim" header="Data Envio" style={{ width: '35%' }}></Column>
                    <Column field="status" header="Status" style={{ width: '35%' }}></Column>
                    <Column field="protocolo" header="Protocolo" style={{ width: '35%' }}></Column>
                    <Column field="id_origem" header="Id Origem" style={{ width: '35%' }}></Column>
                    <Column field="recibo" header="Recibo" style={{ width: '35%' }}></Column>
                </DataTable>
                <ModalSelecionarColaborador opened={modalOpened} aoFechar={() => setModalOpened(false)} />
            </Frame>
        </>
    )
}

export default DataTableESocial