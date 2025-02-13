import Titulo from '@components/Titulo'
import QuestionCard from '@components/QuestionCard'
import { AiFillQuestionCircle } from 'react-icons/ai'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import http from '@http'
import Loading from '@components/Loading'
import meusCiclos from '@json/meusciclos.json'
import DataTableDependentes from '@components/DataTableDependentes'
import DataTableFerias from '../../../components/DataTableFerias'
import DataTableESocial from '../../../components/DataTableESocial'
import DataTableCiclos from '../../../components/DataTableCiclos'

const DivPrincipal = styled.div`
    width: 65vw;
`

function ColabroadorCiclos() {

    let { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [ciclos, setCiclos] = useState(null)

    useEffect(() => {
        if(!ciclos)
            {
                let cc = meusCiclos.filter(evento => evento.colaborador_id == id);
                if(cc.length > 0)
                {
                    setCiclos(cc)
                }
            }
        
    }, [ciclos])

    return (
        <>
            <Loading opened={loading} />
            <Titulo>
                <h6>Ciclos de Folha</h6>
            </Titulo>
            <DataTableCiclos ciclos={ciclos} colaborador={id}/>
        </>
    )
}

export default ColabroadorCiclos