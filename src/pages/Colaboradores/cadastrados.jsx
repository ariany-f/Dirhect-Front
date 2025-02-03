import DataTableColaboradores from '@components/DataTableColaboradores'
import http from '@http'
import Loading from '@components/Loading'
// import collaborators from '@json/colaboradores.json'
import { useEffect, useState } from "react";
import { useOutletContext } from 'react-router-dom';

function ColaboradoresCadastrados() {
    
    const [loading, setLoading] = useState(false)
    const context = useOutletContext();
    const [colaboradores, setColaboradores] = useState([])

    useEffect(() => {
        if(context && (colaboradores.length === 0))
        {
            setColaboradores(context)
        }
    }, [colaboradores, context])

    return (
        <>
            <Loading opened={loading} />
            <DataTableColaboradores colaboradores={colaboradores} />
        </>
    )
}

export default ColaboradoresCadastrados