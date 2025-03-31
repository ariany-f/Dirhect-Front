import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { RiBusFill } from 'react-icons/ri';
import { FaQuestion } from 'react-icons/fa';
import './DataTable.css';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const ContainerDividido = styled.div`
    display: flex;
    gap: 24px;
    width: 100%;
`;

const ListaContainer = styled.div`
    width: 400px;
`;

const DetalhesContainer = styled.div`
    flex: 1;
`;

const BadgeTransporte = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
`;

function DataTableLinhasTransporte({ linhas }) {
    const [selectedOperadora, setSelectedOperadora] = useState(null);
    const [filters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    
    // Processa as operadoras únicas
    const operadoras = [...new Set(linhas.map(linha => linha.operadora))].map(operadora => {
        const linhasOperadora = linhas.filter(linha => linha.operadora === operadora);
        return {
            nome: operadora,
            quantidade: linhasOperadora.length,
            tarifaMedia: linhasOperadora.reduce((sum, linha) => sum + linha.tarifa, 0) / linhasOperadora.length
        };
    });

    // Seleciona a primeira operadora automaticamente
    useEffect(() => {
        if (operadoras.length > 0 && !selectedOperadora) {
            setSelectedOperadora(operadoras[0]);
        }
    }, [operadoras]);

    // Filtra linhas pela operadora selecionada
    const linhasOperadora = selectedOperadora 
        ? linhas.filter(linha => linha.operadora === selectedOperadora.nome)
        : [];

    // Templates para as colunas
    const tarifaTemplate = (rowData) => Real.format(rowData.tarifa);
    const tarifaMediaTemplate = (rowData) => Real.format(rowData.tarifaMedia);

    const operadoraTemplate = (rowData) => {
        return (
            <BadgeTransporte>
                <RiBusFill size={20} />
                <div>
                    <div style={{ fontWeight: '700' }}>{rowData.nome}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--neutro-500)' }}>
                        {rowData.quantidade} linhas
                    </div>
                </div>
            </BadgeTransporte>
        );
    };

    const linhaTemplate = (rowData) => {
        return (
            <BadgeTransporte>
                <div>
                    <div style={{ fontWeight: '700' }}>{rowData.nome}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--neutro-500)' }}>
                        Código: {rowData.codigo} • {Real.format(rowData.tarifa)}
                    </div>
                </div>
            </BadgeTransporte>
        );
    };

    const fornecedorTemplate = (rowData) => {
        return (
            <BadgeTransporte>
                <div>{rowData.nome_fornecedor}</div>
            </BadgeTransporte>
        );
    };

    return (
        <ContainerDividido>
            <ListaContainer>
                <DataTable 
                    value={operadoras} 
                    selection={selectedOperadora} 
                    onSelectionChange={(e) => setSelectedOperadora(e.value)} 
                    selectionMode="single" 
                    dataKey="nome"
                    emptyMessage="Nenhuma operadora encontrada"
                    filters={filters}
                    globalFilterFields={['nome']}
                    tableStyle={{ minWidth: '100%' }}
                    paginator
                    rows={7}
                >
                    <Column 
                        body={operadoraTemplate}
                        field="nome"
                        header="Operadoras"
                        style={{ width: '100%' }}
                    />
                </DataTable>
            </ListaContainer>

            <DetalhesContainer>
                <DataTable 
                    value={linhasOperadora} 
                    emptyMessage="Selecione uma operadora"
                    filters={filters}
                    globalFilterFields={['nome', 'codigo', 'nome_fornecedor']}
                    tableStyle={{ minWidth: '100%' }}
                    paginator
                    rows={7}
                >
                    <Column 
                        body={linhaTemplate}
                        field="nome"
                        header="Linhas"
                        style={{ width: '40%' }}
                    />
                    <Column 
                        body={fornecedorTemplate}
                        field="nome_fornecedor"
                        header="Fornecedor"
                        style={{ width: '30%' }}
                    />
                    <Column 
                        body={tarifaTemplate}
                        field="tarifa"
                        header="Tarifa"
                        style={{ width: '30%', textAlign: 'right' }}
                    />
                </DataTable>
            </DetalhesContainer>
        </ContainerDividido>
    );
}

export default DataTableLinhasTransporte;