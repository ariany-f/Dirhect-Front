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

function DataTableFiliais({ filiais, showSearch = true, pagination = true, selected = null, setSelected = () => { } }) {

    const[selectedFilial, setSelectedFilial] = useState({})
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)
    const [selectedFiliais, setSelectedFiliais] = useState([]);

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && filiais) {
            const filiaisSelecionadas = filiais.filter(filial => selected.includes(filial.id));
            setSelectedFiliais(filiaisSelecionadas);
        } else {
            setSelectedFiliais([]);
        }
    }, [selected, filiais]);

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
        setSelectedFilial(value); // Atualiza o estado
        setTimeout(() => setModalOpened(true), 0); // Aguarda a atualização do estado
    }
    
    useEffect(() => {
        console.log("Filial selecionada mudou:", selectedFilial);
    }, [selectedFilial]);

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

        http.put(`filial/${id}/`, data)
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
            let newSelection = [...selectedFiliais];

            if (Array.isArray(selectedValue)) {
                setSelectedFiliais(selectedValue);
                setSelected(selectedValue.map(filial => filial.id)); // Mantém os IDs no estado global
            } else {
                if (newSelection.some(filial => filial.id === selectedValue.id)) {
                    newSelection = newSelection.filter(filial => filial.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedFiliais(newSelection);
                setSelected(newSelection.map(filial => filial.id));
            }
        } else {
            if(e.value)
            {
                setSelectedFilial(e.value.id);
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
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar filiais" />
                    </span>
                </div>
            }
            <DataTable value={filiais} filters={filters} globalFilterFields={['nome','cnpj']}  emptyMessage="Não foram encontradas filiais" selection={selected ? selectedFiliais : selectedFilial} onSelectionChange={handleSelectChange} selectionMode={selected ? "checkbox" : "single"} paginator={pagination} rows={7}  tableStyle={{ minWidth: '68vw' }}>
                {selected &&
                    <Column selectionMode="multiple" style={{ width: '5%' }}></Column>
                }
                <Column field="nome" header="Filial" style={{ width: '25%' }}></Column>
                <Column field="cidade" header="Cidade" style={{ width: '15%' }}></Column>
                <Column body={representativeCNPJTemplate} header="CNPJ" style={{ width: '25%' }}></Column>
            </DataTable>
            <ModalEditarFilial aoSalvar={editarFilial} filial={selectedFilial} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}

export default DataTableFiliais