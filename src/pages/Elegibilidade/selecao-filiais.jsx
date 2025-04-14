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
import './SelecionarFiliais.css'
import { Toast } from 'primereact/toast'
import { DataTable } from 'primereact/datatable'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import styled from 'styled-components'
import { useConfiguracaoElegibilidadeContext } from '@contexts/ConfiguracaoElegibilidade'

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

function ElegibilidadeSelecionarFiliais() {

    const {
        elegibilidade,
        setFiliais
    } = useConfiguracaoElegibilidadeContext()

    const [modalOpened, setModalOpened] = useState(false)
    const navegar = useNavigate()
    const [globalFilterValue, setGlobalFilterValue] = useState('')
    const [listaFiliais, setListaFiliais] = useState([])
    const [selectedFiliais, setSelectedFiliais] = useState(null);
    const [rowClick, setRowClick] = useState(true)
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const toast = useRef(null)

    useEffect(() => {
        
        http.get('filial/?format=json')
            .then(response => {
                setListaFiliais(response)
            })
            .catch(erro => {
                
            })
            .finally(function() {
                
            })
    }, [])
    
    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function editarValor(){
        setFiliais(selectedFiliais)
        navegar('/elegibilidade/editar-valor/filiais')
    }
    
    function formataCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]/g, "");
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    
    const representativeCNPJTemplate = (rowData) => {
        if(rowData?.cnpj)
        {
            return (
                formataCNPJ(rowData.cnpj)
            )
        }
        else
        {
            return "---"
        }
    }

    return (
        <>
            <Frame>
                <Toast ref={toast} />
                {listaFiliais ?
                    <>
                        <Titulo>
                            <h6>Selecione as filiais</h6>
                            <SubTitulo>
                                Informe quais filiais você quer configurar a elegibilidade
                            </SubTitulo>
                        </Titulo>
                        <div className="flex justify-content-end">
                            <span className="p-input-icon-left">
                                <CampoTexto width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar filal" />
                            </span>
                        </div>
                        <DataTable value={listaFiliais} filters={filters} globalFilterFields={['name']} emptyMessage="Não foram encontradas filiais" selectionMode={rowClick ? null : 'checkbox'} selection={selectedFiliais} onSelectionChange={(e) => setSelectedFiliais(e.value)} tableStyle={{ minWidth: '68vw' }}>
                            <Column selectionMode="multiple" style={{ width: '13%' }}></Column>
                            <Column field="nome" header="Nome" style={{ width: '35%' }}></Column>
                            <Column body={representativeCNPJTemplate} field="cnpj" header="CNPJ" style={{ width: '35%' }}></Column>
                        </DataTable>
                        <ContainerButton>
                            <Botao aoClicar={() => navegar(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Cancelar</Botao>
                            <LadoALado>
                                <span>Selecionado&nbsp;<Texto color='var(--primaria)' weight={700}>{selectedFiliais ? selectedFiliais.length : 0}</Texto></span>
                                <Botao aoClicar={editarValor} estilo="vermilion" size="medium" filled>Continuar</Botao>
                            </LadoALado>
                        </ContainerButton>
                    </>
                : <Skeleton variant="rectangular" width={300} height={60} />
                }
            </Frame>
        </>
    )
}

export default ElegibilidadeSelecionarFiliais