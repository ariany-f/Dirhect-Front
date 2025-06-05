import Botao from "@components/Botao"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import { Link, useNavigate } from "react-router-dom"
import Success from '@assets/Sucess.svg'

function RedefinirSenhaSucesso() {
    
    const navegar = useNavigate()

    return (
        <>
            <Frame gap="16px" alinhamento="center">
                <img width="100px" src={Success}/>
                <Titulo >
                    <h2>Senha redefinida</h2>
                    <SubTitulo>
                        Acesso sua conta e ofereça os melhores benefícios aos seus colaboradores
                    </SubTitulo>
                </Titulo>
            </Frame>
            <Botao aoClicar={() =>navegar('/login')} estilo="vermilion" size="medium" filled>Acessar minha plataforma</Botao>
        </>
    )
}

export default RedefinirSenhaSucesso