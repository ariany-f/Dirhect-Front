import {styled} from "styled-components";

const Paragrafo = styled.p`
    color: ${ props => props.$color};
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: var(--font-secondaria);
    font-size: 14px;
    font-style: normal;
    font-weight: ${ props => props.$weight ? props.$weight : '400' };
    text-align: ${ props => props.$alinhamento ? props.$alinhamento : 'left' };
    line-height: 20px; /* 142.857% */
    align-items: center;
    display: flex;
`

function Texto({ children, weight = 400, color = 'var(--black)'}) {
    return (
        <Paragrafo $color={color} $weight={Number(weight)}>
            {children}
        </Paragrafo>
    )
}

export default Texto