import Titulo from '@components/Titulo'
import QuestionCard from '@components/QuestionCard'
import { AiFillQuestionCircle } from 'react-icons/ai'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import http from '@http'
import Loading from '@components/Loading'
import DataTablePedidos from '../../../components/DataTablePedidos'

const DivPrincipal = styled.div`
    width: 65vw;
`

function ColaboradorPedidos() {

    let { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [pedidos, setPedidos] = useState(null)

    useEffect(() => {
            
        
    }, [pedidos])

    return (
        <>
            <Loading opened={loading} />
            <Titulo>
                <h6>Pedidos</h6>
            </Titulo>
            <DataTablePedidos pedidos={pedidos} colaborador={id}/>
        </>
    )
}

export default ColaboradorPedidos