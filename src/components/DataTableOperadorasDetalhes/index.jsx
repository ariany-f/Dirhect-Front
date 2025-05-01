import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdSecurity } from 'react-icons/md'
import './DataTable.css'
import BadgeGeral from '@components/BadgeGeral';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Tag } from 'primereact/tag';
import { IoEllipsisVertical, IoFastFoodSharp } from 'react-icons/io5';
import { BiBookReader, BiShield } from 'react-icons/bi';
import { RiBusFill, RiComputerLine, RiEBike2Fill, RiGasStationFill, RiShoppingCartFill } from 'react-icons/ri';
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

const tipos = {
    'C': 'Cultura',
    'E': 'Educação',
    'H': 'Home & Office',
    'M': 'Mobilidade',
    'P': 'P(rograma) de A(limentação) do T(rabalhador)',
    'S': 'Saúde e Bem Estar'
}

function DataTableOperadorasDetalhes({ beneficios, onAddBeneficio, operadora = null }) {
    const[selectedBeneficio, setSelectedBeneficio] = useState(0)
    const [sendData, setSendData] = useState({})
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const navegar = useNavigate()
    const { t } = useTranslation('common');

    useEffect(() => {
        setSelectedBeneficio(0)
        setSendData({})
    }, [beneficios])

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
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
        const tipos = {
            'C': 'Cultura',
            'E': 'Educação',
            'H': 'Home & Office',
            'M': 'Mobilidade',
            'P': 'Programa de Alimentação do Trabalhador',
            'S': 'Saúde e Bem Estar'
        }
        return <Tag value={tipos[rowData.beneficio.tipo]} severity="info" />
    }

    return (
        <div style={{ display: 'flex', marginTop: '2.5vh', flexDirection: 'column', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
            <BotaoGrupo align="space-between">                    
                {operadora?.nome && (
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            {/* {operadora.imagem_url && (
                                <CustomImage 
                                    src={operadora.imagem_url} 
                                    alt={operadora.nome} 
                                    width={90} 
                                    height={45} 
                                    title={operadora.nome} 
                                />
                            )} */}
                            Benefícios Disponíveis - 
                            <Texto size={18} weight={600}>{operadora.nome}</Texto>
                        </div>
                    )}
                {onAddBeneficio && (
                    <Botao aoClicar={onAddBeneficio} estilo="vermilion" size="small" tab>
                        <GrAddCircle className={styles.icon} fill="white" color="white"/> {t('add')} Benefício
                    </Botao>
                )}
            </BotaoGrupo>
            <DataTable 
                value={beneficios} 
                filters={filters} 
                globalFilterFields={['beneficio.descricao']} 
                emptyMessage="Não foram encontrados benefícios vinculados à esta operadora" 
                paginator rows={10}
                selection={selectedBeneficio} 
                onSelectionChange={(e) => {setSendData(e.value);}} 
                selectionMode="single"
                tableStyle={{ minWidth: '100%', maxWidth: '100%' }}
            >
                <Column body={representativeBeneficioTemplate} field="beneficio.descricao" style={{ width: '50%' }}></Column>
                <Column body={representativeTipoTemplate} field="beneficio.tipo" style={{ width: '50%' }}></Column>
            </DataTable>
        </div>
    )
}

export default DataTableOperadorasDetalhes