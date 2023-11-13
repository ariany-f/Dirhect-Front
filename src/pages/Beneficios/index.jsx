import http from '@http'
import { useEffect } from "react";

function Beneficios() {

    useEffect(() => {
        http.get('api/dashboard/benefit')
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

export default Beneficios