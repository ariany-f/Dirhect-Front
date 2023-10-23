import { useNavigate } from "react-router-dom"
import styled from "styled-components";
import { MdKeyboardArrowLeft } from "react-icons/md"

const Anchor = styled.a`
    color: var(--primaria);
    font-weight: 700;
    text-decoration: none;
    font-family: var(--fonte-primaria);
    font-size: 14px;
    display: flex;
    cursor: pointer;
    align-items: center;
    & .icon {
        fill: var(--primaria);
    }
`

function BotaoVoltar() {

    const navigate = useNavigate();

    return (
        <Anchor onClick={() => navigate(-1)}>
            <MdKeyboardArrowLeft size={18} className="icon"/>&nbsp;Voltar
        </Anchor>
    )
}

export default BotaoVoltar