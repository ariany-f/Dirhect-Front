import DataTableColaboradores from '@components/DataTableColaboradores'
import http from '@http'
import { useEffect, useState } from "react";

function ColaboradoresAguardando() {
    
    const [colaboradores, setColaboradores] = useState([])

    useEffect(() => {
        http.get('api/collaborator/waiting-registration')
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

export default ColaboradoresAguardando