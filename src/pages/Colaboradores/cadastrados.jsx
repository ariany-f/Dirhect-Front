import DataTableColaboradores from '@components/DataTableColaboradores'
import http from '@http'
import { useEffect, useState } from "react";

function ColaboradoresCadastrados() {
    
    const [colaboradores, setColaboradores] = useState([])

    useEffect(() => {
        if(!colaboradores.length)
        {
            http.get('api/dashboard/collaborator')
                .then(response => {
                    if(response.data.collaborators.length)
                    {
                        setColaboradores(response.data.collaborators)
                    }
                })
                .catch(erro => console.log(erro))
        }
    }, [])

    return (
        <DataTableColaboradores colaboradores={colaboradores} />
    )
}

export default ColaboradoresCadastrados