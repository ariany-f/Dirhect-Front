import { Outlet } from "react-router-dom"
import { DependentesProvider } from "../../contexts/Dependentes"
 

function Dependentes() {

    return (
        <DependentesProvider>
            <Outlet />
        </DependentesProvider>
    )
}

export default Dependentes