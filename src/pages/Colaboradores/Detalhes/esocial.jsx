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
import DataTableESocial from '../../../components/DataTableESocial'

const DivPrincipal = styled.div`
    width: 65vw;
`

function ColabroadorESocial() {

    let { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [historico, setHistorico] = useState(null)

    useEffect(() => {
            
        
    }, [historico])

    return (
        <DivPrincipal>
            <Loading opened={loading} />
            <Titulo>
                <QuestionCard alinhamento="start" element={<h6>ESocial</h6>}>
                    <AiFillQuestionCircle className="question-icon" size={20} />
                </QuestionCard>
            </Titulo>
            <DataTableESocial historico={historico}/>
        </DivPrincipal>
    )
}

export default ColabroadorESocial