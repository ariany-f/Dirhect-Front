import React, { useEffect, useRef, useState } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import Container from '@components/Container'; // Importando o componente Container
import Botao from '@components/Botao'; // Importando o componente Container
import { useNavigate, useParams } from 'react-router-dom';
import styled from "styled-components"
import http from '@http'
import axios from "axios"
import BotaoVoltar from "@components/BotaoVoltar"
import styles from './../Candidatos.module.css'
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { ScrollPanel } from 'primereact/scrollpanel';
import { HiArrowLeft, HiArrowRight, HiEye, HiCheckCircle, HiX } from 'react-icons/hi';
import { FaTrash, FaSave, FaEye, FaUpload } from 'react-icons/fa';
import { Toast } from 'primereact/toast';
import { CandidatoProvider, useCandidatoContext } from '@contexts/Candidato';
import StepDocumentos from './Steps/StepDocumentos';
import StepDadosPessoais from './Steps/StepDadosPessoais';
import StepDadosBancarios from './Steps/StepDadosBancarios';
import StepVaga from './Steps/StepVaga';
import StepEducacao from './Steps/StepEducacao';
import StepHabilidades from './Steps/StepHabilidades';
import StepExperiencia from './Steps/StepExperiencia';
import StepLGPD from './Steps/StepLGPD';
import StepDependentes from './Steps/StepDependentes';
import StepAnotacoes from './Steps/StepAnotacoes';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { RiExchangeFill, RiUpload2Fill } from 'react-icons/ri';
import { ArmazenadorToken } from '@utils';
import imageCompression from 'browser-image-compression';

// Modal customizado estilizado
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease-out;
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

const ModalContainer = styled.div`
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow: hidden;
    animation: slideIn 0.3s ease-out;
    
    @keyframes slideIn {
        from { 
            opacity: 0; 
            transform: translateY(-20px) scale(0.95);
        }
        to { 
            opacity: 1; 
            transform: translateY(0) scale(1);
        }
    }
`;

const ModalHeader = styled.div`
    background: linear-gradient(135deg, var(--black), var(--gradient-secundaria));
    color: white;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    }
`;

const ModalTitle = styled.h2`
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: white;
    display: flex;
    align-items: center;
    gap: 10px;
    
    svg {
        color: white;
    }
`;

const CloseButton = styled.button`
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    
    svg {
        color: white;
    }
    
    &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
    }
`;

const ModalContent = styled.div`
    padding: 24px;
    text-align: center;
    max-height: 60vh;
    overflow-y: auto;
`;

const IconContainer = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #10b981, #059669);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
    
    svg {
        width: 36px;
        height: 36px;
        color: white;
    }
`;

const ModalMessage = styled.p`
    font-size: 16px;
    line-height: 1.6;
    color: #374151;
    margin: 0 0 24px;
    text-align: left;
    
    strong {
        color: var(--primaria);
        font-weight: 600;
    }
`;

const ModalFooter = styled.div`
    padding: 20px 24px;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
`;

const ModalButton = styled.button`
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
    
    &.secondary {
        background: #f3f4f6;
        color: #6b7280;
        border: 1px solid #d1d5db;
        
        svg {
            color: #6b7280;
        }
        
        &:hover {
            background: #e5e7eb;
            color: #374151;
            
            svg {
                color: #374151;
            }
        }
    }
    
    &.primary {
        background: linear-gradient(135deg, var(--black), var(--gradient-secundaria));
        color: white;
        box-shadow: 0 4px 12px rgba(12, 0, 76, 0.3);
        
        svg {
            color: white;
        }
        
        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(12, 0, 76, 0.4);
        }
        
        &:active {
            transform: translateY(0);
        }
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
`;

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

const ImageModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease-out;
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

const ImageModalContent = styled.div`
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

const ImageModalImage = styled.img`
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const ImageModalControls = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
`;

const ImageModalButton = styled.button`
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    color: #333;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
    
    &:hover {
        background: rgba(255, 255, 255, 1);
        transform: translateY(-1px);
    }
    
    &.danger {
        background: rgba(239, 68, 68, 0.9);
        color: white;
        
        &:hover {
            background: rgba(239, 68, 68, 1);
        }
    }
`;

const UploadDropzone = styled.label`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 2px dashed var(--primaria);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.1);
    
    &:hover {
        border-color: var(--primaria-escuro);
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
    }
`;

const UploadIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    
    svg {
        font-size: 16px;
    }
