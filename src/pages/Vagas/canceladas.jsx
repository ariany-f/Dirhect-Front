import http from '@http'
import Loading from '@components/Loading'
import { useEffect, useState } from "react";
import DataTableVagas from '@components/DataTableVagas';
import { Link, useOutletContext } from 'react-router-dom'

function VagasCanceladas() {
    
    const [loading, setLoading] = useState(false)
    const [vagas, setVagas] = useState([])
    const context = useOutletContext();

    useEffect(() => {
        http.get('vagas/?format=json&status=F')
            .then(response => {
                setVagas(response)
            })
            .catch(error => {   
                console.log(error)
            })
    }, [])
    
    return (
        <DataTableVagas vagas={vagas} />
    )
}

export default VagasCanceladas