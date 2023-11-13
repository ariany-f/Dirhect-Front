import http from '@http'
import { useEffect } from "react";

function Cartoes() {

    useEffect(() => {
        http.get('api/dashboard/department')
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

export default Cartoes