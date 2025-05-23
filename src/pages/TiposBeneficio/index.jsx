import { Outlet } from "react-router-dom"
import { RecargaBeneficiosProvider } from "@contexts/RecargaBeneficios"

function TiposBeneficio() {

    return (
        <RecargaBeneficiosProvider>
            <Outlet />
        </RecargaBeneficiosProvider>
    )
}

export default TiposBeneficio