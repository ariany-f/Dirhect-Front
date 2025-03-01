import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import RadioButton from "@components/RadioButton"
import CardText from "@components/CardText"
import { useEffect, useState } from "react"
import { RiCloseFill, RiBuildingLine } from 'react-icons/ri'
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import http from '@http'
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import styles from './ModalCnpj.module.css'
import { CiCirclePlus } from "react-icons/ci"
import { ArmazenadorToken } from "@utils"

const Overlay = styled.div`
    background-color: rgba(0,0,0,0.80);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`

const AdicionarCnpjBotao = styled.div`
    font-size: 14px;
    font-weight: 700;
    color: var(--primaria);
    padding: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
`

const DialogEstilizado = styled.dialog`
    display: flex;
    width: 40vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    border: none;
    margin: 0 auto;
    top: 10vh;
    padding: 24px;
    & button.close {
        & .fechar {
            box-sizing: initial;
            fill: var(--primaria);
            stroke: var(--primaria);
            color: var(--primaria);
        }
        position: absolute;
        right: 20px;
        top: 20px;
        cursor: pointer;
        border: none;
        background-color: initial;
    }
    & .icon {
        margin-right: 5px;
        box-sizing: initial;
        fill: var(--primaria);
        stroke: var(--primaria);
        color: var(--primaria);
    }
    & .frame:nth-of-type(1) {
        gap: 24px;
        & .frame {
            margin-bottom: 24px;
            & p{
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            & b {
                font-weight: 800;
                font-size: 14px;
            }
        }
    }
`

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

function ModalCnpj({ opened = false, aoClicar, aoFechar }) {

    const { 
        usuario,
        setCompanies,
        setSessionCompany,
        setCompanyDomain,
    } = useSessaoUsuarioContext()

    const [tenants, setTenants] = useState(null)
    const [empresas, setEmpresas] = useState(usuario.companies ?? null)

    const [selected, setSelected] = useState(ArmazenadorToken.UserCompanyPublicId ?? '')
    const navegar = useNavigate()

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
                    if(selected == '')
                    {
                        setSelected(tenantsWithDomain[0].id_tenant)
                    }
                })
                .catch(erro => {

                })
            }
        }

        if(empresas && empresas.length > 0 && (!tenants))
        {
            setSelected(empresas[0].id_tenant)
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

            ArmazenadorToken.definirCompany(
                selected,
                comp[0].domain
            )
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
                            <h6>Selecione uma empresa</h6>
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
                            <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>Cancelar</Botao>
                            <Botao aoClicar={selectCompany} estilo="vermilion" size="medium" filled>Alterar</Botao>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalCnpj