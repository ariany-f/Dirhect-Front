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
import styled from "styled-components"

const MarginContainer = styled.div`
    display: inline-flex;
    flex-direction: column;
    height: initial;
    align-items: flex-start;
    margin: 0 6vw;
`

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
                    {location.pathname !== '/beneficio/editar-valor/departamentos' && location.pathname !== '/saldo-livre/editar-valor/departamentos' && location.pathname !== '/beneficio/editar-valor/colaboradores' && location.pathname !== '/saldo-livre/editar-valor/colaboradores' &&                       
                        <BarraLateral />
                    }
                    <MainContainer aoClicar={fechaMenu} align="flex-start" padding="2.5vh 0 7.5vh 0">
                        {location.pathname !== '/beneficio/editar-valor/departamentos' && location.pathname !== '/saldo-livre/editar-valor/departamentos' && location.pathname !== '/beneficio/editar-valor/colaboradores' && location.pathname !== '/saldo-livre/editar-valor/colaboradores' &&     
                            <Cabecalho setMenuOpened={toggleMenu} menuOpened={menuOpened} aoClicar={selectCompany} nomeEmpresa={empresa} />
                        }
                        <MarginContainer>
                            <Outlet />
                        </MarginContainer>
                    </MainContainer>
                </MainSection>
                <ModalCnpj aoFechar={() => setModalOpened(false)} opened={modalOpened} />
            </>
        : <Navigate to="/login" replace={true}/>}
        </>
    )
}
export default Autenticado