import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineFastfood, MdOutlineKeyboardArrowRight, MdOutlineMedicalServices, MdSecurity } from 'react-icons/md'
import './DataTable.css'
import BadgeGeral from '@components/BadgeGeral';
import Texto from '@components/Texto';
import Titulo from '@components/Titulo';
import SubTitulo from '@components/SubTitulo';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { RiBusFill, RiCheckboxCircleFill, RiCloseCircleFill, RiComputerLine, RiEBike2Fill, RiGasStationFill, RiShoppingCartFill } from 'react-icons/ri';
import { PiForkKnifeFill } from 'react-icons/pi';
import { BiBookReader, BiShield } from 'react-icons/bi';
import { FaCar, FaCoins, FaQuestion, FaTheaterMasks, FaTooth } from 'react-icons/fa';
import { Tag } from 'primereact/tag';
import SwitchInput from '@components/SwitchInput';
import { IoFastFoodSharp } from 'react-icons/io5';
import { FaHeartPulse, FaMoneyBillTransfer } from 'react-icons/fa6';
import { MdDirectionsBike } from "react-icons/md";
import IconeBeneficio from '../IconeBeneficio';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});


const Col12 = styled.div`
    display: flex;
    width: 100%;
    gap: 24px;
    flex-wrap: wrap;
`

const Col6 = styled.div`
    display: inline-flex;
    align-items: start;
    justify-content: center;
    gap: 8px;
    flex-direction: column;
`

function DataTableElegibilidadeDetalhes({ elegibilidade = [], pagination = true }) {

    const[selectedVaga, setSelectedVaga] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [expandedRows, setExpandedRows] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const navegar = useNavigate()

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const representativeContratoTemplate = (rowData) => {
        return (
            <Titulo>
                <h6>{rowData.nome_fornecedor}</h6>
                <SubTitulo fontSize={'12px'}>{rowData.description}</SubTitulo>
            </Titulo>
        )
    }

    const representativeValorTemplate = (rowData) => {
        return (
            Real.format(rowData.valor)
        )
    }

    const representativeBeneficiosTemplate = (rowData) => {
        let icone = '';
        return (
            <>
            {rowData.beneficios && rowData.beneficios.length > 0 &&
                <Col12>
                {rowData.beneficios.map((benefit, index) => {
                    return (
                        <Col6 key={index}>
                            <BadgeGeral weight={500} severity={benefit.status == 'Ativo' ? 'success' : ''} nomeBeneficio={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <IconeBeneficio nomeIcone={benefit.beneficio} />
                                    <div>
                                        {benefit.beneficio} <br /> 
                                        {representativeValorTemplate(benefit)}
                                    </div>
                                </div>
                            }  />
                        </Col6>
                    )
                })}
                </Col12>
           }
           </>
        )
    }

    const [mandatoryState, setMandatoryState] = useState(
        elegibilidade.reduce((acc, item) => {
            acc[item.id] = item.mandatory;
            return acc;
        }, {})
    );

    useEffect(() => {
        setMandatoryState(
            elegibilidade.reduce((acc, item) => {
                acc[item.id] = item.mandatory;
                return acc;
            }, {})
        );
    }, [elegibilidade])
    
    const toggleMandatory = (id) => {
        setMandatoryState((prevState) => ({
            ...prevState,
            [id]: !prevState[id], // Atualizar apenas o valor correspondente ao 'id' selecionado
        }));
    };
    
    const representativeMandatoryTemplate = (rowData) => {
        return (
            <SwitchInput 
                checked={mandatoryState[rowData.id]} 
                onChange={() => toggleMandatory(rowData.id)} // Alterar o estado específico para o item
            />
        );
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="card">
                <DataTable emptyMessage="Não foram encontrados benefícios" tableStyle={{ minWidth: '65vw' }} value={data.beneficios}>
                    <Column field="beneficio" header="Benefício"></Column>
                    <Column body={representativeMandatoryTemplate} field="mandatory" header="Obrigatório"></Column>
                    <Column body={representativeValorTemplate} field="valor" header="Valor"></Column>
                </DataTable>
            </div>
        );
    };
    
    const allowExpansion = (rowData) => {
        return rowData.beneficios.length > 0;
    };
    
    return (
        <>
            <DataTable expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={rowExpansionTemplate} value={elegibilidade} filters={filters} globalFilterFields={['data_inicio']}  emptyMessage="Não foram encontrados elegibilidade" paginator={pagination} rows={7}  tableStyle={{ minWidth: '68vw' }}>
                {/* <Column expander={allowExpansion} style={{ width: '5%' }} /> */}
                <Column body={representativeContratoTemplate} field="nome_fornecedor" header="Contrato" style={{ width: '20%' }}></Column>
                <Column body={representativeBeneficiosTemplate} field="beneficios" header="Benefícios" style={{ width: '50%' }}></Column>
                <Column body={representativeMandatoryTemplate} field="mandatory" header="Obrigatório"></Column>
                <Column field="data_inicio" header="Data Início" style={{ width: '15%' }}></Column>
                <Column field="data_fim" header="Data Fim" style={{ width: '15%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableElegibilidadeDetalhes