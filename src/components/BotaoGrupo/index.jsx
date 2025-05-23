import styled from "styled-components"

const Grupo = styled.div`
    display: flex;
    flex-wrap: ${props => props.$wrap ? 'wrap' : 'nowrap'};
    gap: ${ props => props.$gap ? props.$gap : '16px' };
    justify-content: ${ props => props.$align ? props.$align : 'center'};
    align-items: ${ props => props.$verticalalign ? props.$verticalalign : 'center'};
    @media screen and (max-width: 760px) {
        flex-wrap: ${props => props.$tabs ? 'nowrap' : 'wrap'};
        gap: 12px;
        overflow-x: ${props => props.$tabs ? 'scroll' : 'hidden'};
        width: ${props => props.$tabs ? '100%' : 'initial'};
        max-width: ${props => props.$tabs ? '100%' : 'initial'};
        
        ${props => props.$align === 'space-between' && `
            justify-content: flex-start;
            & > * {
                width: 100%;
            }
            & .p-input-icon-left {
                width: 100%;
            }
            & input {
                width: 100% !important;
            }
        `}
    }
`;

function BotaoGrupo({ children, tabs = false, align = 'start', verticalalign = 'center', gap = '16px', wrap = false }) {
    return (
        <Grupo $wrap={wrap} $tabs={tabs} $verticalalign={verticalalign} $align={align} $gap={gap}>
            {children}
        </Grupo>
    )
}

export default BotaoGrupo