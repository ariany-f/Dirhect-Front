import http from '@http'
import { useEffect } from "react";

function Despesas() {

    useEffect(() => {
        http.get('api/dashboard/expense')
            .then(response => {
                console.log(response)
            })
            .catch(erro => console.log(erro))
    }, [])

    const url = window.location.pathname;
    return (
       <>{url}</>
    )
}

export default Despesas