import Titulo from '@components/Titulo'
import { AiFillQuestionCircle } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const QuestionCard = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    & .question-icon {
        cursor: pointer;
    }
`

function ColaboradorSaldo() {
    return (
        <>
            <Titulo>
                <QuestionCard>
                    <h6>Benefícios</h6>
                    <AiFillQuestionCircle className="question-icon" size={20} />
                </QuestionCard>
            </Titulo>
        </>
    )
}

export default ColaboradorSaldo