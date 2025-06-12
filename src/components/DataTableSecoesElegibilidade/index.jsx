import styles from '@pages/Estrutura/Departamento.module.css'
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { Column } from 'primereact/column';
import BadgeBeneficio from '@components/BadgeBeneficio'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import './DataTable.css'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { FaBan } from 'react-icons/fa';

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

function DataTableSecoesElegibilidade({ secoes = [], showSearch = true, pagination = true, selected = null, setSelected = () => { }, mostrarTodas = true }) {
   
    const[selectedSecao, setSelectedSecao] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [selectedSecoes, setSelectedSecoes] = useState([]);
    const navegar = useNavigate()

    // Filtra as seções se não estiver mostrando todas
    const secoesFiltradas = mostrarTodas ? secoes : secoes.filter(secao => 
        secao.elegibilidade && secao.elegibilidade.length > 0
    );

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(value)
    {
        setSelectedSecao(value.id)
        navegar(`/estrutura/secao/detalhes/${value.id}`)
    }

    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedSecoes];

            if (Array.isArray(selectedValue)) {
                setSelectedSecoes(selectedValue);
                setSelected(selectedValue.map(secao => secao.id)); // Mantém os IDs no estado global
            } else {
                if (newSelection.some(secao => secao.id === selectedValue.id)) {
                    newSelection = newSelection.filter(secao => secao.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedSecoes(newSelection);
                setSelected(newSelection.map(secao => secao.id));
            }
        } else {
            setSelectedSecao(e.value.id);
            verDetalhes(e.value);
        }
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

    const representativeDepartamentoTemplate = (rowData) => {
        if(rowData?.departamento && rowData?.departamento?.nome)
        {
            return rowData?.departamento?.nome
        }
        else
        {
            return 'Não informado'
        }
    };

    
   const representativeDescriptionTemplate = (rowData) => {
        return <Texto width={'100%'} weight={800}>{`#${rowData.id} - ${rowData.nome}`}</Texto>
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
            {showSearch &&
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar seção" />
                    </span>
                </div>
            }
            <DataTable value={secoesFiltradas} filters={filters} globalFilterFields={['id']} emptyMessage="Não foram encontrados seções" selection={selected ? selectedSecoes : selectedSecao} onSelectionChange={handleSelectChange} selectionMode={selected ? "checkbox" : "single"} paginator={pagination} rows={10}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeDescriptionTemplate} style={{ width: '20%' }}></Column>
                <Column body={representativeBeneficiosTemplate} style={{ width: '75%' }}></Column>
                <Column field="" header="" style={{ width: '5%' }} body={<MdOutlineKeyboardArrowRight size={24}/>}></Column>
            </DataTable>
        </>
    )
}

export default DataTableSecoesElegibilidade