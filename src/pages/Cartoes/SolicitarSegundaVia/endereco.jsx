import { useParams } from "react-router-dom";

function CartaoSolicitarSegundaViaEndereco() {
    
    const { id } = useParams()
    const url = window.location.pathname
    
    return (
       <>{url}</>
    )
}

export default CartaoSolicitarSegundaViaEndereco