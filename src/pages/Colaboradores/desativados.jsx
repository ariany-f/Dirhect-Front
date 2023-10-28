import colaboradores from '@json/colaboradores.json'
import DataTableColaboradores from '../../components/DataTableColaboradores'

function ColaboradoresDesativados() {
    return (
        <DataTableColaboradores colaboradores={colaboradores} />
    )
}

export default ColaboradoresDesativados