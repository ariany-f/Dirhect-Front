import Frame from "@components/Frame"
import Item from "@components/Item"
import Texto from "@components/Texto"

function RegrasCriacaoSenha() {
    return (
        <Frame estilo="vermilion" padding="16px">
            <Texto weight="800">Regras para criação de senha:</Texto>
            <Item>A senha deve conter pelo menos 6 caracteres</Item>
        </Frame>
    )
}

export default RegrasCriacaoSenha