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
    const [key, setKey] = useState(0); // Adicionar esta linha

    // Carrega calendários quando o modal abre
    useEffect(() => {
        if (opened) {
            http.get('calendario/?format=json')
                .then(response => {
                    const calendariosFormatados = response.map(cal => ({
                        name: cal.nome,
                        code: cal.id  // Usar 'code' em vez de 'value'
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
            console.log('Feriado recebido:', feriado);
            console.log('Calendários disponíveis:', calendarios);
            
            setNome(feriado.nome || '');
            setData(feriado.data || '');
            setHoraInicio(feriado.horainicio || '');
            setHoraFim(feriado.horafim || '');
            setId(feriado.id);
            
            // Encontrar o tipo correto baseado no valor
            const tipoSelecionado = tiposFeriado.find(t => t.code == feriado.tipo);
            setTipo(tipoSelecionado || null);

            // Encontrar o calendário correto baseado no valor
            if (feriado.calendario) {
                console.log('Procurando calendário com ID:', feriado.calendario);
                const calendarioSelecionado = calendarios.find(cal => {
                    return cal.code == feriado.calendario;
                });
                console.log('Calendário encontrado:', calendarioSelecionado);
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
        if (!data) errors.push('data');
        if (!tipo) errors.push('tipo');
        if (!horaInicio) errors.push('horainicio');
        if (!horaFim) errors.push('horafim');
        if (!calendario) errors.push('calendario');
        
        if (errors.length > 0) {
            setClassError(errors);
            return;
        }

        const dadosParaAPI = {
            nome: nome.trim(),
            data: data,
            tipo: tipo.code,  // Usar 'code' em vez de 'value'
            horainicio: horaInicio,
            horafim: horaFim,
            calendario: calendario.code
        };
        
        aoSalvar(dadosParaAPI, id);
    };

    // No JSX, remover os templates e usar o padrão simples:
    <DropdownItens
        camposVazios={classError.includes('calendario') ? ['calendario'] : []}
        name="calendario"
        valor={calendario}
        setValor={setCalendario}
        options={calendarios}
        label="Calendário*"
        placeholder="Selecione o calendário"
    />

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
                                <h6>Editar Feriado</h6>
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

                            <Col12>
                                <Col6>
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
                                </Col6>
                            </Col12>

                            <Botao
                                aoClicar={validarESalvar} 
                                estilo="vermilion" 
                                size="medium" 
                                filled
                            >
                                Salvar Alterações
                            </Botao>
                        </Wrapper>
                    </DialogEstilizado>
                </Overlay>
            )}
        </>
    );
}

export default ModalEditarFeriado;