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

    useEffect(() => {
        if (vaga) {
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
        }
    }, [vaga]);

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

        // Remove formatação e converte para número inteiro (sem centavos)
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
            salario: salarioNumerico
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
                <Frame padding="24px 0px">
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
                                    label="Data de Abertura"  />
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

                        <Botao type="submit">Salvar Alterações</Botao>
                    </form>
                </Frame>
            </DialogEstilizado>
        </Overlay>
    );
}

export default ModalVaga;
