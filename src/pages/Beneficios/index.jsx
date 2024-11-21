import { Outlet } from "react-router-dom"
import { RecargaBeneficiosProvider } from "../../contexts/RecargaBeneficios"
 

function RecargaBeneficios() {

    return (
        <RecargaBeneficiosProvider>
            <Outlet />
        </RecargaBeneficiosProvider>
    )
}

export default RecargaBeneficios