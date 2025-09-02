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
import BrandColors from '@utils/brandColors'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const MarginContainer = styled.div`
    display: inline-flex;
    flex-direction: column;
    height: initial;
    align-items: flex-start;
    margin-left: 2vw;
    margin-right: 2vw;
    margin-top: 12vh;
    margin-bottom: 2vh;
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

    // Aplicar cores da marca dinamicamente
    useEffect(() => {
        BrandColors.applyBrandColorsWhenReady();
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

    // Debounce para evitar múltiplas execuções durante o redimensionamento
    useEffect(() => {
        let timeoutId;
        
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const newIsDesktop = window.innerWidth > 1024;
                const newSidebarOpened = window.innerWidth > 760;
                
                setIsDesktop(newIsDesktop);
                setSidebarOpened(newSidebarOpened);
                
                // Fechar menu mobile se redimensionar para desktop
                if (newIsDesktop && menuOpened) {
                    setMenuOpened(false);
                }
            }, 150); // Debounce de 150ms
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        }
    }, [menuOpened]);

    // Verificação inicial dos estados de responsividade
    useEffect(() => {
        const initialIsDesktop = window.innerWidth > 1024;
        const initialSidebarOpened = window.innerWidth > 760;
        
        setIsDesktop(initialIsDesktop);
        setSidebarOpened(initialSidebarOpened);
        
        // Garantir que o menu mobile esteja fechado em desktop
        if (initialIsDesktop && menuOpened) {
            setMenuOpened(false);
        }
    }, []);

    useEffect(() => {
        // Limpar dados antigos de empresas ao montar o componente
        setEmpresas(null)
        setTenants(null)
        setSelected('')
        setEmpresa('')
        setSimbolo('')
        setLogo('')
    }, [])

    // Escutar mudanças de logo para atualizar automaticamente (mesma mecânica das cores)
    useEffect(() => {
        const handleLogoChange = (event) => {
            const logoUrl = event.detail.logoUrl;
            console.log('🔄 Logo alterada no Autenticado:', logoUrl);
            if (logoUrl) {
                setLogo(logoUrl);
                console.log('✅ Logo atualizada no Autenticado');
            } else {
                setLogo('');
                console.log('✅ Logo removida no Autenticado');
            }
        };

        // Escutar evento automático disparado pelo BrandColors
        window.addEventListener('logoChanged', handleLogoChange);

        return () => {
            window.removeEventListener('logoChanged', handleLogoChange);
        };
    }, []);

    useEffect(() => { 
        if((!tenants) && ((!empresas) || empresas.length == 0))
        {
            // Tentar recuperar do cache primeiro
            const cachedTenants = ArmazenadorToken.getTenantsCache();
            const cachedCompanies = ArmazenadorToken.getCompaniesCache();
            const selectedCompany = ArmazenadorToken.UserCompanyPublicId;

            if (cachedTenants && cachedCompanies && ArmazenadorToken.isCacheValido()) {
                // Usar dados do cache
                setTenants(cachedTenants);
                setEmpresas(cachedCompanies);
                setCompanies(cachedCompanies);
                if(selected == '') {
                    if(selectedCompany) {
                        setSelected(cachedCompanies.find(company => company.id_tenant == selectedCompany)?.id_tenant || '');
                        setEmpresa(cachedCompanies.find(company => company.id_tenant == selectedCompany)?.tenant.nome || '');
                        setSessionCompany(selectedCompany);
                        setCompanyDomain(cachedCompanies.find(company => company.id_tenant == selectedCompany)?.domain || '');
                        setCompanyLogo(cachedCompanies.find(company => company.id_tenant == selectedCompany)?.tenant.logo || '');
                        setCompanySymbol(cachedCompanies.find(company => company.id_tenant == selectedCompany)?.tenant.simbolo || '');
                        setSimbolo(cachedCompanies.find(company => company.id_tenant == selectedCompany)?.tenant.simbolo || '');
                        setLogo(cachedCompanies.find(company => company.id_tenant == selectedCompany)?.tenant.logo || '');
                        
                        if(!localStorage.getItem('layoutColors')) {
                            // Buscar parâmetros de layout da empresa selecionada
                            http.get('parametros/por-assunto/?assunto=LAYOUT')
                            .then(response => {
                                if (response && response.parametros) {
                                    BrandColors.setLayoutData(response.parametros);
                                }
                            })
                            .catch(error => {
                                console.error('Erro ao buscar parâmetros de layout:', error);
                            });
                        }
                    } else {
                        setSelected(cachedCompanies[0]?.id_tenant || '');
                        setEmpresa(cachedCompanies[0]?.tenant.nome || '');
                        setSessionCompany(cachedCompanies[0]?.id_tenant || '');
                        setCompanyDomain(cachedCompanies[0]?.domain || '');
                        setCompanyLogo(cachedCompanies[0]?.tenant.logo || '');
                        setCompanySymbol(cachedCompanies[0]?.tenant.simbolo || '');
                        setSimbolo(cachedCompanies[0]?.tenant.simbolo || '');
                        setLogo(cachedCompanies[0]?.tenant.logo || '');
                        
                        if(!localStorage.getItem('layoutColors')) {
                            
                            // Buscar parâmetros de layout da primeira empresa
                            http.get('parametros/por-assunto/?assunto=LAYOUT')
                            .then(response => {
                                if (response && response.parametros) {
                                    BrandColors.setLayoutData(response.parametros);
                                }
                            })
                            .catch(error => {
                                console.error('Erro ao buscar parâmetros de layout:', error);
                            });
                        }
                    }
                }
                else {
                    setSelected(selectedCompany);
                    setEmpresa(cachedCompanies.find(company => company.id_tenant == selectedCompany)?.tenant.nome || '');
                    setSessionCompany(selectedCompany);
                    setCompanyDomain(cachedCompanies.find(company => company.id_tenant == selectedCompany)?.domain || '');
                    setCompanyLogo(cachedCompanies.find(company => company.id_tenant == selectedCompany)?.tenant.logo || '');
                    setCompanySymbol(cachedCompanies.find(company => company.id_tenant == selectedCompany)?.tenant.simbolo || '');
                    setSimbolo(cachedCompanies.find(company => company.id_tenant == selectedCompany)?.tenant.simbolo || '');
                    setLogo(cachedCompanies.find(company => company.id_tenant == selectedCompany)?.tenant.logo || '');
                    
                    if(!localStorage.getItem('layoutColors')) {
                        // Buscar parâmetros de layout da empresa selecionada
                        http.get('parametros/por-assunto/?assunto=LAYOUT')
                        .then(response => {
                            if (response && response.parametros) {
                                BrandColors.setLayoutData(response.parametros);
                            }
                        })
                        .catch(error => {
                            console.error('Erro ao buscar parâmetros de layout:', error);
                        });
                    }
                }
            } else {
                // Buscar dados do servidor
                http.get(`cliente/?format=json`)
                .then(async (response) => {
                    let clientes = response;

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

                    // Salvar no cache
                    ArmazenadorToken.salvarTenantsCache(clientesCompletos);
                    
                    // Atualizar o estado com os clientes completos
                    setTenants(clientesCompletos);
                    
                })
                .catch(erro => {
                    console.error("Erro ao buscar clientes:", erro);
                });
            }
        }

        if(((!empresas) || empresas.length == 0) && tenants)
        {
            // Tentar recuperar domains do cache
            const cachedDomains = ArmazenadorToken.getDomainsCache();
            
            if (cachedDomains && ArmazenadorToken.isCacheValido()) {
                // Usar domains do cache
                const tenantsWithDomain = tenants.map(tenant => ({
                    ...tenant,
                    domain: cachedDomains.find(domain => domain.tenant === tenant.id_tenant)?.domain || null
                }));

                setEmpresas(tenantsWithDomain);
                setCompanies(tenantsWithDomain);
                ArmazenadorToken.salvarCompaniesCache(tenantsWithDomain);

                if(selected == '' && !ArmazenadorToken.UserCompanyPublicId) {
                    setSelected(tenantsWithDomain[0]?.id_tenant || '');
                    setEmpresa(tenantsWithDomain[0]?.tenant.nome || '');
                    setSimbolo(tenantsWithDomain[0]?.tenant.simbolo || '');
                    setLogo(tenantsWithDomain[0]?.tenant.logo || '');
                    
                    if(!localStorage.getItem('layoutColors')) {
                        
                        // Buscar parâmetros de layout da primeira empresa
                        http.get('parametros/por-assunto/?assunto=LAYOUT')
                        .then(response => {
                            if (response && response.parametros) {
                                BrandColors.setLayoutData(response.parametros);
                            }
                        })
                        .catch(error => {
                            console.error('Erro ao buscar parâmetros de layout:', error);
                        });
                    }
                }
                else {
                    setSelected(ArmazenadorToken.UserCompanyPublicId);
                    setEmpresa(tenants.find(tenant => tenant.id_tenant == ArmazenadorToken.UserCompanyPublicId)?.tenant.nome || '');
                    setSimbolo(tenants.find(tenant => tenant.id_tenant == ArmazenadorToken.UserCompanyPublicId)?.tenant.simbolo || '');
                    setLogo(tenants.find(tenant => tenant.id_tenant == ArmazenadorToken.UserCompanyPublicId)?.tenant.logo || '');
                    
                    if(!localStorage.getItem('layoutColors')) {
                        
                        // Buscar parâmetros de layout da primeira empresa
                        http.get('parametros/por-assunto/?assunto=LAYOUT')
                        .then(response => {
                            if (response && response.parametros) {
                                BrandColors.setLayoutData(response.parametros);
                            }
                        })
                        .catch(error => {
                            console.error('Erro ao buscar parâmetros de layout:', error);
                        });
                    }
                }
            } else {
                // Buscar domains do servidor
                http.get(`client_domain/?format=json`)
                .then(domains => {
                    // Salvar domains no cache
                    ArmazenadorToken.salvarDomainsCache(domains);
                    
                    // Cruzar os dados: adicionar domains correspondentes a cada tenant
                    const tenantsWithDomain = tenants.map(tenant => ({
                        ...tenant,
                        domain: domains.find(domain => domain.tenant === tenant.id_tenant)?.domain || null
                    }));

                    setEmpresas(tenantsWithDomain);
                    setCompanies(tenantsWithDomain);
                    ArmazenadorToken.salvarCompaniesCache(tenantsWithDomain);

                    if(selected == '' && !ArmazenadorToken.UserCompanyPublicId) {
                        setSelected(tenantsWithDomain[0]?.id_tenant || '');
                        setEmpresa(tenantsWithDomain[0]?.tenant.nome || '');
                        setSimbolo(tenantsWithDomain[0]?.tenant.simbolo || '');
                        setLogo(tenantsWithDomain[0]?.tenant.logo || '');
                    } else {
                        setSelected(ArmazenadorToken.UserCompanyPublicId);
                        setEmpresa(tenantsWithDomain.find(tenant => tenant.id_tenant == ArmazenadorToken.UserCompanyPublicId)?.tenant.nome || '');
                        setSimbolo(tenantsWithDomain.find(tenant => tenant.id_tenant == ArmazenadorToken.UserCompanyPublicId)?.tenant.simbolo || '');
                        setLogo(tenantsWithDomain.find(tenant => tenant.id_tenant == ArmazenadorToken.UserCompanyPublicId)?.tenant.logo || '');
                    }
                })
                .catch(erro => {
                    console.error("Erro ao buscar domains:", erro);
                });
            }
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
                setLogo(comp[0].tenant.logo)
                setSimbolo(comp[0].tenant.simbolo)

                if(!localStorage.getItem('layoutColors')) {
                    
                    // Buscar parâmetros de layout da empresa selecionada
                    http.get('parametros/por-assunto/?assunto=LAYOUT')
                    .then(response => {
                        if (response && response.parametros) {
                            // Salvar e aplicar as cores do layout

                            BrandColors.setLayoutData(response.parametros);
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao buscar parâmetros de layout:', error);
                    });
                }
            }
        }

    }, [empresas, tenants, modalOpened, sidebarOpened])

    function toggleMenu(){
        setMenuOpened(!menuOpened)
    }
    
    function fechaMenu(){
        // Fechar menu mobile
        if(menuOpened)
        {
            setMenuOpened(false)
        }

        // Fechar sidebar em telas pequenas
        if(sidebarOpened && window.innerWidth <= 760)
        {
            setSidebarOpened(false)
        }
    }

    
    const selectCompany = () => {
        setModalOpened(true);
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

                // Buscar parâmetros de layout da nova empresa selecionada
                http.get('parametros/por-assunto/?assunto=LAYOUT')
                .then(response => {
                    if (response && response.parametros) {
                        // Salvar e aplicar as cores do layout
                        BrandColors.setLayoutData(response.parametros);
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar parâmetros de layout:', error);
                });
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
                    <Cabecalho sidebarOpened={sidebarOpened} setSidebarOpened={setSidebarOpened} setMenuOpened={toggleMenu} menuOpened={menuOpened} aoClicar={selectCompany} nomeEmpresa={empresa ? empresa.toUpperCase() : ''} simbolo={simbolo} logo={logo} />
                    <MarginContainer>
                        <Outlet key={empresa} context={{ sidebarOpened }} />
                    </MarginContainer>
                    {!isDesktop && <BottomMenu />}
                </MainContainer>
                {import.meta.env.VITE_VERCEL_ENV && <Analytics />}
                {import.meta.env.VITE_VERCEL_ENV && <SpeedInsights />}
            </MainSection>
            <ModalCnpj aoClicar={changeCompany} aoFechar={() => {setModalOpened(false); setLoading(false)}} opened={modalOpened} />
        </>
        : <Navigate to="/login" replace={true}/>
        } </>
    )
}
export default Autenticado