import styles from '@pages/Departamentos/Departamento.module.css'
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { FaBan } from 'react-icons/fa'
import { DataTable } from 'primereact/datatable';
import CampoTexto from '@components/CampoTexto';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import BadgeBeneficio from '@components/BadgeBeneficio'
import Texto from '@components/Texto';
import './DataTable.css'

const NumeroColaboradores = styled.p`
    color: var(--base-black);
    font-feature-settings: 'clig' off, 'liga' off;
    /* Dashboard/14px/Bold */
    font-family: var(--fonte-secundaria);
    font-size: 14px;
    font-weight: 700;
    line-height: 20px; /* 142.857% */
`

function DataTableFuncoes({ funcoes, showSearch = true, pagination = true, selected = null, setSelected = () => { } }) {
   
    const[selectedFuncao, setSelectedFuncao] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [selectedFuncaos, setSelectedFuncaos] = useState([]);
    const navegar = useNavigate()

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && funcoes) {
            const funcoesSelecionados = funcoes.filter(cargo => selected.includes(cargo.id));
            setSelectedFuncaos(funcoesSelecionados);
        } else {
            setSelectedFuncaos([]);
        }
    }, [selected, funcoes]);

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(value)
    {
        setSelectedFuncao(value.public_id)
    }
    
    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedFuncaos];

            if (Array.isArray(selectedValue)) {
                setSelectedFuncaos(selectedValue);
                setSelected(selectedValue.map(cargo => cargo.id)); // Mantém os IDs no estado global
            } else {
                if (newSelection.some(cargo => cargo.id === selectedValue.id)) {
                    newSelection = newSelection.filter(cargo => cargo.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedFuncaos(newSelection);
                setSelected(newSelection.map(cargo => cargo.id));
            }
        } else {
            setSelectedFuncao(e.value.id);
            verDetalhes(e.value);
        }
    }

    const representativeCargoTemplate = (rowData) => {
        if(rowData?.cargo && rowData?.cargo.nome) {
            return (
                <p>{rowData?.cargo.nome}</p>
            )
        }
        else {
            return <p>Não informado</p>
        }
    }

    const representativeDetalhesTemplate = (rowData) => {
        if(rowData?.descricao) {
            // Garante que o texto não passe de 100 caracteres
            const descricaoLimitada = rowData?.descricao.length > 100 
                ? rowData?.descricao.substring(0, 170) + "..." 
                : rowData?.descricao;
        
            return (
                <p style={{
                    width: '100%',  // Define uma largura fixa
                    wordWrap: 'break-word', // Permite quebra de linha
                    overflow: 'hidden' // Garante que o conteúdo fique dentro do limite
                }}>
                    {descricaoLimitada}
                </p>
            );
        }
        else {
            return <p>Não informado</p>;
        }
    };    

    return (
        <>
            {showSearch && 
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar função" />
                    </span>
                </div>
            }
            <DataTable value={funcoes} filters={filters} globalFilterFields={['id', 'nome', 'descricao']} emptyMessage="Não foram encontrados funcoes" selection={selected ? selectedFuncaos : selectedFuncao} onSelectionChange={handleSelectChange} selectionMode={selected ? "checkbox" : "single"} paginator={pagination} rows={7}  tableStyle={{ minWidth: '68vw' }}>
                {selected &&
                    <Column selectionMode="multiple" style={{ width: '5%' }}></Column>
                }
                <Column field="id" header="Id" style={{ width: '10%' }}></Column>
                <Column field="nome" header="Nome" style={{ width: '20%' }}></Column>
                <Column field="cargo" header="Cargo" style={{ width: '15%' }} body={representativeCargoTemplate}></Column>
                <Column body={representativeDetalhesTemplate} field="descricao" header="Descrição" style={{ width: '60%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableFuncoes