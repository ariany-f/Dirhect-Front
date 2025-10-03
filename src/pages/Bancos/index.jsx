import { Link, Outlet } from "react-router-dom"
import { BancosProvider } from "@contexts/Bancos"
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
function Bancos() {

    const [loading, setLoading] = useState(false)
    const [bancos, setBancos] = useState(null)

    useEffect(() => {

        setLoading(true)

        http.get('banco/?format=json')
            .then(response => {
                setBancos(response)
            })
            .catch(erro => {
                
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    return (
        <BancosProvider>
            <Loading opened={loading} />
            <Outlet context={bancos} />
        </BancosProvider>
    )
}

export default Bancos