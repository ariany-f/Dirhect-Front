import DataTableColaboradores from '@components/DataTableColaboradores'
import http from '@http'
import Loading from '@components/Loading'
import { useEffect, useState } from "react";

function ColaboradoresCadastrados() {
    
    const [loading, setLoading] = useState(false)
    const [colaboradores, setColaboradores] = useState([])

    useEffect(() => {
        // setLoading(true)
        // http.get('api/collaborator/index')
        //     .then(response => {
        //         setLoading(false)
        //         if(response.success)
        //         {
        //             setColaboradores(response.data)
        //         }
        //     })
        //     .catch(erro => {
        //         console.log(erro)
        //         setLoading(false)
        //     })
    }, [])

    return (
        <>
            <Loading opened={loading} />
            <DataTableColaboradores colaboradores={colaboradores} />
        </>
    )
}

export default ColaboradoresCadastrados