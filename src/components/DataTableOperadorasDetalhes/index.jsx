import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdSecurity } from 'react-icons/md'
import BadgeGeral from '@components/BadgeGeral';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Tag } from 'primereact/tag';
import { IoEllipsisVertical, IoFastFoodSharp } from 'react-icons/io5';
import { BiBookReader, BiShield } from 'react-icons/bi';
import { RiBusFill, RiComputerLine, RiEBike2Fill, RiGasStationFill, RiShoppingCartFill, RiDeleteBin6Line } from 'react-icons/ri';
import { PiForkKnifeFill } from 'react-icons/pi';
import { FaCar, FaCoins, FaQuestion, FaTheaterMasks, FaTooth } from 'react-icons/fa';
import { FaHeartPulse, FaMoneyBillTransfer } from "react-icons/fa6";
import { MdDirectionsBike } from "react-icons/md";
import IconeBeneficio from '@components/IconeBeneficio';
import Texto from '@components/Texto';
import CustomImage from '@components/CustomImage';
import ContainerHorizontal from '@components/ContainerHorizontal';
import { GrAddCircle } from 'react-icons/gr'
import Botao from '@components/Botao'
import styles from '@pages/Operadoras/Operadoras.module.css'
import BotaoGrupo from '@components/BotaoGrupo';
import { Real } from '@utils/formats'
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Tooltip } from 'primereact/tooltip';
import http from '@http';
import CampoTexto from '@components/CampoTexto';

const TableHeader = styled.div`
    display: flex;
    padding: 0px;
    flex-direction: column;
`;

function DataTableOperadorasDetalhes({ 
    beneficios, 
    showSearch = true,
    pagination = true, 
    rows = 10, 
    totalRecords, 
    first, 
    onPage, 
    onSearch, 
    sortField, 
    sortOrder, 
    onSort,
    onAddBeneficio, 
    onDeleteBeneficio, 
    operadora = null 
}) {
    const[selectedBeneficio, setSelectedBeneficio] = useState(0)
    const [sendData, setSendData] = useState({})
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const navegar = useNavigate()
    const { t } = useTranslation('common');

    // Configuração de larguras das colunas
    const exibeColunasOpcionais = {
        acoes: !!onDeleteBeneficio // Só exibe ações se pode deletar
    };
    
    // Larguras base quando todas as colunas estão visíveis
    // Ordem: Benefício, Tipo, Ações
    const larguraBase = [45, 45, 10];
    
    // Calcula larguras redistribuídas
    const calcularLarguras = () => {
        let larguras = [...larguraBase];
        
        // Remove ações se não deve ser exibida
        if (!exibeColunasOpcionais.acoes) {
            larguras = larguras.slice(0, -1); // Remove última coluna (ações)
        }
        
        const totalFiltrado = larguras.reduce((acc, val) => acc + val, 0);
        const fatorRedistribuicao = 100 / totalFiltrado;
        
        return larguras.map(largura => Math.round(largura * fatorRedistribuicao * 100) / 100);
    };
    
    const largurasColunas = calcularLarguras();

    useEffect(() => {
        setSelectedBeneficio(0)
        setSendData({})
    }, [beneficios])

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleSort = (event) => {
        if (onSort) {
            onSort({
                field: event.sortField,
                order: event.sortOrder === 1 ? 'asc' : 'desc'
            });
        }
    };

    const representativeBeneficioTemplate = (rowData) => {
        return (
            <BadgeGeral weight={500} nomeBeneficio={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconeBeneficio nomeIcone={rowData.beneficio.icone ?? rowData.beneficio.descricao} />
                    <div>
                        {rowData.beneficio.descricao}
                    </div>
                </div>
            } />
        )
    }

    const representativeTipoTemplate = (rowData) => {
        return <Tag value={rowData.beneficio.tipo.descricao} severity="info" />
    }

    const representativeActionsTemplate = (rowData) => {
        return (
            <>
                <Tooltip target={`.delete-beneficio-operadora-${rowData.id}`} mouseTrack mouseTrackLeft={10} />
                <RiDeleteBin6Line
                    className={`delete-beneficio-operadora-${rowData.id}`}
                    data-pr-tooltip="Excluir benefício da operadora"
                    size={16}
                    onClick={e => { onDeleteBeneficio && onDeleteBeneficio(rowData); }}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--error)'
                    }}
                />
            </>
        );
    };

    const headerTemplate = () => {
        return (
            <TableHeader>
                <BotaoGrupo align="space-between">
                    {operadora?.nome && (
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <CustomImage src={operadora?.imagem_url} alt={operadora?.nome} width={'70px'} height={35} size={90} title={operadora?.nome} />
                            <Texto size={16} weight={500}>{operadora?.nome}</Texto>
                        </div>
                    )}
                    {onAddBeneficio && (
                        <Botao aoClicar={onAddBeneficio} estilo="vermilion" size="small" tab>
                            <GrAddCircle className={styles.icon} fill="var(--secundaria)" color="var(--secundaria)"/> {t('add')} Benefício
                        </Botao>
                    )}
                </BotaoGrupo>
                {showSearch && (
                    <CampoTexto  
                        width={'200px'} 
                        valor={globalFilterValue} 
                        setValor={onGlobalFilterChange} 
                        type="search" 
                        label="" 
                        placeholder="Buscar benefícios" 
                    />
                )}
            </TableHeader>
        );
    };

    return (
        <DataTable 
            value={beneficios} 
            filters={filters}
            rowsPerPageOptions={[5, 10, 25, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} benefícios"
            globalFilterFields={['beneficio.descricao']} 
            emptyMessage="Não foram encontrados benefícios vinculados à esta operadora" 
            paginator 
            rows={10}
            selection={selectedBeneficio} 
            onSelectionChange={(e) => {setSendData(e.value);}} 
            selectionMode="single"
            tableStyle={{ minWidth: '36vw', maxWidth: '100%' }}
            header={headerTemplate}
            showGridlines
            stripedRows
        >
            <Column body={representativeBeneficioTemplate} field="beneficio.descricao" style={{ width: `${largurasColunas[0]}%` }} />
            <Column body={representativeTipoTemplate} field="beneficio.tipo.descricao" style={{ width: `${largurasColunas[1]}%` }} />
            {exibeColunasOpcionais.acoes && (
                <Column body={representativeActionsTemplate} header="" style={{ width: `${largurasColunas[2]}%` }} />
            )}
        </DataTable>
    )
}

export default DataTableOperadorasDetalhes;