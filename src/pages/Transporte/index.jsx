import { TransporteProvider } from "@contexts/Transporte"
import { useState } from "react"
import Loading from '@components/Loading'
import styled from "styled-components"
import { Outlet } from "react-router-dom"

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

function Transporte() {
    const [loading, setLoading] = useState(false)

    if (loading) {
        return <Loading opened={loading} />
    }

    return (
        <TransporteProvider>
            <ConteudoFrame>
                <Outlet />
            </ConteudoFrame>
        </TransporteProvider>
    )
}

export default Transporte

