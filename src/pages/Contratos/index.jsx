import { Outlet } from "react-router-dom"
import { ContratosProvider } from "../../contexts/Contratos"
import { useEffect, useState } from "react"
import http from "../../http"
import Loading from '@components/Loading'

function Contratos() {

    const [loading, setLoading] = useState(false)
    const [contratos, setContratos] = useState(null)

    useEffect(() => {
        
    }, [contratos])

    return (
        <ContratosProvider>
            <Loading opened={loading} />
            <Outlet context={contratos} />
        </ContratosProvider>
    )
}

export default Contratos