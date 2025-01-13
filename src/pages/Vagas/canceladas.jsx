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
        if((context) && ((!vagas) || vagas.length === 0 || (!Object.keys(vagas).length)))
        {
            setVagas(context.canceladas)
        }
    }, [context])
    
    return (
        <DataTableVagas vagas={vagas} />
    )
}

export default VagasCanceladas