`;

const CandidatoRegistro = () => {

    let { id, self = false } = useParams()
    const { candidato, setCandidato, admissao, setAdmissao, vaga, setVaga } = useCandidatoContext()
    const [classError, setClassError] = useState([])
    const stepperRef = useRef(null);
    const navegar = useNavigate()
 
    // Verificar se os steps devem ser exibidos baseado nas variáveis de ambiente
    const mostrarHabilidades = import.meta.env.VITE_OPTION_HABILIDADES === 'true';
    const mostrarExperiencia = import.meta.env.VITE_OPTION_EXPERIENCIA === 'true';
 
    const [filiais, setFiliais] = useState([]);
    const [centros_custo, setCentrosCusto] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [secoes, setSecoes] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [funcoes, setFuncoes] = useState([]);
    const [sindicatos, setSindicatos] = useState([]);
    const [estados, setEstados] = useState([]);
    const toast = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showModalConfirmacao, setShowModalConfirmacao] = useState(false);
    const [initialCandidato, setInitialCandidato] = useState(null);
    const [modoLeitura, setModoLeitura] = useState(false);
    const [showConfirmacaoFinalizacao, setShowConfirmacaoFinalizacao] = useState(false);
    const [showConfirmacaoDependentes, setShowConfirmacaoDependentes] = useState(false);
    const [dependentesParaAdicionar, setDependentesParaAdicionar] = useState([]);
    const [acaoSalvamento, setAcaoSalvamento] = useState(null); // 'salvar' ou 'salvar_continuar'
    const [showImageModal, setShowImageModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Funções para verificar permissões baseadas no perfil
    const verificarPermissaoTarefa = (tipoTarefa) => {
        const perfil = ArmazenadorToken.UserProfile;
        
        switch (tipoTarefa) {
            case 'aguardar_documento':
                // Permite que qualquer perfil aprovado possa aprovar documentos
                return perfil === 'analista_tenant' || perfil === 'analista' || perfil === 'supervisor' || perfil === 'gestor' || perfil === null;
            case 'aprovar_admissao':
                return ['analista', 'supervisor', 'gestor'].includes(perfil);
            case 'aguardar_lgpd':
                // Permite que qualquer perfil aprovado possa aceitar LGPD
                return perfil === 'analista_tenant' || perfil === 'analista' || perfil === 'supervisor' || perfil === 'gestor' || perfil === null;
            default:
                return false;
        }
    };

    const verificarTarefaConcluida = (tipoTarefa) => {
        return candidato?.tarefas?.some(tarefa => 
            tarefa.tipo_codigo === tipoTarefa && 
            (tarefa.status === 'concluida' || tarefa.status === 'concluído')
        );
    };

    const obterTarefaPendente = () => {
        if (!candidato?.tarefas) return null;
        
        const tarefasPendentes = candidato.tarefas.filter(tarefa => {
            const temPermissao = verificarPermissaoTarefa(tarefa.tipo_codigo);
            const statusValido = tarefa.status === 'pendente' || tarefa.status === 'em_andamento';
            
            return statusValido && temPermissao;
        });
        
        return tarefasPendentes.length > 0 ? tarefasPendentes[0] : null;
    };

    // Verificar se deve estar em modo leitura
    useEffect(() => {
        const tarefaPendente = obterTarefaPendente();
        
        // Se não há tarefa pendente que o usuário pode concluir, ativa modo leitura
        if (!tarefaPendente) {
            setModoLeitura(true);
        } else {
            setModoLeitura(false);
        }
    }, [candidato?.tarefas]);

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

        // Refatoração: array de endpoints e setters
        const listasAuxiliares = [
            { endpoint: 'filial/?format=json', setter: setFiliais },
            { endpoint: 'departamento/?format=json', setter: setDepartamentos },
            { endpoint: 'secao/?format=json', setter: setSecoes },
            { endpoint: 'cargo/?format=json', setter: setCargos },
            { endpoint: 'centro_custo/?format=json', setter: setCentrosCusto },
            { endpoint: 'sindicato/?format=json', setter: setSindicatos },
            { endpoint: 'horario/?format=json', setter: setHorarios },
            { endpoint: 'funcao/?format=json', setter: setFuncoes },
        ];

        listasAuxiliares.forEach(({ endpoint, setter }) => {
            http.get(endpoint)
                .then(response => setter(response))
                .catch(() => {})
                .finally(() => {});
        });
    }, [])

    // Fechar modal com ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                if (showModalConfirmacao) {
                    setShowModalConfirmacao(false);
                }
                if (showImageModal) {
                    setShowImageModal(false);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showModalConfirmacao, showImageModal]);

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

    // Função utilitária para buscar e processar dados do OCR
    async function buscarDadosOCR(file) {
        if (!file) return null;
        // Converte o arquivo para Base64
        const base64 = await convertToBase64(file);
        // Monta o JSON para a API
        const payload = {
            base64: {
                fileName: base64, // Envia o Base64 no formato correto
            },
        };
        // Faz a requisição para a API
        const response = await axios.post('https://api-homolog.nxcd.app/full-ocr/v4', payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'ApiKey 67af9caf49a98cd56801648b:m98bx4uYC3MbutgRlBN_l-k3',
            },
        });
        return response.data;
    }
    
    // Função para converter um arquivo para Base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Pega apenas o Base64 puro
            reader.onerror = (error) => reject(error);
        });
    };

    const { 
        vagas,
        setVagas
    } = useVagasContext()

    useEffect(() => {
        if (id) {
            http.get(`admissao/${id}/`)
                .then((data) => {
                    const fullCandidatoData = {
                        ...data,
                        educacao: data.educacao || [],
                        habilidades: data.habilidades || [],
                        experiencia: data.experiencia || [],
                        dependentes: data.dependentes || [],
                        anotacoes: data.anotacoes || '',
                        dados_vaga: data.dados_vaga || {}
                    };
                    // Atualiza o candidato com todos os dados
                    setCandidato(fullCandidatoData);
                    setVaga(data.dados_vaga || {});
                    setAdmissao(data);
                    
                    // Aguarda um tick para garantir que os componentes processaram os dados
                    setTimeout(() => {
                        setInitialCandidato(JSON.parse(JSON.stringify(fullCandidatoData)));
                    }, 100);
                })
                .catch((err) => {
                    console.error('Erro ao buscar admissão:', err);
                });
        }
    }, []);

    const handleSalvarAdmissao = async () => {
        // Se estiver em modo leitura, apenas mostra mensagem
        if (modoLeitura) {
            toast.current.show({
                severity: 'warn',
                summary: 'Modo de leitura',
                detail: 'Os dados estão em modo de leitura. Não é possível salvar alterações.',
                life: 3000
            });
            return;
        }

        // Verifica se há dependentes novos para adicionar
        if (candidato.dependentes && candidato.dependentes.length > 0) {
            const dependentesNovos = candidato.dependentes.filter(dep => !dep.id);
            
            if (dependentesNovos.length > 0) {
                setDependentesParaAdicionar(dependentesNovos);
                setAcaoSalvamento('salvar');
                setShowConfirmacaoDependentes(true);
                return;
            }
        }
        
        // Se não há dependentes novos, salva normalmente
        await executarSalvamento();
    };

    const handleSalvarEContinuar = async () => {
        // Se estiver em modo leitura, apenas avança para o próximo step
        if (modoLeitura) {
            stepperRef.current.nextCallback();
            setActiveIndex(prev => prev + 1);
            return;
        }

        // Verifica se há dependentes novos para adicionar
        if (candidato.dependentes && candidato.dependentes.length > 0) {
            const dependentesNovos = candidato.dependentes.filter(dep => !dep.id);
            
            if (dependentesNovos.length > 0) {
                setDependentesParaAdicionar(dependentesNovos);
                setAcaoSalvamento('salvar_continuar');
                setShowConfirmacaoDependentes(true);
                return;
            }
        }
        
        // Se não há dependentes novos, salva e continua normalmente
        await executarSalvamento();
        stepperRef.current.nextCallback();
        setActiveIndex(prev => prev + 1);
    };

    // Função para calcular o índice do step de dependentes
    const getStepDependentesIndex = () => {
        let index = 4; // Base: Documentos, Dados Pessoais, Dados Bancários, Educação
        
        if (!self) {
            index += 1; // Dados Cadastrais
        }
        
        if (mostrarHabilidades) {
            index += 1; // Habilidades
        }
        
        if (mostrarExperiencia) {
            index += 1; // Experiência Profissional
        }
        
        return index; // Dependentes
    };

    // Função que executa o salvamento real
    const executarSalvamento = async () => {
        if (!admissao?.id) return;
        
        if (modoLeitura) {
            toast.current.show({
                severity: 'warn',
                summary: 'Modo de leitura',
                detail: 'Os dados estão em modo de leitura. Não é possível salvar alterações.',
                life: 3000
            });
            return;
        }

        // Verifica se está no step de dependentes
        const stepDependentesIndex = getStepDependentesIndex();
        const isStepDependentes = activeIndex === stepDependentesIndex;
        
        // Se está no step de dependentes e não há dependentes novos, não faz PUT de admissão
        if (isStepDependentes) {
            const dependentesNovos = candidato.dependentes?.filter(dep => !dep.id) || [];
            if (dependentesNovos.length === 0) {
                console.log('Step de dependentes: nenhum dependente novo para salvar');
                return;
            }
        }
        
        // Normaliza os dados para comparação (remove propriedades que podem ser undefined/null)
        const normalizarObjeto = (obj) => {
            if (!obj || typeof obj !== 'object') return obj;
            
            const normalizado = {};
            Object.keys(obj).forEach(key => {
                const valor = obj[key];
                if (valor !== undefined && valor !== null && valor !== '') {
                    if (typeof valor === 'object' && !Array.isArray(valor)) {
                        normalizado[key] = normalizarObjeto(valor);
                    } else {
                        normalizado[key] = valor;
                    }
                }
            });
            return normalizado;
        };
        
        const candidatoNormalizado = normalizarObjeto(candidato);
        const initialNormalizado = normalizarObjeto(initialCandidato);
        
        // Compara o estado atual com o inicial
        if (JSON.stringify(candidatoNormalizado) === JSON.stringify(initialNormalizado)) {
            toast.current.show({
                severity: 'info',
                summary: 'Informação',
                detail: 'Nenhuma alteração para salvar.',
                life: 3000
            });
            console.log('Nenhuma alteração detectada, salvamento pulado.');
            return;
        }

        try {
            // Monta o payload seguindo o padrão correto
            const dadosCandidato = candidato || {};
            const dadosVaga = candidato.dados_vaga || {};
            
            // Função para formatar salário corretamente
            const formatarSalario = (valor) => {
                console.log('formatarSalario - valor recebido:', valor, 'tipo:', typeof valor);
                
                if (!valor) return '';
                
                // Se já é um número, retorna formatado
                if (typeof valor === 'number') {
                    console.log('formatarSalario - é número, retornando:', valor.toFixed(2));
                    return valor.toFixed(2);
                }
                
                // Se é string, remove formatação e converte
                let valorLimpo = valor.toString();
                console.log('formatarSalario - valor como string:', valorLimpo);
                
                // Remove R$, espaços e outros caracteres não numéricos
                valorLimpo = valorLimpo.replace(/[R$\s]/g, '');
                console.log('formatarSalario - após remover R$ e espaços:', valorLimpo);
                
                // Se tem vírgula (formato brasileiro: 15.000,00)
                if (valorLimpo.includes(',')) {
                    // Remove pontos de milhar e troca vírgula por ponto
                    valorLimpo = valorLimpo.replace(/\./g, '').replace(',', '.');
                    console.log('formatarSalario - após tratar vírgula:', valorLimpo);
                }
                
                // Converte para número
                const numero = parseFloat(valorLimpo);
                console.log('formatarSalario - número convertido:', numero);
                
                if (isNaN(numero)) return '';
                
                const resultado = numero.toFixed(2);
                console.log('formatarSalario - resultado final:', resultado);
                return resultado;
            };
            
            // Função para remover campos null, undefined ou string vazia
            const removerCamposVazios = (obj) => {
                if (Array.isArray(obj)) {
                    return obj.map(item => removerCamposVazios(item));
                }
                
                if (obj !== null && typeof obj === 'object') {
                    const objLimpo = {};
                    Object.keys(obj).forEach(key => {
                        const valor = obj[key];
                        if (valor !== null && valor !== undefined && valor !== '') {
                            objLimpo[key] = removerCamposVazios(valor);
                        }
                    });
                    return objLimpo;
                }
                
                return obj;
            };

            const payloadCompleto = {
                // Dados básicos da admissão
                chapa: candidato.chapa,
                dt_admissao: candidato.dt_admissao,
                salario: (() => {
                    const salarioCandidato = dadosCandidato?.salario;
                    const salarioVaga = dadosVaga?.salario;
                    const salarioPrincipal = candidato.salario;
                    
                    const salarioParaFormatar = salarioCandidato ? salarioCandidato : (salarioVaga ? salarioVaga : salarioPrincipal);
                    console.log('Salário selecionado para formatar:', salarioParaFormatar);
                    
                    return formatarSalario(salarioParaFormatar);
                })(),
                status: candidato.status,
                grau_instrucao: candidato.grau_instrucao,
                
                // Endereço
                cep: candidato.cep,
                rua: candidato.rua,
                numero: candidato.numero,
                complemento: candidato.complemento,
                bairro: candidato.bairro,
                cidade: candidato.cidade,
                estado: candidato.estado,
                pais: candidato.pais,
                // Dados do candidato
                // candidato: {
                    nome: dadosCandidato.nome,
                    email: dadosCandidato.email,
                    telefone: dadosCandidato.telefone,
                    cpf: dadosCandidato.cpf ? dadosCandidato.cpf.replace(/\D/g, '').substring(0, 11) : '',
                    dt_nascimento: dadosCandidato.dt_nascimento,
                    salario: (() => {
                        const salarioCandidato = dadosCandidato?.salario;
                        const salarioVaga = dadosVaga?.salario;
                        const salarioPrincipal = candidato.salario;
                        
                        const salarioParaFormatar = salarioCandidato ? salarioCandidato : (salarioVaga ? salarioVaga : salarioPrincipal);
                        console.log('Salário candidato selecionado para formatar:', salarioParaFormatar);
                        
                        return formatarSalario(salarioParaFormatar);
                    })(),
                // },
                
                // Dados pessoais
                nome_mae: candidato.nome_mae,
                sobrenome_mae: candidato.sobrenome_mae,
                nome_pai: candidato.nome_pai,
                sobrenome_pai: candidato.sobrenome_pai,
                naturalidade: candidato.naturalidade,
                estado_natal: candidato.estado_natal,
                nacionalidade: candidato.nacionalidade,
                cor_raca: candidato.cor_raca,
                deficiente_fisico: candidato.deficiente_fisico,
                naturalizado: candidato.naturalizado,
                data_naturalizacao: candidato.data_naturalizacao,
                pais_origem: candidato.pais_origem,
                tipo_visto: candidato.tipo_visto,
                data_venc_visto: candidato.data_venc_visto,
                nome_social: candidato.nome_social,
                genero: candidato.genero,
                estado_civil: candidato.estado_civil,
                
                // Documentos
                identidade: candidato.identidade,
                uf_identidade: candidato.uf_identidade,
                orgao_emissor_ident: candidato.orgao_emissor_ident,
                data_emissao_ident: candidato.data_emissao_ident,
                titulo_eleitor: candidato.titulo_eleitor,
                zona_titulo_eleitor: candidato.zona_titulo_eleitor,
                secao_titulo_eleitor: candidato.secao_titulo_eleitor,
                data_titulo_eleitor: candidato.data_titulo_eleitor,
                estado_emissor_tit_eleitor: candidato.estado_emissor_tit_eleitor,
                carteira_trabalho: candidato.carteira_trabalho,
                serie_carteira_trab: candidato.serie_carteira_trab,
                uf_carteira_trab: candidato.uf_carteira_trab,
                data_emissao_ctps: candidato.data_emissao_ctps,
                data_venc_ctps: candidato.data_venc_ctps,
                nit: candidato.nit,
                carteira_motorista: candidato.carteira_motorista,
                tipo_carteira_habilit: candidato.tipo_carteira_habilit,
                data_venc_habilit: candidato.data_venc_habilit,
                data_emissao_cnh: candidato.data_emissao_cnh,
                certificado_reservista: candidato.certificado_reservista,
                numero_passaporte: candidato.numero_passaporte,
                data_emissao_passaporte: candidato.data_emissao_passaporte,
                data_validade_passaporte: candidato.data_validade_passaporte,
                registro_profissional: candidato.registro_profissional,
                uf_registro_profissional: candidato.uf_registro_profissional,
                data_emissao_registro_profissional: candidato.data_emissao_registro_profissional,
                tipo_sanguineo: candidato.tipo_sanguineo,
                circunscricao_militar: candidato.circunscricao_militar,
                orgao_expedicao: candidato.orgao_expedicao,
                regiao_militar: candidato.regiao_militar,
                situacao_militar: candidato.situacao_militar,
                
                // Contatos
                telefone1: candidato.telefone1,
                telefone2: candidato.telefone2,
                email_pessoal: candidato.email_pessoal,
                
                // Dados bancários
                banco: candidato.banco,
                agencia: candidato.agencia,
                agencia_nova: candidato.agencia_nova,
                conta_corrente: candidato.conta_corrente,
                tipo_conta: candidato.tipo_conta,
                operacao: candidato.operacao,
                pix: candidato.pix,
                pix_tipo: candidato.pix_tipo,
                
                // Dados da vaga (apenas se não for self)
                ...(self ? {} : {
                    centro_custo: dadosVaga?.centro_custo_id ? dadosVaga.centro_custo_id : candidato.centro_custo,
                    filial: dadosVaga?.filial_id ? dadosVaga.filial_id : candidato.filial,
                    departamento: dadosVaga?.departamento_id ? dadosVaga.departamento_id : candidato.departamento,
                    id_secao: dadosVaga?.secao_id ? dadosVaga.secao_id : candidato.id_secao,
                    id_funcao: dadosVaga?.funcao_id ? dadosVaga.funcao_id : candidato.id_funcao,
                    cargo: dadosVaga?.cargo_id ? dadosVaga.cargo_id : candidato.cargo,
                    horario: dadosVaga?.horario_id ? dadosVaga.horario_id : candidato.horario,
                    sindicato: dadosVaga?.sindicato_id ? dadosVaga.sindicato_id : candidato.sindicato,
                }),
                
                // Dados adicionais
                tipo_admissao: candidato.tipo_admissao,
                codigo_ficha_registro: candidato.codigo_ficha_registro,
                codigo_jornada: candidato.codigo_jornada,
                tipo_funcionario: candidato.tipo_funcionario,
                tipo_situacao: candidato.tipo_situacao,
                aceite_lgpd: candidato.aceite_lgpd,
                anotacoes: candidato.anotacoes || '',
            };

            // Remove campos vazios do payload antes de enviar
            const payload = removerCamposVazios(payloadCompleto);

            await http.put(`admissao/${admissao.id}/`, payload);
            
            // Salvar dependentes separadamente se houver dependentes
            if (candidato.dependentes && candidato.dependentes.length > 0) {
                try {
                    // Filtra apenas dependentes novos (que não existem na API)
                    const dependentesNovos = candidato.dependentes.filter(dep => {
                        // Se tem ID, já existe na API
                        if (dep.id) return false;
                        
                        // Se não tem CPF, é novo
                        if (!dep.cpf) return true;
                        
                        // Remove máscara do CPF para comparação
                        const cpfLimpo = dep.cpf.replace(/\D/g, '');
                        
                        // Verifica se já existe um dependente com este CPF na API (com ID)
                        const dependenteExistente = candidato.dependentes.find(d => 
                            d.id && d.cpf && d.cpf.replace(/\D/g, '') === cpfLimpo
                        );
                        
                        // Se não encontrou dependente existente com este CPF, é novo
                        return !dependenteExistente;
                    });
                    
                    // Remove dependentes duplicados baseado no CPF (sem ID)
                    const dependentesUnicos = dependentesNovos.filter((dep, index, arr) => {
                        if (!dep.cpf) return true;
                        
                        const cpfLimpo = dep.cpf.replace(/\D/g, '');
                        const primeiroIndex = arr.findIndex(d => 
                            d.cpf && d.cpf.replace(/\D/g, '') === cpfLimpo
                        );
                        
                        return index === primeiroIndex;
                    });
                    
                    if (dependentesUnicos.length > 0) {
                        // Mapeia os dependentes novos para o formato da API
                        const dependentesParaEnviar = dependentesUnicos.map((dep) => ({
                            nome_depend: dep.nome_depend || null,
                            nrodepend: dep.nrodepend || null,
                            cpf: dep.cpf ? dep.cpf.replace(/\D/g, '') : null,
                            dt_nascimento: dep.dt_nascimento || null,
                            cartorio: dep.cartorio || null,
                            nroregistro: dep.nroregistro || null,
                            nrolivro: dep.nrolivro || null,
                            nrofolha: dep.nrofolha || null,
                            cartao_vacina: dep.cartao_vacina || null,
                            nrosus: dep.nrosus || null,
                            nronascidovivo: dep.nronascidovivo || null,
                            nome_mae: dep.nome_mae || null,
                            id_admissao: candidato.id,
                            genero: dep.genero || null,
                            estadocivil: dep.estadocivil || null,
                            grau_parentesco: dep.grau_parentesco || null
                        }));

                        try {
                            const dependentesSalvos = await http.post(`admissao/${candidato.id}/adiciona_dependentes/`, dependentesParaEnviar);
                            console.log('Dependentes novos salvos com sucesso no endpoint específico');

                            // Atualiza o estado para refletir os dependentes salvos
                            if (dependentesSalvos && Array.isArray(dependentesSalvos)) {
                                setCandidato(prev => {
                                    const dependentesJaExistentes = prev.dependentes.filter(d => d.id);
                                    const listaAtualizada = [...dependentesJaExistentes, ...dependentesSalvos];
                                    return { ...prev, dependentes: listaAtualizada };
                                });
                            }
                        } catch (error) {
                            console.error('Erro ao salvar dependentes no endpoint específico:', error);
                            toast.current.show({
                                severity: 'error',
                                summary: 'Erro ao Salvar Dependentes',
                                detail: 'Não foi possível salvar os dependentes. Verifique os dados e tente novamente.',
                                life: 4000
                            });
                            throw error; // Re-lança o erro para interromper o fluxo de salvamento
                        }

                    } else {
                        console.log('Nenhum dependente novo para salvar');
                    }
                } catch (error) {
                    console.error('Erro ao salvar dependentes no endpoint específico:', error);
                    // Não interrompe o fluxo principal se falhar ao salvar dependentes
                }
            }
            
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Dados salvos com sucesso!',
                life: 3000
            });
            
            // Atualiza o snapshot inicial com os novos dados salvos
            setTimeout(() => {
                const candidatoAtualizado = JSON.parse(JSON.stringify(candidato));
                setInitialCandidato(candidatoAtualizado);
            }, 100);

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
            // Verificar se o usuário tem permissão para concluir esta tarefa
            if (!verificarPermissaoTarefa(tipoCodigo)) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Permissão negada',
                    detail: 'Você não tem permissão para concluir esta tarefa.',
                    life: 3000
                });
                return;
            }

            const tarefa = candidato?.tarefas?.find(t => t.tipo_codigo === tipoCodigo);
            if (!tarefa) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Tarefa não encontrada',
                    life: 3000
                });
                return;
            }

            await http.post(`tarefas/${tarefa.id}/concluir/`);
            
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Tarefa concluída com sucesso!',
                life: 3000
            });

            // Atualiza o estado local da tarefa
            const novasTarefas = candidato.tarefas.map(t => {
                if (t.id === tarefa.id) {
                    return {
                        ...t,
                        status: 'concluida',
                        status_display: 'Concluída',
                        concluido_em: new Date().toISOString()
                    };
                }
                return t;
            });

            setCandidato(prev => ({
                ...prev,
                tarefas: novasTarefas
            }));

        } catch (error) {
            console.error('Erro ao concluir tarefa:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao concluir a tarefa',
                life: 3000
            });
        }
    };

    const validarDocumentos = () => {
        const documentosObrigatoriosPendentes = candidato.documentos
            .filter(doc => doc.obrigatorio && !doc.upload_feito)
            .map(doc => doc.nome);

        if (documentosObrigatoriosPendentes.length > 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Documentos obrigatórios pendentes',
                detail: `Os seguintes documentos obrigatórios não foram enviados: ${documentosObrigatoriosPendentes.join(', ')}`,
                life: 5000
            });
            return false;
        }

        const documentosNaoObrigatoriosPendentes = candidato.documentos
            .filter(doc => !doc.obrigatorio && !doc.upload_feito)
            .map(doc => doc.nome);

        if (documentosNaoObrigatoriosPendentes.length > 0) {
            return new Promise((resolve) => {
                confirmDialog({
                    message: `Os seguintes documentos não obrigatórios estão pendentes: ${documentosNaoObrigatoriosPendentes.join(', ')}. Deseja continuar mesmo assim?`,
                    header: 'Confirmação',
                    icon: 'pi pi-exclamation-triangle',
                    acceptLabel: 'Sim, continuar',
                    rejectLabel: 'Não, voltar',
                    accept: () => resolve(true),
                    reject: () => resolve(false)
                });
            });
        }

        return true;
    };

    // Função para validar campos obrigatórios dos dados pessoais
    const validarCamposObrigatorios = () => {
        const dadosCandidato = candidato || {};
        const dadosVaga = candidato.dados_vaga || {};
        const camposObrigatorios = [];
        
        // Validação de dados pessoais obrigatórios
        if (!dadosCandidato.nome?.trim()) {
            camposObrigatorios.push('Nome completo');
        }
        if (!dadosCandidato.cpf?.trim()) {
            camposObrigatorios.push('CPF');
        }
        if (!dadosCandidato.email?.trim()) {
            camposObrigatorios.push('E-mail');
        }
        if (!dadosCandidato.telefone?.trim()) {
            camposObrigatorios.push('Telefone');
        }
        if (!dadosCandidato.dt_nascimento) {
            camposObrigatorios.push('Data de nascimento');
        }
        
        // Validação de dados bancários obrigatórios
        if (!candidato.banco?.trim()) {
            camposObrigatorios.push('Banco');
        }
        if (!candidato.agencia?.trim()) {
            camposObrigatorios.push('Agência');
        }
        if (!candidato.conta_corrente?.trim()) {
            camposObrigatorios.push('Conta corrente');
        }
        
        // Validação de dados cadastrais obrigatórios (apenas se não for self)
        if (!self) {
            // Só valida campos se houver dados disponíveis nos dropdowns
            if (filiais && filiais.length > 0 && !dadosVaga.filial_id) {
                camposObrigatorios.push('Filial');
            }
            if (departamentos && departamentos.length > 0 && !dadosVaga.departamento_id) {
                camposObrigatorios.push('Departamento');
            }
            if (cargos && cargos.length > 0 && !dadosVaga.cargo_id) {
                camposObrigatorios.push('Cargo');
            }
            if (centros_custo && centros_custo.length > 0 && !dadosVaga.centro_custo_id) {
                camposObrigatorios.push('Centro de custo');
            }
            if (!dadosVaga.salario?.trim()) {
                camposObrigatorios.push('Salário');
            }
        }
        
        if (camposObrigatorios.length > 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Campos obrigatórios não preenchidos',
                detail: `Os seguintes campos são obrigatórios: ${camposObrigatorios.join(', ')}`,
                life: 5000
            });
            return false;
        }
        
        return true;
    };

    const handleFinalizarDocumentos = async () => {
        // Validação de documentos
        const validacaoDocumentos = await validarDocumentos();
        if (!validacaoDocumentos) return;

        // Validação de campos obrigatórios
        const validacaoCampos = validarCamposObrigatorios();
        if (!validacaoCampos) return;

        // Se for visão candidato (self = true), finaliza diretamente
        if (self) {
            await handleSalvarAdmissao();
            await concluirTarefa('aguardar_documento');
            return;
        }

        // Obter a tarefa pendente que o usuário pode concluir
        const tarefaPendente = obterTarefaPendente();
        
        if (!tarefaPendente) {
            toast.current.show({
                severity: 'error',
                summary: 'Nenhuma tarefa disponível',
                detail: 'Não há tarefas pendentes que você possa concluir.',
                life: 3000
            });
            return;
        }

        // Se for visão empresa (self = false), mostra modal de confirmação
        setShowModalConfirmacao(true);
    };

    const handleConfirmarFinalizacao = async () => {
        try {
            setShowModalConfirmacao(false);
            await handleSalvarAdmissao();
            
            // Obter a tarefa pendente que o usuário pode concluir
            const tarefaPendente = obterTarefaPendente();
            
            if (tarefaPendente) {
                await concluirTarefa(tarefaPendente.tipo_codigo);
            }
            
            // Mensagem baseada no tipo de tarefa concluída
            const perfil = ArmazenadorToken.UserProfile;
            const tarefaDocumentosConcluida = verificarTarefaConcluida('aguardar_documento');
            
            let mensagem = '';
            if (tarefaPendente?.tipo_codigo === 'aguardar_documento' && (perfil === 'analista_tenant' || perfil === null)) {
                mensagem = 'Documentos aprovados e encaminhados para aprovação da admissão!';
            } else if (tarefaPendente?.tipo_codigo === 'aprovar_admissao') {
                mensagem = 'Admissão aprovada e integração iniciada com sucesso!';
            } else {
                mensagem = 'Processo finalizado com sucesso!';
            }
            
            toast.current.show({
                severity: 'success',
                summary: 'Processo finalizado',
                detail: mensagem,
                life: 4000
            });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Erro na finalização',
                detail: 'Ocorreu um erro ao finalizar o processo.',
                life: 4000
            });
        }
    };

    const handleCancelarFinalizacao = () => {
        setShowModalConfirmacao(false);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowModalConfirmacao(false);
            setShowConfirmacaoDependentes(false);
        }
    };

    const handleAceitarLGPD = async () => {
        try {
            // Atualiza o estado local
            await setCandidato(prev => ({
                ...prev,
                aceite_lgpd: true
            }));

            // Faz o upload do aceite na admissão
            await http.put(`admissao/${admissao.id}/`, {
                ...candidato,
                aceite_lgpd: true
            });

            // Após confirmar que o aceite foi salvo, conclui a tarefa
            await concluirTarefa('aguardar_lgpd');
            
            // Atualiza o contexto com a tarefa concluída
            const tarefaLGPD = candidato.tarefas.find(t => t.tipo_codigo === 'aguardar_lgpd');
            if (tarefaLGPD) {
                const novasTarefas = candidato.tarefas.map(t => {
                    if (t.id === tarefaLGPD.id) {
                        return {
                            ...t,
                            status: 'concluida',
                            status_display: 'Concluída',
                            concluido_em: new Date().toISOString()
                        };
                    }
                    return t;
                });

                setCandidato(prev => ({
                    ...prev,
                    tarefas: novasTarefas
                }));
            }

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Termo LGPD aceito com sucesso!',
                life: 3000
            });
        } catch (error) {
            // Em caso de erro, reverte o estado local
            setCandidato(prev => ({
                ...prev,
                aceite_lgpd: false
            }));

            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao salvar o aceite da LGPD.',
                life: 3000
            });
        }
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
        
        // Calcular o último step dinamicamente baseado nas variáveis de ambiente
        let totalSteps = 4; // Documentos, Dados Pessoais, Dados Bancários, Educação
        
        if (!self) {
            totalSteps += 1; // Dados Cadastrais
        }
        
        if (mostrarHabilidades) {
            totalSteps += 1; // Habilidades
        }
        
        if (mostrarExperiencia) {
            totalSteps += 1; // Experiência Profissional
        }
        
        // Adicionar step de dependentes
        totalSteps += 1; // Dependentes
        
        if (self) {
            totalSteps += 1; // LGPD
        }
        
        // Adicionar step de anotações como último
        totalSteps += 1; // Anotações
        
        const isLastStep = activeIndex === totalSteps - 1;
        
        // Verificar se há tarefa pendente que o usuário pode concluir
        const tarefaPendente = obterTarefaPendente();
        const podeFinalizar = !self && tarefaPendente && !modoLeitura;
        
        return (
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: '248px', // Ajustado para não sobrepor a sidebar (assumindo largura padrão de sidebar)
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
                    
                    {/* Steps intermediários com salvar */}
                    {(activeIndex >= 1 && activeIndex < totalSteps - 1) && (
                        <>
                            <Botao 
                                size="small" 
                                iconPos="right" 
                                aoClicar={handleSalvarAdmissao}
                                disabled={modoLeitura}
                            >
                                <FaSave fill="white"/> Salvar
                            </Botao>
                            <Botao 
                                size="small" 
                                label="Next" 
                                iconPos="right" 
                                aoClicar={handleSalvarEContinuar}
                            >
                                <HiArrowRight fill="white"/> Próximo
                            </Botao>
                        </>
                    )}
                    
                    {/* Último step (Anotações) */}
                    {isLastStep && (
                        <>
                            <Botao 
                                size="small" 
                                iconPos="right" 
                                aoClicar={handleSalvarAdmissao}
                                disabled={modoLeitura}
                            >
                                <FaSave fill="white"/> Salvar
                            </Botao>
                            {self ? (
                                <Botao 
                                    iconPos="right" 
                                    aoClicar={handleAceitarLGPD}
                                    disabled={candidato.aceite_lgpd || modoLeitura}
                                >
                                    <FaSave fill="white"/> {candidato.aceite_lgpd ? 'Termo Aceito' : 'Aceitar e Finalizar'}
                                </Botao>
                            ) : (
                                <Botao 
                                    size="small" 
                                    label="Next" 
                                    iconPos="right" 
                                    aoClicar={handleFinalizarDocumentos}
                                    disabled={!podeFinalizar}
                                >
                                    <RiExchangeFill fill="white"/> Finalizar
                                </Botao>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };

    // Detectar cliques nos headers do stepper - DESABILITADO TEMPORARIAMENTE
    // useEffect(() => {
    //     const stepperElement = stepperRef.current?.getElement?.();
    //     if (!stepperElement) return;

    //     const handleStepHeaderClick = (event) => {
    //         const stepHeader = event.target.closest('.p-stepper-header');
    //         if (stepHeader) {
    //             const stepIndex = Array.from(stepHeader.parentElement.children).indexOf(stepHeader);
    //             setActiveIndex(stepIndex);
    //         }
    //     };

    //     stepperElement.addEventListener('click', handleStepHeaderClick);
        
    //     // Fallback: usar MutationObserver para detectar mudanças no stepper
    //     const observer = new MutationObserver((mutations) => {
    //         mutations.forEach((mutation) => {
    //             if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
    //                 const activeHeader = stepperElement.querySelector('.p-stepper-header.p-highlight');
    //                 if (activeHeader) {
    //                     const stepIndex = Array.from(activeHeader.parentElement.children).indexOf(activeHeader);
    //                     setActiveIndex(stepIndex);
    //                 }
    //             }
    //         });
    //     });

    //     // Observar mudanças nos headers
    //     const headers = stepperElement.querySelectorAll('.p-stepper-header');
    //     headers.forEach(header => {
    //         observer.observe(header, { attributes: true, attributeFilter: ['class'] });
    //     });
        
    //     return () => {
    //         stepperElement.removeEventListener('click', handleStepHeaderClick);
    //         observer.disconnect();
    //     };
    // }, []);

    const formatarCPF = (cpf) => {
        if (!cpf) return 'CPF não informado';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const handleConfirmarDependentes = async () => {
        try {
            setShowConfirmacaoDependentes(false);
            await executarSalvamento(); // Se ocorrer um erro aqui, o catch abaixo será acionado
            if (acaoSalvamento === 'salvar_continuar') {
                stepperRef.current.nextCallback();
                setActiveIndex(prev => prev + 1);
            }
        } catch (error) {
            console.log("O salvamento foi interrompido devido a um erro ao adicionar dependentes.");
            // O toast de erro já foi exibido na função executarSalvamento
        }
    };

    const handleCancelarDependentes = () => {
        setShowConfirmacaoDependentes(false);
    };

    const compressImage = async (file) => {
        try {
            const options = {
                maxSizeMB: 2, // Máximo 2MB
                maxWidthOrHeight: 1920, // Dimensão máxima de 1920px
                useWebWorker: true, // Usar web worker para melhor performance
                fileType: file.name.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
                quality: 0.8 // Qualidade de 80%
            };
            
            console.log('Compactando imagem...', {
                originalSize: (file.size / 1024 / 1024).toFixed(2) + 'MB',
                originalName: file.name
            });
            
            const compressedFile = await imageCompression(file, options);
            
            // Garantir que o nome do arquivo seja preservado
            const finalFile = new File([compressedFile], file.name, {
                type: compressedFile.type,
                lastModified: Date.now(),
            });
            
            console.log('Imagem compactada:', {
                originalSize: (file.size / 1024 / 1024).toFixed(2) + 'MB',
                compressedSize: (finalFile.size / 1024 / 1024).toFixed(2) + 'MB',
                reduction: ((1 - finalFile.size / file.size) * 100).toFixed(1) + '%',
                fileName: finalFile.name,
                fileType: finalFile.type
            });
            
            return finalFile;
        } catch (error) {
            console.error('Erro ao compactar imagem:', error);
            // Se falhar a compactação, retorna o arquivo original
            return file;
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            setUploading(true);
            
            try {
                // Compactar a imagem antes do upload
                const compressedFile = await compressImage(file);
                
                console.log('Arquivo para upload:', {
                    name: compressedFile.name,
                    type: compressedFile.type,
                    size: compressedFile.size,
                    hasExtension: compressedFile.name.includes('.')
                });
                
                const formData = new FormData();
                formData.append('imagem', compressedFile);
                
                // Verificar se o FormData está correto
                console.log('FormData entries:');
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}:`, value instanceof File ? {
                        name: value.name,
                        type: value.type,
                        size: value.size
                    } : value);
                }
                
                const response = await http.put(`admissao/${id}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                
                setCandidato(prev => ({ ...prev, imagem: response.imagem }));
                
                // Mostrar toast com informações de compactação
                const originalSize = (file.size / 1024 / 1024).toFixed(2);
                const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
                const reduction = ((1 - compressedFile.size / file.size) * 100).toFixed(1);
                
                const detail = originalSize !== compressedSize 
                    ? `Imagem atualizada! Reduzida de ${originalSize}MB para ${compressedSize}MB (${reduction}% menor)`
                    : 'Imagem do candidato atualizada com sucesso!';
                
                toast.current.show({ 
                    severity: 'success', 
                    summary: 'Sucesso', 
                    detail: detail, 
                    life: 4000 
                });
            } catch (erro) {
                console.error("Erro ao fazer upload da imagem:", erro);
                const errorMessage = erro.response?.data?.detail || 'Falha ao fazer upload da imagem.';
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Erro', 
                    detail: errorMessage, 
                    life: 3000 
                });
            } finally {
                setUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        } else {
            toast.current.show({ 
                severity: 'warn', 
                summary: 'Atenção', 
                detail: 'Por favor, selecione um arquivo de imagem válido.', 
                life: 3000 
            });
        }
    };

    const handleRemoveImage = () => {
        const formData = new FormData();
        formData.append('imagem', ''); // Envia string vazia para remover
        
        http.put(`admissao/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(() => {
            setCandidato(prev => ({ ...prev, imagem: null }));
            setShowImageModal(false);
            toast.current.show({ 
                severity: 'success', 
                summary: 'Sucesso', 
                detail: 'Imagem removida com sucesso!', 
                life: 3000 
            });
        })
        .catch(erro => {
            console.error("Erro ao remover imagem:", erro);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Falha ao remover a imagem.', 
                life: 3000 
            });
        });
    };

    return (
        <ConteudoFrame>
            <Toast ref={toast} style={{ zIndex: 9999 }} />
            <ConfirmDialog />
            
            {/* Estilo para desabilitar navegação pelo header do stepper */}
            <style>
                {`
                    .p-stepper-header {
                        pointer-events: none !important;
                        cursor: default !important;
                    }
                    .p-stepper-header * {
                        pointer-events: none !important;
                    }
                    .p-stepper-header:hover {
                        background-color: inherit !important;
                    }
                    
                    /* Estilos para modo leitura */
                    .modo-leitura input,
                    .modo-leitura select,
                    .modo-leitura textarea {
                        background-color: #f5f5f5 !important;
                        color: #666 !important;
                        cursor: not-allowed !important;
                        opacity: 0.7 !important;
                    }
                    
                    .modo-leitura input:disabled,
                    .modo-leitura select:disabled,
                    .modo-leitura textarea:disabled {
                        background-color: #f5f5f5 !important;
                        color: #666 !important;
                        cursor: not-allowed !important;
                        opacity: 0.7 !important;
                    }
                    
                    .modo-leitura .p-dropdown {
                        background-color: #f5f5f5 !important;
                        opacity: 0.7 !important;
                        pointer-events: none !important;
                    }
                    
                    .modo-leitura .p-dropdown-label {
                        color: #666 !important;
                    }
                    
                    .modo-leitura .p-calendar {
                        opacity: 0.7 !important;
                        pointer-events: none !important;
                    }
                    
                    .modo-leitura .p-calendar input {
                        background-color: #f5f5f5 !important;
                        color: #666 !important;
                        cursor: not-allowed !important;
                    }
                    
                    .modo-leitura .p-checkbox {
                        opacity: 0.7 !important;
                        pointer-events: none !important;
                    }
                    
                    .modo-leitura .p-switch {
                        opacity: 0.7 !important;
                        pointer-events: none !important;
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            
            {/* Botão Voltar */}
            {candidato?.nome && (
                <BotaoVoltar />
            )}
            
            {/* Header com informações do candidato */}
            {candidato && (
                <div style={{
                    background: 'linear-gradient(to bottom, var(--black), var(--gradient-secundaria))',
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
                            {candidato.imagem ? (
                                <img 
                                    src={candidato.imagem}
                                    alt={`Foto de ${candidato.nome}`}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        cursor: 'pointer',
                                        border: '2px solid rgba(255, 255, 255, 0.3)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => setShowImageModal(true)}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'scale(1.1)';
                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : (
                                // Se não tem imagem e usuário tem permissão, mostra área de upload
                                ArmazenadorToken.hasPermission('change_admissao') && !modoLeitura ? (
                                    <>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            id="candidato-image-upload"
                                        />
                                        <UploadDropzone htmlFor="candidato-image-upload">
                                            {uploading ? (
                                                <div style={{
                                                    border: '2px solid white',
                                                    borderTop: '2px solid transparent',
                                                    borderRadius: '50%',
                                                    width: '20px',
                                                    height: '20px',
                                                    animation: 'spin 1s linear infinite'
                                                }}></div>
                                            ) : (
                                                <UploadIcon>
                                                    <RiUpload2Fill fill="white"/>
                                                </UploadIcon>
                                            )}
                                        </UploadDropzone>
                                    </>
                                ) : (
                                    // Se não tem permissão ou está em modo leitura, mostra apenas o avatar com inicial
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
                                )
                            )}
                            {/* Fallback para quando a imagem falha ao carregar */}
                            <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.2)',
                                display: 'none',
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
                            {/* Indicador de modo leitura */}
                            {modoLeitura && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    background: 'rgba(255, 193, 7, 0.2)',
                                    border: '1px solid rgba(255, 193, 7, 0.4)',
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
                                        📖 Modo Leitura
                                    </span>
                                </div>
                            )}
                            
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
                                    {candidato?.dados_vaga?.titulo || 'Vaga não informada'}
                                </span>
                            </div>
                            
                            {/* Botão Visão do Candidato/Empresa movido para o header */}
                            {!self ? 
                                (import.meta.env.MODE === 'development' && (
                                    <button
                                        onClick={() => navegar(`/admissao/registro/${id}/true`)}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            borderRadius: 6,
                                            padding: '6px 12px',
                                            color: '#fff',
                                            fontSize: 12,
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 4,
                                            transition: 'all 0.2s ease',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                        }}
                                    >
                                        <HiEye fill="white" size={14}/> Visão do Candidato
                                    </button>
                                ))
                                :
                                (import.meta.env.MODE === 'development' && (
                                    <button
                                        onClick={() => navegar(`/admissao/registro/${id}`)}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            borderRadius: 6,
                                            padding: '6px 12px',
                                            color: '#fff',
                                            fontSize: 12,
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 4,
                                            transition: 'all 0.2s ease',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                        }}
                                    >
                                        <HiEye fill="white" size={14}/> Visão da Empresa
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )}

            <div style={{ paddingBottom: '80px' }} className={modoLeitura ? 'modo-leitura' : ''}> {/* Espaço para o footer fixo */}
                <Stepper 
                    headerPosition="top" 
                    ref={stepperRef} 
                    className="custom-stepper"
                >
                    <StepperPanel header="Documentos Pessoais">
                        <Container padding={'0'} gap="10px">
                            <div className={styles.containerDadosPessoais} style={{ position: 'relative' }}>
                                <ScrollPanel className="responsive-scroll-panel">
                                    <StepDocumentos toast={toast} modoLeitura={modoLeitura} />
                                </ScrollPanel>
                            </div>
                        </Container>
                    </StepperPanel>
                    
                    <StepperPanel header="Dados Pessoais">
                        <Container padding={'0'} gap="10px">
                            <div className={styles.containerDadosPessoais} style={{ position: 'relative' }}>
                                <ScrollPanel className="responsive-scroll-panel" style={{ marginBottom: 10 }}>
                                    <StepDadosPessoais classError={classError} estados={estados} modoLeitura={modoLeitura} />
                                </ScrollPanel>
                            </div>
                        </Container>
                    </StepperPanel>
                    
                    <StepperPanel header="Dados Bancários">
                        <Container padding={'0'} gap="10px">
                            <div className={styles.containerDadosPessoais} style={{ position: 'relative' }}>
                                <ScrollPanel className="responsive-scroll-panel" style={{ marginBottom: 10 }}>
                                    <StepDadosBancarios modoLeitura={modoLeitura} />
                                </ScrollPanel>
                            </div>
                        </Container>
                    </StepperPanel>
                    
                    {!self && (
                        <StepperPanel header="Dados Cadastrais">
                            <Container padding={'0'}>
                                <div className={styles.containerDadosPessoais} style={{ position: 'relative' }}>
                                    <ScrollPanel className="responsive-scroll-panel" style={{ marginBottom: 10 }}>
                                        <StepVaga 
                                            filiais={filiais}
                                            departamentos={departamentos}
                                            secoes={secoes}
                                            cargos={cargos}
                                            centros_custo={centros_custo}
                                            horarios={horarios}
                                            funcoes={funcoes}
                                            sindicatos={sindicatos}
                                            modoLeitura={modoLeitura}
                                        />
                                    </ScrollPanel>
                                </div>
                            </Container>
                        </StepperPanel>
                    )}
                    
                    <StepperPanel header="Educação">
                        <ScrollPanel className="responsive-scroll-panel">
                            <div style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                                <ScrollPanel className="responsive-inner-scroll">
                                    <StepEducacao modoLeitura={modoLeitura} />
                                </ScrollPanel>
                            </div>
                        </ScrollPanel>
                    </StepperPanel>
                    
                    {mostrarHabilidades && (
                        <StepperPanel header="Habilidades">
                            <ScrollPanel className="responsive-scroll-panel">
                                <div style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                                    <ScrollPanel className="responsive-inner-scroll">
                                        <StepHabilidades modoLeitura={modoLeitura} />
                                    </ScrollPanel>
                                </div>
                            </ScrollPanel>
                        </StepperPanel>
                    )}
                    
                    {mostrarExperiencia && (
                        <StepperPanel header="Experiência Profissional">
                            <ScrollPanel className="responsive-scroll-panel">
                                <div style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                                    <ScrollPanel className="responsive-inner-scroll">
                                        <StepExperiencia modoLeitura={modoLeitura} />
                                    </ScrollPanel>
                                </div>
                            </ScrollPanel>
                        </StepperPanel>
                    )}
                    
                    <StepperPanel header="Dependentes">
                        <ScrollPanel className="responsive-scroll-panel">
                            <div style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                                <ScrollPanel className="responsive-inner-scroll">
                                    <StepDependentes modoLeitura={modoLeitura} />
                                </ScrollPanel>
                            </div>
                        </ScrollPanel>
                    </StepperPanel>
                    
                    {self && (
                        <StepperPanel header="LGPD">
                            <ScrollPanel className="responsive-scroll-panel" style={{ textAlign: 'center' }}>
                                <StepLGPD modoLeitura={modoLeitura} />
                            </ScrollPanel>
                        </StepperPanel>
                    )}
                    
                    <StepperPanel header="Anotações">
                        <ScrollPanel className="responsive-scroll-panel">
                            <StepAnotacoes modoLeitura={modoLeitura} />
                        </ScrollPanel>
                    </StepperPanel>
                </Stepper>
            </div>

            {/* Footer fixo com botões */}
            {renderFooterButtons()}

            {/* Modal de confirmação */}
            {showModalConfirmacao && (
                <ModalOverlay onClick={handleOverlayClick}>
                    <ModalContainer>
                        <ModalHeader>
                            <ModalTitle>
                                <HiCheckCircle fill="white" /> Confirmação de Finalização
                            </ModalTitle>
                            <CloseButton onClick={handleCancelarFinalizacao}>
                                <HiX />
                            </CloseButton>
                        </ModalHeader>
                        <ModalContent>
                            <IconContainer>
                                <HiCheckCircle />
                            </IconContainer>
                            <ModalMessage>
                                {(() => {
                                    const tarefaPendente = obterTarefaPendente();
                                    const perfil = ArmazenadorToken.UserProfile;
                                    
                                    if (tarefaPendente?.tipo_codigo === 'aguardar_documento' && (perfil === 'analista_tenant' || perfil === null)) {
                                        return (
                                            <>
                                                Após esta confirmação, os <strong>documentos do candidato</strong> <strong>{candidato?.nome || 'Candidato'}</strong> serão aprovados e encaminhados para aprovação da admissão.
                                                <br /><br />
                                                Esta ação irá:
                                                <br />
                                                • Aprovar a tarefa de preenchimento de documentos
                                                <br />
                                                • Encaminhar para aprovação da admissão
                                                <br />
                                                • Aguardar aprovação de analista/supervisor/gestor
                                                <br /><br />
                                                Deseja continuar com a finalização?
                                            </>
                                        );
                                    } else if (tarefaPendente?.tipo_codigo === 'aprovar_admissao') {
                                        return (
                                            <>
                                                Após esta confirmação, será realizada a <strong>integração do colaborador</strong> <strong>{candidato?.nome || 'Candidato'}</strong> ao sistema.
                                                <br /><br />
                                                Esta ação irá:
                                                <br />
                                                • Aprovar a admissão do candidato
                                                <br />
                                                • Iniciar o processo de integração
                                                <br />
                                                • Incluir o colaborador no sistema
                                                <br /><br />
                                                Deseja continuar com a finalização?
                                            </>
                                        );
                                    } else {
                                        return (
                                            <>
                                                Após esta confirmação, será realizada a <strong>integração do colaborador</strong> <strong>{candidato?.nome || 'Candidato'}</strong> ao sistema.
                                                <br /><br />
                                                Esta ação irá:
                                                <br />
                                                • Aprovar a tarefa de preenchimento de documentos
                                                <br />
                                                • Iniciar o processo de integração
                                                <br />
                                                • Incluir o colaborador no sistema
                                                <br /><br />
                                                Deseja continuar com a finalização?
                                            </>
                                        );
                                    }
                                })()}
                            </ModalMessage>
                        </ModalContent>
                        <ModalFooter>
                            <ModalButton className="secondary" onClick={handleCancelarFinalizacao}>
                                <HiX /> Cancelar
                            </ModalButton>
                            <ModalButton className="primary" onClick={handleConfirmarFinalizacao}>
                                <HiCheckCircle fill="white" /> Sim, finalizar
                            </ModalButton>
                        </ModalFooter>
                    </ModalContainer>
                </ModalOverlay>
            )}

            {/* Modal de confirmação para salvar dependentes */}
            {showConfirmacaoDependentes && (
                <ModalOverlay onClick={handleOverlayClick}>
                    <ModalContainer>
                        <ModalHeader>
                            <ModalTitle>
                                <HiCheckCircle fill="white" /> Confirmação de Salvamento de Dependentes
                            </ModalTitle>
                            <CloseButton onClick={handleCancelarDependentes}>
                                <HiX />
                            </CloseButton>
                        </ModalHeader>
                        <ModalContent>
                            <IconContainer>
                                <HiCheckCircle />
                            </IconContainer>
                            <ModalMessage>
                                <div style={{ marginBottom: '16px' }}>
                                    {acaoSalvamento === 'salvar' ? (
                                        <>
                                            Você tem <strong>{dependentesParaAdicionar.length}</strong> dependente(s) pendente(s) de salvar.
                                            <br /><br />
                                            Deseja salvar estes dependentes agora?
                                        </>
                                    ) : (
                                        <>
                                            Você tem <strong>{dependentesParaAdicionar.length}</strong> dependente(s) pendente(s) de salvar.
                                            <br /><br />
                                            Deseja salvar estes dependentes agora e continuar para o próximo passo?
                                        </>
                                    )}
                                </div>
                                
                                <div style={{ 
                                    background: '#fef3c7', 
                                    border: '1px solid #fde68a', 
                                    borderRadius: '8px', 
                                    padding: '12px', 
                                    marginTop: '16px' 
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px', 
                                        marginBottom: '8px',
                                        color: '#d97706',
                                        fontWeight: '600'
                                    }}>
                                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '16px' }}></i>
                                        <span>Importante</span>
                                    </div>
                                    <p style={{ 
                                        margin: 0, 
                                        fontSize: '14px', 
                                        color: '#92400e', 
                                        lineHeight: '1.5' 
                                    }}>
                                        <strong>Dependentes já salvos não podem ser editados.</strong> Para fazer alterações, será necessário excluir o dependente e adicionar um novo.
                                    </p>
                                </div>
                                
                                {dependentesParaAdicionar.length > 0 && (
                                    <div style={{ 
                                        background: '#f8fafc', 
                                        border: '1px solid #e2e8f0', 
                                        borderRadius: '8px', 
                                        padding: '12px', 
                                        marginTop: '16px' 
                                    }}>
                                        <div style={{ 
                                            fontWeight: '600', 
                                            marginBottom: '8px',
                                            color: '#374151'
                                        }}>
                                            Dependentes que serão salvos:
                                        </div>
                                        <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                                            {dependentesParaAdicionar.map((dep, index) => (
                                                <div key={index} style={{ 
                                                    padding: '6px 0', 
                                                    borderBottom: index < dependentesParaAdicionar.length - 1 ? '1px solid #e5e7eb' : 'none',
                                                    fontSize: '14px',
                                                    color: '#6b7280'
                                                }}>
                                                    <strong>{dep.nome_depend || 'Sem nome'}</strong>
                                                    {dep.cpf && ` - CPF: ${dep.cpf}`}
                                                    {dep.dt_nascimento && ` - Nasc: ${dep.dt_nascimento}`}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </ModalMessage>
                        </ModalContent>
                        <ModalFooter>
                            <ModalButton className="secondary" onClick={handleCancelarDependentes}>
                                <HiX /> Cancelar
                            </ModalButton>
                            <ModalButton className="primary" onClick={handleConfirmarDependentes}>
                                <HiCheckCircle fill="white" /> Sim, salvar dependentes
                            </ModalButton>
                        </ModalFooter>
                    </ModalContainer>
                </ModalOverlay>
            )}

            {/* Modal de visualização da imagem */}
            {showImageModal && candidato.imagem && (
                <ImageModal onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setShowImageModal(false);
                    }
                }}>
                    <ImageModalContent>
                        <ImageModalImage 
                            src={candidato.imagem} 
                            alt={`Foto de ${candidato?.nome}`} 
                        />
                        <ImageModalControls>
                            {ArmazenadorToken.hasPermission('change_admissao') && !modoLeitura && (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                        id="candidato-image-change"
                                    />
                                    <ImageModalButton onClick={() => document.getElementById('candidato-image-change').click()}>
                                        <RiUpload2Fill /> Alterar Imagem
                                    </ImageModalButton>
                                    <ImageModalButton className="danger" onClick={handleRemoveImage}>
                                        <HiX fill="white" /> Remover Imagem
                                    </ImageModalButton>
                                </>
                            )}
                            <ImageModalButton onClick={() => setShowImageModal(false)}>
                                <HiX /> Fechar
                            </ImageModalButton>
                        </ImageModalControls>
                    </ImageModalContent>
                </ImageModal>
            )}
        </ConteudoFrame>
    );
};

export default function Wrapper() {
    return (
        <CandidatoProvider>
            <CandidatoRegistro />
        </CandidatoProvider>
    );
}
