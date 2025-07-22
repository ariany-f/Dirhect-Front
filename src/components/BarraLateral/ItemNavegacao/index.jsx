import styled from "styled-components"

const ItemEstilizado = styled.li`
    display: flex;
    padding: 10px 30px;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    color: var(--white);
    font-weight: 500;
    font-size: ${props => props.$isLongText ? '13px' : '14px'};
    line-height: 150%;
    background-color: ${props => props.$ativo ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
    transition: background-color 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    @media screen and (max-width: 768px) {
        padding: 14px 24px;
        width: 100%;
        justify-content: flex-start;
    }
`

function ItemNavegacao({ children, ativo = false }) {
    // Verifica se algum texto filho é muito longo
    const isLongText = Array.isArray(children) && children.some(child => 
        typeof child === 'string' && child.length > 18
    );
    
    return (
        <ItemEstilizado $ativo={ativo} $isLongText={isLongText}>
            {children}
        </ItemEstilizado>
    )
}

export default ItemNavegacao