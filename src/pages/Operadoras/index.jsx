import { Link, Outlet } from "react-router-dom"
import { OperadorasProvider } from "@contexts/Operadoras"
import { useEffect, useState } from "react"
import http from "@http"
import Loading from '@components/Loading'
import styled from "styled-components"

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function Operadoras() {

    const [loading, setLoading] = useState(false)
    const [operadoras, setOperadoras] = useState(null)

    useEffect(() => {

        setLoading(true)

        http.get('operadora/?format=json')
            .then(response => {
                setOperadoras(response)
            })
            .catch(erro => {
                
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    return (
        <OperadorasProvider>
            <Loading opened={loading} />
            <Outlet context={operadoras} />
        </OperadorasProvider>
    )
}

export default Operadoras