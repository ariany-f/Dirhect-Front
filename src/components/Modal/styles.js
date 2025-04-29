import styled from 'styled-components';

export const Overlay = styled.div`
    background-color: rgba(0,0,0,0.80);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(2px);
`;

export const DialogEstilizado = styled.dialog`
    display: flex;
    width: 40vw;
    min-width: 500px;
    max-width: 800px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    border: none;
    margin: 0 auto;
    padding: 24px;
    background: white;
    z-index: 1001;
    position: relative;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
    will-change: transform;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    
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
        
        & .fechar {
            box-sizing: initial;
            fill: var(--primaria);
            stroke: var(--primaria);
            color: var(--primaria);
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
    z-index: 9;
    opacity: ${props => props.$opened ? 1 : 0};
    transition: visibility 0.5s ease-in-out;
    visibility: ${props => props.$opened ? 'visible' : 'hidden'};
    pointer-events: ${props => props.$opened ? 'all' : 'none'};
`;

export const DialogEstilizadoRight = styled.dialog`
    display: flex;
    width: 70vw;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    border: none;
    z-index: 10;
    top: 3vh;
    left: ${props => props.$opened ? '29vw' : '100vw'};
    height: 94vh;
    padding: 24px;
    transition: left 0.3s ease-in-out;
    background: white;
    
    & button.close {
        & .fechar {
            box-sizing: initial;
            fill: var(--primaria);
            stroke: var(--primaria);
            color: var(--primaria);
        }
        position: absolute;
        right: 20px;
        top: 20px;
        cursor: pointer;
        border: none;
        background-color: initial;
    }
    
    & .icon {
        margin-right: 5px;
        box-sizing: initial;
        fill: var(--primaria);
        stroke: var(--primaria);
        color: var(--primaria);
    }
`; 