import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import http from '@http'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import { Toast } from 'primereact/toast'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ModalEditarSindicato from '../ModalEditarSindicato';
import styled from 'styled-components';

const NumeroColaboradores = styled.p`
    color: var(--base-black);
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: var(--fonte-secundaria);
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
`

function DataTableSindicatos({ 
    sindicatos, 
    showSearch = true, 
    pagination = true, 
    rows, 
    totalRecords, 
    first, 
    onPage, 
    onSearch, 
    selected = null, 
    setSelected = () => {} 
}) {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedSindicatos, setSelectedSindicatos] = useState([]);
    const [selectedSindicato, setSelectedSindicato] = useState(null);
    const navegar = useNavigate();

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && sindicatos) {
            const sindicatosSelecionados = sindicatos.filter(sindicato => selected.includes(sindicato.id));
            setSelectedSindicatos(sindicatosSelecionados);
        } else {
            setSelectedSindicatos([]);
        }
    }, [selected, sindicatos]);

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        onSearch(value);
    };

    function verDetalhes(value) {
        setSelectedSindicato(value.id);
        navegar(`/estrutura/sindicato/detalhes/${value.id}`);
    }

    function formataCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]/g, "");
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }

    const representativeCNPJTemplate = (rowData) => {
        if(rowData?.cnpj) {
            return formataCNPJ(rowData.cnpj);
        }
        return "---";
    };

    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedSindicatos];

            if (Array.isArray(selectedValue)) {
                setSelectedSindicatos(selectedValue);
                setSelected(selectedValue.map(sindicato => sindicato.id));
            } else {
                if (newSelection.some(sindicato => sindicato.id === selectedValue.id)) {
                    newSelection = newSelection.filter(sindicato => sindicato.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedSindicatos(newSelection);
                setSelected(newSelection.map(sindicato => sindicato.id));
            }
        } else {
            setSelectedSindicato(e.value);
            verDetalhes(e.value);
        }
    }

    return (
        <>
            {showSearch && 
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto 
                            width={'320px'} 
                            valor={globalFilterValue} 
                            setValor={onGlobalFilterChange} 
                            type="search" 
                            label="" 
                            placeholder="Buscar sindicatos" 
                        />
                    </span>
                </div>
            }
            <DataTable 
                value={sindicatos} 
                emptyMessage="Não foram encontrados sindicatos" 
                selection={selected ? selectedSindicatos : selectedSindicato} 
                onSelectionChange={handleSelectChange} 
                selectionMode={selected ? "checkbox" : "single"} 
                paginator={pagination} 
                lazy
                rows={rows} 
                totalRecords={totalRecords} 
                first={first} 
                onPage={onPage}
                tableStyle={{ minWidth: '68vw' }}
            >
                {selected &&
                    <Column selectionMode="multiple" style={{ width: '5%' }}></Column>
                }
                <Column field="descricao" header="Nome" style={{ width: '45%' }}></Column>
                <Column body={representativeCNPJTemplate} field="cnpj" header="CNPJ" style={{ width: '45%' }}></Column>
            </DataTable>
        </>
    );
}

export default DataTableSindicatos;