import { Outlet } from "react-router-dom"
import { ColaboradorProvider } from "../../../contexts/Colaborador"
 

function AusenciaRegistro() {

    return (
        <ColaboradorProvider>
            <Outlet />
        </ColaboradorProvider>
    )
}

export default AusenciaRegistro