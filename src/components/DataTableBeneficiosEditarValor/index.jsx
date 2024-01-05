import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import './DataTable.css'
import BotaoGrupo from '@components/BotaoGrupo'
import Botao from '@components/Botao'
import Texto from '@components/Texto'
import styles from './Beneficios.module.css'
import BotaoSemBorda from '@components/BotaoSemBorda'
import { Link, useNavigate } from 'react-router-dom'
import { FaPencilAlt } from 'react-icons/fa'
import { useRef, useState } from 'react'
import ModalBeneficioEditarValor from '../ModalBeneficioEditarValor'
import { Toast } from 'primereact/toast'
import styled from 'styled-components'

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px 0;
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

function DataTableBeneficiosEditarValor({ recarga }) {
    
    const [selectedColaboradores, setSelectedColaboradores] = useState(null)
    const [rowClick, setRowClick] = useState(true)
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)
    const navegar = useNavigate()

    const representativeAmountAuxilioTemplate = (rowData) => {
        if(rowData.auxilio_alimentacao)
        {
            return <b>{(Real.format(rowData.auxilio_alimentacao))}</b>
        }
        else
        {
            return <b>-</b>
        }
    }
    const representativeAmountAlimentacaoTemplate = (rowData) => {
        if(rowData.alimentacao)
        {
            return <b>{(Real.format(rowData.alimentacao))}</b>
        }
        else
        {
            return <b>-</b>
        }
    }
    const representativeAmountRefeicaoTemplate = (rowData) => {
        if(rowData.refeicao)
        {
            return <b>{(Real.format(rowData.refeicao))}</b>
        }
        else
        {
            return <b>-</b>
        }
    }
    const representativeAmountMobilidadeTemplate = (rowData) => {
        if(rowData.mobilidade)
        {
            return <b>{(Real.format(rowData.mobilidade))}</b>
        }
        else
        {
            return <b>-</b>
        }
    }
    const representativeAmountSaudeTemplate = (rowData) => {
        if(rowData.saude)
        {
            return <b>{(Real.format(rowData.saude))}</b>
        }
        else
        {
            return <b>-</b>
        }
    }
    const representativeAmountCombustivelTemplate = (rowData) => {
        if(rowData.combustivel)
        {
            return <b>{(Real.format(rowData.combustivel))}</b>
        }
        else
        {
            return <b>-</b>
        }
    }
    const representativeAmountCulturaTemplate = (rowData) => {
        if(rowData.cultura)
        {
            return <b>{(Real.format(rowData.cultura))}</b>
        }
        else
        {
            return <b>-</b>
        }
    }
    const representativeAmountHomeOfficeTemplate = (rowData) => {
        if(rowData.home_office)
        {
            return <b>{(Real.format(rowData.auxilio_alimentacao))}</b>
        }
        else
        {
            return <b>-</b>
        }
    }
    const representativeAmountEducacaoTemplate = (rowData) => {
        if(rowData.educacao)
        {
            return <b>{(Real.format(rowData.educacao))}</b>
        }
        else
        {
            return <b>-</b>
        }
    }

    const representativeDescriptionTemplate = (rowData) => {
        return (
           rowData.name
        )
    }

    const voltar = () => {
        navegar(-1)
    }

    function editarValores() {
        if(selectedColaboradores && selectedColaboradores.length !== 0)
        {
            setModalOpened(true)
        }
        else
        {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Você deve selecionar os colaboradores', life: 3000 });
        }
    }

    return (
        <>
            <Toast ref={toast} />
            <BotaoGrupo>
                <BotaoSemBorda color="var(--primaria)">
                    <FaPencilAlt className={styles.icon} /><Link onClick={editarValores} className={styles.link}>Editar valor dos benefícios</Link>
                </BotaoSemBorda>
            </BotaoGrupo>
            <DataTable value={recarga[0]} selectionMode={rowClick ? null : 'checkbox'} selection={selectedColaboradores} onSelectionChange={(e) => setSelectedColaboradores(e.value)} tableStyle={{ maxWidth: '100vw',minWidth: '90vw' }}>
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column body={representativeDescriptionTemplate} header="Nome Completo" style={{ width: '15%' }}></Column>
                <Column body={representativeAmountAuxilioTemplate} header="Auxilio Alimentação" style={{ width: '7.5%' }}></Column>
                <Column body={representativeAmountAlimentacaoTemplate} header="Alimentação" style={{ width: '7.5%' }}></Column>
                <Column body={representativeAmountRefeicaoTemplate} header="Refeição" style={{ width: '7.5%' }}></Column>
                <Column body={representativeAmountMobilidadeTemplate} header="Mobilidade" style={{ width: '7.5%' }}></Column>
                <Column body={representativeAmountSaudeTemplate} header="Saúde" style={{ width: '7.5%' }}></Column>
                <Column body={representativeAmountCombustivelTemplate} header="Combustível" style={{ width: '7.5%' }}></Column>
                <Column body={representativeAmountCulturaTemplate} header="Cultura" style={{ width: '7.5%' }}></Column>
                <Column body={representativeAmountHomeOfficeTemplate} header="Home Office" style={{ width: '7.5%' }}></Column>
                <Column body={representativeAmountEducacaoTemplate} header="Educação" style={{ width: '7.5%' }}></Column>
            </DataTable>
            <ContainerButton>
                <Botao aoClicar={voltar} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                <LadoALado>
                    <span>Selecionado&nbsp;<Texto color='var(--primaria)' weight={700}>{selectedColaboradores ? selectedColaboradores.length : 0}</Texto></span>
                    <Botao aoClicar={[]} estilo="vermilion" size="medium" filled>Continuar</Botao>
                </LadoALado>
            </ContainerButton>
            <ModalBeneficioEditarValor selecionados={selectedColaboradores ?? 0} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}

export default DataTableBeneficiosEditarValor