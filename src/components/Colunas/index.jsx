import styled from 'styled-components';

// Breakpoints para responsividade
const breakpoints = {
    mobile: '760px',
};

// Coluna base com propriedades comuns
const ColBase = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${props => props.$gap || '16px'};
    padding: ${props => props.$padding || '0'};
    justify-content: ${props => props.$justify || 'flex-start'};
    align-items: ${props => props.$align || 'flex-start'};
    width: ${props => props.$width || '100%'};
`;

// Coluna 12 (100% width)
export const Col12 = styled(ColBase)`
    width: 100%;
`;

// Coluna 11 (91.66% width)
export const Col11 = styled(ColBase)`
    flex: 1 1 91.66%;
    max-width: 91.66%;

    @media screen and (max-width: ${breakpoints.mobile}) {
        flex: 1 1 100%;
        max-width: 100%;
    }
`;

// Coluna 10 (83.33% width)
export const Col10 = styled(ColBase)`
    flex: 1 1 83.33%;
    max-width: 83.33%;

    @media screen and (max-width: ${breakpoints.mobile}) {
        flex: 1 1 100%;
        max-width: 100%;
    }
`;

// Coluna 9 (75% width)
export const Col9 = styled(ColBase)`
    flex: 1 1 75%;
    max-width: 75%;

    @media screen and (max-width: ${breakpoints.mobile}) {
        flex: 1 1 100%;
        max-width: 100%;
    }
`;

// Coluna 8 (66.66% width)
export const Col8 = styled(ColBase)`
    flex: 1 1 66.66%;
    max-width: 66.66%;

    @media screen and (max-width: ${breakpoints.mobile}) {
        flex: 1 1 100%;
        max-width: 100%;
    }
`;

// Coluna 7 (58.33% width)
export const Col7 = styled(ColBase)`
    flex: 1 1 58.33%;
    max-width: 58.33%;

    @media screen and (max-width: ${breakpoints.mobile}) {
        flex: 1 1 100%;
        max-width: 100%;
    }
`;

// Coluna 6 (50% width)
export const Col6 = styled(ColBase)`
    flex: 1 1 calc(50% - ${props => props.$gap || '8px'});
    max-width: calc(50% - ${props => props.$gap || '8px'});

    @media screen and (max-width: ${breakpoints.mobile}) {
        flex: 1 1 100%;
        max-width: 100%;
    }
`;

// Coluna 5 (41.66% width)
export const Col5 = styled(ColBase)`
    flex: 1 1 41.66%;
    max-width: 41.66%;

    @media screen and (max-width: ${breakpoints.mobile}) {
        flex: 1 1 100%;
        max-width: 100%;
    }
`;

// Coluna 4 (33.33% width)
export const Col4 = styled(ColBase)`
    flex: 1 1 calc(33.33% - ${props => props.$gap || '8px'});
    max-width: calc(33.33% - ${props => props.$gap || '8px'});

    @media screen and (max-width: ${breakpoints.mobile}) {
        flex: 1 1 100%;
        max-width: 100%;
    }
`;

// Coluna 3 (25% width)
export const Col3 = styled(ColBase)`
    flex: 1 1 calc(25% - ${props => props.$gap || '8px'});
    max-width: calc(25% - ${props => props.$gap || '8px'});

    @media screen and (max-width: ${breakpoints.mobile}) {
        flex: 1 1 100%;
        max-width: 100%;
    }
`;

// Coluna 2 (16.66% width)
export const Col2 = styled(ColBase)`
    flex: 1 1 16.66%;
    max-width: 16.66%;

    @media screen and (max-width: ${breakpoints.mobile}) {
        flex: 1 1 100%;
        max-width: 100%;
    }
`;

// Coluna 1 (8.33% width)
export const Col1 = styled(ColBase)`
    flex: 1 1 8.33%;
    max-width: 8.33%;

    @media screen and (max-width: ${breakpoints.mobile}) {
        flex: 1 1 100%;
        max-width: 100%;
    }
`;

// Variações com alinhamento centralizado
export const Col6Centered = styled(Col6)`
    justify-content: center;
    align-items: center;
`;

export const Col4Centered = styled(Col4)`
    justify-content: center;
    align-items: center;
`;

// Variação com input
export const Col6Input = styled(Col6)`
    flex: 1;
    width: 50%;
`;

// Container para agrupar colunas
export const ColContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${props => props.$gap || '16px'};
    padding: ${props => props.$padding || '0'};
    width: 100%;
    justify-content: ${props => props.$justify || 'flex-start'};
    align-items: ${props => props.$align || 'flex-start'};
`;

// Variação específica para o grid do marketplace
export const ColGrid = styled(ColBase)`
    flex: 1 1 calc(25% - 16px); /* 4 colunas */
    max-width: calc(25% - 16px);
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    @media (max-width: 1240px) {
        flex: 1 1 calc(33.333% - 16px); /* 3 colunas */
        max-width: calc(33.333% - 16px);
    }

    @media (max-width: 900px) {
        flex: 1 1 calc(50% - 16px); /* 2 colunas */
        max-width: calc(50% - 16px);
    }

    @media (max-width: 600px) {
        flex: 1 1 100%; /* 1 coluna */
        max-width: 100%;
    }
`; 