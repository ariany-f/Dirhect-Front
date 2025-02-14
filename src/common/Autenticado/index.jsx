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
        setSessionCompany,
        setCompanyDomain,
        usuarioEstaLogado
    } = useSessaoUsuarioContext()

    const navegar = useNavigate()
    const [empresas, setEmpresas] = useState(null)
    const [tenants, setTenants] = useState(null)
    const [selected, setSelected] = useState(usuario.company_public_id ?? ArmazenadorToken.UserCompanyPublicId ?? '')
    const [empresa, setEmpresa] = useState('')
    
    
    const [modalOpened, setModalOpened] = useState(false)
    const [menuOpened, setMenuOpened] = useState(false)
    const [loading, setLoading] = useState(false)

    const location = useLocation()

    useEffect(() => {
        
        if(!tenants)
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

        if((!empresas) && tenants)
        {
            http.get(`client_domain/?format=json`)
            .then(domains => {
                    // Cruzar os dados: adicionar domains correspondentes a cada tenant
                    const tenantsWithDomain = tenants.map(tenant => ({
                    ...tenant,
                    domain: domains.find(domain => domain.tenant === tenant.id_tenant)?.domain || null
                }));

                setEmpresas(tenantsWithDomain)

                if(selected == '')
                {
                    setSelected(tenantsWithDomain[0].id_tenant)
                }
            })
            .catch(erro => {

            })
        }

        var comp = [];

        if(selected && empresas)
        {
            comp = empresas.filter(company => company.id_tenant == selected);
            if(comp.length > 0 && comp[0].id_tenant)
            {
                setEmpresa(comp[0].tenant.nome)
                setSessionCompany(comp[0].id_tenant)
                setCompanyDomain(comp[0].domain)
            }
        }

    }, [empresas, tenants, modalOpened])

    function toggleMenu(){
        setMenuOpened(!menuOpened)
    }
    
    function fechaMenu(){
        if(menuOpened)
        {
            setMenuOpened(false)
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
                setSelected(id)
            }
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
                            <Cabecalho setMenuOpened={toggleMenu} menuOpened={menuOpened} aoClicar={selectCompany} nomeEmpresa={empresa.toUpperCase()} />
                        </>
                    }
                    <MarginContainer>
                        <Outlet key={empresa} />
                    </MarginContainer>
                </MainContainer>
                <Analytics />
                <SpeedInsights />
            </MainSection>
            <ModalCnpj aoClicar={changeCompany} aoFechar={() => {setModalOpened(false); setLoading(false)}} opened={modalOpened} />
        </>
        : <Navigate to="/login" replace={true}/>
        } </>
    )
}
export default Autenticado