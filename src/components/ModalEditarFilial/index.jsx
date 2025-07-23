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
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import { Col12, Col6, Col4 } from '@components/Colunas';
import { ArmazenadorToken } from "@utils"

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
                    <DialogEstilizado 
                        $width="60vw" 
                        $minWidth="500px"
                        $maxWidth="900px"
                        id="modal-add-departamento" 
                        open={opened}
                    >
                        <Frame>
                            <Titulo>
                                <form method="dialog">
                                    <button className="close" onClick={aoFechar} formMethod="dialog">
                                        <RiCloseFill size={20} className="fechar" />  
                                    </button>
                                </form>
                                <h6>{nome || 'Filial'}</h6>
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
                                        name="nome"
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
                                        placeholder="00.000.000/0000-00"
                                        label="CNPJ da Filial" 
                                        name="cnpj"
                                    />
                                </Col6>
                            </Col12>
                            <Col12>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        valor={logradouro} 
                                        type="text" 
                                        setValor={setLogradouro} 
                                        placeholder="Digite o logradouro"
                                        label="Logradouro da Filial" 
                                        name="logradouro"
                                    />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        valor={numero} 
                                        type="text" 
                                        setValor={setNumero} 
                                        placeholder="Digite o número"
                                        label="Número do endereço da Filial" 
                                        name="numero"
                                    />
                                </Col6>
                            </Col12>
                            <Col12>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        valor={bairro} 
                                        type="text" 
                                        setValor={setBairro} 
                                        placeholder="Digite o bairro"
                                        label="Bairro da Filial" 
                                        name="bairro"
                                    />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        valor={complemento} 
                                        type="text" 
                                        setValor={setComplemento} 
                                        placeholder="Digite o complemento"
                                        label="Complemento da Filial" 
                                        name="complemento"
                                    />
                                </Col6>
                            </Col12>
                            <Col12>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        valor={cidade} 
                                        type="text" 
                                        setValor={setCidade} 
                                        placeholder="Digite a cidade"
                                        label="Cidade da Filial" 
                                        name="cidade"
                                    />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        valor={estado} 
                                        type="text" 
                                        setValor={setEstado} 
                                        placeholder="Digite o estado"
                                        label="Estado da Filial" 
                                        name="estado"
                                    />
                                </Col6>
                            </Col12>
                        </Frame>
                        <form method="dialog">
                            <div className={styles.containerBottom}>
                                <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                                {ArmazenadorToken.hasPermission('change_filial') &&
                                    <Botao aoClicar={() => aoSalvar(nome, cnpj, id)} estilo="vermilion" size="medium" filled>Confirmar</Botao>
                                }
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