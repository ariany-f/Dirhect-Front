import Frame from "@components/Frame"
import Item from "@components/Item"
import Texto from "@components/Texto"

function RegrasCriacaoSenha() {
    return (
        <Frame estilo="vermilion" padding="16px">
            <Texto weight="800">Regras para criação de senha:</Texto>
            <Item>A senha deve conter pelo menos 8 caracteres</Item>
            <Item>A senha deve conter pelo menos 1 letra maiúscula</Item>
            <Item>A senha deve conter pelo menos 1 letra minúscula</Item>
            <Item>A senha deve conter pelo menos 1 número</Item>
            <Item>A senha deve conter pelo menos 1 caractere especial</Item>
        </Frame>
    )
}

export default RegrasCriacaoSenha