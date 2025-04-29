import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import http from '@http'
import './DataTable.css'
import { Toast } from 'primereact/toast'
import CampoTexto from '@components/CampoTexto';
import BadgeBeneficio from '@components/BadgeBeneficio'
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ModalEditarSindicato from '../ModalEditarSindicato';
import styled from 'styled-components';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { FaBan } from 'react-icons/fa';

const Beneficios = styled.div`
    display: flex;
    gap: 16px;
    color: var(--neutro-600);
    flex-wrap: wrap;
`

function DataTableSindicatosElegibilidade({ sindicatos = [], showSearch = true, pagination = true, selected = null, setSelected = () => { } }) {

    const[selectedSindicato, setSelectedSindicato] = useState({})
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)
    const [selectedSindicatos, setSelectedSindicatos] = useState([]);

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
        navegar(`/estrutura/sindicato/detalhes/${value.id}`)
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
    
    const representativeDescriptionTemplate = (rowData) => {
        return <Texto width={'100%'} weight={800}>{`#${rowData.codigo} - ${rowData.descricao}`}</Texto>
    }

    
    const representativeBeneficiosTemplate = (rowData) => {
        return (
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <Texto weight={300}>Benefícios elegíveis</Texto>
                <Beneficios>
                    {!rowData?.elegibilidade || rowData.elegibilidade.length === 0 ? (
                        <FaBan size={10} />
                    ) : (
                        // Filtra itens únicos por descrição antes de mapear
                        rowData.elegibilidade
                            .filter((item, index, self) => {
                                const descricao = item.item_beneficio.beneficio?.dados_beneficio?.descricao || 
                                                item.item_beneficio.descricao;
                                return self.findIndex(i => 
                                    (i.item_beneficio.beneficio?.dados_beneficio?.descricao || 
                                     i.item_beneficio.descricao) === descricao
                                ) === index;
                            })
                            .map(item => (
                                <BadgeBeneficio 
                                    key={item.item_beneficio.beneficio?.id || item.id}
                                    nomeBeneficio={item.item_beneficio.beneficio?.dados_beneficio?.icone || item.item_beneficio.beneficio?.dados_beneficio?.descricao || 
                                        item.item_beneficio.icone || item.item_beneficio.descricao}
                                />
                            ))
                    )}
                </Beneficios>
            </div>
        )
    }

    const editarSindicato = ( cnpj, codigo, descricao, id ) => {

        // setLoading(true)
       
        const data = {};
        data.id = id;
        data.codigo = codigo;
        data.descricao = descricao;
        data.cnpj = removerMascaraCNPJ(cnpj);

        http.put(`sindicato/${id}/`, data)
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
            <DataTable value={sindicatos} filters={filters} globalFilterFields={['nome','cnpj']}  emptyMessage="Não foram encontradas sindicatos" selection={selected ? selectedSindicatos : selectedSindicato} onSelectionChange={handleSelectChange} selectionMode={selected ? "checkbox" : "single"} paginator={pagination} rows={10}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeDescriptionTemplate} field="descricao" style={{ width: '30%' }}></Column>
                <Column body={representativeBeneficiosTemplate} style={{ width: '65%' }}></Column>
                <Column body={<MdOutlineKeyboardArrowRight/>} style={{ width: '5%' }}></Column>
            </DataTable>
            <ModalEditarSindicato aoSalvar={editarSindicato} sindicato={selectedSindicato} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}

export default DataTableSindicatosElegibilidade