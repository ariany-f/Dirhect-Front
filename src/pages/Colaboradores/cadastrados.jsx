import DataTableColaboradores from '@components/DataTableColaboradores'
import http from '@http'
import Loading from '@components/Loading'
import { useEffect, useState } from "react";

function ColaboradoresCadastrados() {
    
    const [loading, setLoading] = useState(false)
    const [colaboradores, setColaboradores] = useState([])

    useEffect(() => {
        if(!colaboradores.length)
        {
            setLoading(true)
            http.get('api/dashboard/collaborator')
                .then(response => {
                    setLoading(false)
                    if(response.data.collaborators.length)
                    {
                        setColaboradores(response.data.collaborators)
                    }
                })
                .catch(erro => {
                    console.log(erro)
                    setLoading(false)
                })
        }
    }, [])

    return (
        <>
            <Loading opened={loading} />
            <DataTableColaboradores colaboradores={colaboradores} />
        </>
    )
}

export default ColaboradoresCadastrados