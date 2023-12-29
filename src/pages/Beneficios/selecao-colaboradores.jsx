import http from '@http'
import { useEffect, useRef, useState } from "react"
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
import styled from 'styled-components'
import { useRecargaBeneficiosContext } from "../../contexts/RecargaBeneficios"
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

function BeneficioSelecionarColaboradores() {

    const {
        recarga,
        setColaboradores,
        setNome
    } = useRecargaBeneficiosContext()

    const [modalOpened, setModalOpened] = useState(false)
    const navegar = useNavigate()
    const [globalFilterValue, setGlobalFilterValue] = useState('')
    const [listaColaboradores, setListaColaboradores] = useState([])
    const [selectedColaboradores, setSelectedColaboradores] = useState(null);
    const [rowClick, setRowClick] = useState(true)
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const toast = useRef(null)

    useEffect(() => {
        if(listaColaboradores.length === 0)
        {
            http.get('api/dashboard/collaborator')
                .then(response => {
                    setListaColaboradores(response.data.collaborators)
                })
                .catch(erro => console.log(erro))
        }
    }, [listaColaboradores])
    
    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const abrirNomearBeneficio = () => {
        setColaboradores(selectedColaboradores)
        setModalOpened(true)
    }

    const nomearBeneficio = (nome) => {
        setNome(nome)
        navegar('/beneficio/editar-valor')
    }

    return (
        <>
            <Frame>
                <Toast ref={toast} />
                {listaColaboradores ?
                    <>
                        <Titulo>
                            <h6>Selecione os colaboradores</h6>
                            <SubTitulo>
                                Informe quais colaboradores você quer realizar a recarga de benefícios
                            </SubTitulo>
                        </Titulo>
                        <div className="flex justify-content-end">
                            <span className="p-input-icon-left">
                                <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar colaborador" />
                            </span>
                        </div>
                        <DataTable value={listaColaboradores} filters={filters} globalFilterFields={['name']} emptyMessage="Não foram encontrados colaboradores" selectionMode={rowClick ? null : 'checkbox'} selection={selectedColaboradores} onSelectionChange={(e) => setSelectedColaboradores(e.value)} tableStyle={{ minWidth: '70vw' }}>
                            <Column selectionMode="multiple" headerStyle={{width: '10%', justifyContent: 'center'}}></Column>
                            <Column field="name" header="Nome Completo" headerStyle={{width: '35%', justifyContent: 'center'}}></Column>
                            <Column field="document" header="CPF" headerStyle={{width: '25%', justifyContent: 'center'}}></Column>
                            <Column field="email" header="E-mail" headerStyle={{width: '30%', justifyContent: 'center'}}></Column>
                        </DataTable>
                        <ContainerButton>
                            <Botao aoClicar={() => navegar(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Cancelar</Botao>
                            <LadoALado>
                                <span>Selecionado&nbsp;<Texto color='var(--primaria)' weight={700}>{selectedColaboradores ? selectedColaboradores.length : 0}</Texto></span>
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

export default BeneficioSelecionarColaboradores