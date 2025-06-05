import Frame from "@components/Frame"
import Item from "@components/Item"
import Texto from "@components/Texto"
import { FaCheck, FaCheckCircle, FaRegCheckCircle, FaRegTimesCircle, FaTimes, FaTimesCircle } from "react-icons/fa"

function RegrasCriacaoSenha({ senha = "" }) {
    // Regras
    const regras = [
        {
            texto: "A senha deve conter pelo menos 8 caracteres",
            valida: senha.length >= 8
        },
        {
            texto: "A senha deve conter pelo menos 1 letra maiúscula",
            valida: /[A-Z]/.test(senha)
        },
        {
            texto: "A senha deve conter pelo menos 1 letra minúscula",
            valida: /[a-z]/.test(senha)
        },
        {
            texto: "A senha deve conter pelo menos 1 número",
            valida: /[0-9]/.test(senha)
        },
        {
            texto: "A senha deve conter pelo menos 1 caractere especial",
            valida: /[!@#$%^&*]/.test(senha)
        }
    ]

    return (
        <Frame estilo="vermilion" padding="16px">
            <Texto weight="800">Regras para criação de senha:</Texto>
            {regras.map((regra, idx) => (
                <Item key={idx} style={{display: "flex", alignItems: "center", gap: 8, justifyContent: "center"}}>
                    <span style={{ marginRight: 4 }}>{regra.texto}</span>
                    {regra.valida
                        ? <FaRegCheckCircle fill="green" size={18} />
                        : <FaRegTimesCircle fill="#d32f2f" size={18} />
                    }
                </Item>
            ))}
        </Frame>
    )
}

export default RegrasCriacaoSenha