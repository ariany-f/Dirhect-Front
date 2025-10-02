import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import DropdownItens from "@components/DropdownItens"
import Titulo from "@components/Titulo"
import { RiCloseFill } from 'react-icons/ri'
import { useEffect, useState } from "react"
import styled from "styled-components"
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import { ArmazenadorToken } from "@utils"
import http from "@http"

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

// Opções de tipos de feriado
const tiposFeriado = [
    { name: '1 - Nacional', code: '1' },
    { name: '2 - Estadual', code: '2' },
    { name: '3 - Municipal', code: '3' }
];

function ModalEditarFeriado({ opened = false, feriado, aoFechar, aoSalvar }) {
    const [classError, setClassError] = useState([]);
    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [tipo, setTipo] = useState(null);
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFim, setHoraFim] = useState('');
    const [calendario, setCalendario] = useState(null);
    const [calendarios, setCalendarios] = useState([]);
    const [id, setId] = useState(null);
    const [key, setKey] = useState(0);

    // Carrega calendários quando o modal abre
    useEffect(() => {
        if (opened) {
            http.get('calendario/?format=json')
                .then(response => {
                    const calendariosFormatados = response.map(cal => ({
                        name: cal.nome,
                        code: cal.id
                    }));
                    setCalendarios(calendariosFormatados);
                })
                .catch(error => {
                    console.error('Erro ao carregar calendários:', error);
                });
        }
    }, [opened]);

    // Efeito para preencher os campos quando estiver editando
    useEffect(() => {
        if (feriado && opened && calendarios.length > 0) {
            setNome(feriado.nome || '');
            setData(feriado.data || '');
            setHoraInicio(feriado.horainicio || '00:00');
            setHoraFim(feriado.horafim || '23:59');
            setId(feriado.id);
            
            // Encontrar o tipo correto baseado no valor
            const tipoSelecionado = tiposFeriado.find(t => t.code == feriado.tipo);
            setTipo(tipoSelecionado || null);

            // Encontrar o calendário correto baseado no valor
            if (feriado.calendario) {
                const calendarioSelecionado = calendarios.find(cal => {
                    return cal.code == feriado.calendario;
                });
                setCalendario(calendarioSelecionado || null);
            }
        } else if (!opened) {
            // Limpa os campos quando fecha o modal
            setNome('');
            setData('');
            setHoraInicio('');
            setHoraFim('');
            setTipo(null);
            setCalendario(null);
            setId(null);
            setClassError([]);
        }
    }, [feriado, opened, calendarios]);

    const validarESalvar = () => {
        let errors = [];
        if (!nome.trim()) errors.push('nome');
        if (!data.trim()) errors.push('data');
        if (!tipo) errors.push('tipo');
        if (!calendario) errors.push('calendario');
        
        if (errors.length > 0) {
            setClassError(errors);
            return;
        }

        const dadosParaAPI = {
            nome: nome.trim(),
            data: data,
            tipo: tipo.code,
            horainicio: horaInicio || null,
            horafim: horaFim || null,
            calendario: calendario.code
        };
        
        aoSalvar(dadosParaAPI, id);
    };

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
                                <h6>Editar Feriado</h6>
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

                                            <DropdownItens
                                                key={key}
                                                camposVazios={classError.includes('calendario') ? ['calendario'] : []}
                                                name="calendario"
                                                valor={calendario}
                                                setValor={setCalendario}
                                                options={calendarios}
                                                label="Calendário*"
                                                placeholder="Selecione o calendário"
                                            />
                                        </div>
                                    </LeftColumn>

                                    <RightColumn>
                                        <SectionTitle>Horários (Opcional)</SectionTitle>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <CampoTexto 
                                                name="horainicio" 
                                                valor={horaInicio} 
                                                setValor={setHoraInicio} 
                                                type="time" 
                                                label="Hora de Início" 
                                                placeholder="Selecione a hora de início" 
                                            />
                                            
                                            <CampoTexto 
                                                name="horafim" 
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
                                    Salvar Alterações
                                </Botao>
                            </ButtonContainer>
                        </Wrapper>
                    </DialogEstilizado>
                </Overlay>
            )}
        </>
    );
}

export default ModalEditarFeriado;