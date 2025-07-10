import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components"
import http from '@http'
import { Toast } from 'primereact/toast';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { ScrollPanel } from 'primereact/scrollpanel';
import { HiArrowLeft, HiArrowRight, HiEye } from 'react-icons/hi';
import { FaTrash, FaSave, FaEye, FaUpload } from 'react-icons/fa';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { RiExchangeFill } from 'react-icons/ri';
import StepDocumentos from '../../Admissoes/Registro/Steps/StepDocumentos';
import StepDadosPessoais from '../../Admissoes/Registro/Steps/StepDadosPessoais';
import StepDadosBancarios from '../../Admissoes/Registro/Steps/StepDadosBancarios';
import StepEducacao from '../../Admissoes/Registro/Steps/StepEducacao';
import StepHabilidades from '../../Admissoes/Registro/Steps/StepHabilidades';
import StepExperiencia from '../../Admissoes/Registro/Steps/StepExperiencia';
import StepLGPD from '../../Admissoes/Registro/Steps/StepLGPD';
import Botao from '@components/Botao';
import styles from '../../Admissoes/Candidatos.module.css';
import { useCandidatoContext } from '@contexts/Candidato';
import Container from '@components/Container';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    position: relative;

    .custom-stepper {
        display: flex;
        flex-direction: column;
        height: 500px; /* Altura fixa menor */
        min-height: 400px; /* Altura mínima */
    }

    .custom-stepper .p-stepper-header {
        padding-top: 8px !important;
        padding-bottom: 8px !important;
        flex-shrink: 0; /* Impede que o header encolha */
        min-height: auto !important;
    }

    .custom-stepper .p-stepper-content {
        padding-top: 10px !important;
        flex: 1; /* Permite que o conteúdo use o espaço restante */
        overflow: hidden; /* Evita overflow que pode esconder o header */
    }

    .custom-stepper .p-stepper-panels {
        flex: 1;
        overflow: hidden;
    }

    .custom-stepper .p-stepper-panel {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    /* Altura responsiva para o ScrollPanel principal */
    .responsive-scroll-panel {
        width: 100%;
        height: 380px; /* Altura fixa menor */
        min-height: 300px;
        max-height: 380px;
    }

    /* Altura responsiva para ScrollPanels internos */
    .responsive-inner-scroll {
        width: 100%;
        height: 340px; /* Altura fixa menor */
        min-height: 260px;
        max-height: 340px;
        margin-bottom: 10px;
    }

    /* Media query específica para detectar zoom/escala do Windows */
    @media (min-resolution: 120dpi), (min-resolution: 1.25dppx) {
        .custom-stepper {
            height: 450px; /* Altura menor para zoom 125% */
        }
        .responsive-scroll-panel {
            height: 330px; /* Altura menor para zoom 125% */
            min-height: 280px;
            max-height: 330px;
        }
        .responsive-inner-scroll {
            height: 290px;
            min-height: 240px;
            max-height: 290px;
        }
    }

    /* Para zoom ainda maior (150%+) */
    @media (min-resolution: 144dpi), (min-resolution: 1.5dppx) {
        .custom-stepper {
            height: 400px;
        }
        .responsive-scroll-panel {
            height: 280px;
            min-height: 250px;
            max-height: 280px;
        }
        .responsive-inner-scroll {
            height: 240px;
            min-height: 210px;
            max-height: 240px;
        }
    }

    /* Para telas muito pequenas */
    @media (max-height: 600px) {
        .custom-stepper {
            height: 350px;
        }
        .responsive-scroll-panel {
            height: 250px;
            min-height: 200px;
        }
        .responsive-inner-scroll {
            height: 210px;
            min-height: 170px;
        }
    }
`;

const AcessoCandidatoRegistro = ({ candidatoData, token }) => {
    const { candidato, setCandidato, admissao, setAdmissao, vaga, setVaga } = useCandidatoContext();
    const [classError, setClassError] = useState([]);
    const stepperRef = useRef(null);
    const toast = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const [estados, setEstados] = useState([]);

    // Inicializa os dados do contexto quando candidatoData mudar
    useEffect(() => {
        if (candidatoData) {
            setCandidato(candidatoData || {});
            setAdmissao(candidatoData || {});
            setVaga(candidatoData?.dados_vaga || {});
        }
    }, [candidatoData, setCandidato, setAdmissao, setVaga]);

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

    const [listaInsalubridades, setListaInsalubridades] = useState([
        { code: '30%', name: '30%' },
        { code: '40%', name: '40%' },
        { code: '50%', name: '50%' },
        { code: '60%', name: '60%' },
        { code: '70%', name: '70%' },   
    ]);

    useEffect(() => {
        if (!estados.length) {
            http.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
                .then(response => {
                    response.map((item) => {
                        let obj = {
                            name: item.nome,
                            code: item.sigla
                        }
                        if (!estados.includes(obj)) {
                            setEstados(estadoAnterior => [...estadoAnterior, obj]);
                        }
                    })
                })
        }
    }, []);

    const ChangeCep = (value) => {
        if (value && value.length === 8) {
            http.get(`https://viacep.com.br/ws/${value}/json/`)
                .then(response => {
                    if (!response.erro) {
                        setCandidato(prev => ({
                            ...prev,
                            cep: value,
                            rua: response.logradouro,
                            bairro: response.bairro,
                            cidade: response.localidade,
                            estado: response.uf
                        }));
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar CEP:', error);
                });
        }
    };

    const handleSalvarAdmissao = async () => {
        try {
            const removerMascaraBRL = (valor) => {
                if (!valor) return null;
                return valor.replace(/[^\d,]/g, '').replace(',', '.');
            };

            const dadosParaEnviar = {
                ...admissao,
                dados_candidato: {
                    ...candidato,
                    salario: removerMascaraBRL(candidato.salario)
                }
            };

            // Enviar dados via token
            const response = await http.put(`candidato/${candidato.id}/`, dadosParaEnviar);
            
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Dados salvos com sucesso!',
                life: 3000
            });

            // Atualizar dados locais
            setAdmissao(response);
            setCandidato(response.dados_candidato);

        } catch (error) {
            console.error('Erro ao salvar:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao salvar dados. Tente novamente.',
                life: 3000
            });
        }
    };

    const concluirTarefa = async (tipoCodigo) => {
        try {
            await http.post(`tarefa/concluir-via-token/${token}/`, {
                tipo_codigo: tipoCodigo,
                admissao_id: admissao.id
            });

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Tarefa concluída com sucesso!',
                life: 3000
            });

            // Atualizar dados da admissão
            const response = await http.get(`admissao/${admissao.id}/`);
            setAdmissao(response);

        } catch (error) {
            console.error('Erro ao concluir tarefa:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao concluir tarefa. Tente novamente.',
                life: 3000
            });
        }
    };

    const validarDocumentos = () => {
        // Implementar validação de documentos
        return true;
    };

    const handleFinalizarDocumentos = async () => {
        if (!validarDocumentos()) {
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Por favor, complete todos os documentos obrigatórios.',
                life: 3000
            });
            return;
        }

        await concluirTarefa('aguardar_documento');
    };

    const handleAceitarLGPD = async () => {
        try {
            await http.put(`admissao/${admissao.id}/aceitar-lgpd-via-token/${token}/`);
            
            setAdmissao(prev => ({
                ...prev,
                aceite_lgpd: true
            }));

            await concluirTarefa('aguardar_lgpd');

        } catch (error) {
            console.error('Erro ao aceitar LGPD:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao aceitar LGPD. Tente novamente.',
                life: 3000
            });
        }
    };

    const handleSalvarEContinuar = async () => {
        await handleSalvarAdmissao();
        handleAvancar();
    };

    const handleVoltar = () => {
        stepperRef.current.prevCallback();
        setActiveIndex(prev => prev - 1);
    };

    const handleAvancar = () => {
        stepperRef.current.nextCallback();
        setActiveIndex(prev => prev + 1);
    };

    // Função para renderizar os botões baseado no step atual
    const renderFooterButtons = () => {
        const isFirstStep = activeIndex === 0;
        const isLastStep = activeIndex === 6; // Ajustado para 6 steps (sem dados da vaga)
        
        return (
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: '#fff',
                borderTop: '1px solid #e0e0e0',
                padding: '16px 24px',
                boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', gap: 12 }}>
                    {/* Botão Voltar - em todos os steps exceto o primeiro */}
                    {!isFirstStep && (
                        <Botao size="small" estilo="neutro" aoClicar={handleVoltar}>
                            <HiArrowLeft/> Voltar
                        </Botao>
                    )}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                    {/* Botões específicos por step */}
                    {activeIndex === 0 && (
                        <Botao size="small" label="Next" iconPos="right" aoClicar={handleAvancar}>
                            <HiArrowRight fill="white"/> Continuar
                        </Botao>
                    )}
                    
                    {/* Steps intermediários com salvar (Dados Pessoais, Dados Bancários, Educação, Habilidades) */}
                    {(activeIndex >= 1 && activeIndex <= 4) && (
                        <>
                            <Botao size="small" iconPos="right" aoClicar={handleSalvarAdmissao}>
                                <FaSave fill="white"/> Salvar
                            </Botao>
                            <Botao size="small" label="Next" iconPos="right" aoClicar={handleSalvarEContinuar}>
                                <HiArrowRight fill="white"/> Salvar e Continuar
                            </Botao>
                        </>
                    )}
                    
                    {/* Step Experiência - último step antes da finalização */}
                    {activeIndex === 5 && (
                        <>
                            <Botao size="small" iconPos="right" aoClicar={handleSalvarAdmissao}>
                                <FaSave fill="white"/> Salvar
                            </Botao>
                            <Botao size="small" label="Next" iconPos="right" aoClicar={handleFinalizarDocumentos}>
                                <RiExchangeFill fill="white"/> Finalizar
                            </Botao>
                        </>
                    )}
                    
                    {/* Step LGPD - último step */}
                    {activeIndex === 6 && (
                        <Botao 
                            iconPos="right" 
                            aoClicar={handleAceitarLGPD}
                            disabled={admissao.aceite_lgpd}
                        >
                            <FaSave fill="white"/> {admissao.aceite_lgpd ? 'Termo Aceito' : 'Aceitar e Finalizar'}
                        </Botao>
                    )}
                </div>
            </div>
        );
    };

    // Detectar cliques nos headers do stepper
    useEffect(() => {
        const stepperElement = stepperRef.current?.getElement?.();
        if (!stepperElement) return;

        const handleStepHeaderClick = (event) => {
            const stepHeader = event.target.closest('.p-stepper-header');
            if (stepHeader) {
                const stepIndex = Array.from(stepHeader.parentElement.children).indexOf(stepHeader);
                console.log('Header clicado, step:', stepIndex);
                setActiveIndex(stepIndex);
            }
        };

        stepperElement.addEventListener('click', handleStepHeaderClick);
        
        // Fallback: usar MutationObserver para detectar mudanças no stepper
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const activeHeader = stepperElement.querySelector('.p-stepper-header.p-highlight');
                    if (activeHeader) {
                        const stepIndex = Array.from(activeHeader.parentElement.children).indexOf(activeHeader);
                        console.log('MutationObserver detectou step ativo:', stepIndex);
                        setActiveIndex(stepIndex);
                    }
                }
            });
        });

        // Observar mudanças nos headers
        const headers = stepperElement.querySelectorAll('.p-stepper-header');
        headers.forEach(header => {
            observer.observe(header, { attributes: true, attributeFilter: ['class'] });
        });
        
        return () => {
            stepperElement.removeEventListener('click', handleStepHeaderClick);
            observer.disconnect();
        };
    }, []);

    const formatarCPF = (cpf) => {
        if (!cpf) return 'CPF não informado';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    return (
        <ConteudoFrame>
            <Toast ref={toast} style={{ zIndex: 9999 }} />
            <ConfirmDialog />
            
            {/* Header com informações do candidato */}
            {candidato?.dados_candidato?.nome && (
                <div style={{
                    background: 'linear-gradient(to bottom, #0c004c, #5d0b62)',
                    borderRadius: 8,
                    padding: '12px 16px',
                    marginBottom: 0,
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(12, 0, 76, 0.3)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 5
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 10
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10
                        }}>
                            <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 16,
                                fontWeight: 500,
                                color: '#fff'
                            }}>
                                {candidato?.dados_candidato.nome?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                            <div>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: '#fff',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}>
                                    {candidato?.dados_candidato?.nome || 'Nome não informado'}
                                </h2>
                                <p style={{
                                    margin: 0,
                                    fontSize: 12,
                                    color: '#fff',
                                    opacity: 0.9,
                                    fontWeight: 400
                                }}>
                                    CPF: {formatarCPF(candidato?.dados_candidato?.cpf) || 'CPF não informado'}
                                </p>
                            </div>
                        </div>
                        
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                background: 'rgba(255, 255, 255, 0.15)',
                                padding: '4px 10px',
                                borderRadius: 6,
                                backdropFilter: 'blur(10px)'
                            }}>
                                <span style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: '#fff',
                                    opacity: 0.9
                                }}>
                                    Vaga:
                                </span>
                                <span style={{
                                    background: '#333',
                                    color: '#fff',
                                    padding: '4px 8px',
                                    borderRadius: 12,
                                    fontSize: 11,
                                    fontWeight: 400,
                                    textTransform: 'capitalize'
                                }}>
                                    {vaga?.titulo || 'Vaga não informada'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ paddingBottom: '80px' }}> {/* Espaço para o footer fixo */}
                <Stepper 
                    headerPosition="top" 
                    ref={stepperRef} 
                    className="custom-stepper"
                >
                    <StepperPanel header="Documentos Pessoais">
                        <Container padding={'0'} gap="10px">
                            <div className={styles.containerDadosPessoais} style={{ position: 'relative' }}>
                                <ScrollPanel className="responsive-scroll-panel">
                                    <StepDocumentos
                                        candidato={candidato}
                                        setCandidato={setCandidato}
                                        admissao={admissao}
                                        setAdmissao={setAdmissao}
                                        handleFinalizarDocumentos={handleFinalizarDocumentos}
                                        handleAceitarLGPD={handleAceitarLGPD}
                                        token={token}
                                    />
                                </ScrollPanel>
                            </div>
                        </Container>
                    </StepperPanel>
                    
                    <StepperPanel header="Dados Pessoais">
                        <Container padding={'0'} gap="10px">
                            <div className={styles.containerDadosPessoais} style={{ position: 'relative' }}>
                                <ScrollPanel className="responsive-scroll-panel" style={{ marginBottom: 10 }}>
                                    <StepDadosPessoais
                                        candidato={candidato}
                                        setCandidato={setCandidato}
                                        estados={estados}
                                        ChangeCep={ChangeCep}
                                    />
                                </ScrollPanel>
                            </div>
                        </Container>
                    </StepperPanel>
                    
                    <StepperPanel header="Dados Bancários">
                        <Container padding={'0'} gap="10px">
                            <div className={styles.containerDadosPessoais} style={{ position: 'relative' }}>
                                <ScrollPanel className="responsive-scroll-panel" style={{ marginBottom: 10 }}>
                                    <StepDadosBancarios
                                        candidato={candidato}
                                        setCandidato={setCandidato}
                                    />
                                </ScrollPanel>
                            </div>
                        </Container>
                    </StepperPanel>
                    
                    <StepperPanel header="Educação">
                        <ScrollPanel className="responsive-scroll-panel">
                            <div style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                                <ScrollPanel className="responsive-inner-scroll">
                                    <StepEducacao
                                        candidato={candidato}
                                        setCandidato={setCandidato}
                                    />
                                </ScrollPanel>
                            </div>
                        </ScrollPanel>
                    </StepperPanel>
                    
                    <StepperPanel header="Habilidades">
                        <ScrollPanel className="responsive-scroll-panel">
                            <div style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                                <ScrollPanel className="responsive-inner-scroll">
                                    <StepHabilidades
                                        candidato={candidato}
                                        setCandidato={setCandidato}
                                    />
                                </ScrollPanel>
                            </div>
                        </ScrollPanel>
                    </StepperPanel>
                    
                    <StepperPanel header="Experiência Profissional">
                        <ScrollPanel className="responsive-scroll-panel">
                            <div style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                                <ScrollPanel className="responsive-inner-scroll">
                                    <StepExperiencia
                                        candidato={candidato}
                                        setCandidato={setCandidato}
                                    />
                                </ScrollPanel>
                            </div>
                        </ScrollPanel>
                    </StepperPanel>
                    
                    <StepperPanel header="LGPD">
                        <ScrollPanel className="responsive-scroll-panel" style={{ textAlign: 'center' }}>
                            <StepLGPD
                                candidato={candidato}
                                setCandidato={setCandidato}
                                admissao={admissao}
                                setAdmissao={setAdmissao}
                                handleAceitarLGPD={handleAceitarLGPD}
                            />
                        </ScrollPanel>
                    </StepperPanel>
                </Stepper>
            </div>

            {/* Footer fixo com botões */}
            {renderFooterButtons()}
        </ConteudoFrame>
    );
};

export default AcessoCandidatoRegistro; 