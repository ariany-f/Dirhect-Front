import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import CustomImage from '@components/CustomImage';
import BadgeGeral from '@components/BadgeGeral';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { RiBusFill } from 'react-icons/ri';
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

const FornecedorContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
`;

const IconeFixo = styled.div`
    width: 24px;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
`;

function DataTableLinhasTransporte({ linhas }) {
    const [selectedFornecedor, setSelectedFornecedor] = useState(null);
    const [filters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    
    // Processa e ordena os fornecedores por nome
    const fornecedores = linhas.reduce((acc, linha) => {
        const existing = acc.find(f => f.nome === linha.fornecedor.nome);
        if (!existing) {
            acc.push({
                ...linha.fornecedor,
                quantidade: 1,
                tarifaMedia: linha.tarifa
            });
        } else {
            existing.quantidade += 1;
            existing.tarifaMedia = ((existing.tarifaMedia * (existing.quantidade - 1)) + linha.tarifa) / existing.quantidade;
        }
        return acc;
    }, []).sort((a, b) => a.nome.localeCompare(b.nome));

    // Seleciona o primeiro fornecedor automaticamente
    useEffect(() => {
        if (fornecedores.length > 0 && !selectedFornecedor) {
            setSelectedFornecedor(fornecedores[0]);
        }
    }, [fornecedores]);

    // Filtra linhas pelo fornecedor selecionado
    const linhasFornecedor = selectedFornecedor 
        ? linhas.filter(linha => linha.fornecedor.nome === selectedFornecedor.nome)
        : [];

    // Templates para as colunas
    const tarifaTemplate = (rowData) => Real.format(rowData.tarifa);

    const fornecedorTemplate = (rowData) => {
        const isActive = selectedFornecedor?.nome == rowData?.nome;
        return (
            <FornecedorContainer>
                <CustomImage 
                    src={rowData.imagem} 
                    alt={rowData.nome} 
                    width={'70px'} 
                    height={35} 
                    size={90} 
                    title={rowData.nome}
                />
                <div>
                    <BadgeGeral severity={isActive ? 'info' : ''} weight={500} nomeBeneficio={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div>
                                {rowData?.nome}
                            </div>
                        </div>
                    }  />
                    {rowData.quantidade} linhas
                </div>
            </FornecedorContainer>
        );
    };

    const linhaTemplate = (rowData) => {
        return (
            <BadgeTransporte>
                <IconeFixo>
                    <RiBusFill size={20} />
                </IconeFixo>
                <div>
                    <div style={{ fontWeight: '700' }}>{rowData.nome}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--neutro-500)' }}>
                        Código: {rowData.codigo} • {Real.format(rowData.tarifa)}
                    </div>
                </div>
            </BadgeTransporte>
        );
    };

    const operadoraTemplate = (rowData) => {
        return (
            <BadgeTransporte>
                <div>{rowData.operadora.nome}</div>
            </BadgeTransporte>
        );
    };

    return (
        <ContainerDividido>
            <ListaContainer>
                <DataTable 
                    value={fornecedores} 
                    selection={selectedFornecedor} 
                    onSelectionChange={(e) => setSelectedFornecedor(e.value)} 
                    selectionMode="single" 
                    dataKey="nome"
                    emptyMessage="Nenhum fornecedor encontrado"
                    filters={filters}
                    globalFilterFields={['nome']}
                    tableStyle={{ minWidth: '100%' }}
                    paginator
                    rows={7}
                    sortField="nome"
                    sortOrder={1} // Ordem ascendente
                >
                    <Column 
                        body={fornecedorTemplate}
                        header="Fornecedores"
                        style={{ width: '100%' }}
                        sortable
                    />
                </DataTable>
            </ListaContainer>

            <DetalhesContainer>
                <DataTable 
                    value={linhasFornecedor} 
                    emptyMessage="Selecione um fornecedor"
                    filters={filters}
                    globalFilterFields={['nome', 'codigo', 'operadora.nome']}
                    tableStyle={{ minWidth: '100%' }}
                    paginator
                    rows={7}
                >
                    <Column 
                        body={linhaTemplate}
                        field="nome"
                        header="Linhas"
                        style={{ width: '55%' }}
                    />
                    <Column 
                        body={tarifaTemplate}
                        field="tarifa"
                        header="Tarifa"
                        style={{ width: '20%' }}
                    />
                    <Column 
                        body={operadoraTemplate}
                        field="operadora.nome"
                        header="Operadora"
                        style={{ width: '25%' }}
                    />
                </DataTable>
            </DetalhesContainer>
        </ContainerDividido>
    );
}

export default DataTableLinhasTransporte;