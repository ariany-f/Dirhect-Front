import MainSection from "@components/MainSection"
import EstilosGlobais from '@components/GlobalStyles'
import BarraLateral from "@components/BarraLateral"
import Cabecalho from "@components/Cabecalho"
import MainContainer from "@components/MainContainer"
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"
import ModalCnpj from '@components/ModalCnpj'
import { useEffect, useState } from "react"

function Autenticado() {

    const {
        usuarioEstaLogado
    } = useSessaoUsuarioContext()

    const navegar = useNavigate()

    useEffect(() => {
        if(!usuarioEstaLogado) {
            navegar('/login')
        }
    })
    
    
    const selectCompany = () => {
        setModalOpened(true)
    }

    const [modalOpened, setModalOpened] = useState(false)
    const [menuOpened, setMenuOpened] = useState(false)

    
    function toggleMenu(){
        setMenuOpened(!menuOpened)
    }
    
    function fechaMenu(){
        if(menuOpened)
        {
            setMenuOpened(false)
        }
    }
    
    return (
        <>
        {usuarioEstaLogado ?
            <>
                <EstilosGlobais />
                <MainSection>
                    <BarraLateral />
                    <MainContainer aoClicar={fechaMenu} align="flex-start" padding="2.5vh 5vw">
                        <Cabecalho setMenuOpened={toggleMenu} menuOpened={menuOpened} aoClicar={selectCompany} nomeEmpresa="Soluções Industriais Ltda" />
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