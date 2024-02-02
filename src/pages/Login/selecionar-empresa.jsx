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
        setCode,
        setCompanies,
        setUsuarioEstaLogado,
        setSessionCompany,
        submeterLogin,
        solicitarCodigo,
        submeterCompanySession
    } = useSessaoUsuarioContext()
    
    const [empresas, setEmpresas] = useState(usuario?.companies ?? [])
    const [selected, setSelected] = useState(empresas[0]?.public_id)
    const [loading, setLoading] = useState(false)
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)

    const navegar = useNavigate()

    useEffect(() => {
        
        if(usuario.companies.length === 0)
        {
            http.get(`api/dashboard/company`)
                .then((response) => {
                    if(response !== undefined || response.data !== undefined)
                    {
                        setEmpresas(response.data.companies)
                        setCompanies(response.data.companies)
                    }
                })
                .catch(erro => {
                    console.log(erro)
                })
        }
    }, [usuario, empresas])

    function handleSelectChange(value) {
        setSelected(value);
    }

    const selectCompany = () => {
        if(selected)
        {
            setModalOpened(true)
            setSessionCompany(selected)
        }
    }
    
    const sendCode = () => {

        setLoading(true)

        submeterLogin().then((response) => {
            if(response.data)
            {
                if(response.data.status === 'success')
                {
                    ArmazenadorToken.definirToken(
                        response.data.token_access,
                        response.data.expires_at
                    )
                    setUsuarioEstaLogado(true)
                    submeterCompanySession().then(response => {
                        navegar('/')
                    })
                }
                else
                {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: response.data.message })
                    setCode([])
                    setLoading(false)
                    return false
                }
            }
            else
            {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: response.message })
                setCode([])
                setLoading(false)
                return false
            }
        })
        .catch(erro => {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: erro.message })
            setCode([])
            setLoading(false)
            return false
        })
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
                                            <h6>{empresa.name}</h6>
                                            <div>{empresa.document}</div>
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
                    <ModalToken usuario={usuario} aoReenviar={solicitarCodigo} aoFechar={() => setModalOpened(false)} aoClicar={sendCode} setCode={setCode} opened={modalOpened} />
                </>
            }
        </>
    )
}

export default SelecionarEmpresa