import Botao from "@components/Botao"
import Titulo from "@components/Titulo"
import RadioButton from "@components/RadioButton"
import styled from "styled-components"
import { useEffect, useRef, useState } from "react"
import { RiBuildingLine } from "react-icons/ri"
import styles from './Login.module.css'
import http from '@http';
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"
import { useNavigate } from "react-router-dom"
import { Toast } from 'primereact/toast'
import { ArmazenadorToken } from "../../utils"
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
    } = useSessaoUsuarioContext()

    const [tenants, setTenants] = useState(null)
    const [empresas, setEmpresas] = useState(null)
    const [selected, setSelected] = useState(usuario.company_public_id ?? ArmazenadorToken.UserCompanyPublicId ?? '')
    const [loading, setLoading] = useState(false)
    const toast = useRef(null)
    const navegar = useNavigate()


    useEffect(() => {
        if(!tenants)
        {
            setLoading(true)
            http.get(`client_tenant/?format=json`)
            .then(response => {
                setTenants(response)
                setLoading(false)
            })
            .catch(erro => {
                setLoading(false)
            })
        }

        if((!empresas) && tenants)
        {
            setLoading(true)
            http.get(`client_domain/?format=json`)
            .then(domains => {
                    // Cruzar os dados: adicionar domains correspondentes a cada tenant
                    const tenantsWithDomain = tenants.map(tenant => ({
                    ...tenant,
                    domain: domains.find(domain => domain.tenant === tenant.id)?.domain || null
                }));
                setEmpresas(tenantsWithDomain)
                setSelected(tenantsWithDomain[0].id)
                setLoading(false)
            })
            .catch(erro => {
                setLoading(false)
            })
        }

    }, [empresas, tenants, setSessionCompany])

    function handleSelectChange(value) {
        setSelected(value);
    }
    
    const selectCompany = () => {
        if(selected)
        {
            setSessionCompany(selected)

            var comp = empresas.filter(company => company.id == selected);

            if(comp.length > 0 && comp[0].nome)
            {
                setCompanyDomain(comp[0].domain)
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
                                    $active={selected === empresa.id}
                                    onClick={public_id => handleSelectChange(empresa.id)}>
                                    <div className={styles.cardEmpresa}>
                                        {(selected === empresa.id) ?
                                            <RiBuildingLine className={styles.buildingIcon + ' ' + styles.vermilion} size={20} />
                                            : <RiBuildingLine className={styles.buildingIcon} size={20} />
                                        }
                                        <div className={styles.DadosEmpresa}>
                                            <h6>{empresa.nome.toUpperCase()}</h6>
                                            {/* <div>{formataCNPJ(empresa.cnpj)}</div> */}
                                        </div>
                                    </div>
                                    <RadioButton
                                        name="selected_company"
                                        value={empresa.id}
                                        checked={selected === empresa.id}
                                        onSelected={(id) => handleSelectChange}
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