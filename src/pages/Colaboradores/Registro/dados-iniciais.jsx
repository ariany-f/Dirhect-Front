import CampoTexto from "@components/CampoTexto"
import Botao from "@components/Botao"
import BotaoGrupo from "@components/BotaoGrupo"
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import BotaoVoltar from "@components/BotaoVoltar"
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
    gap: 10px;
`

const Col6 = styled.div`
    flex: 1 1 calc(50% - 10px);
    margin-bottom: 16px;
`

const SingleItemWrapper = styled.div`
    width: 100%;
    margin-bottom: 16px;
    
    & > div {
        max-width: calc(50% - 5px);
    }
`

const FullWidthWrapper = styled.div`
    width: 100%;
    margin-bottom: 16px;
`

const SectionTitleWrapper = styled.div`
    width: 100%;
    text-align: left;
    margin-bottom: 16px;
    margin-top: 24px;
    
    &:first-of-type {
        margin-top: 0;
    }
`;

const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 24px;
    margin-bottom: 8px;
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
        <Frame gap="10px">
            <Toast ref={toast} />
            <Loading opened={loading} />
            <BotaoVoltar />
            <br />
            <h3>Colaborador</h3>
            <br />
            <form onSubmit={sendData}>
                <SectionTitleWrapper>
                    <h6>Dados do Colaborador</h6>
                </SectionTitleWrapper>
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
                </Col12>
                <Col12>
                    <Col6>
                        <CampoTexto 
                        camposVazios={classError} 
                        name="email" 
                        valor={colaborador.email} 
                        setValor={setEmail} 
                        type="email" 
                        label="Email do colaborador" 
                        placeholder="Digite o email do colaborador" />
                    </Col6>
                    <Col6>
                        <CampoTexto 
                        camposVazios={classError} 
                        patternMask={['99 9999-9999', '99 99999-9999']} 
                        name="phone_number" 
                        valor={colaborador.telefone1} 
                        setValor={setTelefone} 
                        type="text" 
                        label="Celular do colaborador" 
                        placeholder="Digite o telefone do colaborador" />
                    </Col6>
                </Col12>
                <SingleItemWrapper>
                    <CampoTexto 
                    camposVazios={classError} 
                    name="chapa" 
                    valor={colaborador.chapa} 
                    setValor={setChapa} 
                    type="text" 
                    label="Matrícula" 
                    placeholder="Digite a matrícula do colaborador" />
                </SingleItemWrapper>
                <FullWidthWrapper>
                    <CheckboxContainer name="remember" valor={adicionar_departamento} setValor={setAdicionarDepartamento} label="Adicionar esse colaborador em um departamento" />
                </FullWidthWrapper>
                {adicionar_departamento &&
                    <>
                        <SectionTitleWrapper>
                            <h6>Departamento</h6>
                        </SectionTitleWrapper>
                        <DepartamentosRecentes setValor={setDepartamento} />
                    </>
                }
                <TitleContainer>
                    <h6>Endereço do Colaborador</h6>
                    <QuestionCard element={<small>Porque precisamos do endereço?</small>}>
                        <RiQuestionLine className="question-icon" />
                    </QuestionCard>
                </TitleContainer>
                <FullWidthWrapper >
                    <CampoTexto 
                    camposVazios={classError} 
                    patternMask={['99999-999']} 
                    name="cep" 
                    valor={colaborador.cep} 
                    setValor={ChangeCep} 
                    type="text" 
                    label="CEP" 
                    placeholder="Digite o CEP do colaborador" />
                </FullWidthWrapper>
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
                </Col12>
                <Col12>
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
                </Col12>
                <Col12>
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
                        <DropdownItens camposVazios={classError} valor={colaborador.estado} setValor={setEstado} options={estados} label="UF" name="address_state" placeholder="Digite a UF do colaborador"/>
                    </Col6>
                </Col12>
                <Botao type="submit" estilo="vermilion" size="medium" filled>Adicionar Colaborador</Botao>
            </form>
        </Frame>
    )
}

export default ColaboradorDadosIniciais