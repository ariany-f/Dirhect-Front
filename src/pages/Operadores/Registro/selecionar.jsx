import http from '@http'
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom'
import BotaoGrupo from "@components/BotaoGrupo"
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import styles from './Registro.module.css'
import { GrAddCircle } from 'react-icons/gr'
import { Toast } from 'primereact/toast'
import { DataTable } from 'primereact/datatable'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { InputSwitch } from 'primereact/inputswitch';
import { Column } from 'primereact/column'
import styled from 'styled-components';
import DottedLine from '@components/DottedLine';
import { useOperadorContext } from '../../../contexts/Operador';
import './DataTableStyle.css'

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

const ConteudoFrame = styled.div`
    width: 100%;
`

function OperadorRegistroSelecionar() {

    let { id } = useParams()
    const navegar = useNavigate()
    const [globalFilterValue, setGlobalFilterValue] = useState('')
    const [colaboradores, setColaboradores] = useState([])
    const [selectedColaborador, setSelectedColaborador] = useState(null);
    const [rowClick, setRowClick] = useState(true)
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const toast = useRef(null)
    
    const { 
        operador,
        setName,
        setPublicId
    } = useOperadorContext()

    useEffect(() => {
        // http.get('api/collaborator/index')
        //     .then(response => {
        //         if(response.success)
        //         {
        //             setColaboradores(response.data)
        //         }
        //     })
        //     .catch(erro => console.log(erro))
    }, [])

    const adicionarColaborador = () => {
        setPublicId(selectedColaborador.public_id)
        setName(selectedColaborador.user_name)
        navegar('/operador/registro/permissoes')
    }
    
    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    return (
        <Frame>
            <Toast ref={toast} />
            <ConteudoFrame>
                <BotaoGrupo align="space-between">
                    <BotaoGrupo>
                        <Titulo align="left">
                            <h6>Selecione o operador</h6>
                            <SubTitulo>
                                Escolha um colaborador para ser o operador:
                            </SubTitulo>
                        </Titulo>
                    </BotaoGrupo>
                    <Botao aoClicar={() => navegar('/colaborador/registro')} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Adicionar um novo colaborador</Botao>
                </BotaoGrupo>
            </ConteudoFrame>
            
            <DottedLine />

            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar colaborador" />
                </span>
            </div>
            <DataTable value={colaboradores} filters={filters} globalFilterFields={['name']} emptyMessage="Não foram encontrados colaboradores" selectionMode={rowClick ? null : 'radiobutton'} selection={selectedColaborador} onSelectionChange={(e) => setSelectedColaborador(e.value)} tableStyle={{ minWidth: '68vw' }}>
                <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                <Column field="name" header="Nome Completo" style={{ width: '100%' }}></Column>
                <Column field="email" header="E-mail corporativo" style={{ width: '100%' }}></Column>
            </DataTable>
            <ContainerButton>
                <Botao aoClicar={() => navegar(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Cancelar</Botao>
                <LadoALado>
                    <span>Selecionado&nbsp;<Texto color='var(--primaria)' weight={700}>1</Texto></span>
                    <Botao aoClicar={adicionarColaborador} estilo="vermilion" size="medium" filled>Continuar</Botao>
                </LadoALado>
            </ContainerButton>
        </Frame>
    )
}

export default OperadorRegistroSelecionar