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
import ModalEditarFilial from '../ModalEditarFilial';

function DataTableSindicatos({ sindicatos, showSearch = true, pagination = true, selected = null, setSelected = () => { } }) {

    const[selectedSindicato, setSelectedSindicato] = useState({})
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)
    const [selectedSindicatos, setSelectedSindicatos] = useState([]);

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && sindicatos) {
            const sindicatosSelecionadas = sindicatos.filter(filial => selected.includes(filial.id));
            setSelectedSindicatos(sindicatosSelecionadas);
        } else {
            setSelectedSindicatos([]);
        }
    }, [selected, sindicatos]);

    const navegar = useNavigate()

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const removerMascaraCNPJ = (cnpj) => {
        return cnpj.replace(/[^\d]/g, ''); // Remove tudo que não for número
    }

    function verDetalhes(value) {
        setSelectedSindicato(value); // Atualiza o estado
        setTimeout(() => setModalOpened(true), 0); // Aguarda a atualização do estado
    }
    
    useEffect(() => {
        console.log("Sindicato selecionado mudou:", selectedSindicato);
    }, [selectedSindicato]);

    function formataCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]/g, "");
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    
    const representativeCNPJTemplate = (rowData) => {
        if(rowData?.cnpj)
        {
            return (
                formataCNPJ(rowData.cnpj)
            )
        }
        else
        {
            return "---"
        }
    }

    
    const editarFilial = (nome, cnpj, id) => {

        // setLoading(true)
       
        const data = {};
        data.nome = nome;
        data.id = id;
        data.cnpj = removerMascaraCNPJ(cnpj);

        http.put(`filial/${id}`, data)
            .then(response => {
                if(response.id)
                {
                    setModalOpened(false)
                }
            })
            .catch(erro => {
                
            })
            .finally(function() {
                // setLoading(false)
            })
    }

    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedSindicatos];

            if (Array.isArray(selectedValue)) {
                setSelectedSindicatos(selectedValue);
                setSelected(selectedValue.map(filial => filial.id)); // Mantém os IDs no estado global
            } else {
                if (newSelection.some(filial => filial.id === selectedValue.id)) {
                    newSelection = newSelection.filter(filial => filial.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedSindicatos(newSelection);
                setSelected(newSelection.map(filial => filial.id));
            }
        } else {
            if(e.value)
            {
                setSelectedSindicato(e.value.id);
                verDetalhes(e.value);
            }
        }
    }

    return (
        <>
            <Toast ref={toast} />
            {showSearch && 
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar sindicatos" />
                    </span>
                </div>
            }
            <DataTable value={sindicatos} filters={filters} globalFilterFields={['nome','cnpj']}  emptyMessage="Não foram encontradas sindicatos" selection={selected ? selectedSindicatos : selectedSindicato} onSelectionChange={handleSelectChange} selectionMode={selected ? "checkbox" : "single"} paginator={pagination} rows={7}  tableStyle={{ minWidth: '68vw' }}>
                {selected &&
                    <Column selectionMode="multiple" style={{ width: '5%' }}></Column>
                }
                <Column field="nome" header="Filial" style={{ width: '35%' }}></Column>
                <Column body={representativeCNPJTemplate} header="CNPJ" style={{ width: '25%' }}></Column>
            </DataTable>
            <ModalEditarFilial aoSalvar={editarFilial} filial={selectedSindicato} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}

export default DataTableSindicatos