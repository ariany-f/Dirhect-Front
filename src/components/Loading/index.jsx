import Puff from "react-loading-icons/dist/esm/components/puff"
import styled from "styled-components"

const Overlay = styled.div`
    background-color: rgba(255,255,255,0.60);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
`

const IconDiv = styled.div`
    margin: auto;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

function Loading({ opened = false }) {
    return (
        <>
        {
            opened &&
            <Overlay>
                <IconDiv>
                    <Puff stroke="var(--primaria)" />
                </IconDiv>
            </Overlay>
        }
        </>
    )
}

export default Loading