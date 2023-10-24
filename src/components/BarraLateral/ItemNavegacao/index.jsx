import { styled } from "styled-components"

const ItemListaEstilizado = styled.li`
    width: -webkit-fill-available;
    display: flex;
    cursor: pointer;
    color: ${ props => props.$ativo ? 'var(--secundaria)' : 'var(--white)' };
    font-family: var(--fonte-secundaria);
    align-items: center;
    padding: 13px 30px;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px; /* 142.857% */
    gap: 12px;
    border-right: ${ props => props.$ativo ? '3px solid var(--secundaria)' : 'none' };

    & .icon {
        fill: ${ props => props.$ativo ? 'var(--secundaria)' : 'var(--white)' };
        color: ${ props => props.$ativo ? 'var(--secundaria)' : 'var(--white)' };
    }
    
    & .icon *{
        fill: ${ props => props.$ativo ? 'var(--secundaria)' : 'var(--white)' };
        color: ${ props => props.$ativo ? 'var(--secundaria)' : 'var(--white)' };
    }

    &:hover{
        color: var(--secundaria);
    }
`

const ItemNavegacao = ({children, ativo = false}) => {
    return <ItemListaEstilizado $ativo={ativo}>
        {children}
    </ItemListaEstilizado>
}

export default ItemNavegacao