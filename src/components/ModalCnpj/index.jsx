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
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"
import styles from './ModalCnpj.module.css'
import { CiCirclePlus } from "react-icons/ci"
import { ArmazenadorToken } from "../../utils"

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
    top: 22vh;
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
        setSessionCompany,
        submeterCompanySession,
        setCompanies,
    } = useSessaoUsuarioContext()

    const [empresas, setEmpresas] = useState(usuario?.companies ?? [])
    const [selected, setSelected] = useState(ArmazenadorToken.UserCompanyPublicId ?? '')
    const navegar = useNavigate()

    useEffect(() => {
        if(opened)
        {
            http.post(`api/company/to-login`, {cpf: usuario.document})
            .then((response) => {
                setEmpresas(response)
                setCompanies(response)
            })
            .catch(erro => {
                console.log(erro)
            })
        }
    }, [empresas, opened])
    
    function handleSelectChange(value) {
        setSelected(value)
    }
    
    const selectCompany = () => {
        aoClicar()
        ArmazenadorToken.definirCompany(
            selected
        )

        submeterCompanySession().then(response => {
            setSessionCompany(selected)
        }).then(item => {
            aoFechar()
        })
    }

    const navegarParaAdicionarCnpj = () => {
        aoFechar()
        navegar('/adicionar-cnpj')
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
                                                    <div>{empresa.cnpj}</div>
                                                </div>
                                            </div>
                                            <RadioButton
                                                value={empresa.public_id}
                                                checked={selected === empresa.public_id}
                                                onSelected={(public_id) => handleSelectChange}
                                            />
                                        </Item>
                                    )
                                })}
                            </Wrapper>
                        </>
                    }
                        <CardText>
                            <p className={styles.subtitulo}>Você pode ter mais de um CNPJ cadastrado, porém às configurações são individuas para cada empresa.</p>
                        </CardText>
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