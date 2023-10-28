import colaboradores from '@json/colaboradores.json'
import DataTableColaboradores from '../../components/DataTableColaboradores'

function ColaboradoresCadastrados() {
    return (
        <DataTableColaboradores colaboradores={colaboradores} />
    )
}

export default ColaboradoresCadastrados