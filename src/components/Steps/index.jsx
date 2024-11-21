import styled from "styled-components"

const ProgressSteps = styled.div`
    width: 100%;
    display: flex;
    gap: 8px;
    margin-top: 8px;
`

const StepPreenchido = styled.div`
    border-radius: 50px;
    width: 120px;
    height: 4px;
    background-color: var(--primaria);
`

const Step = styled.div`
    border-radius: 50px;
    width: 120px;
    height: 4px;
    background-color: var(--neutro-50);
`

function Steps({total, atual}){
    let rows = []
    for (let i = 0; i < total; i++) {
        rows.push( (i < atual) ? <StepPreenchido key={i} /> : <Step key={i} /> )
    }
    return (
        <ProgressSteps>
        {rows}
        </ProgressSteps>
    )
}
export default Steps