import { useState } from "react";
import { RiCloseFill } from 'react-icons/ri';
import styled from "styled-components";
import Botao from "@components/Botao";
import Frame from "@components/Frame";
import CampoTexto from "@components/CampoTexto";
import DropdownItens from "@components/DropdownItens";
import Titulo from "@components/Titulo";
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import styles from './ModalAdicionarFeriado.module.css';

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

const Col4 = styled.div`
    flex: 1 1 calc(33.333% - 11px);
    min-width: 200px;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
`;

// Opções de tipos de feriado
const tiposFeriado = [
    { name: '1 - Nacional', value: '1' },
    { name: '2 - Estadual', value: '2' },
    { name: '3 - Municipal', value: '3' }
];

function ModalAdicionarFeriado({ opened = false, aoFechar, aoSalvar }) {
    const [classError, setClassError] = useState([]);
    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [tipo, setTipo] = useState(null);
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFim, setHoraFim] = useState('');

    const validarESalvar = () => {
        let errors = [];
        if (!nome.trim()) errors.push('nome');
        if (!data) errors.push('data');
        if (!tipo) errors.push('tipo');
        if (!horaInicio) errors.push('horainicio');
        if (!horaFim) errors.push('horafim');
        
        if (errors.length > 0) {
            setClassError(errors);
            return;
        }

        const dadosParaAPI = {
            nome: nome.trim(),
            data: data,
            tipo: tipo,
            horainicio: horaInicio,
            horafim: horaFim
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
                                <h6>Novo Feriado</h6>
                            </Titulo>
                        </Frame>
                        
                        <Wrapper>
                            <Col12>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError.includes('nome') ? ['nome'] : []}
                                        name="nome" 
                                        valor={nome} 
                                        setValor={setNome} 
                                        type="text" 
                                        label="Nome*" 
                                        placeholder="Digite o nome do feriado" 
                                    />
                                </Col6>
                                
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError.includes('data') ? ['data'] : []}
                                        name="data" 
                                        valor={data} 
                                        setValor={setData} 
                                        type="date" 
                                        label="Data*" 
                                        placeholder="Selecione a data" 
                                    />
                                </Col6>
                            </Col12>

                            <Col12>
                                <Col4>
                                    <DropdownItens
                                        camposVazios={classError.includes('tipo') ? ['tipo'] : []}
                                        name="tipo"
                                        valor={tipo}
                                        setValor={setTipo}
                                        options={tiposFeriado}
                                        label="Tipo*"
                                        placeholder="Selecione o tipo"
                                        optionLabel="name"
                                    />
                                </Col4>

                                <Col4>
                                    <CampoTexto 
                                        camposVazios={classError.includes('horainicio') ? ['horainicio'] : []}
                                        name="horainicio" 
                                        valor={horaInicio} 
                                        setValor={setHoraInicio} 
                                        type="time" 
                                        label="Hora Início*" 
                                        placeholder="00:00" 
                                    />
                                </Col4>
                                
                                <Col4>
                                    <CampoTexto 
                                        camposVazios={classError.includes('horafim') ? ['horafim'] : []}
                                        name="horafim" 
                                        valor={horaFim} 
                                        setValor={setHoraFim} 
                                        type="time" 
                                        label="Hora Fim*" 
                                        placeholder="23:59" 
                                    />
                                </Col4>
                            </Col12>

                            <Botao
                                aoClicar={validarESalvar} 
                                estilo="vermilion" 
                                size="medium" 
                                filled
                            >
                                Salvar Feriado
                            </Botao>
                        </Wrapper>
                    </DialogEstilizado>
                </Overlay>
            )}
        </>
    );
}

export default ModalAdicionarFeriado;