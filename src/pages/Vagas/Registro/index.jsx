import React, { useState, useEffect, useRef } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import CampoTexto from '@components/CampoTexto'; // Importando o componente CampoTexto
import BotaoVoltar from '@components/BotaoVoltar'; // Importando o componente CampoTexto
import Container from '@components/Container'; // Importando o componente Container
import Botao from '@components/Botao'; // Importando o componente Container
import BotaoGrupo from '@components/BotaoGrupo';
import { useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';
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
    flex: 1 1 calc(50% - 10px);
    margin-bottom: 16px;
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
    const [letra, setLetra] = useState(null);
    const [opcoesLetraHorario, setOpcoesLetraHorario] = useState([]);
    const toast = useRef(null)
    const [erroPeriInsa, setErroPeriInsa] = useState(false);

    // Função para verificar se um campo é obrigatório baseado na lista
    const isCampoObrigatorio = (lista) => {
        return lista && lista.length > 0;
    };

    const converterData = (data) => {
        if (!data) return null;
        const [dia, mes, ano] = data.split('/');
        return `${ano}-${mes}-${dia}`;
    };

    const carregarOpcoesLetraHorario = async (horarioId) => {
        if (!horarioId) {
            setOpcoesLetraHorario([]);
            return;
        }
        
        try {
            const detalhesHorario = await http.get(`horario_indice/?id_horario=${horarioId}`);
            const opcoes = (detalhesHorario || []).map(item => ({
                code: item.id,
                name: item.descricao_letra ? `${item.indice} - ${item.descricao_letra}` : `${item.indice}`
            }));
            setOpcoesLetraHorario(opcoes);
        } catch (err) {
            setOpcoesLetraHorario([]);
            console.error('Erro ao buscar detalhes do horário:', err);
        }
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

    // Carregar opções de letra quando o horário mudar
    useEffect(() => {
        const horarioId = horario?.code;
        if (horarioId) {
            carregarOpcoesLetraHorario(horarioId);
        } else {
            setOpcoesLetraHorario([]);
        }
    }, [horario]);

    
  const [listaPericulosidades, setListaPericulosidades] = useState([
    { code: 'Sim', name: 'Sim' },
    { code: 'Não', name: 'Não' }
  ]);

  const [listaInsalubridades, setListaInsalubridades] = useState([
    { code: '0', name: '0' },
    { code: '10', name: '10' },
    { code: '20', name: '20' },
    { code: '40', name: '40' }
  ]);
  
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validação: não pode ter os dois preenchidos
        // if (periculosidade && insalubridade) {
        //     setErroPeriInsa(true);
        //     toast.current.show({
        //         severity: 'error',
        //         summary: 'Não é possível preencher periculosidade e insalubridade ao mesmo tempo',
        //         life: 3000
        //     });
        //     return;
        // } else {
        //     setErroPeriInsa(false);
        // }

        // Validação dos campos obrigatórios
        const camposObrigatorios = [
            { campo: titulo, nome: 'titulo' },
            { campo: dataAbertura, nome: 'dt_abertura' },
            { campo: dataEncerramento, nome: 'dt_encerramento' },
            { campo: qtdVagas, nome: 'qtd_vaga' },
            { campo: filial, nome: 'filial', obrigatorio: isCampoObrigatorio(filiais) },
            { campo: centroCusto, nome: 'centro_custo', obrigatorio: isCampoObrigatorio(centros_custo) },
            { campo: secao, nome: 'secao', obrigatorio: isCampoObrigatorio(secoes) },
            { campo: funcao, nome: 'funcao', obrigatorio: isCampoObrigatorio(funcoes) },
            { campo: sindicato, nome: 'sindicato', obrigatorio: isCampoObrigatorio(sindicatos) },
            { campo: horario, nome: 'horario', obrigatorio: isCampoObrigatorio(horarios) },
            { campo: letra, nome: 'letra' }
        ];

        const camposVazios = camposObrigatorios.filter(campo => {
            // Se o campo tem a propriedade obrigatorio, usa ela, senão é sempre obrigatório
            const ehObrigatorio = campo.obrigatorio !== undefined ? campo.obrigatorio : true;
            return ehObrigatorio && !campo.campo;
        });
        
        if (camposVazios.length > 0) {
            setClassError(camposVazios.map(campo => campo.nome));
            
            // Verificar dependências entre campos
            const secaoVazia = camposVazios.find(c => c.nome === 'secao');
            const letraVazia = camposVazios.find(c => c.nome === 'letra');
            let detalheMensagem = `Por favor, preencha os seguintes campos: ${camposVazios.map(campo => campo.nome).join(', ')}`;
            
            if (secaoVazia && !filial) {
                detalheMensagem = 'Selecione a filial primeiro para poder selecionar a seção.';
            } else if (letraVazia && !horario) {
                detalheMensagem = 'Selecione o horário primeiro para poder selecionar a letra.';
            }
            
            toast.current.show({
                severity: 'error',
                summary: 'Campos obrigatórios não preenchidos',
                detail: detalheMensagem,
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
                insalubridade: insalubridade?.code || 0,
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
                letra: letra?.code || null,
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
                    setInsalubridade(null);
                    setSecao(null);
                    setCargo(null);
                    setHorario(null);
                    setLetra(null);
                    setOpcoesLetraHorario([]);
                    setFuncao(null);
                    setSindicato(null);

                    toast.current.show({
                        severity: 'success',
                        summary: 'Vaga registrada com sucesso',
                        life: 3000
                    });
                    
                    // Redireciona para a página de detalhes da vaga criada
                    navegar(`/vagas/detalhes/${response.id}`);
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

    // Filtro de seções por filial selecionada
    const secoesFiltradas = React.useMemo(() => {
        if (!filial) return [];
        return secoes.filter(sec => String(sec.filial) === String(filial.code));
    }, [secoes, filial]);

    return (
        <Frame gap="10px">
            <Toast ref={toast} />
            <BotaoVoltar linkFixo="/vagas" />
            <br />
            <h4>Vaga</h4>
            <br />
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
                            required={true}
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
                            required={true}
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
                            }}
                            options={listaPericulosidades}
                            label="Periculosidade"
                            placeholder="Selecione a periculosidade"
                        />
                    </Col6>
                    <Col6>
                        <DropdownItens
                            name="insalubridade"
                            valor={insalubridade}
                            setValor={valor => { 
                                setInsalubridade(valor); 
                            }}
                            options={listaInsalubridades}
                            label="Insalubridade"
                            placeholder="Selecione a insalubridade"
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
                            camposVazios={classError}
                            patternMask={['999']}
                            required={true}
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
                    <br />
                    <Col12>
                        <Col6>
                            <DropdownItens 
                                camposVazios={classError}
                                name="filial" 
                                valor={filial}
                                setValor={valor => {
                                    setFilial(valor);
                                    setSecao(null); // Limpa a seção ao trocar a filial
                                    if (valor && valor.code) {
                                        http.get(`secao/?format=json&filial=${valor.code}`)
                                            .then(response => setSecoes(response));
                                    } else {
                                        setSecoes([]); // Limpa se desmarcar a filial
                                    }
                                }}
                                options={filiais.map(filial => ({
                                    name: `${filial.id_origem} - ${filial.nome}`,
                                    code: filial.id
                                }))} 
                                filter
                                label="Filial"
                                placeholder="Filial"
                                required={isCampoObrigatorio(filiais)}
                                allowClear={true} />
                        </Col6>
                        <Col6>
                            <DropdownItens 
                                camposVazios={classError}
                                name="secao" 
                                valor={secao}
                                setValor={setSecao} 
                                options={secoes.map(sec => ({
                                    name: `${sec.id_origem} - ${sec.nome}`,
                                    code: sec.id
                                }))} 
                                filter
                                label="Seção"
                                placeholder={!filial ? "Selecione a filial primeiro" : "Seção"}
                                required={isCampoObrigatorio(secoes)}
                                allowClear={true}
                                disabled={!filial}
                            />
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
                                    name: funcao.funcao_origem_id + ' - ' + funcao.nome,
                                    code: funcao.id
                                }))} 
                                filter
                                label="Função"
                                placeholder="Função"
                                required={isCampoObrigatorio(funcoes)}
                                allowClear={true} />
                        </Col6>
                        <Col6>
                            <DropdownItens 
                                camposVazios={classError}
                                name="horario" 
                                valor={horario}
                                setValor={(valor) => {
                                    setHorario(valor);
                                    setLetra(null); // Limpa a letra quando muda o horário
                                }} 
                                options={horarios.map(horario => ({
                                    name: horario.id_origem 
                                    ? `${horario.id_origem} - ${horario.descricao || horario.nome}` 
                                    : (horario.descricao || horario.nome),
                                    code: horario.id
                                }))} 
                                filter
                                label="Horário"
                                placeholder="Horário"
                                required={isCampoObrigatorio(horarios)}
                                allowClear={true} />
                        </Col6>
                    </Col12>

                    <Col12>
                        <Col6>
                            <DropdownItens 
                                camposVazios={classError}
                                name="letra"
                                required={true}
                                label="Letra"
                                valor={letra}
                                setValor={setLetra}
                                options={opcoesLetraHorario}
                                disabled={opcoesLetraHorario.length === 0}
                                placeholder={opcoesLetraHorario.length === 0 ? "Selecione um horário primeiro" : "Selecione a letra"}
                            />
                        </Col6>
                        <Col6>
                            <DropdownItens 
                                camposVazios={classError}
                                name="sindicato" 
                                valor={sindicato}
                                setValor={setSindicato} 
                                options={sindicatos.map(sindicato => ({
                                    name: `${sindicato.id_origem} - ${sindicato.descricao}`,
                                    code: sindicato.id
                                }))} 
                                filter
                                label="Sindicato"
                                placeholder="Sindicato"
                                required={isCampoObrigatorio(sindicatos)}
                                allowClear={true} />
                        </Col6>
                        <Col6>
                            <DropdownItens 
                                camposVazios={classError}
                                name="centro_custo" 
                                valor={centroCusto}
                                setValor={setCentroCusto} 
                                options={centros_custo.map(cc => ({
                                    name: `${cc.cc_origem} - ${cc.nome}`,
                                    code: cc.id
                                }))} 
                                filter
                                label="Centro de Custo"
                                placeholder="Centro de Custo"
                                required={isCampoObrigatorio(centros_custo)}
                                allowClear={true} />
                        </Col6>
                    </Col12>
                </div>
                <BotaoGrupo align="end">

                    <BotaoGrupo align="end" style={{ marginTop: '24px' }}>
                        <Botao size="small" aoClicar={handleSubmit}>
                            <FaSave fill="var(--secundaria)" /> Registrar Vaga
                        </Botao>
                    </BotaoGrupo>

                </BotaoGrupo>
            </form>
        </Frame>
    );
};

export default VagasRegistro;

