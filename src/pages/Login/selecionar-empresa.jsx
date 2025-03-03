import Botao from "@components/Botao"
import Titulo from "@components/Titulo"
import RadioButton from "@components/RadioButton"
import styled from "styled-components"
import { useEffect, useRef, useState } from "react"
import { RiBuildingLine } from "react-icons/ri"
import styles from './Login.module.css'
import http from '@http';
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import { useNavigate } from "react-router-dom"
import { Toast } from 'primereact/toast'
import { ArmazenadorToken } from "@utils"
import Loading from "@components/Loading"

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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

function SelecionarEmpresa() {
    
    const { 
        usuario,
        setSessionCompany,
        setCompanyDomain,
        setCompanies,
    } = useSessaoUsuarioContext()

    const [tenants, setTenants] = useState(null)
    const [empresas, setEmpresas] = useState(usuario.companies ?? null)
    const [selected, setSelected] = useState(ArmazenadorToken.UserCompanyPublicId ?? ArmazenadorToken.UserCompanyPublicId ?? '')
    const [loading, setLoading] = useState(false)
    const toast = useRef(null)
    const navegar = useNavigate()

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
                    domain: domains.find(domain => domain.tenant === tenant.id_tenant)?.domain || null
                }));
                
                setEmpresas(tenantsWithDomain)
                setCompanies(tenantsWithDomain)
                setSelected(tenantsWithDomain[0].id_tenant)
                setLoading(false)
            })
            .catch(erro => {
                setLoading(false)
            })
        }
        
        if(empresas && empresas.length > 0 && (!tenants))
        {
            setSelected(empresas[0].id_tenant)
        }

    }, [empresas, tenants, setSessionCompany])

    function handleSelectChange(value) {
        setSelected(value);
    }
    
    const selectCompany = () => {
        if(selected)
        {
            setSessionCompany(selected)

            var comp = empresas.filter(company => company.id_tenant == selected);

            if(comp.length > 0 && comp[0].id_tenant)
            {
                setCompanyDomain(comp[0].domain)
                
                ArmazenadorToken.definirCompany(
                    selected,
                    comp[0].domain.split('.')[0]
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
        <>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <Titulo>
                <h2>Selecione uma empresa</h2>
            </Titulo>
            {empresas && empresas.length > 0 &&
                <>
                    <Wrapper>
                        {empresas.map((empresa, idx) => {
                            return (
                                <Item 
                                    key={idx} 
                                    $active={selected === empresa.id_tenant}
                                    onClick={id_tenant => handleSelectChange(empresa.id_tenant)}>
                                    <div className={styles.cardEmpresa}>
                                        {(selected === empresa.id_tenant) ?
                                            <RiBuildingLine className={styles.buildingIcon + ' ' + styles.vermilion} size={20} />
                                            : <RiBuildingLine className={styles.buildingIcon} size={20} />
                                        }
                                        <div className={styles.DadosEmpresa}>
                                            <h6>{empresa.tenant.nome.toUpperCase()}</h6>
                                            <div>{formataCNPJ(empresa.pessoaJuridica.cnpj)}</div>
                                        </div>
                                    </div>
                                    <RadioButton
                                        name="selected_company"
                                        value={empresa.id_tenant}
                                        checked={selected === empresa.id_tenant}
                                        onSelected={(id_tenant) => handleSelectChange}
                                    />
                                </Item>
                            )
                        })}
                    </Wrapper>
                    <Botao estilo="vermilion" size="medium" filled aoClicar={selectCompany} >Confirmar</Botao>
                </>
            }
        </>
    )
}

export default SelecionarEmpresa