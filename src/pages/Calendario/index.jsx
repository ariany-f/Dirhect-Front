import { Link, Outlet } from "react-router-dom"
import { CalendariosProvider } from "@contexts/Calendarios"
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
function Calendarios() {

    const [loading, setLoading] = useState(false)
    const [calendarios, setCalendarios] = useState(null)

    useEffect(() => {

        setLoading(true)

        http.get('calendario/?format=json')
            .then(response => {
                setCalendarios(response)
            })
            .catch(erro => {
                
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    return (
        <CalendariosProvider>
            <Loading opened={loading} />
            <Outlet context={calendarios} />
        </CalendariosProvider>
    )
}

export default Calendarios