import Titulo from '@components/Titulo'
import QuestionCard from '@components/QuestionCard'
import { AiFillQuestionCircle } from 'react-icons/ai'
import styled from 'styled-components'

const DivPrincipal = styled.div`
    width: 65vw;
`

function ColaboradorSaldo() {
    return (
        <DivPrincipal>
            <Titulo>
                <QuestionCard alinhamento="start" element={<h6>Benefícios</h6>}>
                    <AiFillQuestionCircle className="question-icon" size={20} />
                </QuestionCard>
            </Titulo>
        </DivPrincipal>
    )
}

export default ColaboradorSaldo