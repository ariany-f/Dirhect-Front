import DataTableColaboradores from '@components/DataTableColaboradores'
import http from '@http'
import { useEffect, useState } from "react";

function ColaboradoresDesativados() {
    
    const [colaboradores, setColaboradores] = useState([])

    useEffect(() => {
        http.get('api/dashboard/collaborator')
            .then(response => {
                setColaboradores(response.data.collaborators)
            })
            .catch(erro => console.log(erro))
    }, [])

    return (
        <DataTableColaboradores colaboradores={colaboradores} />
    )
}

export default ColaboradoresDesativados