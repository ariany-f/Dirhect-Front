import http from '@http'
import Loading from '@components/Loading'
import { useEffect, useState } from "react";
import DataTableVagas from '@components/DataTableVagas';
import { Link, useOutletContext } from 'react-router-dom'

function VagasTransferidas() {
    
    const [loading, setLoading] = useState(true)
    const [vagas, setVagas] = useState([])
    const context = useOutletContext();

    useEffect(() => {
        setLoading(true)
        http.get('vagas/?format=json&status=T')
            .then(response => {
                setVagas(response)
                setLoading(false)
            })
            .catch(error => {   
                console.log(error)
                setLoading(false)
            })
    }, [])
    
    if (loading) {
        return <Loading opened={loading} />
    }
    
    return (
        <DataTableVagas vagas={vagas} />
    )
}

export default VagasTransferidas