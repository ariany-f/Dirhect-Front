import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import ContainerHorizontal from '@components/ContainerHorizontal';
import CustomImage from '@components/CustomImage';
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Image } from 'primereact/image';
import { Skeleton } from 'primereact/skeleton';
import Botao from '@components/Botao';
import styled from 'styled-components';
import { GrAddCircle } from 'react-icons/gr';
import BotaoSemBorda from '@components/BotaoSemBorda';
import BotaoGrupo from '@components/BotaoGrupo';
import { useTranslation } from 'react-i18next';

const TableHeader = styled.div`
    display: flex;
    padding: 0.5rem 0;
    flex-direction: column;

    .header-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .add-button {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s ease;

            &:hover {
                background: var(--surface-100);
            }

            svg {
                width: 16px;
                height: 16px;
            }
        }
    }
`;

function DataTableOperadoras({ operadoras, search = true, onSelectionChange, onAddClick }) {
    const[selectedOperadora, setSelectedOperadora] = useState(null)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const navegar = useNavigate()
    const { t } = useTranslation('common');

    useEffect(() => {
        if (operadoras && operadoras.length > 0 && !selectedOperadora) {
            setSelectedOperadora(operadoras[0]);
            onSelectionChange(operadoras[0]);
        }
    }, [operadoras, selectedOperadora, onSelectionChange]);

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const handleSelectionChange = (e) => {
        // Se o item clicado já está selecionado, não faz nada
        if (e.value === null) {
            return;
        }
        
        // Caso contrário, atualiza a seleção
        setSelectedOperadora(e.value);
        onSelectionChange(e.value);
    };

    // function verDetalhes(value)
    // {
    //     setSelectedOperadora(value.id)
    //     navegar(`/operadoras/detalhes/${value.id}`)
    // }

    const representativeNomeTemplate = (rowData) => {
        return (
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <CustomImage src={rowData?.imagem_url} alt={rowData?.nome} width={'70px'} height={35} size={90} title={rowData?.nome} />
                <Texto size={16} weight={500}>{rowData?.nome}</Texto>
            </div>
        )
    }

    const headerTemplate = () => {
        return (
            <TableHeader>
                <BotaoGrupo align="space-between">
                    <Texto size={18} weight={500}>Operadoras</Texto>
                    <Botao aoClicar={onAddClick} estilo="neutro" size="small" tab>
                        <GrAddCircle /> {t('add')} Operadora
                    </Botao>
                </BotaoGrupo>
                {search && (
                    <CampoTexto  
                        width={'200px'} 
                        valor={globalFilterValue} 
                        setValor={onGlobalFilterChange} 
                        type="search" 
                        label="" 
                        placeholder="Buscar" 
                    />
                )}
            </TableHeader>
        );
    };

    return (
        <DataTable 
            value={operadoras} 
            filters={filters} 
            globalFilterFields={['nome']} 
            emptyMessage="Não foram encontradas operadoras" 
            paginator 
            rows={10}
            selection={selectedOperadora} 
            onSelectionChange={handleSelectionChange}
            selectionMode="single"
            tableStyle={{ minWidth: '100%', maxWidth: '100%' }}
            rowClassName={(data) => data === selectedOperadora ? 'p-highlight' : ''}
            header={headerTemplate}
            showGridlines
            stripedRows
        >
            <Column 
                body={representativeNomeTemplate} 
                header="Nome" 
                style={{ width: '100%' }}
                sortable
                field="nome"
            />
        </DataTable>
    )
}

export default DataTableOperadoras