import { Outlet } from "react-router-dom"
import { RecargaSaldoLivreProvider } from "../../contexts/RecargaSaldoLivre"
 

function LinhasTransporte() {

    return (
        <RecargaSaldoLivreProvider>
            <Outlet />
        </RecargaSaldoLivreProvider>
    )
}

export default LinhasTransporte