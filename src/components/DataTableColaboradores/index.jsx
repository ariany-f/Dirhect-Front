import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'

function DataTableColaboradores({ colaboradores }) {
    return (
        <DataTable value={colaboradores} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
            <Column field="name" sortable header="Nome Completo" style={{ width: '35%' }}></Column>
            <Column field="email" header="E-mail" style={{ width: '35%' }}></Column>
            <Column field="document" header="CPF" style={{ width: '20%' }}></Column>
            <Column field="" header="" style={{ width: '10%' }}  body={<MdOutlineKeyboardArrowRight/>}></Column>
        </DataTable>
    )
}

export default DataTableColaboradores