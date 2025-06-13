import styles from '@pages/Estrutura/Departamento.module.css'
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
const Beneficios = styled.div`
    display: flex;
    gap: 16px;
    color: var(--neutro-600);
    flex-wrap: wrap;
`

function DataTableFuncoesElegibilidade({ funcoes = [], showSearch = true, pagination = true, selected = null, setSelected = () => { }, mostrarTodas = true }) {
    const[selectedFuncao, setSelectedFuncao] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [selectedFuncaos, setSelectedFuncaos] = useState([]);
    const navegar = useNavigate()

    // Filtra as funções se não estiver mostrando todas
    const funcoesFiltradas = mostrarTodas ? funcoes : funcoes.filter(funcao => 
        funcao.elegibilidade && funcao.elegibilidade.length > 0
    );

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(value)
    {
        setSelectedFuncao(value.id)
        navegar(`/estrutura/funcao/detalhes/${value.id}`)
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

    const representativeDescriptionTemplate = (rowData) => {
        var cargo = (rowData?.cargo && rowData?.cargo.nome) ? rowData?.cargo.nome : '';
        return <Texto width={'100%'} weight={800}>{`#${rowData.id} - ${rowData.nome} ${cargo}`}</Texto>
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
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar função" />
                    </span>
                </div>
            }
            <DataTable 
                value={funcoesFiltradas} 
                filters={filters} 
                globalFilterFields={['id', 'nome', 'descricao']} 
                emptyMessage={mostrarTodas ? "Não foram encontrados funções" : "Não foram encontrados funções com benefícios elegíveis"} 
                selection={selected ? selectedFuncaos : selectedFuncao} 
                onSelectionChange={handleSelectChange} 
                selectionMode={selected ? "checkbox" : "single"} 
                paginator={pagination} 
                rows={10}  
                tableStyle={{ minWidth: '68vw' }}
            >
                <Column body={representativeDescriptionTemplate} style={{ width: '20%' }}></Column>
                <Column body={representativeBeneficiosTemplate} style={{ width: '75%' }}></Column>
                <Column field="" header="" style={{ width: '5%' }}  body={<MdOutlineKeyboardArrowRight size={24}/>}></Column>
            </DataTable>
        </>
    )
}

export default DataTableFuncoesElegibilidade