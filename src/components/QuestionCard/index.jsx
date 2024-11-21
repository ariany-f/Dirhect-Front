import styled from "styled-components"

const QuestionDiv = styled.div`
    display: flex;
    align-items: center;
    color: ${ props => props.$cor ? props.$cor : 'var(--black)' };
    justify-content: ${ props => props.$alinhamento ? props.$alinhamento : 'space-between' };
    font-weight: 500;
    & .question-icon {
        margin-left: 8px;
        cursor: pointer;
    }
    & * {
        color: ${ props => props.$cor ? props.$cor : 'var(--black)' };
    }
`

function QuestionCard({ children, element, alinhamento, color='var(--black)' }) {
    return (
        <QuestionDiv $cor={color} $alinhamento={alinhamento}>
            {element}
            {children}
        </QuestionDiv>
    )
}
export default QuestionCard