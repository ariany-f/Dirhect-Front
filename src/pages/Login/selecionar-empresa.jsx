import Botao from "@components/Botao"
import Titulo from "@components/Titulo"
import RadioButton from "@components/RadioButton"
import styled from "styled-components"
import { useEffect, useRef, useState } from "react"
import { RiBuildingLine } from "react-icons/ri"
import styles from './Login.module.css'
import ModalToken from '@components/ModalToken'
import http from '@http';
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"
import { useNavigate } from "react-router-dom"
import { Toast } from 'primereact/toast'
import { ArmazenadorToken } from "../../utils"
import Loading from "@components/Loading"
import companies from '@json/empresas.json'

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
        setSessionCompany
    } = useSessaoUsuarioContext()

    const [empresas, setEmpresas] = useState(companies)
    const [selected, setSelected] = useState(usuario.company_public_id ?? ArmazenadorToken.UserCompanyPublicId ?? '')
    const navegar = useNavigate()

    useEffect(() => {
     

    }, [empresas, setSessionCompany])
    
    const [loading, setLoading] = useState(false)
    const toast = useRef(null)


    // useEffect(() => {

    //     if((!usuario.empresas || usuario.empresas.length === 0) && usuario.cpf)
    //     {
    //         setEmpresas(response)
    //         setCompanies(response)
    //         setSelected(response[0].public_id)
    //     }
    // }, [usuario, empresas])

    function handleSelectChange(value) {
        setSelected(value);
    }
    
    const selectCompany = () => {
        if(selected)
        {
            setSessionCompany(selected)
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
            {empresas.length > 0 &&
                <>
                    <Wrapper>
                        {empresas.map((empresa, idx) => {
                            return (
                                <Item 
                                    key={idx} 
                                    $active={selected === empresa.public_id}
                                    onClick={public_id => handleSelectChange(empresa.public_id)}>
                                    <div className={styles.cardEmpresa}>
                                        {(selected === empresa.public_id) ?
                                            <RiBuildingLine className={styles.buildingIcon + ' ' + styles.vermilion} size={20} />
                                            : <RiBuildingLine className={styles.buildingIcon} size={20} />
                                        }
                                        <div className={styles.DadosEmpresa}>
                                            <h6>{empresa.social_reason}</h6>
                                            <div>{formataCNPJ(empresa.cnpj)}</div>
                                        </div>
                                    </div>
                                    <RadioButton
                                        name="selected_company"
                                        value={empresa.public_id}
                                        checked={selected === empresa.public_id}
                                        onSelected={(public_id) => handleSelectChange}
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