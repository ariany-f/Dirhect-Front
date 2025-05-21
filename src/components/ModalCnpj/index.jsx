import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import RadioButton from "@components/RadioButton"
import CardText from "@components/CardText"
import { useEffect, useState } from "react"
import { RiCloseFill, RiBuildingLine } from 'react-icons/ri'
import { Navigate, useNavigate } from "react-router-dom"
import styled from "styled-components"
import http from '@http'
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import styles from './ModalCnpj.module.css'
import { CiCirclePlus } from "react-icons/ci"
import { ArmazenadorToken } from "@utils"
import { Overlay, DialogEstilizado } from '@components/Modal/styles'
import { useTranslation } from "react-i18next"
import CustomImage from "@components/CustomImage"

const AdicionarCnpjBotao = styled.div`
    font-size: 14px;
    font-weight: 700;
    color: var(--primaria);
    padding: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
    width: 100%;
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
    width: 100%;
    border-color: ${ props => props.$active ? 'var(--primaria)' : 'var(--neutro-200)' };
    
    @media screen and (max-width: 768px) {
        padding: 16px;
        flex-direction: ${props => props.$active ? 'row' : 'column'};
        gap: ${props => props.$active ? '0' : '10px'};
        
        & .${styles.cardEmpresa} {
            width: 100%;
            justify-content: ${props => props.$active ? 'flex-start' : 'center'};
            text-align: ${props => props.$active ? 'left' : 'center'};
        }
        
        & .${styles.DadosEmpresa} {
            align-items: ${props => props.$active ? 'flex-start' : 'center'};
            
            & h6 {
                font-size: 14px;
                text-align: ${props => props.$active ? 'left' : 'center'};
            }
            
            & div {
                font-size: 12px;
            }
        }
    }
`;

function ModalCnpj({ opened = false, aoClicar, aoFechar }) {

    const { 
        usuario,
        setCompanies,
        setSessionCompany,
        setCompanyDomain,
        setCompanySymbol,
        setCompanyLogo
    } = useSessaoUsuarioContext()

    const [tenants, setTenants] = useState(null)
    const [empresas, setEmpresas] = useState(usuario.companies ?? null)

    const [selected, setSelected] = useState(ArmazenadorToken.UserCompanyPublicId ?? '')
    const navegar = useNavigate()
    const { t } = useTranslation('common');

    useEffect(() => {
        if(opened)
        {
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

                    setSelected(ArmazenadorToken.UserCompanyPublicId ?? tenantsWithDomain[0].id_tenant)
                    
                })
                .catch(erro => {

                })
            }
        }

        if(empresas && empresas.length > 0 && (!tenants))
        {
            setSelected(ArmazenadorToken.UserCompanyPublicId ?? empresas[0].id_tenant)
        }
        
    }, [opened, empresas, tenants])
    
    function handleSelectChange(value) {
        setSelected(value)
    }
    
    const selectCompany = () => {
        
        aoClicar(selected)

        setSessionCompany(selected)

        var comp = empresas.filter(company => company.id_tenant == selected)
       
        if(comp.length > 0 && comp[0].id_tenant)
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

         // Verifica se a URL atual termina com um ID numérico
        const regexId = /\/\d+$/;
        if (regexId.test(location.pathname)) {
            navegar(-1); // Volta para a tela anterior
        }

        aoFechar()
    }

    const navegarParaAdicionarCnpj = () => {
        aoFechar()
        navegar('/adicionar-cnpj')
    }

    function formataCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]/g, "");
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }

    return(
        <>
            {opened &&
            <Overlay>
                <DialogEstilizado id="modal-cnpj" open={opened}>
                    <Frame>
                        <Titulo>
                            <h6>{t('select_company')}</h6>
                        </Titulo>
                        {empresas && empresas.length > 0 &&
                        <>
                            <Wrapper>
                                {empresas.map((empresa, idx) => {
                                    return (
                                        <Item 
                                            key={idx} 
                                            $active={selected === empresa.id_tenant}
                                            onClick={id => handleSelectChange(empresa.id_tenant)}>
                                            <div className={styles.cardEmpresa}>
                                                {empresa.tenant.simbolo ?
                                                    <CustomImage src={empresa.tenant.simbolo} title={empresa.tenant.nome} width={50} height={50} borderRadius={16} />
                                                : (selected === empresa.id_tenant) ?
                                                    <RiBuildingLine className={styles.buildingIcon + ' ' + styles.vermilion} size={20} />
                                                    : <RiBuildingLine className={styles.buildingIcon} size={20} />
                                                }
                                                <div className={styles.DadosEmpresa}>
                                                    <h6>{empresa.tenant.nome.toUpperCase()}</h6>
                                                    <div>{formataCNPJ(empresa.pessoaJuridica.cnpj)}</div>
                                                </div>
                                            </div>
                                            <RadioButton
                                                value={empresa.id_tenant}
                                                checked={selected == empresa.id_tenant}
                                                onSelected={(id) => handleSelectChange}
                                            />
                                        </Item>
                                    )
                                })}
                            </Wrapper>
                        </>
                    }
                        {/* <CardText>
                            <p className={styles.subtitulo}>Você pode ter mais de um CNPJ cadastrado, porém às configurações são individuas para cada empresa.</p>
                        </CardText> */}
                        <Frame alinhamento="center">
                            <AdicionarCnpjBotao onClick={() => navegarParaAdicionarCnpj()}><CiCirclePlus size={20} className="icon" />Adicionar uma nova empresa</AdicionarCnpjBotao>
                        </Frame>
                    </Frame>
                    <form method="dialog">
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>{t('cancel')}</Botao>
                            <Botao aoClicar={selectCompany} estilo="vermilion" size="medium" filled>{t('change')}</Botao>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalCnpj