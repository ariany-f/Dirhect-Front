import { useParams } from "react-router-dom"

function CartaoSolicitarSegundaVia() {
    
    const { id } = useParams()
    const url = window.location.pathname

    return (
       <>{url}</>
    )
}

export default CartaoSolicitarSegundaVia