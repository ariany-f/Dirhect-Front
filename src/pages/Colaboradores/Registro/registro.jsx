import { Outlet } from "react-router-dom"
import { ColaboradorProvider } from "../../../contexts/Colaborador"
 

function ColaboradorRegistro() {

    return (
        <ColaboradorProvider>
            <Outlet />
        </ColaboradorProvider>
    )
}

export default ColaboradorRegistro