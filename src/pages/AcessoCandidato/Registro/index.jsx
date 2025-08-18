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
import { TourProvider, useTour } from '@reactour/tour';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    position: relative;
    overflow-x: hidden;
    min-height: 100vh;
    height: 100vh;

    .custom-stepper {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        height: 100%;
    }

    .custom-stepper .p-stepper-header {
        padding-top: 8px !important;
        padding-bottom: 8px !important;
        flex-shrink: 0;
        min-height: auto !important;
        position: sticky;
        top: 0;
        z-index: 10;
        background: #fff;
    }

    .custom-stepper .p-stepper-content {
        padding-top: 10px !important;
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .custom-stepper .p-stepper-panels {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .custom-stepper .p-stepper-panel {
        height: 100%;
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
    }

    .responsive-scroll-panel {
        width: 100%;
        height: 100%;
        min-height: 0;
        max-height: none;
        flex: 1;
        overflow-x: hidden;
        box-sizing: border-box;
    }

    .responsive-inner-scroll {
        width: 100%;
        height: 100%;
        min-height: 0;
        max-height: none;
        flex: 1;
        overflow-x: hidden;
        box-sizing: border-box;
        margin-bottom: 10px;
    }

    /* Removidas media queries que limitavam altura dos painéis */
`;

// Componente interno que usa o contexto do tour
const RegistroContent = ({ candidatoData, token, tourSteps }) => {
    const { candidato, setCandidato, admissao, setAdmissao, vaga, setVaga } = useCandidatoContext();
    const [classError, setClassError] = useState([]);
    const stepperRef = useRef(null);
    const toast = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [tourStepIndex, setTourStepIndex] = useState(0);
    const { setCurrentStep, currentStep, setIsOpen } = useTour();

    const [estados, setEstados] = useState([]);

    // Adicione constantes para as alturas
    const ALTURA_HEADER = 64; // px
    const ALTURA_STEPPER = 64; // px
    const ALTURA_FOOTER = 80; // px

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

            // Função para formatar CPF (só números)
            const formatarCPFNumeros = (cpf) => {
                if (!cpf) return null;
                return cpf.replace(/\D/g, ''); // Remove tudo que não é dígito
            };

            // Remover propriedades que não devem ser enviadas
            // const { vagas_configurado, ...candidatoSemGenero } = candidato.dados_candidato;
            // const { tarefas, log_tarefas, html_email, dados_candidato, documentos, documentos_status, vaga, processo, dados_vaga, ...admissaoLimpa } = admissao;

            const dadosParaEnviar = {
                ...admissao,
                ...candidato,
                cpf: formatarCPFNumeros(candidato.cpf),
                salario: removerMascaraBRL(candidato.salario)
            };

            // Enviar dados via token
            const response = await http.put(`admissao/${admissao.id}/`, dadosParaEnviar);
            
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Dados salvos com sucesso!',
                life: 3000
            });

            // Atualizar dados locais
            setAdmissao(response);
            // Manter a estrutura correta do candidato para não quebrar o header
            setCandidato(prev => ({
                ...prev,
                dados_candidato: response.dados_candidato || response.candidato
            }));

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
                            <HiArrowRight fill="var(--secundaria)"/> Continuar
                        </Botao>
                    )}
                    
                    {/* Steps intermediários com salvar (Dados Pessoais, Dados Bancários, Educação, Habilidades) */}
                    {(activeIndex >= 1 && activeIndex <= 4) && (
                        <>
                            <Botao size="small" iconPos="right" aoClicar={handleSalvarAdmissao}>
                                <FaSave fill="var(--secundaria)"/> Salvar
                            </Botao>
                            <Botao size="small" label="Next" iconPos="right" aoClicar={handleSalvarEContinuar}>
                                <HiArrowRight fill="var(--secundaria)"/> Salvar e Continuar
                            </Botao>
                        </>
                    )}
                    
                    {/* Step Experiência - último step antes da finalização */}
                    {activeIndex === 5 && (
                        <>
                            <Botao size="small" iconPos="right" aoClicar={handleSalvarAdmissao}>
                                <FaSave fill="var(--secundaria)"/> Salvar
                            </Botao>
                            <Botao size="small" label="Next" iconPos="right" aoClicar={handleFinalizarDocumentos}>
                                <RiExchangeFill fill="var(--secundaria)"/> Finalizar
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
                            <FaSave fill="var(--secundaria)"/> {admissao.aceite_lgpd ? 'Termo Aceito' : 'Aceitar e Finalizar'}
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

    // Array com os componentes de cada step
    const stepsContent = [
        <StepDocumentos
            candidato={candidato}
            setCandidato={setCandidato}
            admissao={admissao}
            setAdmissao={setAdmissao}
            handleFinalizarDocumentos={handleFinalizarDocumentos}
            handleAceitarLGPD={handleAceitarLGPD}
            token={token}
        />,
        <StepDadosPessoais
            candidato={candidato}
            setCandidato={setCandidato}
            estados={estados}
            ChangeCep={ChangeCep}
        />,
        <StepDadosBancarios
            candidato={candidato}
            setCandidato={setCandidato}
        />,
        <StepEducacao
            candidato={candidato}
            setCandidato={setCandidato}
        />,
        <StepHabilidades
            candidato={candidato}
            setCandidato={setCandidato}
        />,
        <StepExperiencia
            candidato={candidato}
            setCandidato={setCandidato}
        />,
        <StepLGPD
            candidato={candidato}
            setCandidato={setCandidato}
            admissao={admissao}
            setAdmissao={setAdmissao}
            handleAceitarLGPD={handleAceitarLGPD}
        />
    ];

    // Função para checar se há documentos
    const temDocumentos = Array.isArray(candidato?.documentos) && candidato.documentos.length > 0;

    // Função para scrollar para o topo do Stepper
    const scrollToStepper = () => {
      const stepperEl = document.querySelector('[data-tour="stepper"]');
      if (stepperEl) {
        stepperEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // Sincronizar tour e step ativo
    useEffect(() => {
      if (typeof setCurrentStep === 'function') {
        setCurrentStep(tourStepIndex);
      }
    }, [tourStepIndex, setCurrentStep]);

    // Garante que o tutorial abre automaticamente ao montar a tela
    useEffect(() => {
      if (typeof setIsOpen === 'function') {
        console.log('começa tutorial');
        // Adiciona um pequeno delay para garantir que o DOM está pronto
        setTimeout(() => {
          // Verifica se os elementos existem antes de abrir o tour
          const stepperElement = document.querySelector('[data-tour="stepper"]');
          const firstStepElement = document.querySelector('[data-tour="stepper-step-0"]');
          const firstPanelElement = document.querySelector('[data-tour="panel-step-0"]');
          
          console.log('Elementos encontrados:', {
            stepper: !!stepperElement,
            firstStep: !!firstStepElement,
            firstPanel: !!firstPanelElement
          });
          
          if (stepperElement && firstStepElement && firstPanelElement) {
            console.log('Abrindo tour...');
            setIsOpen(true);
          } else {
            console.log('Elementos não encontrados, tentando novamente em 1s...');
            setTimeout(() => {
              setIsOpen(true);
            }, 1000);
          }
        }, 500);
      }
    }, [setIsOpen]);

    // Função para abrir o tutorial manualmente
    const handleAbrirTutorial = () => {
      console.log('Abrindo tutorial manualmente...');
      if (typeof setIsOpen === 'function') {
        setIsOpen(true);
      }
    };

    // Quando o usuário avança o tour, sincroniza o step ativo
    useEffect(() => {
      if (currentStep !== undefined && currentStep !== null) {
        const idx = currentStep; // Corrigido: cada passo do tour corresponde a um painel
        
        // Clicar no botão do stepper correspondente
        const stepperButton = document.querySelector(`[data-tour="stepper-step-${idx}"] .p-stepper-action`);
        if (stepperButton) {
          stepperButton.click();
        }
        
        // Fallback: usar o método do stepper
        if (stepperRef.current && typeof stepperRef.current.goToStep === 'function') {
          stepperRef.current.goToStep(idx);
        } else {
          setActiveIndex(idx);
        }
        
        setTimeout(() => {
          scrollToStepper();
          // Debug para verificar se o painel existe
          const el = document.querySelector(`[data-tour="panel-step-${idx}"]`);
          console.log('Painel existe?', !!el, `panel-step-${idx}`);
        }, 200);
      }
    }, [currentStep]);

    return (
      <ConteudoFrame>
        <Toast ref={toast} style={{ zIndex: 9999 }} />
        <ConfirmDialog  />
        {/* Header com informações do candidato */}
        {candidato?.nome && (
          <div style={{
            background: 'linear-gradient(to bottom, var(--black), var(--gradient-secundaria))',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 0,
            color: '#fff',
            boxShadow: '0 2px 8px rgba(12, 0, 76, 0.3)',
            position: 'sticky',
            top: 0,
            zIndex: 20
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
                  {candidato.nome?.charAt(0)?.toUpperCase() || 'C'}
                </div>
                <div>
                  <h2 style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#fff',
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    {candidato?.nome || 'Nome não informado'}
                  </h2>
                  <p style={{
                    margin: 0,
                    fontSize: 12,
                    color: '#fff',
                    opacity: 0.9,
                    fontWeight: 400
                  }}>
                    CPF: {formatarCPF(candidato?.cpf) || 'CPF não informado'}
                  </p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                {/* Botão Ver Tutorial */}
                <button
                  onClick={handleAbrirTutorial}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <HiEye fill="#fff" size={14} color="#fff" />
                  Ver Tutorial
                </button>
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

        {/* Stepper sticky logo abaixo do header do candidato */}
        <div
          style={{
            position: 'sticky',
            top: 64, // altura aproximada do header do candidato
            zIndex: 15,
            background: '#fff',
            borderBottom: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            padding: '0 24px',
          }}
          data-tour="stepper"
        >
          <Stepper
            headerPosition="top"
            ref={stepperRef}
            className="custom-stepper"
            onSelect={setActiveIndex}
          >
            <StepperPanel header="Anexos" data-tour="stepper-step-0" />
            <StepperPanel header="Dados Pessoais" data-tour="stepper-step-1" />
            <StepperPanel header="Dados Bancários" data-tour="stepper-step-2" />
            <StepperPanel header="Educação" data-tour="stepper-step-3" />
            <StepperPanel header="Habilidades" data-tour="stepper-step-4" />
            <StepperPanel header="Experiência Profissional" data-tour="stepper-step-5" />
            <StepperPanel header="LGPD" data-tour="stepper-step-6" />
          </Stepper>
        </div>

        {/* Painel rolável com conteúdo do step ativo */}
        <div
          style={{
            overflowY: 'auto',
            height: 'calc(100vh - 64px - 64px - 80px)', // header + stepper + footer
            padding: '24px',
            paddingBottom: 80,
            width: '100%'
          }}
          data-tour={`panel-step-${activeIndex}`}
        >
          {stepsContent[activeIndex]}
        </div>

        {/* Footer fixo com botões */}
        {renderFooterButtons()}
      </ConteudoFrame>
    );
};

const AcessoCandidatoRegistro = ({ candidatoData, token }) => {
    // Passos do tutorial - um para cada etapa
    const stepLabels = [
      'Documentos Pessoais',
      'Dados Pessoais',
      'Dados Bancários',
      'Educação',
      'Habilidades',
      'Experiência Profissional',
      'LGPD'
    ];
    
    // Função para checar se há documentos (baseado nos dados iniciais)
    const temDocumentos = Array.isArray(candidatoData?.documentos) && candidatoData.documentos.length > 0;
    
    const stepContents = temDocumentos ? [
      'Comece anexando os documentos solicitados. Só depois de anexar todos, você poderá avançar.',
      'Preencha seus dados pessoais com atenção.',
      'Informe seus dados bancários.',
      'Informe sua formação acadêmica.',
      'Adicione suas habilidades.',
      'Adicione sua experiência profissional.',
      'Leia e aceite o termo LGPD para finalizar.'
    ] : [
      'Comece preenchendo seus dados pessoais.',
      'Preencha seus dados pessoais com atenção.',
      'Informe seus dados bancários.',
      'Informe sua formação acadêmica.',
      'Adicione suas habilidades.',
      'Adicione sua experiência profissional.',
      'Leia e aceite o termo LGPD para finalizar.'
    ];
    
    const tourSteps = stepLabels.map((label, idx) => [
      {
        selector: `[data-tour="stepper-step-${idx}"]`,
        content: `Etapa ${idx + 1}: ${label}\n${stepContents[idx]}`,
        position: 'bottom',
        action: undefined,
        actionAfter: undefined
      }
    ]).flat();

    // Ajuste no styles.popover: setas mais visíveis e posicionamento melhor
    const popoverStyle = (base, step) => {
      return {
        ...base,
        zIndex: 2147483647,
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        border: '1px solid #e0e0e0',
        maxWidth: '400px',
        padding: '16px'
      };
    };

    return (
      <TourProvider 
        steps={tourSteps} 
        showNavigation 
        showBadge
        styles={{
          popover: popoverStyle,
          mask: (base) => ({
            ...base,
            zIndex: 2147483646,
            backgroundColor: 'rgba(0,0,0,0.5)'
          }),
          highlightedArea: (base) => ({
            ...base,
            zIndex: 2147483648
          })
        }}
        onClickMask={({ setIsOpen }) => setIsOpen(false)}
        disableInteraction={false}
        disableDotsNavigation={false}
        disableKeyboardNavigation={false}
      >
        <RegistroContent candidatoData={candidatoData} token={token} tourSteps={tourSteps} />
      </TourProvider>
    );
};

export default AcessoCandidatoRegistro; 