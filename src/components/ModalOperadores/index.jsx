import Botao from "@components/Botao";
import Frame from "@components/Frame";
import CampoTexto from "@components/CampoTexto";
import Titulo from "@components/Titulo";
import SubTitulo from "@components/SubTitulo";
import { RiCloseFill } from 'react-icons/ri';
import { useState } from "react";
import styled from "styled-components";
import BotaoGrupo from "@components/BotaoGrupo";
import { Overlay, DialogEstilizado } from '@components/Modal/styles';

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const Col6 = styled.div`
    padding: 20px;
    flex: 1 1 50%;
`;

function ModalOperadores({ opened = false, aoFechar, aoSalvar }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const [classError, setClassError] = useState([]);

    const handleSalvar = () => {
        let erros = [];
        if (!firstName.trim()) erros.push('first_name');
        if (!lastName.trim()) erros.push('last_name');
        setClassError(erros);
        if (erros.length === 0) {
            aoSalvar(email, firstName, lastName, password);
        }
    };

    const handleFechar = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setUsername('');
        setClassError([]);
        aoFechar && aoFechar();
    };

    return (
        opened && (
            <Overlay>
                <DialogEstilizado open={opened}>
                    <Frame>
                        <Titulo>
                            <button className="close" onClick={handleFechar}>
                                <RiCloseFill size={20} className="fechar" />
                            </button>
                            <h6>Adicionar Operador</h6>
                        </Titulo>
                    </Frame>
                    <Frame padding="12px 0px">
                        <Col12>
                            <Col6>
                                <CampoTexto
                                    camposVazios={classError}
                                    name="first_name"
                                    valor={firstName}
                                    setValor={setFirstName}
                                    type="text"
                                    label="Primeiro Nome*"
                                    placeholder="Digite o primeiro nome"
                                />
                            </Col6>
                            <Col6>
                                <CampoTexto
                                    camposVazios={classError}
                                    name="last_name"
                                    valor={lastName}
                                    setValor={setLastName}
                                    type="text"
                                    label="Sobrenome*"
                                    placeholder="Digite o sobrenome"
                                />
                            </Col6>
                        </Col12>
                        <Col12>
                            <Col6>
                                <CampoTexto
                                    camposVazios={classError}
                                    name="email"
                                    valor={email}
                                    setValor={setEmail}
                                    type="email"
                                    label="E-mail*"
                                    placeholder="Digite o e-mail"
                                />
                            </Col6>
                            <Col6>
                                <CampoTexto
                                    camposVazios={classError}
                                    name="password"
                                    valor={password}
                                    setValor={setPassword}
                                    type="password"
                                    label="Senha*"
                                    placeholder="Digite a senha"
                                />
                            </Col6>
                        </Col12>
                        <BotaoGrupo align="end">
                            <Botao estilo="neutro" size="medium" aoClicar={handleFechar} filled>Cancelar</Botao>
                            <Botao estilo="vermilion" size="medium" aoClicar={handleSalvar} filled>Salvar</Botao>
                        </BotaoGrupo>
                    </Frame>
                </DialogEstilizado>
            </Overlay>
        )
    );
}

export default ModalOperadores;
