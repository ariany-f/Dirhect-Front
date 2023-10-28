import colaboradores from '@json/colaboradores.json'
import DataTableColaboradores from '../../components/DataTableColaboradores'

function ColaboradoresAguardando() {
    return (
        <DataTableColaboradores colaboradores={colaboradores} />
    )
}

export default ColaboradoresAguardando