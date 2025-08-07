import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import Texto from '@components/Texto';
import { GrAddCircle } from 'react-icons/gr'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import { useNavigate } from 'react-router-dom';
import CampoTexto from '@components/CampoTexto';
import { useEffect, useState } from 'react';
import ModalSelecionarColaborador from '../ModalSelecionarColaborador';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import { Tag } from 'primereact/tag';
import styles from '@pages/Ausencias/Contratos.module.css'

function formatarDataBr(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function DataTableEstabilidade({ estabilidades, colaborador = null }) {
    const [selectedEstabilidade, setSelectedEstabilidade] = useState(0);
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
        setSelectedEstabilidade(value.id);
    }

    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

   
    function representativSituacaoTemplate(rowData) {
        let estabilidade = rowData?.tipo_descricao;
        
        switch(rowData?.tipo_descricao)
        {
            case 'Estabilidade':
                estabilidade = <Tag severity="success" value="Estabilidade"></Tag>;
                break;
            default:
                estabilidade = <Tag severity="info" value={estabilidade}></Tag>;
                break;
        }
        return estabilidade
    }

    const representativeColaboradorTemplate = (rowData) => {
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.funcionario_nome}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                Chapa:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.funcionario_chapa}</p>
            </div>
        </div>
    }

    const representativeInicioTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.data_inicio).toLocaleDateString("pt-BR")}</p>
    }
    
    const representativeFimTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{rowData.data_fim ? new Date(rowData.data_fim).toLocaleDateString("pt-BR") : 'Em andamento'}</p>
    }

    const representativeStatusTemplate = (rowData) => {
        return rowData.ativo ? 
            <Tag severity="success" value="Ativo"></Tag> : 
            <Tag severity="danger" value="Inativo"></Tag>
    }
    
    return (
        <>
            <BotaoGrupo align="space-between" wrap>
                {!colaborador && (
                    <>
                        <div className="flex justify-content-end">
                            <span className="p-input-icon-left">
                                <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar por colaborador" />
                            </span>
                        </div>
                        <BotaoGrupo align="end" gap="8px">
                            <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon} fill="var(--secundaria)" stroke="var(--secundaria)" color="var(--secundaria)"/> Registrar Estabilidade</Botao>
                        </BotaoGrupo>
                    </>
                )
                }
            </BotaoGrupo>
            <DataTable value={estabilidades} filters={filters} globalFilterFields={['funcionario_nome', 'funcionario_chapa']} emptyMessage="Não foram encontradas estabilidades registradas" selection={selectedEstabilidade} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={10} tableStyle={{ minWidth: (!colaborador ? '68vw' : '48vw') }}>
                {!colaborador && <Column body={representativeColaboradorTemplate} field="funcionario_nome" header="Colaborador" style={{ width: '25%' }}></Column>}
                <Column body={representativSituacaoTemplate} field="tipo_descricao" header="Estabilidade" style={{ width: '20%' }}></Column>
                <Column body={representativeInicioTemplate} field="data_inicio" header="Data Início" style={{ width: '15%' }}></Column>
                <Column body={representativeFimTemplate} field="data_fim" header="Data Fim" style={{ width: '15%' }}></Column>
                <Column body={representativeStatusTemplate} field="ativo" header="Status" style={{ width: '10%' }}></Column>
            </DataTable>
            <ModalSelecionarColaborador opened={modalOpened} aoFechar={() => setModalOpened(false)} />

        </>
    )
}

export default DataTableEstabilidade;
