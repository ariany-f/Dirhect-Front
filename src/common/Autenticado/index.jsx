import MainSection from "@components/MainSection"
import EstilosGlobais from '@components/GlobalStyles'
import BarraLateral from "@components/BarraLateral"
import Cabecalho from "@components/Cabecalho"
import MainContainer from "@components/MainContainer"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"
import ModalCnpj from '@components/ModalCnpj'
import { useEffect, useState } from "react"
import http from '@http'
import { ArmazenadorToken } from "../../utils"

function Autenticado() {

    const {
        usuario,
        setCompanies,
        usuarioEstaLogado
    } = useSessaoUsuarioContext()

    const navegar = useNavigate()
    const [empresa, setEmpresa] = useState('')
    const location = useLocation()

    useEffect(() => {
        
        if(!usuarioEstaLogado) {
            navegar('/login')
        }
        else
        {
            if(usuario.companies.length === 0)
            {
                http.get(`api/dashboard/company`)
                    .then((response) => {
                        setCompanies(response.data.companies)
                    })
                    .catch(erro => {
                        console.log(erro)
                    })
            }
            else
            {
                usuario.companies.map(item => {
                    if(item.public_id === ArmazenadorToken.UserCompanyPublicId)
                    {
                        setEmpresa(item.name)
                    }
                })
            }
        }
    }, [usuarioEstaLogado, usuario])
    
    
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
                    {location.pathname !== '/beneficio/editar-valor' &&                     
                        <BarraLateral />
                    }
                    <MainContainer aoClicar={fechaMenu} align="flex-start" padding="2.5vh 5vw">
                        {location.pathname !== '/beneficio/editar-valor' &&   
                            <Cabecalho setMenuOpened={toggleMenu} menuOpened={menuOpened} aoClicar={selectCompany} nomeEmpresa={empresa} />
                        }
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