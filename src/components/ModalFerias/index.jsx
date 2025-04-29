import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import CheckboxContainer from '@components/CheckboxContainer'
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import { RiCloseFill } from 'react-icons/ri'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import styles from './ModalFerias.module.css'
import { useDepartamentoContext } from "@contexts/Departamento"
import { Overlay, DialogEstilizado } from '@components/Modal/styles'

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`

const Col6 = styled.div`
    padding: 20px;
    flex: 1 1 50%;
`

const Col4 = styled.div`
    padding: 20px;
    flex: 1 1 25%;
`

const Col4Centered = styled.div`
    display: flex;
    flex: 1 1 25%;
    justify-content: center;
    align-items: center;
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

function ModalFerias({ opened = false, aoClicar, aoFechar, aoSucesso, aoSalvar, colaborador = null }) {

    const [classError, setClassError] = useState([])
    const [dataInicialFerias, setDataInicialFerias] = useState('');
    const [dataFinalFerias, setDataFinalFerias] = useState('');
    const [dataInicialAquisicao, setDataInicialAquisicao] = useState('');
    const [dataFinalAquisicao, setDataFinalAquisicao] = useState('');
    const [diasDeFerias, setDiasDeFerias] = useState(0);
    const [abono, setAbono] = useState('');
    const [decimoTerceiro, setDecimoTerceiro] = useState(false)

    const navegar = useNavigate()

    function handleDiasDeFerias() {
        if (dataInicialFerias && dataFinalFerias) {
            const inicio = new Date(dataInicialFerias);
            const fim = new Date(dataFinalFerias);
            
            if (inicio > fim) {
                setDiasDeFerias(0);
                return;
            }
    
            const diffTime = fim.getTime() - inicio.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir o primeiro dia
    
            setDiasDeFerias(diffDays);
        }
    }

    useEffect(() => {
        if (dataInicialFerias && dataFinalFerias) {
            const inicio = new Date(dataInicialFerias);
            const fim = new Date(dataFinalFerias);

            if (inicio > fim) {
                setDiasDeFerias(0);
                return;
            }

            const diffTime = fim.getTime() - inicio.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir o primeiro dia

            setDiasDeFerias(diffDays);
        } else {
            setDiasDeFerias(0);
        }
    }, [dataInicialFerias, dataFinalFerias]);
    

    return(
        <>
            {opened &&
            <>
                <Overlay>
                    <DialogEstilizado open={opened}>
                        <Frame>
                            <Titulo>
                                <button className="close" onClick={aoFechar}>
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                                <h6>Solicitação de Férias</h6>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="12px 0px">
                            <Col12>
                                <Col6>
                                    <Col12>
                                        <SubTitulo>Período Aquisitivo</SubTitulo>
                                    </Col12>
                                    <Col12>
                                        <Col6>
                                            <CampoTexto
                                                camposVazios={classError}
                                                name="data_inicial_aquisition"
                                                valor={dataInicialAquisicao}
                                                setValor={setDataInicialAquisicao}
                                                type="date"
                                                label="Data Inicial"
                                                placeholder="Selecione a data inicial"
                                            />
                                        </Col6>
                                        <Col6>
                                            <CampoTexto
                                                camposVazios={classError}
                                                name="data_final_aquisition"
                                                valor={dataFinalAquisicao}
                                                setValor={setDataFinalAquisicao}
                                                type="date"
                                                label="Data Final"
                                                placeholder="Selecione a data final"
                                            />
                                        </Col6>
                                    </Col12>
                                </Col6>
                                <Col6>
                                    <Col12>
                                        <SubTitulo>Férias</SubTitulo>
                                    </Col12>
                                    <Col12>
                                        <Col6>
                                            <CampoTexto
                                                camposVazios={classError}
                                                name="data_inicial_ferias"
                                                valor={dataInicialFerias}
                                                setValor={setDataInicialFerias}
                                                type="date"
                                                label="Data Inicial"
                                                placeholder="Selecione a data inicial"
                                            />
                                        </Col6>
                                        <Col6>
                                            <CampoTexto
                                                camposVazios={classError}
                                                name="data_final_ferias"
                                                valor={dataFinalFerias}
                                                setValor={setDataFinalFerias}
                                                type="date"
                                                label="Data Final"
                                                placeholder="Selecione a data final"
                                            />
                                        </Col6>
                                    </Col12>
                                </Col6>
                            </Col12>
                            <Col12>
                                <Col4Centered>
                                    <CheckboxContainer fontSize="16px" name="decimo" valor={decimoTerceiro} setValor={() => setDecimoTerceiro(!decimoTerceiro)} label="13º Salário"/>
                                </Col4Centered>
                                <Col4>
                                    <CampoTexto
                                        camposVazios={classError}
                                        name="abono"
                                        valor={abono}
                                        setValor={setAbono}
                                        type="number"
                                        label="Abono"
                                        placeholder="Digite o abono"
                                    />
                                </Col4>
                                <Col4>
                                    <CampoTexto
                                        camposVazios={classError}
                                        name="dias_ferias"
                                        valor={diasDeFerias}
                                        setValor={setDiasDeFerias}
                                        type="number"
                                        label="Dias de Férias"
                                        placeholder="Dias de férias"
                                        disabled
                                    />
                                </Col4>
                            </Col12>
                        </Frame>
                        <div className={styles.containerBottom}>
                            <Botao
                                aoClicar={aoFechar} 
                                estilo="neutro" 
                                size="medium" 
                                filled
                            >
                                Cancelar
                            </Botao>
                            <Botao
                                aoClicar={aoSalvar} 
                                estilo="vermilion" 
                                size="medium" 
                                filled
                            >
                                Salvar
                            </Botao>
                        </div>
                    </DialogEstilizado>
                </Overlay>
            </>
            }
        </>
    )
}

export default ModalFerias