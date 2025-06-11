import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import http from '@http'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import { Toast } from 'primereact/toast'
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ModalEditarFilial from '../ModalEditarFilial';
import styled from 'styled-components';
import BadgeBeneficio from '@components/BadgeBeneficio'
import { FaBan } from 'react-icons/fa';

const Beneficios = styled.div`
    display: flex;
    gap: 16px;
    color: var(--neutro-600);
    flex-wrap: wrap;
`

function DataTableFiliaisElegibilidade({ filiais = [], showSearch = true, pagination = true, selected = null, setSelected = () => { } }) {
    console.log(filiais)
    const[selectedFilial, setSelectedFilial] = useState({})
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)
    const [selectedFiliais, setSelectedFiliais] = useState([]);

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
        navegar(`/estrutura/filial/detalhes/${value.id}`);
        // setTimeout(() => setModalOpened(true), 0); // Aguarda a atualização do estado
    }

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
                setSelected(selectedValue.map(filial => filial.id_origem)); // Usando id_origem
            } else {
                if (newSelection.some(filial => filial.id_origem === selectedValue.id_origem)) {
                    newSelection = newSelection.filter(filial => filial.id_origem !== selectedValue.id_origem);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedFiliais(newSelection);
                setSelected(newSelection.map(filial => filial.id_origem));
            }
        } else {
            if(e.value)
            {
                setSelectedFilial(e.value.id_origem);
                verDetalhes(e.value);
            }
        }
    }
    
    const representativeDescriptionTemplate = (rowData) => {
        return <Texto width={'100%'} weight={800}>{`#${rowData.id_origem} - ${rowData.nome}`}</Texto>
    }

    const representativeBeneficiosTemplate = (rowData) => {
        // Cria um Set para armazenar benefícios únicos
        const beneficiosUnicos = new Set();
        
        return (
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <Texto weight={300}>Benefícios elegíveis</Texto>
                <Beneficios>
                    {!rowData?.elegibilidade || rowData.elegibilidade.length === 0 ? (
                        <FaBan size={10} />
                    ) : (
                        rowData.elegibilidade
                            .filter(item => {
                                const descricao = item.item_beneficio.beneficio?.dados_beneficio?.descricao;
                                if (beneficiosUnicos.has(descricao)) {
                                    return false;
                                }
                                beneficiosUnicos.add(descricao);
                                return true;
                            })
                            .map(item => (
                                <BadgeBeneficio 
                                    key={item.item_beneficio.beneficio?.id || item.id}
                                    nomeBeneficio={item.item_beneficio.beneficio?.dados_beneficio?.descricao}
                                    icone={item.item_beneficio.beneficio?.dados_beneficio?.icone}
                                />
                            ))
                    )}
                </Beneficios>
            </div>
        )
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
            <DataTable value={filiais} filters={filters} globalFilterFields={['nome','cnpj']}  emptyMessage="Não foram encontradas filiais" selection={selected ? selectedFiliais : selectedFilial} onSelectionChange={handleSelectChange} selectionMode={selected ? "checkbox" : "single"} paginator={pagination} rows={10}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeDescriptionTemplate} style={{ width: '20%' }}></Column>
                <Column body={representativeBeneficiosTemplate} style={{ width: '75%' }}></Column>
                <Column body={<MdOutlineKeyboardArrowRight size={24}/>} style={{ width: '5%' }}></Column>
            </DataTable>
            <ModalEditarFilial aoSalvar={editarFilial} filial={selectedFilial} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}

export default DataTableFiliaisElegibilidade