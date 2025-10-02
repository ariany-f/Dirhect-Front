import { useState, useEffect } from "react";
import { RiCloseFill } from 'react-icons/ri';
import styled from "styled-components";
import Botao from "@components/Botao";
import Frame from "@components/Frame";
import CampoTexto from "@components/CampoTexto";
import Titulo from "@components/Titulo";
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import DropdownItens from "@components/DropdownItens";
import Texto from "@components/Texto";

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 24px;
    padding: 24px;
    width: 100%;
`;

const Col6 = styled.div`
    flex: 1 1 calc(50% - 12px);
    min-width: 280px;
`;

const Col4 = styled.div`
    flex: 1 1 calc(33.333% - 16px);
    min-width: 200px;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    width: 100%;
`;

const FormSection = styled.div`
    border-radius: 12px;
    padding: 24px 2px;
    width: 100%;
`;

const SectionTitle = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 20px;
    padding-bottom: 12px;
    position: relative;
    
    &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 40px;
        height: 2px;
        background: var(--primaria);
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
    padding-top: 20px;
`;

const LeftColumn = styled.div`
    flex: 1;
    min-width: 300px;
`;

const RightColumn = styled.div`
    flex: 0 0 200px;
    min-width: 200px;
`;

function ModalAdicionarFeriado({ opened = false, aoFechar, aoSalvar, calendarioSelecionado }) {
    const [classError, setClassError] = useState([]);
    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [tipo, setTipo] = useState(null);
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFim, setHoraFim] = useState('');

    const tiposFeriado = [
        { name: '1 - Nacional', code: '1' },
        { name: '2 - Estadual', code: '2' },
        { name: '3 - Municipal', code: '3' }
    ];

    // Debug: vamos verificar se os dados estão corretos
    console.log('tiposFeriado:', tiposFeriado);

    useEffect(() => {
        if (opened) {
            setNome('');
            setData('');
            setTipo(null);
            setHoraInicio('00:00');
            setHoraFim('23:59');
            setClassError([]);
        }
    }, [opened]);

    const validarESalvar = () => {
        let errors = [];
        if (!nome.trim()) errors.push('nome');
        if (!data.trim()) errors.push('data');
        if (!tipo) errors.push('tipo');
        
        if (errors.length > 0) {
            setClassError(errors);
            return;
        }

        const dadosParaAPI = {
            nome: nome.trim(),
            data: data,
            tipo: tipo.code,
            hora_inicio: horaInicio || null,
            hora_fim: horaFim || null,
            calendario: calendarioSelecionado.id
        };
        
        aoSalvar(dadosParaAPI);
    };

    // Remover a validação que desabilita o botão
    // const isFormValid = nome.trim() && data.trim() && tipo && calendarioSelecionado;

    return (
        <>
            {opened && (
                <Overlay>
                    <DialogEstilizado open={opened} style={{ maxWidth: '800px', width: '90vw' }}>
                        <Frame>
                            <Titulo>
                                <button className="close" onClick={aoFechar}>
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                                <h6>
                                    Adicionar Feriado
                                    {calendarioSelecionado && ` - ${calendarioSelecionado.nome}`}
                                </h6>
                            </Titulo>
                        </Frame>
                        
                        <Wrapper>
                            <FormSection>
                                <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
                                    <LeftColumn>
                                        <SectionTitle>Informações do Feriado</SectionTitle>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <CampoTexto 
                                                camposVazios={classError.includes('nome') ? ['nome'] : []}
                                                name="nome" 
                                                valor={nome} 
                                                setValor={setNome} 
                                                type="text" 
                                                label="Nome do Feriado*" 
                                                placeholder="Digite o nome do feriado" 
                                                maxCaracteres={100}
                                            />
                                            
                                            <CampoTexto 
                                                camposVazios={classError.includes('data') ? ['data'] : []}
                                                name="data" 
                                                valor={data} 
                                                setValor={setData} 
                                                type="date" 
                                                label="Data do Feriado*" 
                                                placeholder="Selecione a data" 
                                            />
                                            
                                            <DropdownItens
                                                camposVazios={classError.includes('tipo') ? ['tipo'] : []}
                                                name="tipo"
                                                valor={tipo}
                                                setValor={setTipo}
                                                label="Tipo do Feriado*"
                                                placeholder="Selecione o tipo"
                                                options={tiposFeriado}
                                                optionLabel="name"
                                            />
                                        </div>
                                    </LeftColumn>

                                    <RightColumn>
                                        <SectionTitle>Horários (Opcional)</SectionTitle>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <CampoTexto 
                                                name="hora_inicio" 
                                                valor={horaInicio} 
                                                setValor={setHoraInicio} 
                                                type="time" 
                                                label="Hora de Início" 
                                                placeholder="Selecione a hora de início" 
                                            />
                                            
                                            <CampoTexto 
                                                name="hora_fim" 
                                                valor={horaFim} 
                                                setValor={setHoraFim} 
                                                type="time" 
                                                label="Hora de Fim" 
                                                placeholder="Selecione a hora de fim" 
                                            />
                                        </div>
                                    </RightColumn>
                                </div>
                            </FormSection>

                            <ButtonContainer>
                                <Botao
                                    aoClicar={aoFechar}
                                    estilo="neutro"
                                    size="medium"
                                >
                                    Cancelar
                                </Botao>
                                <Botao
                                    aoClicar={validarESalvar} 
                                    estilo="vermilion" 
                                    size="medium" 
                                    filled
                                >
                                    Salvar Feriado
                                </Botao>
                            </ButtonContainer>
                        </Wrapper>
                    </DialogEstilizado>
                </Overlay>
            )}
        </>
    );
}

export default ModalAdicionarFeriado;