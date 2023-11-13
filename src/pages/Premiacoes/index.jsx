import http from '@http'
import { useEffect } from "react";

function Premiacoes() {
    
    useEffect(() => {
        http.get('api/dashboard/award')
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

export default Premiacoes