import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import DropdownItens from "@components/DropdownItens" 
import { RiCloseFill } from 'react-icons/ri'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import styles from './ModalAdicionarCentroCusto.module.css'
import { useDepartamentoContext } from "@contexts/Departamento"
import { Overlay, DialogEstilizado } from '@components/Modal/styles'
import { useTranslation } from "react-i18next"

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

function ModalAdicionarCentroCusto({ opened = false, aoClicar, aoFechar, aoSucesso, aoSalvar, centros_custo = [] }) {

    const [classError, setClassError] = useState([])
    const [nome, setNome] = useState('')
    const [cc_pai, setCCPai] = useState('')
    const [centros, setCentros] = useState([])
    const { t } = useTranslation('common');

    const navegar = useNavigate()

    useEffect(() =>{
        if ((centros_custo && centros_custo.length > 0)) {
            setCentros((estadoAnterior) => {
                const novosCentros = centros_custo.map((item) => ({
                    name: item.nome,
                    code: item.cc_origem
                }));
                return [...estadoAnterior, ...novosCentros];
            });
        }
    }, [centros_custo])

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
                                <h6>Criar Centro de Custo</h6>
                                <SubTitulo>
                                    Digite o nome do seu novo centro de custo:
                                </SubTitulo>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="24px 0px">
                            <DropdownItens camposVazios={classError} valor={cc_pai} setValor={setCCPai} options={centros} label="Centro de Custo Pai" name="cc_pai" placeholder="Centro de Custo Pai"/>
                            <br/><br/>
                            <CampoTexto 
                                    numeroCaracteres={50}
                                    camposVazios={classError} 
                                    valor={nome} 
                                    type="text" 
                                    setValor={setNome} 
                                    placeholder=""
                                    label="Nome do centro de custo" 
                                />
                        </Frame>
                        <form method="dialog">
                            <div className={styles.containerBottom}>
                                <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>{t('back')}</Botao>
                                <Botao aoClicar={() => aoSalvar(nome, cc_pai)} estilo="vermilion" size="medium" filled>{t('confirm')}</Botao>
                            </div>
                        </form>
                    </DialogEstilizado>
                </Overlay>
            </>
            }
        </>
    )
}

export default ModalAdicionarCentroCusto