import Titulo from '@components/Titulo'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import http from '@http'
import Loading from '@components/Loading'
import movimentos from '@json/movimentos.json'
import DataTableMovimentos from '@components/DataTableMovimentos'

const DivPrincipal = styled.div`
    width: 65vw;
`

function ColaboradorMovimentos() {

    let { id } = useParams()
    const [loading, setLoading] = useState(false)
    // const [movimentos, setPedidos] = useState(null)

    useEffect(() => {
       
        // if(!movimentos)
        // {
        //     const pd = movimentosjson.filter(pedido => pedido.colaborador_id == id);
        //     setPedidos(pd)
        // }
        
    }, [movimentos])

    return (
        <>
            <Loading opened={loading} />
            <Titulo>
                <h6>Movimentação</h6>
            </Titulo>
            <DataTableMovimentos movimentos={movimentos} colaborador={id}/>
        </>
    )
}

export default ColaboradorMovimentos