import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import { RiCloseFill } from 'react-icons/ri'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import styles from './ModalEditarFilial.module.css'
import { useDepartamentoContext } from "@contexts/Departamento"

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
    width: 60vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    border: none;
    margin: 0 auto;
    top: 5vh;
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

const Col12 = styled.div`
    display: flex;
    width: 100%;
    gap: 24px;
    flex-wrap: wrap;
`

const Col6 = styled.div`
    flex: 1 1 calc(50% - 12px);
`

const Col4 = styled.div`
    flex: 1 1 1 calc(25% - 8px);
`

function ModalEditarFilial({ opened = false, filial, aoClicar, aoFechar, aoSucesso, aoSalvar }) {
    
    
    const [classError, setClassError] = useState([])
    const [nome, setNome] = useState(filial.nome ?? '')
    const [cnpj, setCNPJ] = useState(filial.cnpj ?? '')
    const [cidade, setCidade] = useState(filial.cidade ?? '')
    const [estado, setEstado] = useState(filial.estado ?? '')
    const [logradouro, setLogradouro] = useState(filial.logradouro ?? '')
    const [complemento, setComplemento] = useState(filial.complemento ?? '')
    const [bairro, setBairro] = useState(filial.bairro ?? '')
    const [numero, setNumero] = useState(filial.numero ?? '')
    const [id, setId] = useState(filial.id)

    useEffect(() => {
        if (filial && opened) {
            setCNPJ(filial.cnpj); // Atualiza o estado interno do modal sempre que a filial mudar
            setNome(filial.nome);
            setCidade(filial.cidade);
            setEstado(filial.estado);
            setLogradouro(filial.logradouro)
            setNumero(filial.numero);
            setComplemento(filial.complemento);
            setBairro(filial.bairro);
            setId(filial.id);
        }
    }, [filial, opened]);


    const navegar = useNavigate()

    return(
        <>
            {opened &&
            <>
                <Overlay>
                    <DialogEstilizado id="modal-add-departamento" open={opened}>
                        <Frame>
                            <Titulo>
                                <form method="dialog">
                                    <button className="close" onClick={aoFechar} formMethod="dialog">
                                        <RiCloseFill size={20} className="fechar" />  
                                    </button>
                                </form>
                                <h6>Editar filial</h6>
                                <SubTitulo>
                                    Digite o nome da filial:
                                </SubTitulo>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="24px 0px">
                            <Col12>
                                <Col6>
                                    <CampoTexto 
                                        numeroCaracteres={50}
                                        camposVazios={classError} 
                                        valor={nome} 
                                        type="text" 
                                        setValor={setNome} 
                                        placeholder="ex. Filial 1"
                                        label="Nome da Filial" 
                                    />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        numeroCaracteres={18}
                                        camposVazios={classError} 
                                        patternMask={['99.999.999/9999-99']} 
                                        valor={cnpj} 
                                        type="text" 
                                        setValor={setCNPJ} 
                                        placeholder=""
                                        label="CNPJ da Filial" 
                                    />
                                </Col6>
                            </Col12>
                            <Col12>
                                <Col4>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        valor={logradouro} 
                                        type="text" 
                                        setValor={setLogradouro} 
                                        placeholder=""
                                        label="Logradouro da Filial" 
                                    />
                                </Col4>
                                <Col4>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        valor={numero} 
                                        type="text" 
                                        setValor={setNumero} 
                                        placeholder=""
                                        label="Número do endereço da Filial" 
                                    />
                                </Col4>
                                <Col4>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        valor={bairro} 
                                        type="text" 
                                        setValor={setBairro} 
                                        placeholder=""
                                        label="Bairro da Filial" 
                                    />
                                </Col4>
                            </Col12>
                            <Col12>
                                <Col4>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        valor={cidade} 
                                        type="text" 
                                        setValor={setCidade} 
                                        placeholder=""
                                        label="Cidade da Filial" 
                                    />
                                </Col4>
                                <Col4>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        valor={estado} 
                                        type="text" 
                                        setValor={setEstado} 
                                        placeholder=""
                                        label="Estado da Filial" 
                                    />
                                </Col4>
                                <Col4>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        valor={complemento} 
                                        type="text" 
                                        setValor={setComplemento} 
                                        placeholder=""
                                        label="Complemento da Filial" 
                                    />
                                </Col4>
                            </Col12>
                        </Frame>
                        <form method="dialog">
                            <div className={styles.containerBottom}>
                                <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                                <Botao aoClicar={() => aoSalvar(nome, cnpj, id)} estilo="vermilion" size="medium" filled>Confirmar</Botao>
                            </div>
                        </form>
                    </DialogEstilizado>
                </Overlay>
            </>
            }
        </>
    )
}

export default ModalEditarFilial