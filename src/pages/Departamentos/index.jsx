import { Outlet } from 'react-router-dom'
import { DepartamentoProvider } from '../../contexts/Departamento'

function DepartamentosCommon() {

    return (
        <DepartamentoProvider>
            <Outlet />
        </DepartamentoProvider>
    )
}

export default DepartamentosCommon