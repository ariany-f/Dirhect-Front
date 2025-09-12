import Botao from "@components/Botao"
import Titulo from "@components/Titulo"
import RadioButton from "@components/RadioButton"
import styled from "styled-components"
import { useEffect, useRef, useState } from "react"
import { RiBuildingLine, RiErrorWarningLine } from "react-icons/ri"
import Texto from "@components/Texto"
import styles from './Login.module.css'
import http from '@http';
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import { useNavigate } from "react-router-dom"
import { Toast } from 'primereact/toast'
import { ArmazenadorToken } from "@utils"
import Loading from "@components/Loading"
import { useTranslation } from "react-i18next"
import RightContainer from "@components/RightContainer"
import MainContainer from "@components/MainContainer"
import CustomImage from "@components/CustomImage"

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 16px;
    align-self: stretch;
`;

const Item = styled.div`
    cursor: pointer;
    border-width: 1px;
    border-style: solid;
    border-radius: 16px;
    display: flex;
    padding: 20px;
    justify-content: space-between;
    align-items: center;
    width: 94%;
    border-color: ${ props => props.$active ? 'var(--primaria)' : 'var(--neutro-200)' };
`;

const WrapperOut = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    align-self: stretch;
    width: 100%;
    @media (max-width: 768px) {
        margin-left: 0px;
        margin-right: 0px;
    }
`;

function SelecionarEmpresaMobile() {
    
    const { 
        usuario,
        setSessionCompany,
        setCompanyDomain,
        setCompanySymbol,
        setCompanyLogo,
        setCompanies,
    } = useSessaoUsuarioContext()

    const [serversOut, setServersOut] = useState(false)
    const [tenants, setTenants] = useState(null)
    const [empresas, setEmpresas] = useState(usuario.companies ?? null)
    const [selected, setSelected] = useState(ArmazenadorToken.UserCompanyPublicId ?? ArmazenadorToken.UserCompanyPublicId ?? '')
    const [loading, setLoading] = useState(false)
    const toast = useRef(null)
    const navegar = useNavigate()
    const { t } = useTranslation('common');

    useEffect(() => {
        if((!tenants) && ((!empresas) || empresas.length == 0))
        {
            setLoading(true)
             // Buscar clientes
             http.get(`cliente/?format=json`)
             .then(async (response) => {
                 let clientes = response; // Supondo que a resposta seja um array de clientes

                 // Mapear cada cliente para incluir tenant, pessoa_juridica e domain
                 const clientesCompletos = await Promise.all(clientes.map(async (cliente) => {
                     try {
                         // Buscar o tenant
                         const tenantResponse = await http.get(`client_tenant/${cliente.id_tenant.id}/?format=json`);
                         
                         const tenant = tenantResponse || {};

                         const pessoaJuridica = cliente.pessoaJuridica || cliente.pessoa_juridica;

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
                 setServersOut(false)
             })
             .catch(erro => {
                setServersOut(true)
                console.error("Erro ao buscar clientes:", erro);
             })
             .finally(function(){
                setLoading(false)
             });
        }

        if(((!empresas) || empresas.length == 0) && tenants)
        {
            http.get(`client_domain/?format=json`)
            .then(domains => {
                    // Cruzar os dados: adicionar domains correspondentes a cada tenant
                const tenantsWithDomain = tenants.map(tenant => ({
                    ...tenant,
                    domain: domains.find(domain => domain.tenant === tenant.id_tenant.id)?.domain || null
                }));
                
                setEmpresas(tenantsWithDomain)
                setCompanies(tenantsWithDomain)
                setSelected(tenantsWithDomain[0].id_tenant.id)
                setLoading(false)
            })
            .catch(erro => {
                setLoading(false)
            })
        }
        
        if(empresas && empresas.length > 0 && (!tenants))
        {
            setSelected(empresas[0].id_tenant.id)
        }

    }, [empresas, tenants, setSessionCompany])

    function handleSelectChange(value) {
        setSelected(value);
    }
    
    const selectCompany = () => {
        if(selected)
        {
            setSessionCompany(selected)

            var comp = empresas.filter(company => company.id_tenant.id == selected);
           
            if(comp.length > 0 && comp[0].id_tenant.id)
            {
                setCompanyDomain(comp[0].domain)
                setCompanySymbol(comp[0].tenant.simbolo)
                setCompanyLogo(comp[0].tenant.logo)
                
                ArmazenadorToken.definirCompany(
                    selected,
                    comp[0].domain.split('.')[0],
                    comp[0].tenant.simbolo,
                    comp[0].tenant.logo
                )
            }

            navegar('/')
        }
    }

    function formataCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]/g, "");
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }

    return (
        <RightContainer>
            <MainContainer>
                <Toast ref={toast} />
                <Loading opened={loading} />
                {empresas && empresas.length > 0 && (!serversOut) &&
                    <>
                        <Titulo>
                            <h2>{t('select_company')}</h2>
                        </Titulo>
                        <Wrapper>
                            {empresas.map((empresa, idx) => {
                                return (
                                    <Item 
                                        key={idx} 
                                        $active={selected === empresa.id_tenant.id}
                                        onClick={id_tenant => handleSelectChange(empresa.id_tenant.id)}>
                                        <div className={styles.cardEmpresa}>
                                            {empresa.tenant.simbolo ? 
                                                <CustomImage src={empresa.tenant.simbolo} title={empresa.tenant.nome} width={50} height={50} borderRadius={16} />
                                            : (selected === empresa.id_tenant.id) ?
                                                <RiBuildingLine className={styles.buildingIcon + ' ' + styles.vermilion} size={20} />
                                            : <RiBuildingLine className={styles.buildingIcon} size={20} />
                                            }
                                            <div className={styles.DadosEmpresa}>
                                                <h6 style={{ fontSize: empresa.tenant.nome.length > 22 ? 10 : undefined }}>
                                                    {empresa.tenant.nome.toUpperCase()}
                                                </h6>
                                                <div style={{ fontSize: 12 }}>{formataCNPJ(empresa.pessoaJuridica.cnpj)}</div>
                                            </div>
                                        </div>
                                        <RadioButton
                                            name="selected_company"
                                            value={empresa.id_tenant.id}
                                            checked={selected === empresa.id_tenant.id}
                                            onSelected={(id_tenant) => handleSelectChange}
                                        />
                                    </Item>
                                )
                            })}
                        </Wrapper>
                        <Botao estilo="vermilion" size="medium" filled aoClicar={selectCompany} >{t('confirm')}</Botao>
                    </>
                }
                
                {serversOut &&
                    <WrapperOut>
                        <Texto><RiErrorWarningLine className={styles.warningIcon} size={20} />Servidores fora do ar. Por favor, tente novamente mais tarde.</Texto>
                        <Botao estilo="vermilion" size="medium" filled aoClicar={() => setEmpresas([])}>Tentar novamente</Botao>
                    </WrapperOut>
                }    
            </MainContainer>
        </RightContainer>
    )
}

export default SelecionarEmpresaMobile