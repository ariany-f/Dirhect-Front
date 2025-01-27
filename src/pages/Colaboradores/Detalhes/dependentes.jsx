import Titulo from '@components/Titulo'
import QuestionCard from '@components/QuestionCard'
import { AiFillQuestionCircle } from 'react-icons/ai'
import styled from 'styled-components'
import DataTableCollaboratorBenefit from '../../../components/DataTableCollaboratorBenefit'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import http from '@http'

const DivPrincipal = styled.div`
    width: 65vw;
`

function ColaboradorDependentes() {

    let { id } = useParams()
    const [colaborador, setColaborador] = useState({})

    useEffect(() => {
        // if(colaborador.length === 0)
        // {
        //     http.get(`api/collaborator/show/${id}`)
        //         .then(response => {
        //             if (response.success) {
        //                 setColaborador(response.data)
        //             }
        //         })
        //         .catch(erro => console.log(erro))
        // }
    }, [colaborador])

    return (
        <DivPrincipal>
            <Titulo>
                <QuestionCard alinhamento="start" element={<h6>Dependentes</h6>}>
                    <AiFillQuestionCircle className="question-icon" size={20} />
                </QuestionCard>
            </Titulo>
            <DataTableCollaboratorBenefit beneficios={colaborador?.benefits}/>
        </DivPrincipal>
    )
}

export default ColaboradorDependentes