import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import './DataTable.css'
import BotaoGrupo from '@components/BotaoGrupo'
import Botao from '@components/Botao'
import Texto from '@components/Texto'
import styles from './SaldoLivre.module.css'
import BotaoSemBorda from '@components/BotaoSemBorda'
import { Link, useNavigate } from 'react-router-dom'
import { FaPencilAlt } from 'react-icons/fa'
import { useRef, useState } from 'react'
import ModalSaldoLivreEditarValor from '../ModalSaldoLivreEditarValor'
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

function DataTablePremiacaoEditarValor({ recarga }) {
    
    const [selectedColaboradores, setSelectedColaboradores] = useState(null)
    const [rowClick, setRowClick] = useState(true)
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)
    const navegar = useNavigate()

    const representativeAmountTemplate = (rowData) => {
        if(rowData.amount)
        {
            return <b>{(Real.format(rowData.amount))}</b>
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
            <DataTable value={recarga[0]} selectionMode={rowClick ? null : 'checkbox'} selection={selectedColaboradores} onSelectionChange={(e) => setSelectedColaboradores(e.value)} tableStyle={{ minWidth: '90vw' }}>
                <Column selectionMode="multiple" style={{ width: '15%' }} headerStyle={{ width: '15%' }}></Column>
                <Column body={representativeDescriptionTemplate} header="Nome Completo" style={{ width: '40%' }}></Column>
                <Column body={representativeAmountTemplate} header="Valor da premiação" style={{ width: '40%' }}></Column>
            </DataTable>
            <ContainerButton>
                <Botao aoClicar={voltar} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                <LadoALado>
                    <span>Selecionado&nbsp;<Texto color='var(--primaria)' weight={700}>{selectedColaboradores ? selectedColaboradores.length : 0}</Texto></span>
                    <Botao aoClicar={() => {}} estilo="vermilion" size="medium" filled>Continuar</Botao>
                </LadoALado>
            </ContainerButton>
            <ModalSaldoLivreEditarValor selecionados={selectedColaboradores ?? 0} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}

export default DataTablePremiacaoEditarValor