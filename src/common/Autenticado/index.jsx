import MainSection from "@components/MainSection"
import EstilosGlobais from '@components/GlobalStyles'
import BarraLateral from "@components/BarraLateral"
import Cabecalho from "@components/Cabecalho"
import MainContainer from "@components/MainContainer"
import { Navigate, Outlet } from "react-router-dom"
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"
import ModalCnpj from '@components/ModalCnpj'
import { useState } from "react"

function Autenticado() {

    const {
        usuarioEstaLogado
    } = useSessaoUsuarioContext()
    
    
    const selectCompany = () => {
        setModalOpened(true)
    }

    const [modalOpened, setModalOpened] = useState(false)
    
    return (
        <>
        {usuarioEstaLogado ?
            <>
                <EstilosGlobais />
                <MainSection>
                    <BarraLateral />
                    <MainContainer align="flex-start" padding="2.5vh 5vw">
                        <Cabecalho aoClicar={selectCompany} nomeEmpresa="Soluções Industriais Ltda" />
                        <Outlet />
                    </MainContainer>
                </MainSection>
                <ModalCnpj aoFechar={() => setModalOpened(false)} opened={modalOpened} />
            </>
        : <Navigate to="/login" replace={true}/>}
        </>
    )
}
export default Autenticado