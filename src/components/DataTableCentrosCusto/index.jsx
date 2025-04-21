import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import CampoTexto from '@components/CampoTexto';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
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

function DataTableCentrosCusto({ 
    centros_custo, 
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
    const [selectedCentros, setSelectedCentros] = useState([]);
    const [selectedCentro, setSelectedCentro] = useState(null);
    const navegar = useNavigate();

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && centros_custo) {
            const centrosSelecionados = centros_custo.filter(centro => selected.includes(centro.id));
            setSelectedCentros(centrosSelecionados);
        } else {
            setSelectedCentros([]);
        }
    }, [selected, centros_custo]);

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        onSearch(value);
    };

    function verDetalhes(value) {
        setSelectedCentro(value.id);
        navegar(`/estrutura/centro-custo/detalhes/${value.id}`);
    }

    const representativeCCPaiTemplate = (rowData) => {
        if(rowData?.cc_pai && rowData?.cc_pai?.nome) {
            return rowData?.cc_pai?.nome;
        }
        return 'Não informado';
    };

    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedCentros];

            if (Array.isArray(selectedValue)) {
                setSelectedCentros(selectedValue);
                setSelected(selectedValue.map(centro => centro.id));
            } else {
                if (newSelection.some(centro => centro.id === selectedValue.id)) {
                    newSelection = newSelection.filter(centro => centro.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedCentros(newSelection);
                setSelected(newSelection.map(centro => centro.id));
            }
        } else {
            setSelectedCentro(e.value);
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
                            placeholder="Buscar centros de custo" 
                        />
                    </span>
                </div>
            }
            <DataTable 
                value={centros_custo} 
                emptyMessage="Não foram encontrados centros de custo" 
                selection={selected ? selectedCentros : selectedCentro} 
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
                <Column field="cc_origem" header="Código" style={{ width: '20%' }}></Column>
                <Column field="nome" header="Nome" style={{ width: '40%' }}></Column>
                <Column body={representativeCCPaiTemplate} field="cc_pai.nome" header="Centro de Custo Pai" style={{ width: '35%' }}></Column>
            </DataTable>
        </>
    );
}

export default DataTableCentrosCusto;