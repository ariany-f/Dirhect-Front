import React, { useState, useEffect, useRef } from 'react';
import CampoTexto from '@components/CampoTexto';
import Botao from '@components/Botao';
import Frame from '@components/Frame';
import http from '@http';
import styled from 'styled-components';
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import { RiCloseFill } from 'react-icons/ri';
import Titulo from '@components/Titulo';
import { unformatCurrency } from '@utils/formats';
import DropdownItens from '@components/DropdownItens';

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

const ModalContent = styled.div`
    display: flex;
    gap: 24px;
    height: calc(100vh - 200px);
    overflow-y: auto;
    padding: 0 24px;
`

const Column = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    background: var(--surface-card);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);

    h6 {
        margin: 0;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--surface-border);
    }
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 16px 24px;
    border-top: 1px solid var(--surface-border);
    background: var(--surface-ground);
`

function ModalVaga({ opened = false, aoFechar, vaga, aoSalvar }) {
    const [classError, setClassError] = useState([]);
    const [filiais, setFiliais] = useState([]);
    const [centros_custo, setCentrosCusto] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [secoes, setSecoes] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [funcoes, setFuncoes] = useState([]);
    const [sindicatos, setSindicatos] = useState([]);
    const [erroPeriInsa, setErroPeriInsa] = useState(false);
    const toast = useRef(null);

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataAbertura, setDataAbertura] = useState('');
    const [dataEncerramento, setDataEncerramento] = useState('');
    const [salario, setSalario] = useState('');
    const [deficiencia, setDeficiencia] = useState(false);
    const [qtdVagas, setQtdVagas] = useState('');
    const [inclusao, setInclusao] = useState(false);
    const [inclusao_para, setInclusaoPara] = useState('');
    const [filial, setFilial] = useState(null);
    const [centroCusto, setCentroCusto] = useState(null);
    const [departamento, setDepartamento] = useState(null);
    const [secao, setSecao] = useState(null);
    const [cargo, setCargo] = useState(null);
    const [horario, setHorario] = useState(null);
    const [funcao, setFuncao] = useState(null);
    const [sindicato, setSindicato] = useState(null);
    const [periculosidade, setPericulosidade] = useState('');
    const [insalubridade, setInsalubridade] = useState('');

    const [listaPericulosidades] = useState([
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

    // Verifica se a vaga tem candidatos
    const temCandidatos = vaga?.candidatos?.length > 0;
    const vagaAberta = vaga?.status === 'A';

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

    useEffect(() => {
        if (vaga) {
            console.log(vaga)
            setTitulo(vaga.titulo || '');
            setDescricao(vaga.descricao || '');
            setDataAbertura(vaga.dt_abertura || '');
            setDataEncerramento(vaga.dt_encerramento || '');
            setSalario(vaga.salario);
            setDeficiencia(vaga.deficiencia || false);
            setQtdVagas(vaga.qtd_vaga ? vaga.qtd_vaga.toString() : '');
            setInclusao(vaga.inclusao || false);
            setInclusaoPara(vaga.inclusao_para || '');
            setPericulosidade(vaga.periculosidade ? listaPericulosidades.find(p => p.code === vaga.periculosidade) : '');
            setInsalubridade(vaga.insalubridade || '');
            setFilial(vaga.filial_id ? { code: vaga.filial_id, name: filiais.find(f => f.id === vaga.filial_id)?.nome } : null);
            setCentroCusto(vaga.centro_custo_id ? { code: vaga.centro_custo_id, name: centros_custo.find(cc => cc.id === vaga.centro_custo_id)?.nome } : null);
            setDepartamento(vaga.departamento_id ? { code: vaga.departamento_id, name: departamentos.find(d => d.id === vaga.departamento_id)?.nome } : null);
            setSecao(vaga.secao_id ? { code: vaga.secao_id, name: secoes.find(s => s.id === vaga.secao_id)?.nome } : null);
            setCargo(vaga.cargo_id ? { code: vaga.cargo_id, name: cargos.find(c => c.id === vaga.cargo_id)?.nome } : null);
            setHorario(vaga.horario_id ? { code: vaga.horario_id, name: horarios.find(h => h.id === vaga.horario_id)?.codigo + ' - ' + horarios.find(h => h.id === vaga.horario_id)?.descricao } : null);
            setFuncao(vaga.funcao_id ? { code: vaga.funcao_id, name: funcoes.find(f => f.id === vaga.funcao_id)?.nome } : null);
            setSindicato(vaga.sindicato_id ? { code: vaga.sindicato_id, name: sindicatos.find(s => s.id === vaga.sindicato_id)?.codigo + ' - ' + sindicatos.find(s => s.id === vaga.sindicato_id)?.descricao } : null);
        }
    }, [vaga, filiais, centros_custo, departamentos, secoes, cargos, horarios, funcoes, sindicatos]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!periculosidade && !insalubridade) {
            setErroPeriInsa(true);
            toast.current.show({
                severity: 'error',
                summary: 'Preencha periculosidade ou insalubridade',
                life: 3000
            });
            return;
        } else {
            setErroPeriInsa(false);
        }

        const salarioNumerico = salario ? 
            Math.floor(Number(unformatCurrency(salario)) / 100)
            : null;

        const vagaAtualizada = {
            ...vaga,
            titulo,
            descricao,
            dt_abertura: dataAbertura || null,
            dt_encerramento: dataEncerramento || null,
            deficiencia,
            periculosidade: periculosidade?.code || null,
            insalubridade: insalubridade || 0,
            inclusao,
            inclusao_para: inclusao_para || null,
            qtd_vaga: qtdVagas ? parseInt(qtdVagas) : null,
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

        aoSalvar(vagaAtualizada);
    };

    return (
        opened &&
        <Overlay>
            <DialogEstilizado $width="95vw" $minWidth="80vw" open={opened}>
                <Frame>
                    <Titulo>
                        <button className="close" onClick={aoFechar}>
                            <RiCloseFill size={20} className="fechar" />  
                        </button>
                        <h6>Editar Vaga</h6>
                    </Titulo>
                </Frame>
                <form onSubmit={handleSubmit}>
                    <ModalContent>
                        <Column>
                            <h6>Dados Básicos</h6>
                            <Col12>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError}
                                        name="titulo" 
                                        valor={titulo} 
                                        setValor={setTitulo} 
                                        type="text" 
                                        label="Título" 
                                        placeholder="Digite o titulo" />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError}
                                        name="descricao" 
                                        valor={descricao} 
                                        setValor={setDescricao} 
                                        type="text" 
                                        label="Descrição" 
                                        placeholder="Digite a descrição" />
                                </Col6>
                            </Col12>
                            <Col12>
                                <Col6>
                                    <CampoTexto 
                                        type="date" 
                                        valor={dataAbertura} 
                                        setValor={setDataAbertura}
                                        label="Data de Abertura"
                                        disabled={vagaAberta && temCandidatos}
                                        title={vagaAberta && temCandidatos ? "Não é possível alterar a data de início pois a vaga já possui candidatos" : ""} />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        type="date" 
                                        valor={dataEncerramento} 
                                        setValor={setDataEncerramento}
                                        label="Data de Encerramento"  />
                                </Col6>
                            </Col12>
                            
                            <Col12>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError}
                                        name="salario" 
                                        valor={salario} 
                                        setValor={setSalario} 
                                        type="text" 
                                        patternMask="BRL"
                                        label="Salário" 
                                        placeholder="Digite o salário" />
                                </Col6>
                                <Col6>
                                    <CampoTexto
                                        name="qtd_vaga"
                                        valor={qtdVagas}
                                        setValor={setQtdVagas}
                                        type="number"
                                        label="Quantidade de Vagas"
                                        placeholder="Digite a quantidade de vagas"
                                    />
                                </Col6>
                            </Col12>
                        </Column>

                        <Column>
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
                        </Column>
                    </ModalContent>
                    <ButtonContainer>
                        <Botao type="submit">Salvar Alterações</Botao>
                    </ButtonContainer>
                </form>
            </DialogEstilizado>
        </Overlay>
    );
}

export default ModalVaga;
