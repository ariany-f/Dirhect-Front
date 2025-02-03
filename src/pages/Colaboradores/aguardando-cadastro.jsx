import DataTableColaboradores from '@components/DataTableColaboradores'
import http from '@http'
import Loading from '@components/Loading'
import { useEffect, useState } from "react";

function ColaboradoresAguardando() {
    
    const [loading, setLoading] = useState(false)
    const [colaboradores, setColaboradores] = useState([])

    useEffect(() => {
    }, [])
    
    return (
        <DataTableColaboradores colaboradores={colaboradores} />
    )
}

export default ColaboradoresAguardando