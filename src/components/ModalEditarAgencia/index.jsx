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

// Opções de tipos de agencia
const tiposAgencia = [
    { name: '1 - Nacional', code: '1' },
    { name: '2 - Estadual', code: '2' },
    { name: '3 - Municipal', code: '3' }
];

function ModalEditarAgencia({ opened = false, agencia, aoFechar, aoSalvar }) {
    const [classError, setClassError] = useState([]);
    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [tipo, setTipo] = useState(null);
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFim, setHoraFim] = useState('');
    const [banco, setBanco] = useState(null);
    const [bancos, setBancos] = useState([]);
    const [id, setId] = useState(null);
    const [key, setKey] = useState(0);

    // Carrega calendários quando o modal abre
    useEffect(() => {
        if (opened) {
            http.get('banco/?format=json')
                .then(response => {
                    const bancosFormatados = response.map(cal => ({
                        name: cal.nome,
                        code: cal.id
                    }));
                    setBancos(bancosFormatados);
                })
                .catch(error => {
                    console.error('Erro ao carregar calendários:', error);
                });
        }
    }, [opened]);

    // Efeito para preencher os campos quando estiver editando
    useEffect(() => {
        if (agencia && opened && bancos.length > 0) {
            setNome(agencia.nome || '');
            setData(agencia.data || '');
            setHoraInicio(agencia.horainicio || '00:00');
            setHoraFim(agencia.horafim || '23:59');
            setId(agencia.id);
            
            // Encontrar o tipo correto baseado no valor
            const tipoSelecionado = tiposAgencia.find(t => t.code == agencia.tipo);
            setTipo(tipoSelecionado || null);

            // Encontrar o calendário correto baseado no valor
            if (agencia.banco) {
                const bancoSelecionado = bancos.find(cal => {
                    return cal.code == agencia.banco;
                });
                setBanco(bancoSelecionado || null);
            }
        } else if (!opened) {
            // Limpa os campos quando fecha o modal
            setNome('');
            setData('');
            setHoraInicio('');
            setHoraFim('');
            setTipo(null);
            setBanco(null);
            setId(null);
            setClassError([]);
        }
    }, [agencia, opened, bancos]);

    const validarESalvar = () => {
        let errors = [];
        if (!nome.trim()) errors.push('nome');
        if (!data.trim()) errors.push('data');
        if (!tipo) errors.push('tipo');
        if (!banco) errors.push('banco');
        
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
            banco: banco.code
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
                                <h6>Editar Agencia</h6>
                            </Titulo>
                        </Frame>
                        
                        <Wrapper>
                            <FormSection>
                                <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
                                    <LeftColumn>
                                        <SectionTitle>Informações do Agencia</SectionTitle>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <CampoTexto 
                                                camposVazios={classError.includes('nome') ? ['nome'] : []}
                                                name="nome" 
                                                valor={nome} 
                                                setValor={setNome} 
                                                type="text" 
                                                label="Nome do Agencia*" 
                                                placeholder="Digite o nome do agencia" 
                                                maxCaracteres={100}
                                            />
                                            
                                            <CampoTexto 
                                                camposVazios={classError.includes('data') ? ['data'] : []}
                                                name="data" 
                                                valor={data} 
                                                setValor={setData} 
                                                type="date" 
                                                label="Data do Agencia*" 
                                                placeholder="Selecione a data" 
                                            />
                                            
                                            <DropdownItens
                                                camposVazios={classError.includes('tipo') ? ['tipo'] : []}
                                                name="tipo"
                                                valor={tipo}
                                                setValor={setTipo}
                                                label="Tipo do Agencia*"
                                                placeholder="Selecione o tipo"
                                                options={tiposAgencia}
                                                optionLabel="name"
                                            />

                                            <DropdownItens
                                                key={key}
                                                camposVazios={classError.includes('banco') ? ['banco'] : []}
                                                name="banco"
                                                valor={banco}
                                                setValor={setBanco}
                                                options={bancos}
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

export default ModalEditarAgencia;