import styled from "styled-components"

const DivLine = styled.div`
    width: '100%';
    border-bottom: '1px dotted var(--neutro-300)';
    margin-top: ${ props => props.$margin ? props.$margin : '18px' };
`

function DottedLine({ margin = "18px" }) {
    return (
        <DivLine $margin={margin} />
    )
}

export default DottedLine