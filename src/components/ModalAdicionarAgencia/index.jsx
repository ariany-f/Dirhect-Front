import React, { useState, useEffect } from 'react';
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import Titulo from '@components/Titulo';
import { RiCloseFill } from 'react-icons/ri';
import CampoTexto from '@components/CampoTexto';
import DropdownItens from '@components/DropdownItens';
import Frame from '@components/Frame';
import Botao from '@components/Botao';
import styled from 'styled-components';

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
    min-width: 200px;
`;

const MiddleColumn = styled.div`
    flex: 1;
    min-width: 200px;
`;

const RightColumn = styled.div`
    flex: 1;
    min-width: 200px;
`;

const FourthColumn = styled.div`
    flex: 1;
    min-width: 200px;
`;

// Opções de tipos de agencia
const tiposAgencia = [
    { name: '1 - Matriz', code: 1 },
    { name: '2 - Filial', code: 2 },
    { name: '3 - Posto', code: 3 },
    { name: '4 - Correspondente', code: 4 },
    { name: '5 - Outros', code: 5 }
];

const ModalAdicionarAgencia = ({ opened, aoFechar, aoSalvar, bancoSelecionado }) => {
    const [classError, setClassError] = useState([]);
    const [nome, setNome] = useState('');
    const [numAgencia, setNumAgencia] = useState('');
    const [codCompensacao, setCodCompensacao] = useState('');
    const [tipoAgencia, setTipoAgencia] = useState(null);
    const [telefone, setTelefone] = useState('');
    const [praca, setPraca] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [cep, setCep] = useState('');

    useEffect(() => {
        if (opened) {
            setNome('');
            setNumAgencia('');
            setCodCompensacao('');
            setTipoAgencia(null);
            setTelefone('');
            setPraca('');
            setRua('');
            setNumero('');
            setComplemento('');
            setBairro('');
            setCidade('');
            setEstado('');
            setCep('');
            setClassError([]);
        }
    }, [opened]);

    const validarESalvar = () => {
        let errors = [];
        if (!nome.trim()) errors.push('nome');
        if (!numAgencia.trim()) errors.push('numAgencia');
        if (!tipoAgencia) errors.push('tipoAgencia');
        
        if (errors.length > 0) {
            setClassError(errors);
            return;
        }

        const dadosParaAPI = {
            nome: nome.trim(),
            num_agencia: numAgencia.trim(),
            cod_compensacao: codCompensacao.trim() || null,
            tipo_agencia: tipoAgencia.code,
            telefone: telefone.trim() || null,
            praca: praca.trim() || null,
            rua: rua.trim() || null,
            numero: numero.trim() || null,
            complemento: complemento.trim() || null,
            bairro: bairro.trim() || null,
            cidade: cidade.trim() || null,
            estado: estado.trim() || null,
            cep: cep.trim() || null,
            banco_id: bancoSelecionado.id
        };
        
        aoSalvar(dadosParaAPI);
    };

    return (
        <>
            {opened && (
                <Overlay>
                    <DialogEstilizado open={opened} style={{ maxWidth: '1200px', width: '95vw' }}>
                        <Frame>
                            <Titulo>
                                <button className="close" onClick={aoFechar}>
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                                <h6>
                                    Adicionar Agência
                                    {bancoSelecionado && ` - ${bancoSelecionado.nome}`}
                                </h6>
                            </Titulo>
                        </Frame>
                        
                        <Wrapper>
                            <FormSection>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                    <LeftColumn>
                                        <SectionTitle>Informações Básicas</SectionTitle>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <CampoTexto 
                                                camposVazios={classError.includes('nome') ? ['nome'] : []}
                                                name="nome" 
                                                valor={nome} 
                                                setValor={setNome} 
                                                type="text" 
                                                label="Nome da Agência*" 
                                                placeholder="Digite o nome da agência" 
                                                maxCaracteres={100}
                                            />
                                            
                                            <CampoTexto 
                                                camposVazios={classError.includes('numAgencia') ? ['numAgencia'] : []}
                                                name="numAgencia" 
                                                valor={numAgencia} 
                                                setValor={setNumAgencia} 
                                                type="text" 
                                                label="Número da Agência*" 
                                                placeholder="Digite o número da agência" 
                                                maxCaracteres={20}
                                            />
                                            
                                            <CampoTexto 
                                                name="codCompensacao" 
                                                valor={codCompensacao} 
                                                setValor={setCodCompensacao} 
                                                type="text" 
                                                label="Código de Compensação" 
                                                placeholder="Digite o código de compensação" 
                                                maxCaracteres={20}
                                            />
                                            
                                            <DropdownItens
                                                camposVazios={classError.includes('tipoAgencia') ? ['tipoAgencia'] : []}
                                                name="tipoAgencia"
                                                valor={tipoAgencia}
                                                setValor={setTipoAgencia}
                                                label="Tipo da Agência*"
                                                placeholder="Selecione o tipo"
                                                options={tiposAgencia}
                                                optionLabel="name"
                                            />
                                        </div>
                                    </LeftColumn>

                                    <MiddleColumn>
                                        <SectionTitle>Contato</SectionTitle>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <CampoTexto 
                                                name="telefone" 
                                                valor={telefone} 
                                                setValor={setTelefone} 
                                                type="text" 
                                                label="Telefone" 
                                                placeholder="Digite o telefone" 
                                                maxCaracteres={20}
                                            />

                                            <CampoTexto 
                                                name="praca" 
                                                valor={praca} 
                                                setValor={setPraca} 
                                                type="text" 
                                                label="Praça" 
                                                placeholder="Digite a praça" 
                                                maxCaracteres={100}
                                            />
                                        </div>
                                    </MiddleColumn>

                                    <RightColumn>
                                        <SectionTitle>Endereço</SectionTitle>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <CampoTexto 
                                                name="rua" 
                                                valor={rua} 
                                                setValor={setRua} 
                                                type="text" 
                                                label="Rua" 
                                                placeholder="Digite a rua" 
                                                maxCaracteres={100}
                                            />
                                            
                                            <CampoTexto 
                                                name="numero" 
                                                valor={numero} 
                                                setValor={setNumero} 
                                                type="text" 
                                                label="Número" 
                                                placeholder="Digite o número" 
                                                maxCaracteres={20}
                                            />

                                            <CampoTexto 
                                                name="complemento" 
                                                valor={complemento} 
                                                setValor={setComplemento} 
                                                type="text" 
                                                label="Complemento" 
                                                placeholder="Digite o complemento" 
                                                maxCaracteres={100}
                                            />

                                            <CampoTexto 
                                                name="bairro" 
                                                valor={bairro} 
                                                setValor={setBairro} 
                                                type="text" 
                                                label="Bairro" 
                                                placeholder="Digite o bairro" 
                                                maxCaracteres={100}
                                            />
                                        </div>
                                    </RightColumn>

                                    <FourthColumn>
                                        <SectionTitle>Localização</SectionTitle>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <CampoTexto 
                                                name="cidade" 
                                                valor={cidade} 
                                                setValor={setCidade} 
                                                type="text" 
                                                label="Cidade" 
                                                placeholder="Digite a cidade" 
                                                maxCaracteres={100}
                                            />

                                            <CampoTexto 
                                                name="estado" 
                                                valor={estado} 
                                                setValor={setEstado} 
                                                type="text" 
                                                label="Estado" 
                                                placeholder="Digite o estado" 
                                                maxCaracteres={50}
                                            />

                                            <CampoTexto 
                                                name="cep" 
                                                valor={cep} 
                                                setValor={setCep} 
                                                type="text" 
                                                label="CEP" 
                                                placeholder="Digite o CEP" 
                                                maxCaracteres={10}
                                            />
                                        </div>
                                    </FourthColumn>
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
                                    Salvar Agência
                                </Botao>
                            </ButtonContainer>
                        </Wrapper>
                    </DialogEstilizado>
                </Overlay>
            )}
        </>
    );
};

export default ModalAdicionarAgencia; 