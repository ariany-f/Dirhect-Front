import { Outlet } from "react-router-dom"
import { OperadorProvider } from "../../../contexts/Operador"
 

function OperadorRegistro() {

    return (
        <OperadorProvider>
            <Outlet />
        </OperadorProvider>
    )
}

export default OperadorRegistro