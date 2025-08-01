import styled from 'styled-components';

export const Overlay = styled.div`
    background-color: rgba(0,0,0,0.80);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(2px);
`;

export const DialogEstilizado = styled.dialog`
    display: flex;
    width: ${props => props.$width || '40vw'};
    min-width: ${props => props.$minWidth || '500px'};
    max-width: ${props => props.$maxWidth || '800px'};
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    border-radius: 16px;
    border: none;
    margin: 0 auto;
    padding: 24px;
    background: white;
    z-index: 1002;
    position: relative;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;   
    transition: all 0.3s ease-in-out;

    & > * {
        width: 100%;
    }

    & > form {
        width: 100%;
    }

    & .p-float-label {
        width: 100%;
    }

    & .p-inputtext {
        width: 100%;
    }
    
    @media screen and (max-width: 760px) {
        width: 100%;
        min-width: 100%;
        max-width: 100%;
        height: 100vh;
        max-height: 100vh;
        border-radius: 0;
        margin: 0;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    
    & button.close {
        position: absolute;
        right: 20px;
        top: 20px;
        cursor: pointer;
        border: none;
        background-color: transparent;
        padding: 8px;
        border-radius: 8px;
        transition: background-color 0.2s;
        z-index: 2;
        
        &:hover {
            background-color: var(--neutro-100);
        }
        
        & .fechar {
            box-sizing: initial;
            fill: var(--primaria);
            stroke: var(--primaria);
            color: var(--primaria);
            width: 20px;
            height: 20px;
        }

        @media screen and (max-width: 760px) {
            padding: 12px;
            right: 16px;
            top: 16px;

            & .fechar {
                width: 24px;
                height: 24px;
            }
        }
    }
`;

export const OverlayRight = styled.div`
    background-color: rgba(0,0,0,0.50);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    opacity: ${props => props.$opened ? 1 : 0};
    transition: visibility 0.5s ease-in-out;
    visibility: ${props => props.$opened ? 'visible' : 'hidden'};
    pointer-events: ${props => props.$opened ? 'all' : 'none'};
`;

export const DialogEstilizadoRight = styled.dialog`
    display: flex;
    width: ${props => props.$width || '70vw'};
    flex-direction: column;
    justify-content: space-between;
    align-items: ${props => props.$align || 'center'};
    border-radius: 5px;
    border: none;
    z-index: 1002;
    top: 3vh;
    left: ${({ $opened, $width }) => $opened 
        ? `calc(100vw - ${$width || '70vw'})` 
        : '100vw'};
    height: 94vh;
    padding: 24px;
    transition: left 0.3s ease-in-out;
    background: white;
    
    & button.close {
        position: absolute;
        right: 20px;
        top: 20px;
        cursor: pointer;
        border: none;
        background-color: transparent;
        padding: 8px;
        border-radius: 8px;
        transition: background-color 0.2s;
        
        &:hover {
            background-color: var(--neutro-100);
        }
        
        & .fechar {
            box-sizing: initial;
            fill: var(--primaria);
            stroke: var(--primaria);
            color: var(--primaria);
            width: 20px;
            height: 20px;
        }

        @media screen and (max-width: 760px) {
            padding: 12px;
            right: 16px;
            top: 16px;

            & .fechar {
                width: 24px;
                height: 24px;
            }
        }
    }
    
    & .icon {
        margin-right: 5px;
        box-sizing: initial;
        fill: var(--primaria);
        stroke: var(--primaria);
        color: var(--primaria);
    }
`; 