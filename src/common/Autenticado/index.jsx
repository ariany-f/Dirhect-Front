import MainSection from "@components/MainSection"
import EstilosGlobais from '@components/GlobalStyles';
import BarraLateral from "@components/BarraLateral"
import Cabecalho from "@components/Cabecalho"
import MainContainer from "@components/MainContainer"
import { Navigate, Outlet } from "react-router-dom";
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario";

function Autenticado() {

    const {
        usuarioEstaLogado
    } = useSessaoUsuarioContext()

    return (
        <>
        {usuarioEstaLogado ?
            <>
                <EstilosGlobais />
                <MainSection>
                    <BarraLateral />
                    <MainContainer align="flex-start" padding="2.5vh 5vw">
                        <Cabecalho nomeEmpresa="Soluções Industriais Ltda" />
                        <Outlet />
                    </MainContainer>
                </MainSection>
            </>
        : <Navigate to="/login" replace={true}/>}
        </>
    )
}
export default Autenticado