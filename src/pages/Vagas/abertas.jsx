import http from '@http'
import Loading from '@components/Loading'
import { useEffect, useState } from "react";
import DataTableVagas from '@components/DataTableVagas';
import { Link, useOutletContext } from 'react-router-dom'

function VagasAbertas() {
    
    const [loading, setLoading] = useState(false)
    const [vagas, setVagas] = useState([])
    const context = useOutletContext();

    useEffect(() => {
        http.get('vagas/?format=json')
            .then(response => {
                setVagas(response)
                // console.log(response)
            })
            .catch(error => {   
                console.log(error)
            })
    }, [])

    // useEffect(() => {
    //     if((context) && ((!vagas) || vagas.length === 0 || (!Object.keys(vagas).length)))
    //     {
    //         setVagas(context.abertas)
    //     }
    // }, [context])
    
    return (
        <DataTableVagas vagas={vagas} />
    )
}

export default VagasAbertas