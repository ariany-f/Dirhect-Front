import React, { useState, useEffect } from 'react';
import CampoTexto from '@components/CampoTexto'; // Importando o componente CampoTexto
import BotaoVoltar from '@components/BotaoVoltar'; // Importando o componente CampoTexto
import Container from '@components/Container'; // Importando o componente Container
import Botao from '@components/Botao'; // Importando o componente Container
import Frame from '@components/Frame'; // Importando o componente Container
import DropdownItens from '@components/DropdownItens'
import Titulo from '@components/Titulo'; // Importando o componente Container
import styled from "styled-components"
import { useNavigate, useOutletContext } from 'react-router-dom';
import http from '@http'
import axios from "axios"

const Overlay = styled.div`
    background-color: rgba(0,0,0,0.80);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`

const DialogEstilizado = styled.dialog`
    display: flex;
    width: 40vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    border: none;
    margin: 0 auto;
    top: 22vh;
    padding: 24px;
    & button.close {
        & .fechar {
            box-sizing: initial;
            fill: var(--primaria);
            stroke: var(--primaria);
            color: var(--primaria);
        }
        position: absolute;
        right: 20px;
        top: 20px;
        cursor: pointer;
        border: none;
        background-color: initial;
    }
    & .icon {
        margin-right: 5px;
        box-sizing: initial;
        fill: var(--primaria);
        stroke: var(--primaria);
        color: var(--primaria);
    }
    & .frame:nth-of-type(1) {
        gap: 24px;
        & .frame {
            margin-bottom: 24px;
            & p{
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            & b {
                font-weight: 800;
                font-size: 14px;
            }
        }
    }
`

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`

const Col6 = styled.div`
    padding: 10px;
    flex: 1 1 50%;
