import { useEffect, useRef, useState } from "react"
import BrandColors from '@utils/brandColors';
import styled from "styled-components"

const Overlay = styled.div`
    background-color: rgba(255,255,255,0.60);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9;
`

const LogoDiv = styled.div`
    margin: auto;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`
const LogoWrapper = styled.div`
    position: relative;
    width: 50px;
    height: 50px;
`;

const LogoImg = styled.img`
    width: 50px;
    height: 50px;
    object-fit: contain;
    filter: grayscale(1);
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
`;

const LogoColorFill = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    height: 50px;
    background: linear-gradient(
        to right,
        var(--primaria) ${({ $progress }) => $progress * 100}%,
        transparent ${({ $progress }) => $progress * 100}%
    );
    mask-image: url(${props => props.$logo});
    mask-size: cover;
    mask-repeat: no-repeat;
    -webkit-mask-image: url(${props => props.$logo});
    -webkit-mask-size: cover;
    -webkit-mask-repeat: no-repeat;
    pointer-events: none;
    user-select: none;
    transition: background 0.3s;
`;

function Loading({ opened = false }) {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        if (!opened) return;
        let raf;
        let last = Date.now();
        const animate = () => {
            const now = Date.now();
            const delta = (now - last) / 1000;
            last = now;
            setProgress(prev => {
                let next = prev + delta * 0.5; // velocidade
                if (next >= 1) next = 0; // reinicia para repetir
                return next;
            });
            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        return () => raf && cancelAnimationFrame(raf);
    }, [opened]);

    return (
        opened &&
        <Overlay>
            <LogoDiv>
                <LogoWrapper>
                    <LogoImg src={BrandColors.getLoadingLogo()} alt="Logo" />
                    <LogoColorFill
                        $progress={progress}
                        $logo={BrandColors.getLoadingLogo()}
                    />
                </LogoWrapper>
            </LogoDiv>
        </Overlay>
    );
}

export default Loading