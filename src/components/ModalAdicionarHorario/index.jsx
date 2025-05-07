import { useState } from "react";
import { RiCloseFill } from 'react-icons/ri';
import styled from "styled-components";
import Botao from "@components/Botao";
import Frame from "@components/Frame";
import CampoTexto from "@components/CampoTexto";
import Titulo from "@components/Titulo";
import { Overlay, DialogEstilizado } from '@components/Modal/styles';

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
    width: 100%;
`;

const Col6 = styled.div`
    flex: 1 1 calc(50% - 8px);
    min-width: 250px;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
`;

function ModalAdicionarHorario({ opened = false, aoFechar, aoSalvar }) {
    const [classError, setClassError] = useState([]);
    const [codigo, setCodigo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [jornada, setJornada] = useState('');

    const validarESalvar = () => {
        let errors = [];
        if (!codigo.trim()) errors.push('codigo');
        if (!descricao.trim()) errors.push('descricao');
        if (!jornada.trim()) errors.push('jornada');
        
        if (errors.length > 0) {
            setClassError(errors);
            return;
        }

        const dadosParaAPI = {
            codigo: codigo.trim(),
            descricao: descricao.trim(),
            jornada: jornada.trim()
        };
        aoSalvar(dadosParaAPI);
    };

    return (
        <>
            {opened && (
                <Overlay>
                    <DialogEstilizado open={opened}>
                        <Frame>
                            <Titulo>
                                <button className="close" onClick={aoFechar}>
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                                <h6>Novo Horário</h6>
                            </Titulo>
                        </Frame>
                        <Wrapper>
                            <Col12>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError.includes('codigo') ? ['codigo'] : []}
                                        name="codigo" 
                                        valor={codigo} 
                                        setValor={setCodigo} 
                                        type="text" 
                                        label="Código*" 
                                        placeholder="Digite o código" 
                                    />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError.includes('jornada') ? ['jornada'] : []}
                                        name="jornada" 
                                        valor={jornada} 
                                        setValor={setJornada} 
                                        type="text" 
                                        label="Jornada*" 
                                        placeholder="Digite a jornada" 
                                    />
                                </Col6>
                            </Col12>
                            <Col12>
                                <CampoTexto 
                                    camposVazios={classError.includes('descricao') ? ['descricao'] : []}
                                    name="descricao" 
                                    valor={descricao} 
                                    setValor={setDescricao} 
                                    type="text" 
                                    label="Descrição*" 
                                    placeholder="Digite a descrição" 
                                />
                            </Col12>
                            <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'flex-end' }}>
                                <Botao
                                    aoClicar={aoFechar} 
                                    estilo="neutro" 
                                    size="medium" 
                                    filled
                                >
                                    Cancelar
                                </Botao>
                                <Botao
                                    aoClicar={validarESalvar} 
                                    estilo="vermilion" 
                                    size="medium" 
                                    filled
                                >
                                    Salvar Horário
                                </Botao>
                            </div>
                        </Wrapper>
                    </DialogEstilizado>
                </Overlay>
            )}
        </>
    );
}

export default ModalAdicionarHorario;
