import { Outlet } from "react-router-dom"
import { RecargaSaldoLivreProvider } from "../../contexts/RecargaSaldoLivre"
 

function RecargaPremiacoes() {

    return (
        <RecargaSaldoLivreProvider>
            <Outlet />
        </RecargaSaldoLivreProvider>
    )
}

export default RecargaPremiacoes