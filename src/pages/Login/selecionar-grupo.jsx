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

function SelecionarGrupo() {
    
    const { 
        usuario,
        setSessionCompany,
        setCompanyDomain,
        setCompanySymbol,
        setCompanyLogo,
        setTipo,
        setCompanies,
    } = useSessaoUsuarioContext()

    const [serversOut, setServersOut] = useState(false)
    const [grupos, setGrupos] = useState(ArmazenadorToken.UserGroups ?? null)
    const [selected, setSelected] = useState(ArmazenadorToken.UserTipo ?? ArmazenadorToken.UserTipo ?? '')
    const [loading, setLoading] = useState(false)
    const toast = useRef(null)
    const navegar = useNavigate()
    const { t } = useTranslation('common');

    function handleSelectChange(value) {
        setSelected(value);
    }

    const handleSelectSave = (value) => {
        ArmazenadorToken.definirTipo(selected);
        navegar('/login/selecionar-empresa')
    }

    return (
        <>
            <Toast ref={toast} />
            <Loading opened={loading} />
            {grupos && grupos.length > 0 &&
                <>
                    <Titulo>
                        <h2>{t('select_group')}</h2>
                    </Titulo>
                    <Wrapper>
                        {grupos.map((grupo, idx) => {
                            return (
                                <Item 
                                    key={idx} 
                                    $active={selected === grupo}
                                    onClick={id_group => handleSelectChange(grupo)}>
                                    <div className={styles.cardEmpresa}>
                                        <h6>{grupo}</h6>
                                    </div>
                                </Item>
                            )
                        })}
                    </Wrapper>
                    <Botao estilo="vermilion" size="medium" filled aoClicar={handleSelectSave} >{t('confirm')}</Botao>
                </>
            }
        </>
    )
}

export default SelecionarGrupo