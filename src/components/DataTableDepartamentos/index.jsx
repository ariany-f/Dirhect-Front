import styles from '@pages/Departamentos/Departamento.module.css'
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

function DataTableDepartamentos({ departamentos }) {

    const[selectedDepartamento, setSelectedDepartamento] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
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

    function verDetalhes(value)
    {
        setSelectedDepartamento(value)
        navegar(`/departamento/detalhes/${value.public_id}`)
    }

    const representativeBodyTemplate = (rowData) => {
        return (
            <div style={{ padding: '20px'}}>
                <Texto weight={700} className={styles.departmentName}>{rowData.name}</Texto>
                <div className={styles.departamento}>
                    <div className={styles.left}>
                        <div className={styles.recuo} color="var(--neutro-500)">
                            Colaboradores:&nbsp;<NumeroColaboradores weight={700}>{rowData?.total_collaborators ?? 0}</NumeroColaboradores>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <Texto weight={300}>Benefícios configurados</Texto>
                        <div className={styles.beneficios}>
                            {(!rowData.benefits) || rowData.benefits.length === 0
                            ?
                                <FaBan size={10} />
                            :
                                rowData.benefits.map((benefit, index) => {
                                    return (
                                        <BadgeBeneficio key={index} nomeBeneficio={benefit}/>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar departamento" />
                </span>
            </div>
            <DataTable value={departamentos} filters={filters} globalFilterFields={['name']} emptyMessage="Não foram encontrados departamentos" selection={selectedDepartamento} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '68vw' }}>
                <Column header="" filterField="name" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                body={representativeBodyTemplate} />
                <Column field="" header="" style={{ width: '10%' }}  body={<MdOutlineKeyboardArrowRight/>}></Column>
            </DataTable>
        </>
    )
}

export default DataTableDepartamentos