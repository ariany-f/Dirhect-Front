import React, { useState, useEffect } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import CampoTexto from '@components/CampoTexto'; // Importando o componente CampoTexto
import BotaoVoltar from '@components/BotaoVoltar'; // Importando o componente CampoTexto
import Container from '@components/Container'; // Importando o componente Container
import Botao from '@components/Botao'; // Importando o componente Container
import { useNavigate } from 'react-router-dom';
import Frame from '@components/Frame';
import DropdownItens from '@components/DropdownItens';
import http from '@http';
import styled from 'styled-components';
import SwitchInput from '@components/SwitchInput';

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 10px;
`

const Col6 = styled.div`
    padding: 15px 0px;
    flex: 1 1 calc(50% - 10px);
`

const VagasRegistro = () => {
    const [classError, setClassError] = useState([])
    const [filiais, setFiliais] = useState([]);
    const [centros_custo, setCentrosCusto] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [secoes, setSecoes] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [funcoes, setFuncoes] = useState([]);
    const [sindicatos, setSindicatos] = useState([]);
      
    const { 
        vagas,
        setVagas
    } = useVagasContext()

    const navegar = useNavigate()

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataAbertura, setDataAbertura] = useState('');
    const [dataEncerramento, setDataEncerramento] = useState('');
    const [salario, setSalario] = useState('');
    const [deficiencia, setDeficiencia] = useState(false);
    const [qtdVagas, setQtdVagas] = useState('');
    const [inclusao, setInclusao] = useState(false);
    const [inclusao_para, setInclusaoPara] = useState('');
    const [selectedDate, setSelectedDate] = useState(1);
    const [filial, setFilial] = useState(null);
    const [centroCusto, setCentroCusto] = useState(null);
    const [departamento, setDepartamento] = useState(null);
    const [secao, setSecao] = useState(null);
    const [cargo, setCargo] = useState(null);
    const [horario, setHorario] = useState(null);
    const [funcao, setFuncao] = useState(null);
    const [sindicato, setSindicato] = useState(null);

    useEffect(() => {
        http.get('filial/?format=json')
            .then(response => {
                setFiliais(response)
            })

        http.get('departamento/?format=json')
            .then(response => {
                setDepartamentos(response)
            })

        http.get('secao/?format=json')
            .then(response => {
                setSecoes(response)
            })

        http.get('cargo/?format=json')
            .then(response => {
                setCargos(response)
            })

        http.get('centro_custo/?format=json')
            .then(response => {
                setCentrosCusto(response)
            })

        http.get('sindicato/?format=json')
            .then(response => {
                setSindicatos(response)
            })
            
        http.get('horario/?format=json')
            .then(response => {
                setHorarios(response)
            })

        http.get('funcao/?format=json')
            .then(response => {
                setFuncoes(response)
            })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();

        // Verificação de segurança para garantir que vagas e vagas.abertas estão definidos
        const id = (vagas && vagas.abertas) ? vagas.abertas.length + 1 : 1; // Se não estiver definido, inicia com 1

        const novaVaga = {
            id, // Usando o ID gerado
            titulo,
            descricao,
            dataAbertura,
            dataEncerramento,
            deficiencia,
            qtd_vagas: parseInt(qtdVagas),
            inclusao,
            inclusao_para,
            salario: parseFloat(salario), // Convertendo para número
            filial: filial?.code,
            centroCusto: centroCusto?.code,
            departamento: departamento?.code,
            secao: secao?.code,
            cargo: cargo?.code,
            horario: horario?.code,
            funcao: funcao?.code,
            sindicato: sindicato?.code
        };

        // Atualizando o estado com a nova vaga
        setVagas(novaVaga); // Agora chama a função que atualiza e salva no localStorage

        // Limpar o formulário
        setTitulo('');
        setDescricao('');
        setDataAbertura('');
        setDataEncerramento('');
        setSalario('');
        setFilial(null);
        setCentroCusto(null);
        setDepartamento(null);
        setDeficiencia(false);
        setQtdVagas('');
        setInclusao(false);
        setInclusaoPara('');
        setSecao(null);
        setCargo(null);
        setHorario(null);
        setFuncao(null);
        setSindicato(null);

        navegar('/vagas')
    };

    return (
        <Frame gap="10px">
            <BotaoVoltar linkFixo="/vagas" />
            <h3>Registrar Nova Vaga</h3>
            <form onSubmit={handleSubmit}>
                <CampoTexto 
                    camposVazios={classError}
                    name="titulo" 
                    valor={titulo} 
                    setValor={setTitulo} 
                    type="text" 
                    label="Título" 
                    placeholder="Digite o titulo" />

                <CampoTexto 
                    camposVazios={classError}
                    name="descricao" 
                    valor={descricao} 
                    setValor={setDescricao} 
                    type="text" 
                    label="Descrição" 
                    placeholder="Digite a descrição" />
                    
                <CampoTexto 
                    type="date" 
                    valor={dataAbertura} 
                    setValor={setDataAbertura}
                    label="Data de Abertura"  />

                <CampoTexto 
                    type="date" 
                    valor={dataEncerramento} 
                    setValor={setDataEncerramento}
                    label="Data de Encerramento" 
                    placeholder="Selecione a data" />
                    
                <CampoTexto 
                    camposVazios={classError}
                    name="salario" 
                    valor={salario} 
                    setValor={setSalario} 
                    type="number" 
                    label="Salário" 
                    placeholder="Digite o salário" />

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '12px 0' }}>
                    <label style={{ fontWeight: 600 }}>Vaga para pessoa com deficiência?</label>
                    <SwitchInput checked={deficiencia} onChange={setDeficiencia} />
                </div>
                <CampoTexto
                    name="qtd_vagas"
                    valor={qtdVagas}
                    setValor={setQtdVagas}
                    type="number"
                    label="Quantidade de Vagas"
                    placeholder="Digite a quantidade de vagas"
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '12px 0' }}>
                    <label style={{ fontWeight: 600 }}>Vaga inclusiva?</label>
                    <SwitchInput checked={inclusao} onChange={setInclusao} />
                </div>
                {inclusao && (
                    <CampoTexto
                        name="inclusao_para"
                        valor={inclusao_para}
                        setValor={setInclusaoPara}
                        type="text"
                        label="Inclusiva para quem?"
                        placeholder="Ex: PCD, LGBTQIA+, 50+ etc."
                    />
                )}

                <div style={{textAlign: 'left'}}>
                    <h6>Estrutura Organizacional</h6>
                    <Col12>
                        <Col6>
                            <DropdownItens 
                                camposVazios={classError}
                                name="filial" 
                                valor={filial}
                                setValor={setFilial} 
                                options={filiais.map(filial => ({
                                    name: filial.nome,
                                    code: filial.id
                                }))} 
                                placeholder="Filial" />
                        </Col6>
                        <Col6>
                            <DropdownItens 
                                camposVazios={classError}
                                name="centro_custo" 
                                valor={centroCusto}
                                setValor={setCentroCusto} 
                                options={centros_custo.map(cc => ({
                                    name: cc.nome,
                                    code: cc.id
                                }))} 
                                placeholder="Centro de Custo" />
                        </Col6>
                    </Col12>

                    <Col12>
                        <Col6>
                            <DropdownItens 
                                camposVazios={classError}
                                name="departamento" 
                                valor={departamento}
                                setValor={setDepartamento} 
                                options={departamentos.map(dep => ({
                                    name: dep.nome,
                                    code: dep.id
                                }))} 
                                placeholder="Departamento" />
                        </Col6>
                        <Col6>
                            <DropdownItens 
                                camposVazios={classError}
                                name="secao" 
                                valor={secao}
                                setValor={setSecao} 
                                options={secoes.map(sec => ({
                                    name: sec.nome,
                                    code: sec.id
                                }))} 
                                placeholder="Seção" />
                        </Col6>
                    </Col12>

                    <Col12>
                        <Col6>
                            <DropdownItens 
                                camposVazios={classError}
                                name="cargo" 
                                valor={cargo}
                                setValor={setCargo} 
                                options={cargos.map(cargo => ({
                                    name: cargo.nome,
                                    code: cargo.id
                                }))} 
                                placeholder="Cargo" />
                        </Col6>
                        <Col6>
                            <DropdownItens 
                                camposVazios={classError}
                                name="horario" 
                                valor={horario}
                                setValor={setHorario} 
                                options={horarios.map(horario => ({
                                    name: `${horario.codigo} - ${horario.descricao}`,
                                    code: horario.id
                                }))} 
                                placeholder="Horário" />
                        </Col6>
                    </Col12>

                    <Col12>
                        <Col6>
                            <DropdownItens 
                                camposVazios={classError}
                                name="funcao" 
                                valor={funcao}
                                setValor={setFuncao} 
                                options={funcoes.map(funcao => ({
                                    name: funcao.nome,
                                    code: funcao.id
                                }))} 
                                placeholder="Função" />
                        </Col6>
                        <Col6>
                            <DropdownItens 
                                camposVazios={classError}
                                name="sindicato" 
                                valor={sindicato}
                                setValor={setSindicato} 
                                options={sindicatos.map(sindicato => ({
                                    name: `${sindicato.codigo} - ${sindicato.descricao}`,
                                    code: sindicato.id
                                }))} 
                                placeholder="Sindicato" />
                        </Col6>
                    </Col12>
                </div>

                <Botao type="submit">Registrar Vaga</Botao>
            </form>
        </Frame>
    );
};

export default VagasRegistro;
