import MainSection from "@components/MainSection"
import EstilosGlobais from '@components/GlobalStyles'
import BarraLateral from "@components/BarraLateral"
import Cabecalho from "@components/Cabecalho"
import Botao from "@components/Botao"
import MainContainer from "@components/MainContainer"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import ModalCnpj from '@components/ModalCnpj'
import { useEffect, useState } from "react"
import Loading from '@components/Loading'
import http from '@http'
import { ArmazenadorToken } from "@utils"
import styled from "styled-components"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import BottomMenu from '@components/BottomMenu'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const MarginContainer = styled.div`
    display: inline-flex;
    flex-direction: column;
    height: initial;
    align-items: flex-start;
    margin: 0 4vw;
    padding-top: 14vh;
    padding-bottom: 4vh;
`

function Autenticado() {   
    
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
    const query = useQuery();

    useEffect(() => {
        if(query.get("tenant"))
        {
            ArmazenadorToken.definirCompany('', query.get("tenant"))
        }
    }, []);

    const {
        usuario,
        setCompanies,
        setSessionCompany,
        setCompanyDomain,
        setCompanySymbol,
        setCompanyLogo,
        usuarioEstaLogado
    } = useSessaoUsuarioContext()

    const navegar = useNavigate()
    const [empresas, setEmpresas] = useState(usuario.companies ?? null)
    const [tenants, setTenants] = useState(null)
    const [selected, setSelected] = useState(ArmazenadorToken.UserCompanyPublicId ?? ArmazenadorToken.UserCompanyPublicId ?? '')
    const [empresa, setEmpresa] = useState('')
    const [simbolo, setSimbolo] = useState(ArmazenadorToken.UserCompanySymbol ?? '')
    const [logo, setLogo] = useState(ArmazenadorToken.UserCompanyLogo ?? '')
    const [modalOpened, setModalOpened] = useState(false)
    const [menuOpened, setMenuOpened] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sidebarOpened, setSidebarOpened] = useState(window.innerWidth > 760)

    const location = useLocation()

    useEffect(() => {
        const handleResize = () => {
            setSidebarOpened(window.innerWidth > 760)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {        
        if((!tenants) && ((!empresas) || empresas.length == 0))
        {
             // Buscar clientes
             http.get(`cliente/?format=json`)
             .then(async (response) => {
                 let clientes = response; // Supondo que a resposta seja um array de clientes

                 // Mapear cada cliente para incluir tenant, pessoa_juridica e domain
                 const clientesCompletos = await Promise.all(clientes.map(async (cliente) => {
                     try {
                         // Buscar o tenant
                         const tenantResponse = await http.get(`client_tenant/${cliente.id_tenant}/?format=json`);
                         const tenant = tenantResponse || {};

                         // Buscar a pessoa jurídica
                         const pessoaJuridicaResponse = await http.get(`pessoa_juridica/${cliente.pessoa_juridica}/?format=json`);
                         const pessoaJuridica = pessoaJuridicaResponse || {};


                         // Retornar o objeto consolidado
                         return {
                             ...cliente,
                             tenant,
                             pessoaJuridica
                         };
                     } catch (erro) {
                         console.error("Erro ao buscar dados do cliente:", erro);
                         return { ...cliente, tenant: {}, pessoaJuridica: {}, domain: null };
                     }
                 }));

                 // Atualizar o estado com os clientes completos
                 setTenants(clientesCompletos);
                 
            })
            .catch(erro => {
                console.error("Erro ao buscar clientes:", erro);
            });
        }

        if(((!empresas) || empresas.length == 0) && tenants)
        {
            http.get(`client_domain/?format=json`)
            .then(domains => {
                    // Cruzar os dados: adicionar domains correspondentes a cada tenant
                    const tenantsWithDomain = tenants.map(tenant => ({
                    ...tenant,
                    domain: domains.find(domain => domain.tenant === tenant.id_tenant)?.domain || null
                }));

                setEmpresas(tenantsWithDomain)
                setCompanies(tenantsWithDomain)

                if(selected == '')
                {
                    setSelected(tenantsWithDomain[0].id_tenant)
                }
            })
            .catch(erro => {

            })
        }

        var comp = [];

        if(selected && empresas && empresas.length > 0)
        {
            comp = empresas.filter(company => company.id_tenant == selected);
            if(comp.length > 0 && comp[0].id_tenant)
            {
                setEmpresa(comp[0].tenant.nome)
                setSessionCompany(comp[0].id_tenant)
                setCompanyDomain(comp[0].domain)
                setCompanyLogo(comp[0].tenant.logo)
                setCompanySymbol(comp[0].tenant.simbolo)
            }
        }

    }, [empresas, tenants, modalOpened, sidebarOpened])

    function toggleMenu(){
        setMenuOpened(!menuOpened)
    }
    
    function fechaMenu(){
        if(menuOpened)
        {
            setMenuOpened(false)
        }

        if(sidebarOpened && window.innerWidth <= 760)
        {
            setSidebarOpened(false)
        }
    }

    
    const selectCompany = () => {
        setModalOpened(true)
    }

    function changeCompany(id) {
        
        var comp = [];

        if(id && empresas)
        {
            comp = empresas.filter(company => company.id_tenant === id);
           
            if(comp.length > 0 && comp[0].id_tenant)
            {
                setEmpresa(comp[0].tenant.nome)
                setSimbolo(comp[0].tenant.simbolo)
                setLogo(comp[0].tenant.logo)
                setSelected(id)
            }
        }
    }

    
    return (
        <> 
        {usuarioEstaLogado ?
            <>
            <EstilosGlobais />
            <MainSection aoClicar={fechaMenu}>
                <Loading opened={loading} />
                <BarraLateral $sidebarOpened={sidebarOpened}/>
                <MainContainer aoClicar={fechaMenu} align="flex-start" padding="0 0 0 0">
                    <Cabecalho sidebarOpened={sidebarOpened} setSidebarOpened={setSidebarOpened} setMenuOpened={toggleMenu} menuOpened={menuOpened} aoClicar={selectCompany} nomeEmpresa={empresa.toUpperCase()} simbolo={simbolo} logo={logo} />
                    <MarginContainer>
                        <Outlet key={empresa} />
                    </MarginContainer>
                    {!isDesktop && <BottomMenu />}
                </MainContainer>
                {import.meta.env.VERCEL_ENV && <Analytics />}
                {import.meta.env.VERCEL_ENV && <SpeedInsights />}
            </MainSection>
            <ModalCnpj aoClicar={changeCompany} aoFechar={() => {setModalOpened(false); setLoading(false)}} opened={modalOpened} />
        </>
        : <Navigate to="/login" replace={true}/>
        } </>
    )
}
export default Autenticado