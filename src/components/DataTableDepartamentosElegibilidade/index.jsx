import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import BadgeBeneficio from '@components/BadgeBeneficio'
import { FaBan } from 'react-icons/fa';
import './DataTable.css'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

const NumeroColaboradores = styled.p`
    color: var(--base-black);
    font-feature-settings: 'clig' off, 'liga' off;
    /* Dashboard/14px/Bold */
    font-family: var(--fonte-secundaria);
    font-size: 14px;
    font-weight: 700;
    line-height: 20px; /* 142.857% */
`
const Beneficios = styled.div`
    display: flex;
    gap: 16px;
    color: var(--neutro-600);
    flex-wrap: wrap;
`

function DataTableDepartamentosElegibilidade({ departamentos = [], showSearch = true, pagination = true, selected = null, setSelected = () => { } }) {
   
    const[selectedDepartamento, setSelectedDepartamento] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const navegar = useNavigate()

    const [selectedDepartamentos, setSelectedDepartamentos] = useState([]);

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(value)
    {
        setSelectedDepartamento(value.id)
        navegar(`/estrutura/departamento/detalhes/${value.id}`)
    }

    const representativeFilialTemplate = (rowData) => {
        if(rowData?.filial && rowData?.filial?.nome)
        {
            return rowData?.filial?.nome
        }
        else
        {
            return 'Não informado'
        }
    };
    
    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;

            if (Array.isArray(selectedValue)) {
                setSelectedDepartamentos(selectedValue);
                setSelected(selectedValue.map(departamento => departamento.id)); // Salva os IDs selecionados
            } else {
                let newSelection = [...selectedDepartamentos];

                // Se o item já estiver selecionado, remove
                if (newSelection.some(departamento => departamento.id === selectedValue.id)) {
                    newSelection = newSelection.filter(departamento => departamento.id !== selectedValue.id);
                } else {
                    // Caso contrário, adiciona à seleção
                    newSelection.push(selectedValue);
                }

                setSelectedDepartamentos(newSelection);
                setSelected(newSelection.map(departamento => departamento.id)); // Mantém IDs no estado global
            }
        } else {
            setSelectedDepartamento(e.value.id);
            verDetalhes(e.value);
        }
    }
    
    
   const representativeDescriptionTemplate = (rowData) => {
        return <Texto width={'100%'} weight={800}>{`#${rowData.id} - ${rowData.nome}`}</Texto>
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

    return (
        <>
            {showSearch &&
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar departamento" />
                    </span>
                </div>
            }
            <DataTable value={departamentos} filters={filters} globalFilterFields={['id', 'filial.nome']} emptyMessage="Não foram encontrados departamentos" selection={selected ? selectedDepartamentos : selectedDepartamento} onSelectionChange={handleSelectChange} selectionMode={selected ? "checkbox" : "single"} paginator={pagination} rows={10}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeDescriptionTemplate}  style={{ width: '20%' }}></Column>
                <Column body={representativeBeneficiosTemplate} style={{ width: '75%' }}></Column>
                <Column body={<MdOutlineKeyboardArrowRight/>} style={{ width: '5%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableDepartamentosElegibilidade