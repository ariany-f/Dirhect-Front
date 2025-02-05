import Titulo from '@components/Titulo'
import QuestionCard from '@components/QuestionCard'
import { AiFillQuestionCircle } from 'react-icons/ai'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import http from '@http'
import Loading from '@components/Loading'
import DataTableDependentes from '@components/DataTableDependentes'
import DataTableFerias from '../../../components/DataTableFerias'

const DivPrincipal = styled.div`
    width: 65vw;
`

function ColabroadorFerias() {

    let { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [ferias, setFerias] = useState(null)

    useEffect(() => {
            
        
    }, [ferias])

    return (
        <DivPrincipal>
            <Loading opened={loading} />
            <Titulo>
                <QuestionCard alinhamento="start" element={<h6>Férias</h6>}>
                    <AiFillQuestionCircle className="question-icon" size={20} />
                </QuestionCard>
            </Titulo>
            <DataTableFerias ferias={ferias}/>
        </DivPrincipal>
    )
}

export default ColabroadorFerias