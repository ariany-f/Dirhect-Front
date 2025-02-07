import MainSection from "@components/MainSection"
import EstilosGlobais from '@components/GlobalStyles'
import BarraLateral from "@components/BarraLateral"
import Cabecalho from "@components/Cabecalho"
import Botao from "@components/Botao"
import MainContainer from "@components/MainContainer"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"
import ModalCnpj from '@components/ModalCnpj'
import { useEffect, useState } from "react"
import Loading from '@components/Loading'
import http from '@http'
import companies from '@json/empresas.json'
import { ArmazenadorToken } from "../../utils"
import styled from "styled-components"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"


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
    
    const [selected, setSelected] = useState(usuario.company_public_id ?? ArmazenadorToken.UserCompanyPublicId ?? '')
    
    let comp = companies;

    if(selected)
    {
        comp = companies.filter(company => company.public_id === selected);
    }

    const [empresa, setEmpresa] = useState(comp[0].social_reason)
    const location = useLocation()

    useEffect(() => {
        
        // if(!usuarioEstaLogado) 
        // {
        //     //navegar('/login')
        // }
        // else
        // {
        //     // if(!usuario.companies || usuario.companies.length === 0)
        //     // {
        //     //     // http.get(`api/auth/me`)
        //     //     //     .then((response) => {
        //     //     //         if(response.success)
        //     //     //         {
        //     //     //             setCompanies(response.data.user.companies)
        //     //     //         }
        //     //     //     })
        //     //     //     .catch(erro => {
        //     //     //         console.log(erro)
        //     //     //     })
        //     // }
        //     // else
        //     // {
        //     //     usuario.companies.map(item => {
        //     //         if(item.public_id === ArmazenadorToken.UserCompanyPublicId)
        //     //         {
        //     //             // setEmpresa(item.social_reason)
        //     //         }
        //     //     })
        //     // }
        // }
    }, [usuarioEstaLogado, usuario, empresa])
    
    
    const selectCompany = () => {
        setModalOpened(true)
    }

    const changeCompany = () => {

        setLoading(true)

        setSelected(usuario.company_public_id ?? ArmazenadorToken.UserCompanyPublicId ?? '')
    
        let comp = companies;
    
        if(selected)
        {
            comp = companies.filter(company => company.public_id === selected);
        }
    
        setEmpresa(comp[0].social_reason)
    }

    const [modalOpened, setModalOpened] = useState(false)
    const [menuOpened, setMenuOpened] = useState(false)
    const [loading, setLoading] = useState(false)

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
                <Loading opened={loading} />
                {location.pathname !== '/beneficio/editar-valor/departamentos' && location.pathname !== '/linhas-transporte/editar-valor/departamentos' && location.pathname !== '/beneficio/editar-valor/colaboradores' && location.pathname !== '/linhas-transporte/editar-valor/colaboradores' &&                       
                    <BarraLateral />
                }
                <MainContainer aoClicar={fechaMenu} align="flex-start" padding="2.5vh 0 7.5vh 0">
                    {location.pathname !== '/beneficio/editar-valor/departamentos' && location.pathname !== '/linhas-transporte/editar-valor/departamentos' && location.pathname !== '/beneficio/editar-valor/colaboradores' && location.pathname !== '/linhas-transporte/editar-valor/colaboradores' &&     
                        <>
                            <Cabecalho setMenuOpened={toggleMenu} menuOpened={menuOpened} aoClicar={selectCompany} nomeEmpresa={empresa} />
                        </>
                    }
                    <MarginContainer>
                        <Outlet key={empresa} />
                    </MarginContainer>
                </MainContainer>
                <Analytics />
                <SpeedInsights />
            </MainSection>
            <ModalCnpj aoClicar={() => changeCompany()} aoFechar={() => {setModalOpened(false); setLoading(false)}} opened={modalOpened} />
        </>
        : <Navigate to="/login" replace={true}/>
        } </>
    )
}
export default Autenticado