import Titulo from '@components/Titulo'
import QuestionCard from '@components/QuestionCard'
import { AiFillQuestionCircle } from 'react-icons/ai'

function ColaboradorSaldo() {
    return (
        <>
            <Titulo>
                <QuestionCard alinhamento="start" element={<h6>Benefícios</h6>}>
                    <AiFillQuestionCircle className="question-icon" size={20} />
                </QuestionCard>
            </Titulo>
        </>
    )
}

export default ColaboradorSaldo