`


const CandidatoRegistroDadosGerais = () => {

    const [classError, setClassError] = useState([])

    const [candidato, setCandidato] = useState(null)
    const context = useOutletContext();
    
    const [estados, setEstados] = useState([]);
   
    const navegar = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();        
    };

  
    const setCandidatoEndereco = (field, value) => {
        setCandidato((estadoAnterior) => ({
            ...estadoAnterior,
            endereco: {
                ...estadoAnterior.endereco,
                [field]: value,
            },
        }));
    };
    const setStreet = (street) => setCandidatoEndereco("street", street);
    const setCep = (cep) => setCandidatoEndereco("cep", cep);
    const setDistrict = (district) => setCandidatoEndereco("district", district);
    const setComplemento = (complement) => setCandidatoEndereco("complement", complement);
    const setState = (state) => setCandidatoEndereco("state", state);
    const setCity = (city) => setCandidatoEndereco("city", city);
    const setNumber = (number) => setCandidatoEndereco("number", number);

    const setDataNascimento = (dataNascimento) => {
        setCandidato(estadoAnterior => {
            return {
                ...estadoAnterior,
                dataNascimento
            }
        })
    }

    const setName = (nome) => {
        setCandidato(estadoAnterior => {
            return {
                ...estadoAnterior,
                nome
            }
        })
    }

    const setEmail = (email) => {
        setCandidato(estadoAnterior => {
            return {
                ...estadoAnterior,
                email
            }
        })
    }

    const setCpf = (cpf) => {
        setCandidato(estadoAnterior => {
            return {
                ...estadoAnterior,
                cpf
            }
        })
    }

    useEffect(() => {
        if((context) && (!candidato))
        {
            setCandidato(context)
        }

        if(!estados.length)
        {
            http.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                    response.map((item) => {
                        let obj = {
                            name: item.nome,
                            code: item.sigla
                        }
                        if(!estados.includes(obj))
                        {
                            setEstados(estadoAnterior => [...estadoAnterior, obj]);
                        }
                    })
                })
        }
    }, [context])

    const ChangeCep = (value) => 
    {
        setCep(value)
        if(value.length > 8)
        {
            axios.get(`https://viacep.com.br/ws/${value.replace('-', '')}/json`)
            .then((response) => {
                if(response.data)
                {
                    setStreet(response.data.logradouro)
                    setDistrict(response.data.bairro)
                    setCity(response.data.localidade)
                    setState(response.data.uf)
                }
            })
        }
    }
    

    return (
    <Container>
        <h3>Dados Gerais</h3>
        <form onSubmit={handleSubmit}>
            <CampoTexto 
                camposVazios={classError}
                name="nome" 
                valor={candidato?.nome ?? ''} 
                setValor={setName} 
                type="text" 
                label="Nome" 
                placeholder="Digite o nome" />

            <CampoTexto 
                camposVazios={classError}
                name="email" 
                valor={candidato?.email ?? ''} 
                setValor={setEmail} 
                type="text" 
                label="E-mail" 
                placeholder="Digite o email" />
                
            <CampoTexto 
                type="date" 
                valor={candidato?.dataNascimento} 
                setValor={setDataNascimento}
                label="Data de Nascimento"  />
            
            <CampoTexto 
                camposVazios={classError} 
                patternMask={['999.999.999-99', '99.999.999/9999-99']} 
                name="cpf" 
                valor={candidato?.cpf} 
                setValor={setCpf} 
                type="text" 
                label="CPF" 
                placeholder="Digite p CPF" />

            <Frame padding="24px 0px">
                <Titulo>
                    <h5>Endereço</h5>
                </Titulo>
                <div style={{height: '35vh', overflowY: 'scroll', flexWrap: 'wrap', marginTop: '15px'}}>
                    <Col12 >
                        <Col6>
                            <CampoTexto 
                                camposVazios={classError} 
                                patternMask={['99999-999']} 
                                name="cep" 
                                valor={candidato?.endereco?.cep} 
                                setValor={ChangeCep} 
                                type="text" 
                                label="CEP" 
                                placeholder="Digite o CEP" />
                        </Col6>
                    </Col12>
                    <Col12>
                        <Col6>
                            <CampoTexto 
                                camposVazios={classError} 
                                name="street" 
                                valor={candidato?.endereco?.street} 
                                setValor={setStreet} 
                                type="text" 
                                label="Logradouro" 
                                placeholder="Digite o logradouro" />
                        </Col6>
                        <Col6>
                            <CampoTexto 
                                camposVazios={classError} 
                                name="district" 
                                valor={candidato?.endereco?.district} 
                                setValor={setDistrict} 
                                type="text" 
                                label="Bairro" 
                                placeholder="Digite o Bairro" />
                        </Col6>
                        <Col6>
                            <CampoTexto 
                                camposVazios={classError} 
                                name="number" 
                                valor={candidato?.endereco?.number} 
                                setValor={setNumber} 
                                type="text" 
                                label="Número" 
                                placeholder="Digite o número" />
                        </Col6>
                        <Col6>
                            <CampoTexto 
                                name="complement" 
                                valor={candidato?.endereco?.complement} 
                                setValor={setComplemento} 
                                type="text" 
                                label="Complemento (opcional)" 
                                placeholder="Digite o complemento" />
                        </Col6>
                        <Col6>
                            <CampoTexto 
                                camposVazios={classError} 
                                name="city" 
                                valor={candidato?.endereco?.city} 
                                setValor={setCity} 
                                type="text" 
                                label="Cidade" 
                                placeholder="Digite a cidade" />
                        </Col6>
                        <Col6>
                            <DropdownItens 
                                camposVazios={classError} 
                                valor={candidato?.endereco?.state} 
                                setValor={setState} 
                                options={estados} 
                                label="UF" 
                                name="state" 
                                placeholder="Digite a UF"/>
                        </Col6>
                    </Col12>
                </div>
            </Frame>

            <Botao type="submit">Salvar</Botao>
        </form>
        </Container>
    );
};

export default CandidatoRegistroDadosGerais;
