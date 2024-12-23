import DataTableColaboradores from '@components/DataTableColaboradores'
import http from '@http'
import Loading from '@components/Loading'
import { useEffect, useState } from "react";

function ColaboradoresDesativados() {
    
    const [loading, setLoading] = useState(false)
    const [colaboradores, setColaboradores] = useState([])

    useEffect(() => {
        http.get('api/collaborator/trash')
        .then(response => {
            setLoading(false)
            if(response.data.length)
            {
                setColaboradores(response.data)
            }
        })
        .catch(erro => {
            console.log(erro)
            setLoading(false)
        })
    }, [])

    return (
        <DataTableColaboradores colaboradores={colaboradores} />
    )
}

export default ColaboradoresDesativados