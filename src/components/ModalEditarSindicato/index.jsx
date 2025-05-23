import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import { RiCloseFill } from 'react-icons/ri'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import styles from './ModalEditarSindicato.module.css'
import { useDepartamentoContext } from "@contexts/Departamento"
import { Overlay, DialogEstilizado } from '@components/Modal/styles';

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

function ModalEditarSindicato({ opened = false, sindicato, aoClicar, aoFechar, aoSucesso, aoSalvar }) {
    
    
    const [classError, setClassError] = useState([])
    const [descricao, setDescricao] = useState(sindicato.descricao ?? '')
    const [codigo, setCodigo] = useState(sindicato.codigo ?? '')
    const [cnpj, setCNPJ] = useState(sindicato.cnpj ?? '')
    const [id, setId] = useState(sindicato.id)

    useEffect(() => {
        if (sindicato && opened) {
            setCNPJ(sindicato.cnpj); // Atualiza o estado interno do modal sempre que a sindicato mudar
            setDescricao(sindicato.descricao);
            setCodigo(sindicato.codigo);
            setId(sindicato.id);
        }
    }, [sindicato, opened]);


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
                                <h6>Editar sindicato</h6>
                                <SubTitulo>
                                    Digite o descricao da sindicato:
                                </SubTitulo>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="24px 0px">
                                <CampoTexto 
                                    numeroCaracteres={4}
                                    camposVazios={classError} 
                                    valor={codigo} 
                                    type="text" 
                                    setValor={setCodigo} 
                                    placeholder="ex. 1111"
                                    label="Código do Sindicato" 
                                />
                                <CampoTexto 
                                    numeroCaracteres={18}
                                    camposVazios={classError} 
                                    patternMask={['99.999.999/9999-99']} 
                                    valor={cnpj} 
                                    type="text" 
                                    setValor={setCNPJ} 
                                    placeholder=""
                                    label="CNPJ do Sindicato" 
                                />
                                <CampoTexto 
                                    numeroCaracteres={50}
                                    camposVazios={classError} 
                                    valor={descricao} 
                                    type="text" 
                                    setValor={setDescricao} 
                                    placeholder="ex. Sindicato 1"
                                    label="Descrição do Sindicato" 
                                />
                        </Frame>
                        <form method="dialog">
                            <div className={styles.containerBottom}>
                                <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                                <Botao aoClicar={() => aoSalvar(cnpj, codigo, descricao, id)} estilo="vermilion" size="medium" filled>Confirmar</Botao>
                            </div>
                        </form>
                    </DialogEstilizado>
                </Overlay>
            </>
            }
        </>
    )
}

export default ModalEditarSindicato