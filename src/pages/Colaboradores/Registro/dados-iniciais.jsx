import CampoTexto from "@components/CampoTexto"
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import Texto from "@components/Texto"
import QuestionCard from '@components/QuestionCard'
import SwitchInput from '@components/SwitchInput'
import DropdownItens from '@components/DropdownItens'
import CheckboxContainer from "@components/CheckboxContainer"
import Loading from "@components/Loading"
import DepartamentosRecentes from "@components/DepartamentosRecentes"
import { useState, useRef, useEffect } from "react"
import http from '@http'
import styles from './Registro.module.css'
import styled from "styled-components"
import { RiQuestionLine } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import { Toast } from 'primereact/toast'
import axios from "axios"
import { useColaboradorContext } from "@contexts/Colaborador"
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario";
 
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
    flex: 1 1 1 33%;
`


const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

function ColaboradorDadosIniciais() {

    const navigate = useNavigate();
    const [classError, setClassError] = useState([])
    const [loading, setLoading] = useState(false);
    const [adicionar_departamento, setAdicionarDepartamento] = useState(false);
    const [estados, setEstados] = useState(null);
    const toast = useRef(null);
    const lastCep = useRef("");

    const { colaborador, setCpf, setChapa, setNome, setSituacao, setDepartamento, setEmail, setTelefone, setCep, setRua, setNumero, setComplemento, setBairro, setCidade, setEstado, submeterUsuario } =
        useColaboradorContext();

    useEffect(() => {
        if (!estados) {
        axios
            .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
            .then((response) => {
            const estadosFormatados = response.data.map((item) => ({
                name: item.nome,
                code: item.sigla,
            }));
            setEstados(estadosFormatados);
            })
            .catch((error) => console.error("Erro ao buscar estados:", error));
        }
    }, [estados]);

    useEffect(() => {
        if (colaborador.cep.length === 9 && colaborador.cep !== lastCep.current) {
            lastCep.current = colaborador.cep;
            axios.get(`https://viacep.com.br/ws/${colaborador.cep}/json`)
                .then((response) => {
                    if (response.data) {
                        setRua(response.data.logradouro);
                        setBairro(response.data.bairro);
                        setCidade(response.data.localidade);
                        setEstado(response.data.uf);
                    }
                })
                .catch((error) => console.error("Erro ao buscar CEP:", error));
        }
    }, [colaborador.cep]);
    

    const requestCep = (cep) => {
        if (cep.length === 9 && cep !== lastCep.current) {
        lastCep.current = cep;
        axios
            .get(`https://viacep.com.br/ws/${cep}/json`)
            .then((response) => {
                console.log(response.data);
            if (response.data) {
                setRua(response.data.logradouro);
                setBairro(response.data.bairro);
                setCidade(response.data.localidade);
                setEstado(response.data.uf);
            }
            })
            .catch((error) => console.error("Erro ao buscar CEP:", error));
        }
    };

    const ChangeCep = (value) => {
        setCep(value);
        requestCep(value);
    };

    const sendData = (evento) => {
        evento.preventDefault();
        setLoading(true);
        setSituacao('A');
        submeterUsuario()
        .then((response) => {
            if (response.success) {
            navigate("/colaborador/registro/sucesso");
            }
        })
        .catch((erro) => {
            toast.current.show({ severity: "error", summary: "Erro", detail: erro.message });
        })
        .finally(() => setLoading(false));
    };

    return (
        <form>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <Frame estilo="spaced">
                <Titulo>
                    <h6>Dados do Colaborador</h6>
                </Titulo>
            </Frame>
            <Col12 >
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        patternMask={['999.999.999-99']} 
                        name="cpf" 
                        valor={colaborador.cpf} 
                        setValor={setCpf} 
                        type="text" 
                        label="CPF" 
                        placeholder="Digite o CPF do colaborador" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="nome" 
                        valor={colaborador.nome} 
                        setValor={setNome} 
                        type="text" 
                        label="Nome do colaborador" 
                        placeholder="Digite o name completo do colaborador" />
                </Col6>
                <Col4>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="email" 
                        valor={colaborador.email} 
                        setValor={setEmail} 
                        type="email" 
                        label="Email do colaborador" 
                        placeholder="Digite o email do colaborador" />
                </Col4>
                <Col4>
                    <CampoTexto 
                        camposVazios={classError} 
                        patternMask={['99 9999-9999', '99 99999-9999']} 
                        name="phone_number" 
                        valor={colaborador.telefone1} 
                        setValor={setTelefone} 
                        type="text" 
                        label="Celular do colaborador" 
                        placeholder="Digite o telefone do colaborador" />
                </Col4>
                <Col4>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="chapa" 
                        valor={colaborador.chapa} 
                        setValor={setChapa} 
                        type="text" 
                        label="Matrícula" 
                        placeholder="Digite a matrícula do colaborador" />
                </Col4>
            </Col12>
            <Col12>
                <Col6>
                    <CheckboxContainer name="remember" valor={adicionar_departamento} setValor={setAdicionarDepartamento} label="Adicionar esse colaborador em um departamento" />
                </Col6>
            </Col12>
            {adicionar_departamento &&
                <>
                    <Frame estilo="spaced">
                        <Titulo>
                            <h6>Departamento</h6>
                        </Titulo>
                    </Frame>
                    <DepartamentosRecentes setValor={setDepartamento} />
                </>
            }
            <Frame estilo="spaced">
                <Titulo>
                    <h6>Endereço do Colaborador</h6>
                </Titulo>
                <QuestionCard element={<small>Porque precisamos do endereço?</small>}>
                    <RiQuestionLine className="question-icon" />
                </QuestionCard>
            </Frame>
            <Col12 >
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        patternMask={['99999-999']} 
                        name="cep" 
                        valor={colaborador.cep} 
                        setValor={setCep} 
                        type="text" 
                        label="CEP" 
                        placeholder="Digite o CEP do colaborador" />
                </Col6>
            </Col12>
            <Col12>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="rua" 
                        valor={colaborador.rua} 
                        setValor={setRua} 
                        type="text" 
                        label="Logradouro" 
                        placeholder="Digite a rua do colaborador" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="bairro" 
                        valor={colaborador.bairro} 
                        setValor={setBairro} 
                        type="text" 
                        label="Bairro" 
                        placeholder="Digite o Bairro do colaborador" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="numero" 
                        valor={colaborador.numero} 
                        setValor={setNumero} 
                        type="text" 
                        label="Número" 
                        placeholder="Digite o número" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        name="complemento" 
                        valor={colaborador.complemento} 
                        setValor={setComplemento} 
                        type="text" 
                        label="Complemento (opcional)" 
                        placeholder="Digite o complemento" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="cidade" 
                        valor={colaborador.cidade} 
                        setValor={setCidade} 
                        type="text" 
                        label="Cidade" 
                        placeholder="Digite a cidade do colaborador" />
                </Col6>
                <Col6>
                    <DropdownItens camposVazios={classError} valor={colaborador.address_state} setValor={setEstado} options={estados} label="UF" name="address_state" placeholder="Digite a UF do colaborador"/>
                </Col6>
            </Col12>
            <ContainerButton>
                <Botao aoClicar={() => navigate('/colaborador')} estilo="neutro" formMethod="dialog" size="medium" filled>Cancelar</Botao>
                <Botao aoClicar={(evento) => sendData(evento)} estilo="vermilion" size="medium" filled>Adicionar Colaborador</Botao>
            </ContainerButton>
        </form>
    )
}

export default ColaboradorDadosIniciais