import React, { useState, useEffect, useRef } from 'react';
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
import { Toast } from 'primereact/toast';
import { unformatCurrency } from '@utils/formats';

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
    const [periculosidade, setPericulosidade] = useState(null);
    const [insalubridade, setInsalubridade] = useState('');
    const [status, setStatus] = useState('Ativa');
    const toast = useRef(null)
    const [erroPeriInsa, setErroPeriInsa] = useState(false);

    const converterData = (data) => {
        if (!data) return null;
        const [dia, mes, ano] = data.split('/');
        return `${ano}-${mes}-${dia}`;
    };

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

    
  const [listaPericulosidades, setListaPericulosidades] = useState([
    { code: 'QC', name: 'Trabalho com Substâncias Químicas Perigosas' },
    { code: 'MP', name: 'Atividades com Máquinas e Equipamentos Pesados' },
    { code: 'HA', name: 'Trabalho em Altura' },
    { code: 'RA', name: 'Exposição a Radiação' },
    { code: 'TE', name: 'Trabalho com Energia Elétrica' },
    { code: 'CE', name: 'Exposição ao Calor Excessivo' },
    { code: 'PE', name: 'Atividades com Produtos Explosivos' },
    { code: 'CA', name: 'Trabalho em Ambientes Confinedos' },
    { code: 'SA', name: 'Atividades Subaquáticas' },
    { code: 'RAU', name: 'Exposição a Ruídos Altos' },
    { code: 'PB', name: 'Perigos Biológicos' },
    { code: 'TE', name: 'Exposição a Temperaturas Extremas' },
    { code: 'DA', name: 'Trabalho em Áreas de Desastres ou Emergências' },
    { code: 'MC', name: 'Manipulação de Materiais Cortantes' },
    { code: 'SC', name: 'Exposição a Substâncias Cancerígenas' }
  ]);
  
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validação: não pode ter os dois preenchidos
        if (periculosidade && insalubridade) {
            setErroPeriInsa(true);
            toast.current.show({
                severity: 'error',
                summary: 'Não é possível preencher periculosidade e insalubridade ao mesmo tempo',
                life: 3000
            });
            return;
        } else {
            setErroPeriInsa(false);
        }

        // Validação dos campos obrigatórios
        const camposObrigatorios = [
            { campo: titulo, nome: 'Titulo' },
            { campo: descricao, nome: 'Descricao' },
            { campo: dataAbertura, nome: 'dt_abertura' },
            { campo: dataEncerramento, nome: 'dt_encerramento' },
            { campo: salario, nome: 'salario' },
            { campo: qtdVagas, nome: 'qtd_vaga' },
            { campo: filial, nome: 'Filial' },
            { campo: departamento, nome: 'Departamento' },
            { campo: cargo, nome: 'Cargo' },
            { campo: horario, nome: 'horario' }
        ];

        const camposVazios = camposObrigatorios.filter(campo => !campo.campo);
        
        if (camposVazios.length > 0) {
            setClassError(camposVazios.map(campo => campo.nome.toLowerCase().replace(/\s+/g, '_')));
            toast.current.show({
                severity: 'error',
                summary: 'Campos obrigatórios não preenchidos',
                detail: `Por favor, preencha os seguintes campos: ${camposVazios.map(campo => campo.nome).join(', ')}`,
                life: 5000
            });
            return;
        }

        document.querySelectorAll('input').forEach(function(element) {
            if(element.value !== '' && (!element.classList.contains('not_required')))
            {
                if(classError.includes(element.name))
                {
                    setClassError(classError.filter(item => item !== element.name))
                }
            }
            else
            {
                if(!classError.includes(element.name))
                {
                    setClassError(estadoAnterior => [...estadoAnterior, element.name])
                }
            }
        })

        if(document.querySelectorAll("form .error").length === 0)
        {
            // Remove caracteres não numéricos e trata a vírgula do salário
            const salarioNumerico = salario ? 
                Math.floor(Number(unformatCurrency(salario)) / 100)
                : null;

            const novaVaga = {
                titulo,
                descricao,
                dt_abertura: dataAbertura,
                dt_encerramento: dataEncerramento,
                deficiencia,
                periculosidade: periculosidade?.code || null,
                insalubridade: insalubridade || 0,
                inclusao,
                inclusao_para: inclusao_para || null,
                qtd_vaga: qtdVagas ? parseInt(qtdVagas) : null,
                status: 'A',
                salario: salarioNumerico,
                filial: filial?.code || null,
                centro_custo: centroCusto?.code || null,
                departamento: departamento?.code || null,
                secao: secao?.code || null,
                cargo: cargo?.code || null,
                horario: horario?.code || null,
                funcao: funcao?.code || null,
                sindicato: sindicato?.code || null
            };

            http.post('/vagas/', novaVaga)
                .then((response) => {
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
                    setPericulosidade(null);
                    setInsalubridade('');
                    setSecao(null);
                    setCargo(null);
                    setHorario(null);
                    setFuncao(null);
                    setSindicato(null);

                    toast.current.show({
                        severity: 'success',
                        summary: 'Vaga registrada com sucesso',
                        life: 3000
                    });
                    
                    navegar('/vagas');
                })
                .catch(() => {
                    // erro
                    toast.current.show({
                        severity: 'error',
                        summary: 'Erro ao registrar vaga',
                        life: 3000
                    });
                });
        }
    };

    return (
        <Frame gap="10px">
            <Toast ref={toast} />
            <BotaoVoltar linkFixo="/vagas" />
            <h3>Registrar Nova Vaga</h3>
            <form onSubmit={handleSubmit}>
                <Col12>
                    <Col6>
                        <CampoTexto 
                            camposVazios={classError}
                            name="titulo" 
                            valor={titulo} 
                            setValor={setTitulo} 
                            type="text" 
                            label="Título" 
                            placeholder="Digite o título da vaga" />
                    </Col6>
                    <Col6>
                        <CampoTexto 
                            camposVazios={classError}
                            name="descricao" 
                            valor={descricao} 
                            setValor={setDescricao} 
                            type="text" 
                            label="Descrição" 
                            placeholder="Digite a descrição da vaga" />
                    </Col6>
                </Col12>
                <Col12>
                    <Col6>
                        <CampoTexto 
                            camposVazios={classError}
                            name="dt_abertura" 
                            valor={dataAbertura} 
                            setValor={setDataAbertura} 
                            type="date" 
                            label="Data de Abertura" 
                            placeholder="Digite a data de abertura" />
                    </Col6>
                    <Col6>
                        <CampoTexto 
                            camposVazios={classError}
                            name="dt_encerramento" 
                            valor={dataEncerramento} 
                            setValor={setDataEncerramento} 
                            type="date" 
                            label="Data de Encerramento" 
                            placeholder="Digite a data de encerramento" />
                    </Col6>
                </Col12>

                <Col12>
                    <Col6>
                        <DropdownItens
                            name="periculosidade"
                            valor={periculosidade}
                            setValor={valor => { 
                                setPericulosidade(valor); 
                                if (valor) setInsalubridade(''); 
                                setErroPeriInsa(false);
                            }}
                            options={listaPericulosidades}
                            label="Periculosidade"
                            placeholder="Selecione a periculosidade"
                            disabled={!!insalubridade}
                            allowClear={true}
                        />
                    </Col6>
                    <Col6>
                        <CampoTexto
                            name="insalubridade"
                            valor={insalubridade}
                            setValor={valor => { 
                                setInsalubridade(valor); 
                                if (valor) setPericulosidade(''); 
                                setErroPeriInsa(false);
                            }}
                            type="text"
                            label="Insalubridade"
                            placeholder="Digite a insalubridade"
                            disabled={!!periculosidade}
                        />
                    </Col6>
                </Col12>
                {erroPeriInsa && (
                    <div style={{ color: 'var(--error)', marginBottom: 8, marginTop: -8 }}>
                        Não é possível preencher periculosidade e insalubridade ao mesmo tempo
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '12px 0' }}>
                    <label style={{ fontWeight: 600 }}>Vaga para pessoa com deficiência?</label>
                    <SwitchInput checked={deficiencia} onChange={setDeficiencia} />
                </div>
                
                <Col12>
                    <Col6>
                        <CampoTexto 
                            camposVazios={classError}
                            patternMask={'BRL'}
                            name="salario" 
                            valor={salario} 
                            setValor={setSalario} 
                            type="text" 
                            label="Salário" 
                            placeholder="Digite o salário" />
                            
                    </Col6>
                    <Col6>
                        <CampoTexto
                            patternMask={['999']}
                            name="qtd_vaga" 
                            valor={qtdVagas} 
                            setValor={setQtdVagas} 
                            type="text" 
                            label="Quantidade de Vagas" 
                            placeholder="Digite a quantidade de vagas" />
                    </Col6>
                </Col12>
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
                        label="Inclusão Para"
                        placeholder="Digite a data de inclusão"
                        className="not_required"
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
                                placeholder="Filial"
                                required />
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
                                placeholder="Departamento"
                                required />
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
                                placeholder="Cargo"
                                required />
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
                                placeholder="Horário"
                                required />
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

                <Botao aoClicar={handleSubmit}>Registrar Vaga</Botao>
            </form>
        </Frame>
    );
};

export default VagasRegistro;

