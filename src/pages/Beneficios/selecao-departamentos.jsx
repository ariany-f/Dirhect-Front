import http from '@http'
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom'
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import { Skeleton } from 'primereact/skeleton'
import './SelecionarColaboradores.css'
import { Toast } from 'primereact/toast'
import { DataTable } from 'primereact/datatable'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import styled from 'styled-components';
import { useRecargaBeneficiosContext } from '../../contexts/RecargaBeneficios'
import ModalRecarga from '@components/ModalRecarga'

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

const LadoALado = styled.div`
    display: flex;
    gap: 24px;
    & span {
        display: flex;
        align-items: center;
    }
`

function BeneficioSelecionarDepartamentos() {

    const navegar = useNavigate()
    const [modalOpened, setModalOpened] = useState(false)
    const [globalFilterValue, setGlobalFilterValue] = useState('')
    const [departments, setDepartments] = useState([])
    const [selectedDepartamentos, setSelectedDepartamentos] = useState(null);
    const [rowClick, setRowClick] = useState(true)
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const toast = useRef(null)
    const {
        recarga,
        setDepartamentos,
        setNome
    } = useRecargaBeneficiosContext()

    useEffect(() => {
        if(departments.length === 0)
        {
            setDepartamentos([])
            // http.get('api/department/index')
            //     .then(response => {
            //         setDepartments(response.data.departments)
            //     })
            //     .catch(erro => console.log(erro))
        }
    }, [departments])
    
    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const representativeCountTemplate = (rowData) => {
        return rowData.collaborators_count
    }
    
    function abrirNomearBeneficio()  {
        setDepartamentos(selectedDepartamentos)
        setModalOpened(true)
    }

    function nomearBeneficio(nome) {
        setNome(nome)
        navegar('/beneficio/editar-valor/departamentos')
    }

    return (
        <>
        <Frame>
            <Toast ref={toast} />
            {departments ?
                <>
                    <Titulo>
                        <h6>Selecione os departamentos</h6>
                        <SubTitulo>
                        Informe quais departamentos você quer realizar a recarga de benefícios
                        </SubTitulo>
                    </Titulo>
                    <div className="flex justify-content-end">
                        <span className="p-input-icon-left">
                            <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar departamento" />
                        </span>
                    </div>
                    <DataTable value={departments} filters={filters} globalFilterFields={['name']} emptyMessage="Não foram encontrados departamentos" selectionMode={rowClick ? null : 'checkbox'} selection={selectedDepartamentos} onSelectionChange={(e) => setSelectedDepartamentos(e.value)} tableStyle={{ minWidth: '68vw' }}>
                        <Column selectionMode="multiple" style={{ width: '15%' }}></Column>
                        <Column field="name" header="Nome" style={{ width: '70%' }}></Column>
                        <Column body={representativeCountTemplate} header="Colaboradores" style={{ width: '15%' }}></Column>
                    </DataTable>
                    <ContainerButton>
                        <Botao aoClicar={() => navegar(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Cancelar</Botao>
                        <LadoALado>
                            <span>Selecionado&nbsp;<Texto color='var(--primaria)' weight={700}>{selectedDepartamentos ? selectedDepartamentos.length : 0}</Texto></span>
                            <Botao aoClicar={abrirNomearBeneficio} estilo="vermilion" size="medium" filled>Continuar</Botao>
                        </LadoALado>
                    </ContainerButton>
                </>
            : <Skeleton variant="rectangular" width={300} height={60} />
            }
        </Frame>
        <ModalRecarga aoClicar={nomearBeneficio} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}

export default BeneficioSelecionarDepartamentos