import { useParams } from "react-router-dom";

function CartaoDetalhes() {

    const { id } = useParams()
    const url = window.location.pathname
    
    return (
       <>{url}</>
    )
}

export default CartaoDetalhes