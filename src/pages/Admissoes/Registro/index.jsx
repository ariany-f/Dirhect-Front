import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import Container from '@components/Container'; // Importando o componente Container
import Botao from '@components/Botao'; // Importando o componente Container
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import styled from "styled-components"
import http from '@http'
import axios from "axios"
import BotaoVoltar from "@components/BotaoVoltar"
import styles from './../Candidatos.module.css'
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { ScrollPanel } from 'primereact/scrollpanel';
import { HiArrowLeft, HiArrowRight, HiCheckCircle, HiX } from 'react-icons/hi';
import { FaTrash, FaSave, FaEye, FaUpload, FaExclamation } from 'react-icons/fa';
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
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FaExclamationTriangle } from 'react-icons/fa';
import ModalHistoricoTarefa from '@components/ModalHistoricoTarefa';

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

// CSS para animação de carregamento
const LoadingSpinner = styled.div`
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

// CSS customizado para ConfirmDialog
const StyledConfirmDialog = styled.div`
    .p-confirm-dialog-message {
        margin-left: 1rem !important;
    }
    
    .p-confirm-dialog-icon {
        margin-right: 0.5rem !important;
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
    
    &.danger {
        background: #fee2e2;
        color: #b91c1c;
        border: 1px solid #fecaca;
        
        svg {
            color: #b91c1c;
        }
        
        &:hover {
            background: #fecaca;
            color: #991b1b;
            
            svg {
                color: #991b1b;
            }
        }
    }
    
    &:disabled {
        opacity: 0.8;
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
    z-index: 7;

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
        margin-bottom: 10px;
    }


    /* Para telas muito pequenas */
    @media (min-resolution: 96dpi), (min-resolution: 1dppx) and (max-height: 600px) {
        .custom-stepper {
            height: 350px;
        }
        .responsive-scroll-panel {
            height: 250px;
            min-height: 200px;
        }
    }

    /* Para escala 100% com altura maior que 48vh */
    @media (min-resolution: 96dpi), (min-resolution: 1dppx) {
        .custom-stepper {
            height: 470px;
        }
        .responsive-scroll-panel {
            height: 45vh;
            min-height: 45vh;
        }
    }

    /* Para escala 100% com altura maior que 60vh */
    @media (min-resolution: 96dpi), (min-resolution: 1dppx) and (min-height: 70vh) {
        .custom-stepper {
            height: 600px;
        }
        .responsive-scroll-panel {
            height: 56vh;
            min-height: 56vh;
        }
    }

    
    /* Media query específica para detectar zoom/escala do Windows */
    @media (min-resolution: 120dpi), (min-resolution: 1.25dppx) {
        .custom-stepper {
            height: 450px; /* Altura menor para zoom 125% */
        }
        .responsive-scroll-panel {
            max-height: 42vh;
            min-height: 42vh;
        }
    }

    /* Para zoom ainda maior (150%+) */
    @media (min-resolution: 144dpi), (min-resolution: 1.5dppx) {
        .custom-stepper {
            height: 400px;
        }
        .responsive-scroll-panel {
            max-height: 30vh;
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
    const { candidato, setCandidato, admissao, setAdmissao, vaga, setVaga, setCampo } = useCandidatoContext()
    const { sidebarOpened } = useOutletContext() || { sidebarOpened: true }
    const [classError, setClassError] = useState([])
    const [classInvalid, setClassInvalid] = useState([])
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
    
    // Função para buscar seções por filial
    const buscarSecoesPorFilial = (filialId) => {
        if (!filialId) {
            setSecoes([]);
            return;
        }
        
        http.get(`secao/?format=json&filial=${filialId}`)
            .then(response => setSecoes(response))
            .catch(() => setSecoes([]));
    };
    const [horarios, setHorarios] = useState([]);
    const [funcoes, setFuncoes] = useState([]);
    const [funcoes_confianca, setFuncoesConfianca] = useState([]);
    const [sindicatos, setSindicatos] = useState([]);
    const [estados, setEstados] = useState([]);
    const [paises, setPaises] = useState([]);
    const [nacionalidades, setNacionalidades] = useState([]);
    const [opcoesDominio, setOpcoesDominio] = useState({});
    const [availableDominioTables, setAvailableDominioTables] = useState([]);
    const [dadosCarregados, setDadosCarregados] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [carregamentoEmAndamento, setCarregamentoEmAndamento] = useState(false);
    const toast = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showModalConfirmacao, setShowModalConfirmacao] = useState(false);
    const [initialCandidato, setInitialCandidato] = useState(null);
    const [modoLeitura, setModoLeitura] = useState(false);
    const [perfil, setPerfil] = useState(null);
    const [finalizada, setFinalizada] = useState(false);
    const [showConfirmacaoFinalizacao, setShowConfirmacaoFinalizacao] = useState(false);
    const [showConfirmacaoDependentes, setShowConfirmacaoDependentes] = useState(false);
    const [dependentesParaAdicionar, setDependentesParaAdicionar] = useState([]);
    const [acaoSalvamento, setAcaoSalvamento] = useState(null); // 'salvar' ou 'salvar_continuar'

    const [showImageModal, setShowImageModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showHistoricoTarefa, setShowHistoricoTarefa] = useState(false);
    const [selectedTarefaLogs, setSelectedTarefaLogs] = useState([]);
    const fileInputRef = useRef(null);
    const modalFileInputRef = useRef(null);

    const [activeStep, setActiveStep] = useState(0);
    const [steps, setSteps] = useState([]);

    const [showCropModal, setShowCropModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [crop, setCrop] = useState({
        unit: '%',
        width: 80,
        height: 80,
        x: 10,
        y: 10
    });
    const [imageSrc, setImageSrc] = useState('');
    const [imageRef, setImageRef] = useState(null);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [showCropSelection, setShowCropSelection] = useState(false);
    const [croppedImageSrc, setCroppedImageSrc] = useState('');
    const [isCropped, setIsCropped] = useState(false);
    const [hasCropChanged, setHasCropChanged] = useState(false);
    
    // Estado para rastrear campos que foram explicitamente selecionados pelo usuário
    const [camposSelecionados, setCamposSelecionados] = useState(new Set());

    // Normaliza os dados para comparação (remove propriedades que podem ser undefined/null)
    const normalizarObjeto = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;
        
        const normalizado = {};
        Object.keys(obj).forEach(key => {
            const valor = obj[key];
            if (valor !== undefined && valor !== null && valor !== '') {
                if (typeof valor === 'object' && !Array.isArray(valor)) {
                    // Se é um objeto com id (como grau_instrucao, tipo_situacao, etc.), converte para o id
                    if (valor.id !== undefined) {
                        normalizado[key] = valor.id;
                    } else if (valor.code !== undefined) {
                        normalizado[key] = valor.code;
                    } else {
                        normalizado[key] = normalizarObjeto(valor);
                    }
                } else {
                    normalizado[key] = valor;
                }
            }
        });
        return normalizado;
    };
    
    const isDirty = React.useMemo(() => {
        if (!initialCandidato || !candidato) return false;
        const candidatoNormalizado = normalizarObjeto(candidato);
        const initialNormalizado = normalizarObjeto(initialCandidato);
        return JSON.stringify(candidatoNormalizado) !== JSON.stringify(initialNormalizado);
    }, [candidato, initialCandidato]);

    // Função para formatar salário corretamente
    const formatarSalario = (valor) => {
        if (!valor) return '';
        
        // Se já é um número, retorna formatado
        if (typeof valor === 'number') {
            return valor.toFixed(2);
        }
        
        // Se é string, remove formatação e converte
        let valorLimpo = valor.toString();
        
        // Remove R$, espaços e outros caracteres não numéricos
        valorLimpo = valorLimpo.replace(/[R$\s]/g, '');
        
        // Se tem vírgula (formato brasileiro: 15.000,00)
        if (valorLimpo.includes(',')) {
            // Remove pontos de milhar e troca vírgula por ponto
            valorLimpo = valorLimpo.replace(/\./g, '').replace(',', '.');
        }
        
        // Converte para número
        const numero = parseFloat(valorLimpo);
        
        if (isNaN(numero)) return '';
        
        return numero.toFixed(2);
    };
    
    // Função para marcar um campo como selecionado pelo usuário
    const marcarCampoSelecionado = (campo) => {
        setCamposSelecionados(prev => {
            const novoSet = new Set([...prev, campo]);
            return novoSet;
        });
    };

    // Função para marcar um campo como inválido
    const marcarCampoInvalido = (campo) => {
        setClassInvalid(prev => {
            const novoArray = [...prev, campo];
            return novoArray;
        });
    };

    // Função para remover marcação de campo inválido
    const removerCampoInvalido = (campo) => {
        setClassInvalid(prev => {
            const novoArray = prev.filter(c => c !== campo);
            return novoArray;
        });
    };

    // Funções para verificar permissões baseadas no perfil
    const verificarPermissaoTarefa = (tipoTarefa) => {
        const perfil = ArmazenadorToken.UserProfile;
        
        switch (tipoTarefa) {
            case 'aguardar_documento':
                // Permite que qualquer perfil aprovado possa aprovar documentos
                return perfil === 'analista_tenant' || perfil === 'analista' || perfil === 'supervisor' || perfil === 'gestor' || perfil === '' || perfil === null;
            case 'aprovar_admissao':
                return ['analista', 'supervisor', 'gestor'].includes(perfil);
            case 'aguardar_lgpd':
                // Permite que qualquer perfil aprovado possa aceitar LGPD
                return perfil === 'analista_tenant' || perfil === 'analista' || perfil === 'supervisor' || perfil === 'gestor' || perfil === '' || perfil === null;
            case 'integrar_admissao_correcao':
                return perfil === 'analista' || perfil === 'supervisor' || perfil === 'gestor' || perfil === '' || perfil === null;
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

    const obterTodasTarefaPendente = () => {
        if (!candidato?.tarefas) return null;
        
        const tarefasPendentes = candidato.tarefas.filter(tarefa => {
            const statusValido = tarefa.status === 'pendente' || tarefa.status === 'em_andamento';
            
            return statusValido;
        });
        
        return tarefasPendentes.length > 0 ? tarefasPendentes[0] : null;
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

    // Função para verificar se há erros nas tarefas
    const verificarErrosTarefas = () => {
        if (!candidato?.log_tarefas || !ArmazenadorToken.hasPermission('view_tarefa')) {
            return null;
        }
        
        const erros = candidato.log_tarefas.filter(log => log.tipo === 'erro');
        return erros.length > 0 ? erros : null;
    };

    // Função para abrir modal de histórico de tarefa
    const abrirHistoricoTarefa = (tarefaId) => {
        if (!candidato?.log_tarefas) return;
        
        const logsTarefa = candidato.log_tarefas.filter(log => log.tarefa === tarefaId);
        setSelectedTarefaLogs(logsTarefa);
        setShowHistoricoTarefa(true);
    };

    // Verificar se deve estar em modo leitura
    useEffect(() => {
        const tarefaPendente = obterTarefaPendente();
        const todasTarefasPendentes = obterTodasTarefaPendente();

        if((!todasTarefasPendentes) || todasTarefasPendentes.length === 0){
            setFinalizada(true);
            setModoLeitura(true);
        } else {
            if(!tarefaPendente){
                setModoLeitura(true);
                setFinalizada(false);
            }
            else {
                setModoLeitura(false);
                setFinalizada(false);
            }
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

    // Memoizar as listas auxiliares para evitar recriação desnecessária
    const listasAuxiliares = useMemo(() => [
        { endpoint: 'filial/?format=json', setter: setFiliais },
        { endpoint: 'departamento/?format=json', setter: setDepartamentos },
        { endpoint: 'cargo/?format=json', setter: setCargos },
        { endpoint: 'centro_custo/?format=json', setter: setCentrosCusto },
        { endpoint: 'sindicato/?format=json', setter: setSindicatos },
        { endpoint: 'horario/?format=json', setter: setHorarios },
        { endpoint: 'funcao/?format=json', setter: setFuncoes },
        { endpoint: 'funcao/?format=json&confianca=true', setter: setFuncoesConfianca },
    ], []);

    // Função otimizada para carregar dados
    const carregarDados = useCallback(async () => {
        // Evitar múltiplas chamadas simultâneas ou se já carregou
        if (carregamentoEmAndamento || dadosCarregados) {
            return;
        }
        
        try {
            setCarregamentoEmAndamento(true);
            setDadosCarregados(false);
            
            // Carregar apenas países na inicialização
            if (!paises.length) {
                try {
                    const paisesResponse = await http.get('pais/?format=json');
                    
                    // Verifica se a resposta tem a estrutura esperada
                    let dadosPaises = [];
                    if (paisesResponse && paisesResponse.results && Array.isArray(paisesResponse.results)) {
                        dadosPaises = paisesResponse.results;
                    } else if (paisesResponse && Array.isArray(paisesResponse)) {
                        dadosPaises = paisesResponse;
                    } else if (paisesResponse && typeof paisesResponse === 'object') {
                        // Se for um objeto único, converte para array
                        dadosPaises = [paisesResponse];
                    } else {
                        dadosPaises = [];
                    }
                    
                    if (dadosPaises.length > 0) {
                        const paisesFormatados = dadosPaises
                            .filter(pais => pais && pais.nome_por) // Filtra países válidos com nome
                            .map(pais => ({
                                name: pais.nome_por || pais.nome_ing || pais.nome_esp,
                                code: parseInt(pais.id)
                            }))
                            .filter(pais => pais.name && pais.code) // Remove países sem nome ou código
                            .sort((a, b) => a.name.localeCompare(b.name)); // Ordena alfabeticamente
                        

                        
                        setPaises(paisesFormatados);
                    }
                } catch (error) {
                    console.error('Erro ao carregar países:', error);
                    setPaises([]);
                }
            }

            // Carregar nacionalidades da tabela domínio
            if (!nacionalidades.length) {
                try {
                    const nacionalidadesResponse = await http.get('tabela_dominio/nacionalidade/');
                    
                    let dadosNacionalidades = [];
                    if (nacionalidadesResponse && nacionalidadesResponse.registros && Array.isArray(nacionalidadesResponse.registros)) {
                        dadosNacionalidades = nacionalidadesResponse.registros;
                    } else if (nacionalidadesResponse && Array.isArray(nacionalidadesResponse)) {
                        dadosNacionalidades = nacionalidadesResponse;
                    } else {
                        dadosNacionalidades = [];
                    }
                    
                    if (dadosNacionalidades.length > 0) {
                        const nacionalidadesFormatadas = dadosNacionalidades
                            .filter(nacionalidade => nacionalidade && nacionalidade.descricao)
                            .map(nacionalidade => ({
                                name: nacionalidade.descricao,
                                code: nacionalidade.id_origem || nacionalidade.codigo || nacionalidade.id
                            }))
                            .filter(nacionalidade => nacionalidade.name && nacionalidade.code)
                            .sort((a, b) => a.name.localeCompare(b.name));
                        
                        setNacionalidades(nacionalidadesFormatadas);
                    }
                } catch (error) {
                    console.error('Erro ao carregar nacionalidades:', error);
                }
            }

            // Contador para rastrear quantas requisições foram concluídas
            let requisicoesConcluidas = 0;
            const totalRequisicoes = listasAuxiliares.length + 1; // +1 para a requisição de tabela_dominio

            const verificarCarregamentoCompleto = () => {
                requisicoesConcluidas++;
                if (requisicoesConcluidas >= totalRequisicoes) {
                    setDadosCarregados(true);
                }
            };

            // Carregar listas auxiliares em paralelo
            const promisesListas = listasAuxiliares.map(({ endpoint, setter }) =>
                http.get(endpoint)
                    .then(response => setter(response))
                    .catch(error => {
                        console.error(`Erro ao carregar ${endpoint}:`, error);
                        setter([]);
                    })
                    .finally(() => verificarCarregamentoCompleto())
            );

            // Carregar tabelas de domínio
            try {
                const response = await http.get('tabela_dominio/');
                const availableTables = response?.tabelas_disponiveis || [];
                setAvailableDominioTables(availableTables);

                if (availableTables.length > 0) {
                    // Carregar registros das tabelas de domínio em paralelo
                    const promisesDominio = availableTables.map(async (tabela) => {
                        try {
                            const res = await http.get(`tabela_dominio/${tabela}/`);
                            return { [tabela]: res?.registros || [] };
                        } catch (error) {
                            console.error(`Erro ao buscar tabela_dominio/${tabela}/`, error);
                            return { [tabela]: [] };
                        }
                    });

                    const resultados = await Promise.all(promisesDominio);
                    const novasOpcoes = resultados.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                    setOpcoesDominio(novasOpcoes);
                }
                verificarCarregamentoCompleto();
            } catch (error) {
                console.error("Erro ao buscar a lista de tabelas de domínio:", error);
                verificarCarregamentoCompleto();
            }

            // Aguardar todas as requisições de listas auxiliares
            await Promise.all(promisesListas);

        } catch (error) {
            console.error('Erro geral ao carregar dados:', error);
            setDadosCarregados(true); // Garantir que o componente não fique travado
        } finally {
            setCarregamentoEmAndamento(false);
        }
    }, []); // Removidas as dependências problemáticas

    useEffect(() => {
        carregarDados();
    }, []); // Executar apenas uma vez na montagem

    // Detectar mudanças de visibilidade da aba
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsVisible(!document.hidden);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []); // Executar apenas uma vez

    // Fechar modal com ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                if (showModalConfirmacao) {
                    setShowModalConfirmacao(false);
                } else if (showImageModal) {
                    setShowImageModal(false);
                } else if (showCropModal) {
                    setShowCropModal(false);
                    setSelectedFile(null);
                    setImageSrc('');
                    setCrop({
                        unit: '%',
                        width: 80,
                        height: 80,
                        x: 10,
                        y: 10
                    });
                    setScale(1);
                    setRotation(0);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showModalConfirmacao, showImageModal, showCropModal]);

    // Expor funções para o StepDocumentos usar
    useEffect(() => {
        window.handleImageUploadFromStep = handleImageUploadFromStep;
        window.handleShowImageModal = handleShowImageModal;
        
        return () => {
            delete window.handleImageUploadFromStep;
            delete window.handleShowImageModal;
        };
    }, []);

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

    const { 
        vagas,
        setVagas
    } = useVagasContext()

    useEffect(() => {
        if (id) {
            http.get(`admissao/${id}/`)
                .then((data) => {
                    console.log('🔍 DADOS DA API - admissao completa:', data);
                    console.log('🔍 DADOS DA API - dados_vaga:', data.dados_vaga);
                    console.log('🔍 DADOS DA API - centro_custo direto:', data.centro_custo);
                    
                    // Processar dados_vaga para garantir que os campos sejam preenchidos corretamente
                    let dadosVagaProcessados = data.dados_vaga || {};
                    
                    // Mapear campos da admissão para dados_vaga se estiverem faltando
                    const camposMapeamento = {
                        centro_custo_id: data.centro_custo,
                        filial_id: data.filial,
                        departamento_id: data.departamento,
                        secao_id: data.id_secao,
                        funcao_id: data.id_funcao,
                        cargo_id: data.cargo,
                        horario_id: data.id_horario || data.horario,
                        sindicato_id: data.sindicato
                    };
                    
                    // Preencher campos faltantes em dados_vaga
                    Object.entries(camposMapeamento).forEach(([campoVaga, valorAdmissao]) => {
                        if (!dadosVagaProcessados[campoVaga] && valorAdmissao) {
                            console.log(`🔧 CORREÇÃO - Preenchendo ${campoVaga} em dados_vaga com valor:`, valorAdmissao);
                            dadosVagaProcessados[campoVaga] = valorAdmissao;
                        }
                    });
                    
                    console.log('🔍 DADOS PROCESSADOS - dados_vaga final:', dadosVagaProcessados);
                    
                    const fullCandidatoData = {
                        ...data,
                        educacao: data.educacao || [],
                        habilidades: data.habilidades || [],
                        experiencia: data.experiencia || [],
                        dependentes: data.dependentes || [],
                        anotacoes: data.anotacoes || '',
                        dados_vaga: dadosVagaProcessados
                    };
                    
                    // Atualiza o candidato com todos os dados
                    setCandidato(fullCandidatoData);
                    setVaga(dadosVagaProcessados);
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

        // Step 0 (Documentos) - não faz nada
        if (activeIndex === 0) {
            toast.current.show({
                severity: 'info',
                summary: 'Informação',
                detail: 'O step de documentos não requer salvamento.',
                life: 3000
            });
            return;
        }

        // Validação de campos obrigatórios do step atual
        const validacaoCampos = validarCamposObrigatoriosStep();
        if (!validacaoCampos) {
            // Exibe o erro, mas permite salvar mesmo assim
            // return; // REMOVIDO: permite salvar mesmo com erro
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
        // Se não há dependentes novos, salva normalmente com payload específico do step
        const payloadStepAtual = obterPayloadStepAtual();
        await executarSalvamento(null, payloadStepAtual);
    };

    const handleSalvarEContinuar = async () => {
        // Se estiver em modo leitura, apenas avança para o próximo step
        if (modoLeitura) {
            stepperRef.current.nextCallback();
            setActiveIndex(prev => prev + 1);
            return;
        }

        // Step 0 (Documentos) - passa direto sem validação nem salvamento
        if (activeIndex === 0) {
            stepperRef.current.nextCallback();
            setActiveIndex(prev => prev + 1);
            return;
        }

        // Validação de campos obrigatórios do step atual
        const validacaoCampos = validarCamposObrigatoriosStep();
        if (!validacaoCampos) return;

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
        
        // Se não há dependentes novos, salva e continua normalmente com payload específico do step
        const payloadStepAtual = obterPayloadStepAtual();
        const salvamentoSucesso = await executarSalvamento(null, payloadStepAtual);
        if (salvamentoSucesso === false) {
            // ❌ ERRO DE VALIDAÇÃO - NÃO CONTINUA PARA O PRÓXIMO STEP
            return;
        }
        
        // ✅ SALVAMENTO SUCESSO - CONTINUA PARA O PRÓXIMO STEP
        stepperRef.current.nextCallback();
        setActiveIndex(prev => prev + 1);
    };

    // Função para calcular o índice do step de educação
    const getStepEducacaoIndex = () => {
        return 4; // Documentos, Dados Pessoais, Dados Bancários, Dados Contratuais, Educação
    };

    // Função para calcular o índice do step de dependentes
    const getStepDependentesIndex = () => {
        let index = getStepEducacaoIndex(); // Base: até Educação
        
        // Sempre adiciona pelo menos 1 para o step de dependentes
        index += 1;
        
        if (mostrarHabilidades) {
            index += 1; // Habilidades
        }
        
        if (mostrarExperiencia) {
            index += 1; // Experiência Profissional
        }
        return index; // Dependentes
    };
    
    // Função auxiliar para normalizar campos específicos de dados pessoais
    const normalizarCampoPessoal = (valor, nomeCampo) => {
        if (!valor) return '';
        
        // Se é um objeto com id ou code, retorna o id/code
        if (typeof valor === 'object' && !Array.isArray(valor)) {
            if (valor.id !== undefined) return valor.id;
            if (valor.code !== undefined) return valor.code;
            if (valor.descricao !== undefined) return valor.descricao;
        }
        
        // Se é string, retorna trim
        if (typeof valor === 'string') {
            const valorTrim = valor.trim();
            
            // Tratamento específico para CPF - remove formatação
            if (nomeCampo === 'cpf' || (valorTrim.length === 14 && valorTrim.includes('.'))) {
                // Formato: 417.790.328-03 -> 41779032803
                return valorTrim.replace(/\D/g, '');
            }
            
            return valorTrim;
        }
        
        return valor;
    };

    // Função que executa o salvamento real
    const executarSalvamento = async (candidatoOverride = null, payloadEspecifico = null) => {
        const candidatoAtual = candidatoOverride || candidato;
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

        // Se não for um override, verifica se houve mudanças
        if (!candidatoOverride && !payloadEspecifico) {
            const candidatoNormalizado = normalizarObjeto(candidatoAtual);
            const initialNormalizado = normalizarObjeto(initialCandidato);
            
            
            if (JSON.stringify(candidatoNormalizado) === JSON.stringify(initialNormalizado)) {
                toast.current.show({
                    severity: 'info',
                    summary: 'Informação',
                    detail: 'Nenhuma alteração para salvar.',
                    life: 3000
                });
                return;
            }
        } else {
            
            // Verificação específica para payload de dados contratuais
            if (payloadEspecifico && activeIndex === 3) {
                const candidatoNormalizado = normalizarObjeto(candidatoAtual);
                const initialNormalizado = normalizarObjeto(initialCandidato);
                
                // Comparar TODOS os campos do step de Vaga, não só os obrigatórios
                const camposVaga = [
                    'filial', 'id_secao', 'id_funcao', 'id_horario', 'centro_custo',
                    'salario', 'ajuda_custo', 'arredondamento', 'media_sal_maternidade',
                    'dt_admissao', 'indicativo_admissao', 'tipo_admissao', 'motivo_admissao',
                    'tipo_situacao', 'tipo_funcionario', 'tipo_regime_trabalhista', 'tipo_regime_previdenciario',
                    'tipo_recebimento', 'tipo_regime_jornada', 'jornada', 'funcao_emprego_cargoacumulavel',
                    'calcula_inss', 'calcula_irrf', 'confianca', 'funcao_confianca',
                    'codigo_situacao_fgts', 'dt_opcao_fgts', 'codigo_ocorrencia_sefip', 'codigo_categoria_sefip',
                    'contrato_tempo_parcial', 'tipo_contrato_prazo_determinado', 'tipo_contrato_trabalho',
                    'codigo_categoria_esocial', 'natureza_atividade_esocial', 'letra',
                    'perc_adiantamento',
                    // Adicione outros campos do StepVaga conforme necessário
                ];
                
                const candidatoVaga = {};
                const initialVaga = {};
                
                camposVaga.forEach(campo => {
                    if (candidatoNormalizado[campo] !== undefined) {
                        candidatoVaga[campo] = candidatoNormalizado[campo];
                    }
                    if (initialNormalizado[campo] !== undefined) {
                        initialVaga[campo] = initialNormalizado[campo];
                    }
                });
                
                // Normalizar campos de salário para comparação
                const normalizarCampoSalario = (valor) => {
                    if (!valor) return '';
                    if (typeof valor === 'number') {
                        return valor.toFixed(2);
                    }
                    let valorLimpo = valor.toString();
                    valorLimpo = valorLimpo.replace(/[R$\s]/g, '');
                    if (valorLimpo.includes(',')) {
                        valorLimpo = valorLimpo.replace(/\./g, '').replace(',', '.');
                    }
                    const numero = parseFloat(valorLimpo);
                    if (isNaN(numero)) return '';
                    return numero.toFixed(2);
                };
                const camposSalario = ['salario', 'ajuda_custo', 'arredondamento', 'media_sal_maternidade'];
                camposSalario.forEach(campo => {
                    if (candidatoVaga[campo] !== undefined) {
                        candidatoVaga[campo] = normalizarCampoSalario(candidatoVaga[campo]);
                    }
                    if (initialVaga[campo] !== undefined) {
                        initialVaga[campo] = normalizarCampoSalario(initialVaga[campo]);
                    }
                });
                
                if (JSON.stringify(candidatoVaga) === JSON.stringify(initialVaga)) {
                    toast.current.show({
                        severity: 'info',
                        summary: 'Informação',
                        detail: 'Nenhuma alteração nos dados da vaga para salvar.',
                        life: 3000
                    });
                    return;
                }
            }
            
            // Verificação específica para payload de educação
            if (payloadEspecifico && activeIndex === getStepEducacaoIndex()) {
                const candidatoNormalizado = normalizarObjeto(candidatoAtual);
                const initialNormalizado = normalizarObjeto(initialCandidato);
                
                // Compara apenas os campos relevantes do step de educação
                const camposEducacao = ['grau_instrucao'];
                
                const candidatoEducacao = {};
                const initialEducacao = {};
                
                camposEducacao.forEach(campo => {
                    if (candidatoNormalizado[campo] !== undefined) {
                        candidatoEducacao[campo] = candidatoNormalizado[campo];
                    }
                    if (initialNormalizado[campo] !== undefined) {
                        initialEducacao[campo] = initialNormalizado[campo];
                    }
                });
                
                if (JSON.stringify(candidatoEducacao) === JSON.stringify(initialEducacao)) {
                    toast.current.show({
                        severity: 'info',
                        summary: 'Informação',
                        detail: 'Nenhuma alteração nos dados de educação para salvar.',
                        life: 3000
                    });
                    return;
                }
            }
            
            // Verificação específica para payload de dependentes
            if (payloadEspecifico && activeIndex === getStepDependentesIndex()) {
                const candidatoNormalizado = normalizarObjeto(candidatoAtual);
                const initialNormalizado = normalizarObjeto(initialCandidato);
                
                // Compara apenas os campos relevantes do step de dependentes
                const camposDependentes = ['dependentes'];
                
                const candidatoDependentes = {};
                const initialDependentes = {};
                
                camposDependentes.forEach(campo => {
                    if (candidatoNormalizado[campo] !== undefined) {
                        candidatoDependentes[campo] = candidatoNormalizado[campo];
                    }
                    if (initialNormalizado[campo] !== undefined) {
                        initialDependentes[campo] = initialNormalizado[campo];
                    }
                });
                
                
                if (JSON.stringify(candidatoDependentes) === JSON.stringify(initialDependentes)) {
                    toast.current.show({
                        severity: 'info',
                        summary: 'Informação',
                        detail: 'Nenhuma alteração nos dados de dependentes para salvar.',
                        life: 3000
                    });
                    return;
                } 
            }
            
            // Verificação específica para payload de dados bancários
            if (payloadEspecifico && activeIndex === 2) {
                const candidatoNormalizado = normalizarObjeto(candidatoAtual);
                const initialNormalizado = normalizarObjeto(initialCandidato);
                
                // Compara apenas os campos relevantes do step de dados bancários
                const camposBancarios = [
                    'banco', 'agencia', 'agencia_nova', 'conta_corrente', 
                    'conta_operacao', 'pix', 'pix_tipo'
                ];
                
                const candidatoBancario = {};
                const initialBancario = {};
                
                camposBancarios.forEach(campo => {
                    if (candidatoNormalizado[campo] !== undefined) {
                        candidatoBancario[campo] = candidatoNormalizado[campo];
                    }
                    if (initialNormalizado[campo] !== undefined) {
                        initialBancario[campo] = initialNormalizado[campo];
                    }
                });
                
                if (JSON.stringify(candidatoBancario) === JSON.stringify(initialBancario)) {
                    toast.current.show({
                        severity: 'info',
                        summary: 'Informação',
                        detail: 'Nenhuma alteração nos dados bancários para salvar.',
                        life: 3000
                    });
                    return;
                }
            }
            
            // Verificação específica para payload de dados pessoais
            if (payloadEspecifico && activeIndex === 1) {
                const candidatoNormalizado = normalizarObjeto(candidatoAtual);
                const initialNormalizado = normalizarObjeto(initialCandidato);
                
                // Compara apenas os campos relevantes do step de dados pessoais
                const camposPessoais = [
                    'nome', 'email', 'telefone', 'cpf', 'dt_nascimento', 'nome_mae', 'nome_pai',
                    'naturalidade', 'estado_natal', 'nacionalidade', 'cor_raca', 'deficiente_fisico',
                    'naturalizado', 'data_naturalizacao', 'pais_origem', 'tipo_visto', 'data_venc_visto',
                    'nome_social', 'genero', 'estado_civil', 'cep', 'rua', 'numero', 'complemento',
                    'bairro', 'tipo_rua', 'tipo_bairro', 'cidade', 'estado', 'pais', 'pispasep',
                    // Documentos
                    'orgao_emissor_ident', 'data_emissao_ident', 'titulo_eleitor', 'zona_titulo_eleitor',
                    'secao_titulo_eleitor', 'data_titulo_eleitor', 'estado_emissor_tit_eleitor',
                    'carteira_trabalho', 'serie_carteira_trab', 'uf_carteira_trab', 'data_emissao_ctps',
                    'data_venc_ctps', 'nit', 'carteira_motorista', 'tipo_carteira_habilit',
                    'data_venc_habilit', 'data_emissao_cnh', 'identidade', 'uf_identidade',
                    'dt_opcao_fgts', 'codigo_situacao_fgts', 'numero_cartao_sus', 'certificado_reservista',
                    'numero_passaporte', 'data_emissao_passaporte', 'data_validade_passaporte', 'rnm',
                    'uf_emissor_rnm', 'data_emissao_rnm', 'data_vencimento_rnm', 'decreto_imigracao',
                    'registro_profissional', 'uf_registro_profissional', 'data_emissao_registro_profissional',
                    'tipo_sanguineo', 'circunscricao_militar', 'orgao_expedicao', 'regiao_militar',
                    'situacao_militar', 'telefone1', 'telefone2', 'email_pessoal', 'ddi', 'ddd', 'ddi1', 'ddd1', 'ddi2', 'ddd2'
                ];
                
                const candidatoPessoal = {};
                const initialPessoal = {};
                
                camposPessoais.forEach(campo => {
                    if (candidatoNormalizado[campo] !== undefined) {
                        candidatoPessoal[campo] = normalizarCampoPessoal(candidatoNormalizado[campo], campo);
                    }
                    if (initialNormalizado[campo] !== undefined) {
                        initialPessoal[campo] = normalizarCampoPessoal(initialNormalizado[campo], campo);
                    }
                });
                
                // Log detalhado de alguns campos importantes para debug
                const camposDebug = ['nome', 'email', 'email_pessoal', 'cpf', 'dt_nascimento', 'genero', 'estado_civil', 'nacionalidade', 'cor_raca', 'estado_civil', 'estado_natal', 'naturalidade', 'cep', 'tipo_rua', 'rua', 'numero', 'complemento', 'bairro', 'tipo_bairro', 'cidade', 'estado', 'pais', 'pispasep', 'orgao_emissor_ident', 'data_emissao_ident', 'titulo_eleitor', 'zona_titulo_eleitor', 'secao_titulo_eleitor', 'data_titulo_eleitor', 'estado_emissor_tit_eleitor', 'carteira_trabalho', 'serie_carteira_trab', 'uf_carteira_trab', 'data_emissao_ctps', 'data_venc_ctps', 'nit', 'carteira_motorista', 'tipo_carteira_habilit', 'data_venc_habilit', 'data_emissao_cnh', 'identidade', 'uf_identidade', 'dt_opcao_fgts', 'codigo_situacao_fgts', 'numero_cartao_sus', 'certificado_reservista', 'numero_passaporte', 'data_emissao_passaporte', 'data_validade_passaporte', 'rnm', 'uf_emissor_rnm', 'data_emissao_rnm', 'data_vencimento_rnm', 'decreto_imigracao', 'registro_profissional', 'uf_registro_profissional', 'data_emissao_registro_profissional', 'tipo_sanguineo', 'circunscricao_militar', 'orgao_expedicao', 'regiao_militar', 'situacao_militar', 'telefone1', 'telefone2', 'email_pessoal', 'ddi', 'ddd', 'ddi1', 'ddd1', 'ddi2', 'ddd2'];
               
                
                // Comparação detalhada para identificar diferenças
                const candidatoString = JSON.stringify(candidatoPessoal);
                const initialString = JSON.stringify(initialPessoal);
            
                
                if (candidatoString === initialString) {
                    toast.current.show({
                        severity: 'info',
                        summary: 'Informação',
                        detail: 'Nenhuma alteração nos dados pessoais para salvar.',
                        life: 3000
                    });
                    return;
                } else {
                    
                    // Identificar exatamente quais campos são diferentes
                    const camposDiferentes = [];
                    Object.keys(candidatoPessoal).forEach(campo => {
                        const valorAtual = candidatoPessoal[campo];
                        const valorInicial = initialPessoal[campo];
                        if (JSON.stringify(valorAtual) !== JSON.stringify(valorInicial)) {
                            camposDiferentes.push({
                                campo,
                                atual: valorAtual,
                                inicial: valorInicial
                            });
                        }
                    });
                    
                    if (camposDiferentes.length > 0) {
                        console.log('🔍 VERIFICAÇÃO DADOS PESSOAIS - Campos diferentes:', camposDiferentes);
                    }
                }
            }
        }

        try {
            let payload;
            
            // Se foi fornecido um payload específico, usa ele
            if (payloadEspecifico) {
                payload = payloadEspecifico;
            } else {
                // Monta o payload completo (comportamento original)
                const dadosCandidato = candidatoAtual || {};
                const dadosVaga = candidatoAtual.dados_vaga || {};
                


                // Função para formatar percentual corretamente
                const formatarPercentual = (valor) => {
                    if (!valor) return '';
                    
                    // Se já é um número, retorna formatado
                    if (typeof valor === 'number') {
                        return valor.toFixed(2);
                    }
                    
                    // Se é string, remove formatação e converte
                    let valorLimpo = valor.toString();
                    
                    // Remove %, espaços e outros caracteres não numéricos
                    valorLimpo = valorLimpo.replace(/[%\s]/g, '');
                    
                    // Se tem vírgula (formato brasileiro: 50,00)
                    if (valorLimpo.includes(',')) {
                        // Troca vírgula por ponto
                        valorLimpo = valorLimpo.replace(',', '.');
                    }
                    
                    // Converte para número
                    const numero = parseFloat(valorLimpo);
                    
                    if (isNaN(numero)) return '';
                    
                    return numero.toFixed(2);
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
                    chapa: candidatoAtual.chapa,
                    dt_admissao: candidatoAtual.dt_admissao,
                    jornada: candidatoAtual.jornada,
                    pispasep: candidatoAtual.pispasep,
                    status: candidatoAtual.status,
                    grau_instrucao: candidatoAtual.grau_instrucao,
                    confianca: candidatoAtual.confianca,
                    funcao_confianca: candidatoAtual.funcao_confianca,
                    // Endereço
                    cep: candidatoAtual.cep,
                    rua: candidatoAtual.rua,
                    numero: candidatoAtual.numero,
                    complemento: candidatoAtual.complemento,
                    bairro: candidatoAtual.bairro,
                    tipo_rua: candidatoAtual.tipo_rua,
                    tipo_bairro: candidatoAtual.tipo_bairro,
                    cidade: candidatoAtual.cidade,
                    estado: candidatoAtual.estado,
                    pais: candidatoAtual.pais,
                    // Dados do candidato
                    // candidato: {
                    nome: dadosCandidato.nome,
                    email: dadosCandidato.email,
                    email_pessoal: dadosCandidato.email_pessoal,
                    telefone: dadosCandidato.telefone,
                    ddi: dadosCandidato.ddi,
                    ddd: dadosCandidato.ddd,
                    cpf: dadosCandidato.cpf ? dadosCandidato.cpf.replace(/\D/g, '').substring(0, 11) : '',
                    dt_nascimento: dadosCandidato.dt_nascimento,
                    salario: (() => {
                        const salarioCandidato = dadosCandidato?.salario;
                        const salarioVaga = dadosVaga?.salario;
                        const salarioPrincipal = candidatoAtual.salario;
                        
                        const salarioParaFormatar = salarioCandidato ? salarioCandidato : (salarioVaga ? salarioVaga : salarioPrincipal);
                        
                        
                        return formatarSalario(salarioParaFormatar);
                    })(),
                    // },
                    
                    // Dados pessoais
                    nome_mae: candidatoAtual.nome_mae,
                    nome_pai: candidatoAtual.nome_pai,
                    naturalidade: candidatoAtual.naturalidade,
                    estado_natal: candidatoAtual.estado_natal,
                    nacionalidade: candidatoAtual.nacionalidade,
                    cor_raca: candidatoAtual.cor_raca,
                    deficiente_fisico: candidatoAtual.deficiente_fisico,
                    naturalizado: candidatoAtual.naturalizado,
                    data_naturalizacao: candidatoAtual.data_naturalizacao,
                    pais_origem: candidatoAtual.pais_origem,
                    tipo_visto: candidatoAtual.tipo_visto,
                    data_venc_visto: candidatoAtual.data_venc_visto,
                    nome_social: candidatoAtual.nome_social,
                    genero: candidatoAtual.genero,
                    estado_civil: candidatoAtual.estado_civil,
                    
                    // Documentos
                    orgao_emissor_ident: candidatoAtual.orgao_emissor_ident,
                    data_emissao_ident: candidatoAtual.data_emissao_ident,
                    titulo_eleitor: candidatoAtual.titulo_eleitor,
                    zona_titulo_eleitor: candidatoAtual.zona_titulo_eleitor,
                    secao_titulo_eleitor: candidatoAtual.secao_titulo_eleitor,
                    data_titulo_eleitor: candidatoAtual.data_titulo_eleitor,
                    estado_emissor_tit_eleitor: candidatoAtual.estado_emissor_tit_eleitor,
                    carteira_trabalho: candidatoAtual.carteira_trabalho,
                    serie_carteira_trab: candidatoAtual.serie_carteira_trab,
                    uf_carteira_trab: candidatoAtual.uf_carteira_trab,
                    data_emissao_ctps: candidatoAtual.data_emissao_ctps,
                    data_venc_ctps: candidatoAtual.data_venc_ctps,
                    nit: candidatoAtual.nit,
                    carteira_motorista: candidatoAtual.carteira_motorista,
                    tipo_carteira_habilit: candidatoAtual.tipo_carteira_habilit,
                    data_venc_habilit: candidatoAtual.data_venc_habilit,
                    data_emissao_cnh: candidatoAtual.data_emissao_cnh,
                    identidade: candidatoAtual.identidade,
                    uf_identidade: candidatoAtual.uf_identidade,
                    dt_opcao_fgts: candidatoAtual.dt_opcao_fgts,
                    codigo_situacao_fgts: candidatoAtual.codigo_situacao_fgts,
                    numero_cartao_sus: candidatoAtual.numero_cartao_sus || candidatoAtual.nrosus,
                    certificado_reservista: candidatoAtual.certificado_reservista,
                    numero_passaporte: candidatoAtual.numero_passaporte,
                    data_emissao_passaporte: candidatoAtual.data_emissao_passaporte,
                    data_validade_passaporte: candidatoAtual.data_validade_passaporte,
                    rnm: candidatoAtual.rnm,
                    uf_emissor_rnm: candidatoAtual.uf_emissor_rnm,
                    data_emissao_rnm: candidatoAtual.data_emissao_rnm,
                    data_vencimento_rnm: candidatoAtual.data_vencimento_rnm,
                    decreto_imigracao: candidatoAtual.decreto_imigracao,
                    registro_profissional: candidatoAtual.registro_profissional,
                    uf_registro_profissional: candidatoAtual.uf_registro_profissional,
                    data_emissao_registro_profissional: candidatoAtual.data_emissao_registro_profissional,
                    tipo_sanguineo: candidatoAtual.tipo_sanguineo,
                    circunscricao_militar: candidatoAtual.circunscricao_militar,
                    orgao_expedicao: candidatoAtual.orgao_expedicao,
                    regiao_militar: candidatoAtual.regiao_militar,
                    situacao_militar: candidatoAtual.situacao_militar,
                    
                    // Contatos
                    telefone1: candidatoAtual.telefone1,
                    telefone2: candidatoAtual.telefone2,
                    ddi1: candidatoAtual.ddi1,
                    ddd1: candidatoAtual.ddd1,
                    ddi2: candidatoAtual.ddi2,
                    ddd2: candidatoAtual.ddd2,
                    
                    // Dados bancários
                    banco: candidatoAtual.banco,
                    agencia: candidatoAtual.agencia,
                    agencia_nova: candidatoAtual.agencia_nova,
                    conta_corrente: candidatoAtual.conta_corrente,
                    tipo_conta: candidatoAtual.tipo_conta,
                    conta_operacao: candidatoAtual.conta_operacao,
                    pix: candidatoAtual.pix,
                    pix_tipo: candidatoAtual.pix_tipo,
                    
                    // Dados da vaga (apenas se não for self)
                    ...(self ? {} : {
                        centro_custo: dadosVaga?.centro_custo_id ? dadosVaga.centro_custo_id : candidatoAtual.centro_custo,
                        filial: dadosVaga?.filial_id ? dadosVaga.filial_id : candidatoAtual.filial,
                        departamento: dadosVaga?.departamento_id ? dadosVaga.departamento_id : candidatoAtual.departamento,
                        id_secao: dadosVaga?.secao_id ? dadosVaga.secao_id : candidatoAtual.id_secao,
                        id_funcao: dadosVaga?.funcao_id ? dadosVaga.funcao_id : candidatoAtual.id_funcao,
                        cargo: dadosVaga?.cargo_id ? dadosVaga.cargo_id : candidatoAtual.cargo,
                        horario: dadosVaga?.horario_id ? dadosVaga.horario_id : candidatoAtual.horario,
                        sindicato: dadosVaga?.sindicato_id ? dadosVaga.sindicato_id : candidatoAtual.sindicato,
                    }),
                    
                    // Dados adicionais
                    tipo_admissao: candidatoAtual.tipo_admissao,
                    codigo_ficha_registro: candidatoAtual.codigo_ficha_registro,
                    codigo_jornada: candidatoAtual.codigo_jornada,
                    tipo_funcionario: candidatoAtual.tipo_funcionario,
                    aceite_lgpd: candidatoAtual.aceite_lgpd,
                    anotacoes: candidatoAtual.anotacoes || '',
                    
                    // Novos campos
                    natureza_esocial: candidatoAtual.natureza_esocial,
                    codigo_ocorrencia_sefip: candidatoAtual.codigo_ocorrencia_sefip,
                    codigo_categoria_sefip: candidatoAtual.codigo_categoria_sefip,
                    motivo_admissao: candidatoAtual.motivo_admissao,
                    indicativo_admissao: candidatoAtual.indicativo_admissao,
                    codigo_categoria_esocial: candidatoAtual.codigo_categoria_esocial,
                    tipo_regime_trabalhista: candidatoAtual.tipo_regime_trabalhista,
                    funcao_emprego_cargoacumulavel: candidatoAtual.funcao_emprego_cargoacumulavel,
                    tipo_recebimento: candidatoAtual.tipo_recebimento,
                    mensal: candidatoAtual.mensal,
                    calcula_inss: candidatoAtual.calcula_inss,
                    calcula_irrf: candidatoAtual.calcula_irrf,
                    id_horario: candidatoAtual.id_horario,
                    horario: candidatoAtual.horario,
                    letra: candidatoAtual.letra,
                    contrato_tempo_parcial: candidatoAtual.contrato_tempo_parcial,
                    tipo_regime_jornada: candidatoAtual.tipo_regime_jornada,
                    tipo_situacao: candidatoAtual.tipo_situacao,
                    tipo_regime_previdenciario: candidatoAtual.tipo_regime_previdenciario,
                    tipo_contrato_prazo_determinado: candidatoAtual.tipo_contrato_prazo_determinado,
                    tipo_contrato_trabalho: candidatoAtual.tipo_contrato_trabalho,
                    natureza_atividade_esocial: candidatoAtual.natureza_atividade_esocial,
                    // Dados adicionais
                    perc_adiantamento: (() => {
                        let perc = candidatoAtual.perc_adiantamento;
                        if (typeof perc === 'string') {
                            perc = perc.replace('%', '').replace(',', '.').trim();
                            if (perc !== '') perc = parseFloat(perc);
                        }
                        return isNaN(perc) ? null : perc;
                    })(),
                    ajuda_custo: formatarSalario(candidatoAtual.ajuda_custo),
                    arredondamento: formatarSalario(candidatoAtual.arredondamento),
                    media_sal_maternidade: formatarSalario(candidatoAtual.media_sal_maternidade)
                };

                // Remove campos vazios do payload antes de enviar
                payload = removerCamposVazios(payloadCompleto);
            }

            // Debug: verificar se há campos duplicados
            const camposDuplicados = Object.keys(payload).filter((item, index) => Object.keys(payload).indexOf(item) !== index);
            if (camposDuplicados.length > 0) {
                console.warn('Campos duplicados encontrados:', camposDuplicados);
            }

            if(classInvalid.length > 0) {
                return;
            }
            await http.put(`admissao/${admissao.id}/`, payload);
            
            // Salvar dependentes separadamente se houver dependentes
            if (candidatoAtual.dependentes && candidatoAtual.dependentes.length > 0) {
                try {
                    // Filtra apenas dependentes novos (sem ID) que ainda não foram salvos
                    const dependentesNovos = candidatoAtual.dependentes.filter(dep => {
                        // Se já tem ID, já foi salvo
                        if (dep.id) return false;
                        
                        // Se tem temp_id mas não tem ID, ainda não foi salvo
                        return dep.temp_id && !dep.id;
                    });
                    
                    // Remove dependentes duplicados baseado no CPF (sem ID)
                    const dependentesUnicos = dependentesNovos.filter((dep, index, arr) => {
                        if (!dep.cpf) return true;
                        
                        const cpfLimpo = (dep.cpf && typeof dep.cpf === 'string') ? dep.cpf.replace(/\D/g, '') : '';
                        const primeiroIndex = arr.findIndex(d => 
                            d.cpf && typeof d.cpf === 'string' && d.cpf.replace(/\D/g, '') === cpfLimpo
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
                            cartao_vacina: dep.cartao_vacina || false,
                            nrosus: dep.nrosus || dep.numero_cartao_sus || null,
                            numero_cartao_sus: dep.nrosus || dep.numero_cartao_sus || null,
                            nronascidovivo: dep.nronascidovivo || null,
                            nome_mae: dep.nome_mae || null,
                            id_admissao: candidatoAtual.id,
                            genero: dep.genero || null,
                            genero_id_origem: dep.genero_id_origem || null,
                            estado_civil_id_origem: dep.estado_civil_id_origem || null,
                            estadocivil: ((dep.estadocivil  && dep.estadocivil !== '') ? dep.estadocivil : null),
                            grau_parentesco: dep.grau_parentesco || null,
                            grau_parentesco_id_origem: dep.grau_parentesco_id_origem || null,
                            incidencia_irrf: dep.incidencia_irrf || false,
                            incidencia_inss: dep.incidencia_inss || false,
                            incidencia_assist_medica: dep.incidencia_assist_medica || false,
                            incidencia_assist_odonto: dep.incidencia_assist_odonto || false,
                            incidencia_pensao: dep.incidencia_pensao || false,
                            incidencia_sal_familia: dep.incidencia_sal_familia || false
                        }));

                        try {
                            const dependentesSalvos = await http.post(`admissao/${candidatoAtual.id}/adiciona_dependentes/`, dependentesParaEnviar);

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
                        // Nenhum dependente novo para salvar
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
                const snapshot = JSON.parse(JSON.stringify(candidatoAtual));
                setInitialCandidato(snapshot);
            }, 100);
            
            // ✅ SALVAMENTO SUCESSO - RETORNA TRUE
            return true;

        } catch (error) {
            console.error('Erro ao salvar:', error);
            
            // Verifica se o erro tem o formato específico da API
            if (error && error.admissao_errors) {
                const admissaoErrors = error.admissao_errors;
                
                // Processa os erros para exibir no toast
                const errosFormatados = Object.entries(admissaoErrors).map(([campo, mensagens]) => {
                    const mensagem = Array.isArray(mensagens) ? mensagens.join(', ') : mensagens;
                    return `${campo}: ${mensagem}`;
                }).join('\n');
                
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro de Validação',
                    detail: errosFormatados,
                    life: 5000
                });
                
                // Atualiza o estado de erro para destacar os campos com problema
                const camposComErro = Object.keys(admissaoErrors);
                setClassError(camposComErro);
                // Limpa campos inválidos quando há erro de validação da API
                setClassInvalid([]);
                
                // ❌ INTERROMPE O FLUXO - NÃO CONTINUA PARA O PRÓXIMO STEP
                return false;
                
            } else {
                // Erro genérico
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao salvar dados. Tente novamente.',
                    life: 3000
                });
                
                // ❌ INTERROMPE O FLUXO - NÃO CONTINUA PARA O PRÓXIMO STEP
                return false;
            }
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
            if(tarefa.status === 'pendente'){
                await http.post(`tarefas/${tarefa.id}/aprovar/`);
            } else if (tarefa.status === 'em_andamento') {
                await http.post(`tarefas/${tarefa.id}/concluir/`);
            }

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

        if (documentosNaoObrigatoriosPendentes.length > 0 && !modoLeitura) {
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

    // Função para validar PIS
    const validarPIS = (pis) => {
        if (!pis || pis.trim() === '') return true; // Campo vazio é válido
        
        const pisLimpo = pis.replace(/\D/g, '');
        
        // PIS deve ter 11 dígitos
        if (pisLimpo.length !== 11) return false;
        
        // Algoritmo de validação do PIS
        const pesos = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        let soma = 0;
        
        for (let i = 0; i < 10; i++) {
            soma += parseInt(pisLimpo[i]) * pesos[i];
        }
        
        const resto = soma % 11;
        const digitoVerificador = resto < 2 ? 0 : 11 - resto;
        
        return parseInt(pisLimpo[10]) === digitoVerificador;
    };



    // Função para validar campos obrigatórios do step atual
    const validarCamposObrigatoriosStep = () => {
        // NÃO limpa os erros anteriores - vamos acumular
        // setClassError([]);
        
        const dadosCandidato = candidato || {};
        const dadosVaga = candidato.dados_vaga || {};
        const camposObrigatorios = [];
        

        
        // Validação específica por step
        if (activeIndex === 1) { // Step Dados Pessoais
            // Validação de dados pessoais obrigatórios baseada no required={true}
            const camposObrigatoriosDadosPessoais = [
                { campo: 'nome', nome: 'Nome completo' },
                { campo: 'cpf', nome: 'CPF' },
                { campo: 'ddi', nome: 'DDI' },
                { campo: 'ddd', nome: 'DDD' },
                { campo: 'telefone', nome: 'Telefone' },
                { campo: 'dt_nascimento', nome: 'Data de nascimento' },
                { campo: 'genero', nome: 'Gênero' },
                { campo: 'cor_raca', nome: 'Cor/Raça' },
                { campo: 'estado_civil', nome: 'Estado Civil' },
                { campo: 'estado_natal', nome: 'Estado Natal' },
                { campo: 'nacionalidade', nome: 'Nacionalidade' },
                { campo: 'naturalidade', nome: 'Naturalidade' },
                { campo: 'cep', nome: 'CEP' },
                { campo: 'tipo_rua', nome: 'Tipo de Logradouro' },
                { campo: 'rua', nome: 'Logradouro' },
                { campo: 'numero', nome: 'Número' },
                { campo: 'bairro', nome: 'Bairro' },
                { campo: 'tipo_bairro', nome: 'Tipo de Bairro' },
                { campo: 'cidade', nome: 'Cidade' },
                { campo: 'estado', nome: 'Estado' }
            ];

            camposObrigatoriosDadosPessoais.forEach(({ campo, nome }) => {
                // Verifica se o campo existe e tem valor (pode ser objeto ou string)
                const valor = dadosCandidato[campo];
                if (!valor || (typeof valor === 'object' && !valor.id && !valor.code) || (typeof valor === 'string' && !valor.trim())) {
                    camposObrigatorios.push(nome);
                    setClassError(prev => [...prev, campo]);
                }
            });

            // Validação de PIS (se preenchido, deve ser válido)
            if (dadosCandidato.pispasep && dadosCandidato.pispasep.trim() !== '' && !validarPIS(dadosCandidato.pispasep)) {
                camposObrigatorios.push('PIS/PASEP (inválido)');
                marcarCampoInvalido('pispasep');
            }

            // Validação de campos obrigatórios baseada nos documentos
            if (dadosCandidato.documentos && Array.isArray(dadosCandidato.documentos)) {
                const camposRequeridos = {};
                
                // Coleta todos os campos requeridos dos documentos
                dadosCandidato.documentos.forEach(documento => {
                    // Só valida campos se o documento for obrigatório
                    if (documento.obrigatorio === true && documento.campos_requeridos) {
                        let camposObj = documento.campos_requeridos;
                        if (typeof camposObj === 'string') {
                            try {
                                camposObj = JSON.parse(camposObj);
                            } catch (error) {
                                return;
                            }
                        }
                        
                        Object.entries(camposObj).forEach(([campo, obrigatorio]) => {
                            if (obrigatorio === true) {
                                camposRequeridos[campo] = true;
                            }
                        });
                    }
                });

                // Valida os campos requeridos
                const nomesCampos = {
                    identidade: 'Identidade (RG)',
                    uf_identidade: 'UF da Identidade',
                    orgao_emissor_ident: 'Órgão Emissor da Identidade',
                    data_emissao_ident: 'Data de Emissão da Identidade',
                    titulo_eleitor: 'Título de Eleitor',
                    zona_titulo_eleitor: 'Zona do Título',
                    secao_titulo_eleitor: 'Seção do Título',
                    data_titulo_eleitor: 'Data do Título',
                    estado_emissor_tit_eleitor: 'Estado Emissor do Título',
                    carteira_trabalho: 'CTPS',
                    serie_carteira_trab: 'Série da CTPS',
                    uf_carteira_trab: 'UF da CTPS',
                    data_emissao_ctps: 'Data de Emissão da CTPS',
                    data_venc_ctps: 'Data de Vencimento da CTPS',
                    carteira_motorista: 'Carteira de Motorista',
                    tipo_carteira_habilit: 'Tipo da Carteira de Habilitação',
                    data_venc_habilit: 'Data de Vencimento da Habilitação',
                    data_emissao_cnh: 'Data de Emissão da CNH',
                    pispasep: 'PIS/PASEP',
                    dt_opcao_fgts: 'Data de Opção FGTS',
                    codigo_situacao_fgts: 'Código Situação FGTS',
                    numero_passaporte: 'Número do Passaporte',
                    pais_origem: 'País de Origem',
                    data_emissao_passaporte: 'Data de Emissão do Passaporte',
                    data_validade_passaporte: 'Data de Validade do Passaporte',
                    rnm: 'NRM',
                    uf_emissor_rnm: 'UF Emissor do RNM',
                    data_emissao_rnm: 'Data de Emissão do RNM',
                    data_vencimento_rnm: 'Data de Vencimento do RNM',
                    decreto_imigracao: 'Decreto de Imigração',
                };

                Object.entries(camposRequeridos).forEach(([campo, obrigatorio]) => {
                    if (obrigatorio && !dadosCandidato[campo]?.toString().trim()) {
                        const nomeCampo = nomesCampos[campo] || campo;
                        if (!camposObrigatorios.includes(nomeCampo)) {
                            camposObrigatorios.push(nomeCampo);
                            setClassError(prev => [...prev, campo]);
                        }
                    }
                });
            }
        } else if (activeIndex === 2) { // Step Dados Bancários
            // Validação de dados bancários obrigatórios baseada no required={true}
            const camposObrigatoriosDadosBancarios = [
                { campo: 'banco', nome: 'Banco' },
                { campo: 'conta_corrente', nome: 'Número da Conta' }
            ];

            camposObrigatoriosDadosBancarios.forEach(({ campo, nome }) => {
                // Verifica se o campo existe e tem valor (pode ser objeto ou string)
                const valor = candidato[campo];
                if (!valor || (typeof valor === 'object' && !valor.id && !valor.code) || (typeof valor === 'string' && !valor.trim())) {
                    camposObrigatorios.push(nome);
                    setClassError(prev => [...prev, campo]);
                }
            });
        } else if (activeIndex === 3 && !self) { // Step Dados Contratuais (apenas se não for self)
            
            // Validação de dados contratuais obrigatórios baseada no required={true}
            const camposObrigatoriosDadosContratuais = [
                { campo: 'dt_admissao', nome: 'Data de Admissão' },
                { campo: 'tipo_admissao', nome: 'Tipo de Admissão' },
                { campo: 'motivo_admissao', nome: 'Motivo da Admissão' },
                { campo: 'tipo_situacao', nome: 'Situação' },
                { campo: 'tipo_funcionario', nome: 'Tipo de Funcionário' },
                { campo: 'tipo_recebimento', nome: 'Tipo de Recebimento' },
                { campo: 'jornada', nome: 'Jornada' },
                { campo: 'salario', nome: 'Salário' },
                { campo: 'letra', nome: 'Letra' },
                { campo: 'codigo_situacao_fgts', nome: 'Situação FGTS' },
                { campo: 'codigo_categoria_esocial', nome: 'Código Categoria eSocial' },
                { campo: 'natureza_atividade_esocial', nome: 'Natureza da Atividade eSocial' },
                // { campo: 'letra', nome: 'Letra' }
            ];

            // Validação condicional para funcao_confianca
            if (candidato.confianca) {
                camposObrigatoriosDadosContratuais.push({ campo: 'funcao_confianca', nome: 'Função de Confiança/Cargo em Comissão' });
            }

            camposObrigatoriosDadosContratuais.forEach(({ campo, nome }) => {
                // Verifica se o campo existe e tem valor (pode ser objeto ou string)
                const valor = candidato[campo];
                

                
                // Verifica se o campo foi explicitamente selecionado pelo usuário
                const foiSelecionado = camposSelecionados.has(campo);
                
                // Lista de campos que DEVEM ser explicitamente selecionados pelo usuário
                const camposExplicitos = [];
                const precisaSelecaoExplicita = camposExplicitos.includes(campo);
                

                if (!valor || (typeof valor === 'object' && !valor.id && !valor.code) || (typeof valor === 'string' && !valor.trim())) {
                    camposObrigatorios.push(nome);
                    setClassError(prev => [...prev, campo]);
                } else if (precisaSelecaoExplicita && !foiSelecionado) {
                    // Campo específico que precisa ser explicitamente selecionado
                    camposObrigatorios.push(nome);
                    setClassError(prev => [...prev, campo]);
                }
            });

            // Validação específica para campos que dependem de listas
            if (filiais && filiais.length > 0 && !dadosVaga.filial_id) {
                camposObrigatorios.push('Filial');
                setClassError(prev => [...prev, 'filial_id']);
            }
            if (centros_custo && centros_custo.length > 0 && ((!dadosVaga.centro_custo_id) && (!dadosVaga.centro_custo))) {
                console.log(dadosVaga.centro_custo_id)
                console.log(dadosVaga.centro_custo)
                camposObrigatorios.push('Centro de custo');
                setClassError(prev => [...prev, 'centro_custo_id']);
            }
        } else if (activeIndex === getStepDependentesIndex() && activeIndex !== getStepEducacaoIndex()) { // Step Dependentes (apenas se não for o mesmo que educação)
           
            if (candidato.dependentes && candidato.dependentes.length > 0) {
                candidato.dependentes.forEach((dependente, index) => {
                    // Validação básica de campos obrigatórios
                    if (!dependente.nome_depend?.trim()) {
                        camposObrigatorios.push(`Nome do dependente ${index + 1}`);
                        setClassError(prev => [...prev, `nome_depend_${index}`]);
                    }
                    if (!dependente.grau_parentesco_id_origem) {
                        camposObrigatorios.push(`Grau de parentesco do dependente ${index + 1}`);
                        setClassError(prev => [...prev, `grau_parentesco_id_origem_${index}`]);
                    }
                    if (!dependente.genero_id_origem) {
                        camposObrigatorios.push(`Gênero do dependente ${index + 1}`);
                        setClassError(prev => [...prev, `genero_id_origem_${index}`]);
                    }
                    if (!dependente.estado_civil_id_origem) {
                        camposObrigatorios.push(`Estado civil do dependente ${index + 1}`);
                        setClassError(prev => [...prev, `estado_civil_id_origem_${index}`]);
                    }
                    
                    // Validação específica baseada em incidências e grau de parentesco
                    const incidenciasQueRequeremCPF = dependente.incidencia_irrf || dependente.incidencia_assist_medica || dependente.incidencia_assist_odonto;
                    const grauRequerCPF = dependente.grau_parentesco_id_origem === '6' || dependente.grau_parentesco_id_origem === '7' || 
                                          dependente.grau_parentesco_id_origem === 6 || dependente.grau_parentesco_id_origem === 7;
                    const naoEPaiOuMae = !grauRequerCPF; // Se NÃO for pai ou mãe, é obrigatório
                    
                    // Validação de CPF obrigatório
                    if ((incidenciasQueRequeremCPF || naoEPaiOuMae) && !dependente.cpf?.trim()) {
                        const motivo = grauRequerCPF ? 'há incidências de IRRF, Assistência Médica ou Assistência Odontológica' : 'o dependente não é Pai ou Mãe';
                        camposObrigatorios.push(`CPF do dependente ${index + 1} (obrigatório quando ${motivo})`);
                        setClassError(prev => [...prev, `cpf_${index}`]);
                    }
                    
                    // Validação de Data de Nascimento obrigatória
                    if ((incidenciasQueRequeremCPF || naoEPaiOuMae) && !dependente.dt_nascimento) {
                        const motivo = grauRequerCPF ? 'há incidências de IRRF, Assistência Médica ou Assistência Odontológica' : 'o dependente não é Pai ou Mãe';
                        camposObrigatorios.push(`Data de nascimento do dependente ${index + 1} (obrigatória quando ${motivo})`);
                        setClassError(prev => [...prev, `dt_nascimento_${index}`]);
                    }
                });
            }
        } else if (activeIndex === getStepEducacaoIndex()) { // Step Educação
            // Validação de educação obrigatória baseada no required={true}
            const camposObrigatoriosEducacao = [
                { campo: 'grau_instrucao', nome: 'Grau de Instrução' }
            ];

            camposObrigatoriosEducacao.forEach(({ campo, nome }) => {
                // Verifica se o campo existe e tem valor (pode ser objeto ou string)
                const valor = candidato[campo];
                
                const isVazio = !valor || (typeof valor === 'object' && !valor.id && !valor.code) || (typeof valor === 'string' && !valor.trim());
                
                if (isVazio) {
                    camposObrigatorios.push(nome);
                    setClassError(prev => [...prev, campo]);
                }
            });
        }
        
        if (camposObrigatorios.length > 0) {
            toast.current.show({
                severity: 'warn',
                summary: 'Campos obrigatórios não preenchidos',
                detail: `Os seguintes campos são obrigatórios: ${camposObrigatorios.join(', ')}`,
                life: 5000
            });
            return false;
        }
        
        // Se chegou até aqui, não há erros, então limpa o classError e classInvalid
        setClassError([]);
        setClassInvalid([]);
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
        if (!dadosCandidato.telefone?.trim()) {
            camposObrigatorios.push('Telefone');
        }
        if (!dadosCandidato.dt_nascimento) {
            camposObrigatorios.push('Data de nascimento');
        }
        if (!dadosCandidato.nacionalidade?.trim()) {
            camposObrigatorios.push('Nacionalidade');
        }
        // if (!dadosCandidato.genero?.trim()) {
        //     camposObrigatorios.push('Gênero');
        // }
        // if (!dadosCandidato.cor_raca?.trim()) {
        //     camposObrigatorios.push('Cor/Raça');
        // }
        // if (!dadosCandidato.estado_civil?.trim()) {
        //     camposObrigatorios.push('Estado Civil');
        // }
        
        // Validação de dados bancários obrigatórios
        if (!candidato.banco?.trim()) {
            camposObrigatorios.push('Banco');
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
            if (centros_custo && centros_custo.length > 0 && ((!dadosVaga.centro_custo_id) && (!dadosVaga.centro_custo))) {
                console.log(dadosVaga.centro_custo_id)
                console.log(dadosVaga.centro_custo)
                camposObrigatorios.push('Centro de custo');
            }
            if (!dadosVaga.salario?.trim()) {
                camposObrigatorios.push('Salário');
            }
        }

        // Validação de campos obrigatórios baseada nos documentos
        if (dadosCandidato.documentos && Array.isArray(dadosCandidato.documentos)) {
            const camposRequeridos = {};
            
            // Coleta todos os campos requeridos dos documentos
            dadosCandidato.documentos.forEach(documento => {
                // Só valida campos se o documento for obrigatório
                if (documento.obrigatorio === true && documento.campos_requeridos) {
                    let camposObj = documento.campos_requeridos;
                    if (typeof camposObj === 'string') {
                        try {
                            camposObj = JSON.parse(camposObj);
                        } catch (error) {
                            return;
                        }
                    }
                    
                    Object.entries(camposObj).forEach(([campo, obrigatorio]) => {
                        if (obrigatorio === true) {
                            camposRequeridos[campo] = true;
                        }
                    });
                }
            });

            // Valida os campos requeridos
            const nomesCampos = {
                identidade: 'Identidade (RG)',
                uf_identidade: 'UF da Identidade',
                orgao_emissor_ident: 'Órgão Emissor da Identidade',
                data_emissao_ident: 'Data de Emissão da Identidade',
                titulo_eleitor: 'Título de Eleitor',
                zona_titulo_eleitor: 'Zona do Título',
                secao_titulo_eleitor: 'Seção do Título',
                data_titulo_eleitor: 'Data do Título',
                estado_emissor_tit_eleitor: 'Estado Emissor do Título',
                carteira_trabalho: 'CTPS',
                serie_carteira_trab: 'Série da CTPS',
                uf_carteira_trab: 'UF da CTPS',
                data_emissao_ctps: 'Data de Emissão da CTPS',
                data_venc_ctps: 'Data de Vencimento da CTPS',
                carteira_motorista: 'Carteira de Motorista',
                tipo_carteira_habilit: 'Tipo da Carteira de Habilitação',
                data_venc_habilit: 'Data de Vencimento da Habilitação',
                data_emissao_cnh: 'Data de Emissão da CNH',
                pispasep: 'PIS/PASEP',
                dt_opcao_fgts: 'Data de Opção FGTS',
                codigo_situacao_fgts: 'Código Situação FGTS',
                numero_passaporte: 'Número do Passaporte',
                pais_origem: 'País de Origem',
                data_emissao_passaporte: 'Data de Emissão do Passaporte',
                data_validade_passaporte: 'Data de Validade do Passaporte',
                rnm: 'NRM',
                uf_emissor_rnm: 'UF Emissor do RNM',
                data_emissao_rnm: 'Data de Emissão do RNM',
                data_vencimento_rnm: 'Data de Vencimento do RNM',
                decreto_imigracao: 'Decreto de Imigração',
            };

            Object.entries(camposRequeridos).forEach(([campo, obrigatorio]) => {
                if (obrigatorio && !dadosCandidato[campo]?.toString().trim()) {
                    const nomeCampo = nomesCampos[campo] || campo;
                    if (!camposObrigatorios.includes(nomeCampo)) {
                        camposObrigatorios.push(nomeCampo);
                    }
                }
            });
        }
        
        if (camposObrigatorios.length > 0) {
            toast.current.show({
                severity: 'warn',
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
            // Para self, usa payload específico do step atual
            const payloadStepAtual = obterPayloadStepAtual();
            const salvamentoSucesso = await executarSalvamento(null, payloadStepAtual);
            if (salvamentoSucesso === false) {
                return;
            }
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

        const perfil = ArmazenadorToken.UserProfile;
                                    
        if(perfil === 'analista_tenant' && tarefaPendente?.tipo_codigo === 'aprovar_admissao'){
            toast.current.show({
                severity: 'error',
                summary: 'Você não pode executar esta ação',
                detail: 'Você não pode executar esta ação',
                life: 3000
            });
        }

        // Se for visão empresa (self = false), mostra modal de confirmação
        setShowModalConfirmacao(true);
    };

    const handleConfirmarFinalizacao = async () => {
        try {
            setShowModalConfirmacao(false);
            // Usa payload específico do step atual
            const payloadStepAtual = obterPayloadStepAtual();
            const salvamentoSucesso = await executarSalvamento(null, payloadStepAtual);
            if (salvamentoSucesso === false) {
                return;
            }
            
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
            } else if (tarefaPendente?.tipo_codigo === 'integrar_admissao_correcao') {
                mensagem = 'Integração do colaborador iniciada com sucesso!';
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

            // Faz o upload do aceite na admissão com payload específico
            const payloadLGPD = gerarPayloadStepLGPD();
            await http.put(`admissao/${admissao.id}/`, {
                ...payloadLGPD,
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

            // Verifica se o erro tem o formato específico da API
            if (error.response && error.response.data && error.response.data.admissao_errors) {
                const admissaoErrors = error.response.data.admissao_errors;
                // Processa os erros para exibir no toast
                const errosFormatados = Object.entries(admissaoErrors).map(([campo, mensagens]) => {
                    const mensagem = Array.isArray(mensagens) ? mensagens.join(', ') : mensagens;
                    return `${campo}: ${mensagem}`;
                }).join('\n');
                
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro de Validação',
                    detail: errosFormatados,
                    life: 5000
                });
                
                // Atualiza o estado de erro para destacar os campos com problema
                const camposComErro = Object.keys(admissaoErrors);
                setClassError(camposComErro);
                // Limpa campos inválidos quando há erro de validação da API
                setClassInvalid([]);
                
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao salvar o aceite da LGPD.',
                    life: 3000
                });
            }
        }
    };



    const handleVoltar = () => {
        stepperRef.current.prevCallback();
        setActiveIndex(prev => prev - 1);
    };

    const handleAvancar = async () => {
        // Se estiver em modo leitura, apenas avança
        if (modoLeitura) {
            stepperRef.current.nextCallback();
            setActiveIndex(prev => prev + 1);
            return;
        }

        // Step 0 (Documentos) - só permite avançar se todos os obrigatórios estiverem enviados
        if (activeIndex === 0) {
            if (!candidato?.documentos || candidato.documentos.length === 0) {
               stepperRef.current.nextCallback();
               setActiveIndex(prev => prev + 1);
               return;
            }
            const obrigatoriosPendentes = candidato.documentos.filter(doc => doc.obrigatorio && (!doc.upload_feito || !doc.itens || doc.itens.some(item => !item.upload_feito)));
            
            if(obrigatoriosPendentes.length > 0) 
            {
                toast.current.show({
                    severity: 'error',
                    summary: 'Documentos pendentes',
                    detail: `Preencha os documentos obrigatórios para avançar.`,
                    life: 4000
                });
            } else {
                 // ✅ SALVAMENTO SUCESSO - AVANÇA PARA O PRÓXIMO STEP
                stepperRef.current.nextCallback();
                setActiveIndex(prev => prev + 1);
            }

            return obrigatoriosPendentes.length === 0;
        }

        // Validação para todos os outros steps
        const validacaoCampos = validarCamposObrigatoriosStep();
        if (!validacaoCampos) return;
        
        // ✅ SALVA DADOS ANTES DE AVANÇAR com payload específico do step
        const payloadStepAtual = obterPayloadStepAtual();
        const salvamentoSucesso = await executarSalvamento(null, payloadStepAtual);
        if (salvamentoSucesso === false) {
            // ❌ ERRO DE VALIDAÇÃO DA API - NÃO AVANÇA
            return;
        }
        
        // ✅ SALVAMENTO SUCESSO - AVANÇA PARA O PRÓXIMO STEP
        stepperRef.current.nextCallback();
        setActiveIndex(prev => prev + 1);
    };

    // Função para verificar se há dependentes com campos obrigatórios não preenchidos
    const verificarDependentesIncompletos = useCallback(() => {
        if (!candidato.dependentes || candidato.dependentes.length === 0) {
            return false;
        }
        
        const resultado = candidato.dependentes.some(dependente => {
            // Verificar campos básicos obrigatórios
            const nomeVazio = !dependente.nome_depend?.trim();
            const grauVazio = !dependente.grau_parentesco_id_origem;
            const generoVazio = !dependente.genero_id_origem;
            const estadoCivilVazio = !dependente.estado_civil_id_origem;
            
            if (nomeVazio || grauVazio || generoVazio || estadoCivilVazio) {
                return true;
            }
            
            // Verificar campos obrigatórios baseados em incidências
            const incidenciasQueRequeremCPF = dependente.incidencia_irrf || dependente.incidencia_assist_medica || dependente.incidencia_assist_odonto;
            const grauRequerCPF = dependente.grau_parentesco_id_origem === '6' || dependente.grau_parentesco_id_origem === '7' || 
                                  dependente.grau_parentesco_id_origem === 6 || dependente.grau_parentesco_id_origem === 7;
            const naoEPaiOuMae = !grauRequerCPF;
            
            if ((incidenciasQueRequeremCPF || naoEPaiOuMae) && (!dependente.cpf?.trim() || !dependente.dt_nascimento)) {
                return true;
            }
            
            return false;
        });
        
        return resultado;
    }, [candidato.dependentes]);

    // Função para verificar se o step atual está válido
    const verificarStepAtualValido = useCallback(() => {
        // Se estiver em modo leitura, sempre permite navegação
        if (modoLeitura) {
            return true;
        }

        // Step 0 - Documentos - sempre válido (passa direto)
        if (activeIndex === 0) {
            return true;
        }

        // Step 1 - Dados Pessoais
        if (activeIndex === 1) {
            const camposObrigatorios = [
                'nome', 'cpf', 'telefone', 'dt_nascimento', 'genero', 'cor_raca', 'estado_civil',
                'estado_natal', 'nacionalidade', 'naturalidade', 'cep', 'tipo_rua', 'rua', 'numero',
                'bairro', 'tipo_bairro', 'cidade', 'estado'
            ];
            
            return camposObrigatorios.every(campo => {
                const valor = candidato[campo];
                return valor && (typeof valor === 'object' ? (valor.id || valor.code) : valor.toString().trim());
            });
        }

        // Step 2 - Dados Bancários
        if (activeIndex === 2) {
            const camposObrigatorios = ['banco', 'conta_corrente'];
            return camposObrigatorios.every(campo => {
                const valor = candidato[campo];
                return valor && (typeof valor === 'object' ? (valor.id || valor.code) : valor.toString().trim());
            });
        }

        // Step 3 - Dados Contratuais (apenas se não for self)
        if (activeIndex === 3 && !self) {
            const camposObrigatorios = [
                'dt_admissao', 'tipo_admissao', 'motivo_admissao', 'tipo_situacao',
                'tipo_funcionario', 'tipo_recebimento', 'jornada', 'salario', 'letra',
                'codigo_situacao_fgts', 'codigo_categoria_esocial', 'natureza_atividade_esocial'
            ];
            // Estrutura organizacional
            // Filial
            const temFiliais = filiais && filiais.length > 0;
            if (temFiliais) camposObrigatorios.push('filial');

            // Seção (só se houver filial selecionada e seções válidas)
            const filialSelecionada = candidato?.filial || candidato?.dados_vaga?.filial_id;
            const secoesFiltradas = secoes && filialSelecionada
                ? secoes.filter(sec => String(sec.filial) === String(filialSelecionada))
                : [];
            if (filialSelecionada && secoesFiltradas.length > 0) camposObrigatorios.push('id_secao');
            // Função
            const temFuncoes = funcoes && funcoes.length > 0;
            if (temFuncoes) camposObrigatorios.push('id_funcao');

            // Centro de custo
            const temCentrosCusto = centros_custo && centros_custo.length > 0;
            if (temCentrosCusto) camposObrigatorios.push('centro_custo');

            // Horário
            const temHorarios = horarios && horarios.length > 0;
            if (temHorarios) {
                camposObrigatorios.push('id_horario');
            }

            // Adiciona funcao_confianca se confianca for true
            if (candidato.confianca) {
                camposObrigatorios.push('funcao_confianca');
            }

            // Checar quais campos não estão preenchidos
            const mapaCamposVaga = {
                id_secao: 'secao_id',
                id_funcao: 'funcao_id',
                id_horario: 'horario_id',
                centro_custo: 'centro_custo_id',
                filial: 'filial_id'
            };
            const camposNaoPreenchidos = camposObrigatorios.filter(campo => {
                const valorDireto = candidato[campo];
                const valorVaga = candidato.dados_vaga && mapaCamposVaga[campo] ? candidato.dados_vaga[mapaCamposVaga[campo]] : undefined;
                const preenchido = (
                    (valorDireto && (typeof valorDireto === 'object' ? (valorDireto.id || valorDireto.code) : valorDireto.toString().trim())) ||
                    (valorVaga && (typeof valorVaga === 'object' ? (valorVaga.id || valorVaga.code) : valorVaga.toString().trim()))
                );
                return !preenchido;
            });
            if (camposNaoPreenchidos.length > 0) {
                const nomesCampos = {
                    filial: 'Filial',
                    id_secao: 'Seção',
                    id_funcao: 'Função',
                    centro_custo: 'Centro de Custo',
                    id_horario: 'Horário',
                    dt_admissao: 'Data de Admissão',
                    tipo_admissao: 'Tipo de Admissão',
                    motivo_admissao: 'Motivo de Admissão',
                    tipo_situacao: 'Tipo de Situação',
                    tipo_funcionario: 'Tipo de Funcionário',
                    tipo_recebimento: 'Tipo de Recebimento',
                    jornada: 'Jornada',
                    salario: 'Salário',
                    letra: 'Letra',
                    codigo_situacao_fgts: 'Situação FGTS',
                    codigo_categoria_esocial: 'Categoria eSocial',
                    natureza_atividade_esocial: 'Natureza Atividade eSocial',
                    funcao_confianca: 'Função de Confiança'
                };
                const listaCampos = camposNaoPreenchidos.map(campo => nomesCampos[campo] || campo).join(', ');

                return false;
            }

            return true;
        }

        // Step Educação
        if (activeIndex === getStepEducacaoIndex()) {
            const valor = candidato.grau_instrucao;
            
            if (!valor) {
                return false;
            }
            
            if (typeof valor === 'object') {
                const resultado = valor.id || valor.code;
                return !!resultado; // Força conversão para boolean
            }
            
            const resultado = valor.toString().trim() !== '';
            return resultado;
        }

        // Step Dependentes
        if (activeIndex === getStepDependentesIndex()) {
            const resultado = !verificarDependentesIncompletos();
            return resultado;
        }

        // Para outros steps (habilidades, experiência, anotações), sempre válido
        return true;
    }, [activeIndex, candidato, self, modoLeitura, verificarDependentesIncompletos]);

    const handleValidarStep = () => {
        // Limpa o classError e classInvalid antes de validar
        setClassError([]);
        setClassInvalid([]);
        
        // Executa a validação do step atual para mostrar quais campos estão faltando
        const resultado = validarCamposObrigatoriosStep();
        
        // Mostra um toast informativo
        toast.current.show({
            severity: 'warn',
            summary: 'Campos obrigatórios pendentes',
            detail: 'Os campos obrigatórios não preenchidos foram destacados em vermelho.',
            life: 4000
        });
    };

    // Função para renderizar os botões baseado no step atual
    const renderFooterButtons = useCallback(() => {
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
        
        // Verificar se o step atual está válido
        const stepAtualValido = verificarStepAtualValido();
        
        return (
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: sidebarOpened ? '248px' : '0px', // Ajusta dinamicamente baseado no estado da sidebar
                right: 0,
                background: '#fff',
                borderTop: '1px solid #e0e0e0',
                padding: '16px 24px',
                boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'left 0.3s ease' // Adiciona transição suave
            }}>
                <div style={{ display: 'flex', gap: 12 }}>
                    {/* Botão Voltar - em todos os steps exceto o primeiro */}
                    {!isFirstStep && stepAtualValido && (
                        <Botao size="small" estilo="neutro" aoClicar={handleVoltar}>
                            <HiArrowLeft/> Voltar
                        </Botao>
                    )}
                    {/* Se step inválido, botão voltar fica desabilitado */}
                    {!isFirstStep && !stepAtualValido && (
                        <Botao size="small" estilo="neutro" disabled>
                            <HiArrowLeft/> Voltar
                        </Botao>
                    )}
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: '1', minWidth: '0', justifyContent: 'flex-end' }}>
                    {/* Indicador de carregamento */}
                    {!dadosCarregados && (
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            color: '#6b7280', 
                            fontSize: '14px',
                            fontStyle: 'italic',
                            flexShrink: 0
                        }}>
                            <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid #e5e7eb',
                                borderTop: '2px solid #3b82f6',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            Carregando dados...
                        </div>
                    )}
                    
                    {/* Indicador de step inválido */}
                    {!stepAtualValido && !modoLeitura && (
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            color: '#dc2626', 
                            fontSize: '14px',
                            fontWeight: '500',
                            flex: '1',
                            minWidth: '0',
                            marginRight: '16px'
                        }}>
                            <FaExclamationTriangle size={16} style={{ flexShrink: 0 }} />
                            <span style={{ whiteSpace: 'nowrap' }}>
                                Complete todos os campos obrigatórios para continuar
                            </span>
                        </div>
                    )}
                    
                    {/* Botões específicos por step */}
                    {activeIndex === 0 && stepAtualValido && (
                        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                            <Botao 
                                size="small" 
                                label="Next" 
                                iconPos="right" 
                                aoClicar={handleAvancar}
                                disabled={!dadosCarregados}
                            >
                                <HiArrowRight fill="var(--secundaria)"/> Continuar
                            </Botao>
                        </div>
                    )}
                    
                    {/* Steps intermediários com salvar */}
                    {(activeIndex >= 1 && activeIndex < totalSteps - 1) && (
                        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                            {activeIndex !== getStepDependentesIndex() && (
                                <Botao 
                                    size="small" 
                                    iconPos="right" 
                                    aoClicar={handleSalvarAdmissao}
                                    disabled={modoLeitura || !dadosCarregados || !isDirty}
                                >
                                    <FaSave fill="var(--secundaria)"/> Salvar
                                </Botao>
                            )}
                            <Botao 
                                size="small" 
                                label="Next" 
                                iconPos="right" 
                                aoClicar={handleSalvarEContinuar}
                                disabled={!dadosCarregados || !stepAtualValido}
                            >
                                <HiArrowRight size={20} fill="var(--secundaria)"/> Próximo
                            </Botao>
                        </div>
                    )}
                    
                    {/* Último step (Anotações) */}
                    {isLastStep && stepAtualValido && (
                        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                            <Botao 
                                size="small" 
                                iconPos="right" 
                                aoClicar={handleSalvarAdmissao}
                                disabled={modoLeitura || !dadosCarregados || !isDirty}
                            >
                                <FaSave fill="var(--secundaria)"/> Salvar
                            </Botao>
                            {self ? (
                                <Botao 
                                    iconPos="right" 
                                    aoClicar={handleAceitarLGPD}
                                    disabled={candidato.aceite_lgpd || modoLeitura}
                                >
                                    <FaSave fill="var(--secundaria)"/> {candidato.aceite_lgpd ? 'Termo Aceito' : 'Aceitar e Finalizar'}
                                </Botao>
                            ) : (
                                <Botao 
                                    size="small" 
                                    label="Next" 
                                    iconPos="right" 
                                    aoClicar={handleFinalizarDocumentos}
                                    disabled={!podeFinalizar}
                                >
                                    <RiExchangeFill fill="var(--secundaria)"/> Finalizar
                                </Botao>
                            )}
                        </div>
                    )}
                    
                    {/* Botão Validar - aparece quando step não está válido */}
                    {!stepAtualValido && !modoLeitura && (
                        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                            <Botao 
                                size="small" 
                                iconPos="right" 
                                aoClicar={() => {
                                    handleValidarStep();
                                }}
                                disabled={!dadosCarregados}
                            >
                                <FaExclamationTriangle fill="var(--error)" /> Validar
                            </Botao>
                        </div>
                    )}
                </div>
            </div>
        );
    }, [activeIndex, dadosCarregados, isVisible, sidebarOpened, self, mostrarHabilidades, mostrarExperiencia, modoLeitura, obterTarefaPendente, handleVoltar, handleAvancar, handleSalvarEContinuar, handleSalvarAdmissao, handleFinalizarDocumentos, verificarStepAtualValido, isDirty]);

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
            const payloadStepAtual = obterPayloadStepAtual();
            const salvamentoSucesso = await executarSalvamento(null, payloadStepAtual);
            
            if (salvamentoSucesso === false) {
                // ❌ ERRO DE VALIDAÇÃO - NÃO CONTINUA
                return;
            }
            
            if (acaoSalvamento === 'salvar_continuar') {
                stepperRef.current.nextCallback();
                setActiveIndex(prev => prev + 1);
            }
        } catch (error) {
            // O toast de erro já foi exibido na função executarSalvamento
        }
    };



    const handleCancelarDependentes = () => {
        setShowConfirmacaoDependentes(false);
    };

    const handleRemoverDependentesESalvar = async () => {
        setShowConfirmacaoDependentes(false);

        // Filtra para manter apenas os dependentes já salvos (com ID)
        const dependentesMantidos = candidato.dependentes.filter(dep => dep.id);
        const candidatoAtualizado = { ...candidato, dependentes: dependentesMantidos };

        // Atualiza o estado do contexto para refletir a remoção na UI
        setCandidato(candidatoAtualizado);

        // Executa o salvamento com payload específico do step atual
        const payloadStepAtual = obterPayloadStepAtual();
        const salvamentoSucesso = await executarSalvamento(candidatoAtualizado, payloadStepAtual);
        
        if (salvamentoSucesso === false) {
            // ❌ ERRO DE VALIDAÇÃO - NÃO CONTINUA
            return;
        }

        if (acaoSalvamento === 'salvar_continuar') {
            stepperRef.current.nextCallback();
            setActiveIndex(prev => prev + 1);
        }
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
            
            const compressedFile = await imageCompression(file, options);
            
            // Garantir que o nome do arquivo seja preservado
            const finalFile = new File([compressedFile], file.name, {
                type: compressedFile.type,
                lastModified: Date.now(),
            });
            
            return finalFile;
        } catch (error) {
            console.error('Erro ao compactar imagem:', error);
            // Se falhar a compactação, retorna o arquivo original
            return file;
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            // Abrir modal de corte em vez de fazer upload direto
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                setShowCropModal(true);
                setShowCropSelection(false);
                setIsCropped(false);
                setCroppedImageSrc('');
                setHasCropChanged(false); // Resetar no início
            };
            reader.readAsDataURL(file);
        } else {
            toast.current.show({ 
                severity: 'warn', 
                summary: 'Atenção', 
                detail: 'Por favor, selecione um arquivo de imagem válido.', 
                life: 3000 
            });
        }
    };

    // Função para ser chamada pelo StepDocumentos
    const handleImageUploadFromStep = (file) => {
        if (file && file.type.match('image.*')) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                setShowCropModal(true);
                setShowCropSelection(false);
                setIsCropped(false);
                setCroppedImageSrc('');
                setHasCropChanged(false);
            };
            reader.readAsDataURL(file);
        }
    };

    // Função para abrir modal de visualização da imagem
    const handleShowImageModal = () => {
        setShowImageModal(true);
    };

    const handleCropChange = (crop, percentCrop) => {
        setCrop(percentCrop);
        setHasCropChanged(true); // Usuário interagiu
    };

    const handleCropComplete = (crop, percentCrop) => {
        // Forçar proporção quadrada (1:1)
        if (crop && crop.width && crop.height) {
            const size = Math.min(crop.width, crop.height);
            const squareCrop = {
                ...crop,
                width: size,
                height: size
            };
            setCrop(squareCrop);
        } else {
            setCrop(crop);
        }
    };

    // Garantir que a seleção inicial seja sempre quadrada
    useEffect(() => {
        if (showCropSelection && !isCropped) {
            // Forçar seleção quadrada inicial
            const squareCrop = {
                unit: '%',
                width: 70,
                height: 70,
                x: 15,
                y: 15
            };
            setCrop(squareCrop);
        }
    }, [showCropSelection, isCropped]);

    const handleZoomChange = (e) => {
        setScale(parseFloat(e.target.value));
    };

    const handleRotationChange = (e) => {
        setRotation(parseInt(e.target.value));
    };

    const handleRotateLeft = () => {
        setRotation(prev => prev - 90);
    };

    const handleRotateRight = () => {
        setRotation(prev => prev + 90);
    };

    const handleReset = () => {
        setCrop({
            unit: '%',
            width: 80,
            height: 80,
            x: 10,
            y: 10
        });
    };

    const applyCrop = async () => {
        if (!hasCropChanged) {
            toast.current.show({ 
                severity: 'info', 
                summary: 'Aviso', 
                detail: 'Mova ou redimensione a seleção para aplicar o corte.', 
                life: 3000 
            });
            return;
        }

        if (!imageRef || !crop.width || !crop.height) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Por favor, selecione uma área para cortar.', 
                life: 3000 
            });
            return;
        }

        try {
            const outputSize = 400; // Tamanho final da imagem
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = outputSize;
            canvas.height = outputSize;
            
            // Aguardar a imagem carregar completamente
            await new Promise((resolve) => {
                if (imageRef.complete) {
                    resolve();
                } else {
                    imageRef.onload = resolve;
                }
            });
            
            // Obter as dimensões reais da imagem
            const naturalWidth = imageRef.naturalWidth;
            const naturalHeight = imageRef.naturalHeight;
            
            // Obter as dimensões visuais da imagem no DOM
            const displayWidth = imageRef.offsetWidth;
            const displayHeight = imageRef.offsetHeight;
            
            // Calcular a proporção entre dimensões reais e visuais
            const scaleX = naturalWidth / displayWidth;
            const scaleY = naturalHeight / displayHeight;
            
            // Calcular as dimensões do crop em pixels reais baseadas na seleção visual
            const cropWidth = crop.width * scaleX;
            const cropHeight = crop.height * scaleY;
            const cropX = crop.x * scaleX;
            const cropY = crop.y * scaleY;
            
            // Preencher o canvas com fundo branco
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, outputSize, outputSize);
            
            // Desenhar a área selecionada, redimensionada para preencher todo o canvas
            ctx.drawImage(
                imageRef,
                cropX,
                cropY,
                cropWidth,
                cropHeight,
                0,
                0,
                outputSize,
                outputSize
            );
            
            // Converter canvas para blob e criar URL
            canvas.toBlob((blob) => {
                if (blob) {
                    const croppedImageUrl = URL.createObjectURL(blob);
                    setCroppedImageSrc(croppedImageUrl);
                    setIsCropped(true);
                    setShowCropSelection(false);
                    
                    toast.current.show({ 
                        severity: 'success', 
                        summary: 'Sucesso', 
                        detail: 'Corte aplicado! Clique em "Salvar" para fazer upload.', 
                        life: 3000 
                    });
                }
            }, selectedFile.type, 0.9);
            
        } catch (erro) {
            console.error("Erro ao aplicar corte:", erro);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Falha ao aplicar o corte.', 
                life: 3000 
            });
        }
    };

    const handleCropImage = async () => {
        setUploading(true);

        try {
            let fileToUpload;
            let detail;

            if (isCropped && croppedImageSrc) {
                // Upload da imagem cortada
                const response = await fetch(croppedImageSrc);
                const blob = await response.blob();
                fileToUpload = new File([blob], selectedFile.name, { type: selectedFile.type });
                detail = 'Imagem cortada e atualizada com sucesso!';
            } else {
                // Upload da imagem inteira
                fileToUpload = selectedFile;
                detail = 'Imagem atualizada com sucesso!';
            }
            
            // Compactar a imagem
            const compressedFile = await compressImage(fileToUpload);
            
            const formData = new FormData();
            formData.append('imagem', compressedFile);
            
            const uploadResponse = await http.put(`admissao/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            setCandidato(prev => ({ ...prev, imagem: uploadResponse.imagem }));
            
            // Mostrar toast de sucesso com informações de compactação
            const originalSize = (fileToUpload.size / 1024 / 1024).toFixed(2);
            const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
            const reduction = ((1 - compressedFile.size / fileToUpload.size) * 100).toFixed(1);
            
            const finalDetail = originalSize !== compressedSize 
                ? `${detail} Reduzida de ${originalSize}MB para ${compressedSize}MB (${reduction}% menor)`
                : detail;
            
            toast.current.show({ 
                severity: 'success', 
                summary: 'Sucesso', 
                detail: finalDetail, 
                life: 4000 
            });
            
            // Fechar modal e limpar estados
            setShowCropModal(false);
            setSelectedFile(null);
            setImageSrc('');
            setCroppedImageSrc('');
            setIsCropped(false);
            setShowCropSelection(false);
            setCrop({
                unit: '%',
                width: 80,
                height: 80,
                x: 10,
                y: 10
            });
            setScale(1);
            setRotation(0);
            
        } catch (erro) {
            console.error("Erro ao fazer upload da imagem:", erro);
            
            // Verifica se o erro tem o formato específico da API
            if (erro.response && erro.response.data && erro.response.data.admissao_errors) {
                const admissaoErrors = erro.response.data.admissao_errors;
                
                // Processa os erros para exibir no toast
                const errosFormatados = Object.entries(admissaoErrors).map(([campo, mensagens]) => {
                    const mensagem = Array.isArray(mensagens) ? mensagens.join(', ') : mensagens;
                    return `${campo}: ${mensagem}`;
                }).join('\n');
                
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro de Validação',
                    detail: errosFormatados,
                    life: 5000
                });
                
                // Atualiza o estado de erro para destacar os campos com problema
                const camposComErro = Object.keys(admissaoErrors);
                setClassError(camposComErro);
                // Limpa campos inválidos quando há erro de validação da API
                setClassInvalid([]);
                
            } else {
                let errorMessage = 'Falha ao fazer upload da imagem.';
                
                if (erro.response?.data?.detail) {
                    errorMessage = erro.response.data.detail;
                } else if (erro.message) {
                    errorMessage = erro.message;
                }
                
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Erro no Upload', 
                    detail: errorMessage, 
                    life: 5000 
                });
            }
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            if (modalFileInputRef.current) modalFileInputRef.current.value = '';
        }
    };

    const handleCancelCrop = () => {
        setShowCropModal(false);
        setSelectedFile(null);
        setImageSrc('');
        setCroppedImageSrc('');
        setIsCropped(false);
        setShowCropSelection(false);
        setCrop({
            unit: '%',
            width: 80,
            height: 80,
            x: 10,
            y: 10
        });
        setScale(1);
        setRotation(0);
        // Limpar ambos os inputs de arquivo para permitir a mesma seleção novamente
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (modalFileInputRef.current) modalFileInputRef.current.value = '';
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
            
            // Verifica se o erro tem o formato específico da API
            if (erro.response && erro.response.data && erro.response.data.admissao_errors) {
                const admissaoErrors = erro.response.data.admissao_errors;
                
                // Processa os erros para exibir no toast
                const errosFormatados = Object.entries(admissaoErrors).map(([campo, mensagens]) => {
                    const mensagem = Array.isArray(mensagens) ? mensagens.join(', ') : mensagens;
                    return `${campo}: ${mensagem}`;
                }).join('\n');
                
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro de Validação',
                    detail: errosFormatados,
                    life: 5000
                });
                
                // Atualiza o estado de erro para destacar os campos com problema
                const camposComErro = Object.keys(admissaoErrors);
                setClassError(camposComErro);
                // Limpa campos inválidos quando há erro de validação da API
                setClassInvalid([]);
                
            } else {
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Erro', 
                    detail: 'Falha ao remover a imagem.', 
                    life: 3000 
                });
            }
        });
    };

    // Funções para gerar payloads específicos por step
    const gerarPayloadStepDocumentos = () => {
        // Step 0 - Documentos: não envia dados específicos, apenas valida
        return {};
    };

    const gerarPayloadStepDadosPessoais = () => {
        // Step 1 - Dados Pessoais
        const payload = {
            nome: candidato.nome,
            email: candidato.email,
            email_pessoal: candidato.email_pessoal,
            telefone: candidato.telefone,
            ddi: candidato.ddi,
            ddd: candidato.ddd,
            cpf: candidato.cpf ? candidato.cpf.replace(/\D/g, '').substring(0, 11) : '',
            dt_nascimento: candidato.dt_nascimento,
            nome_mae: candidato.nome_mae,
            nome_pai: candidato.nome_pai,
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
            // Endereço
            cep: candidato.cep,
            rua: candidato.rua,
            numero: candidato.numero,
            complemento: candidato.complemento,
            bairro: candidato.bairro,
            tipo_rua: candidato.tipo_rua,
            tipo_bairro: candidato.tipo_bairro,
            cidade: candidato.cidade,
            estado: candidato.estado,
            pais: candidato.pais,
            // Documentos
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
            identidade: candidato.identidade,
            uf_identidade: candidato.uf_identidade,
            dt_opcao_fgts: candidato.dt_opcao_fgts,
            codigo_situacao_fgts: candidato.codigo_situacao_fgts,
            numero_cartao_sus: candidato.numero_cartao_sus || candidato.nrosus,
            certificado_reservista: candidato.certificado_reservista,
            numero_passaporte: candidato.numero_passaporte,
            data_emissao_passaporte: candidato.data_emissao_passaporte,
            data_validade_passaporte: candidato.data_validade_passaporte,
            rnm: candidato.rnm,
            uf_emissor_rnm: candidato.uf_emissor_rnm,
            data_emissao_rnm: candidato.data_emissao_rnm,
            data_vencimento_rnm: candidato.data_vencimento_rnm,
            decreto_imigracao: candidato.decreto_imigracao,
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
            ddi1: candidato.ddi1,
            ddi2: candidato.ddi2,
            ddd1: candidato.ddd1,
            ddd2: candidato.ddd2,
            // PIS/PASEP
            pispasep: candidato.pispasep
        };
        
        return payload;
    };

    const gerarPayloadStepDadosBancarios = () => {
        // Step 2 - Dados Bancários
        const payload = {
            banco: candidato.banco,
            agencia: candidato.agencia,
            agencia_nova: candidato.agencia_nova,
            conta_corrente: candidato.conta_corrente,
            tipo_conta: candidato.tipo_conta,
            conta_operacao: candidato.conta_operacao,
            pix: candidato.pix,
            pix_tipo: candidato.pix_tipo
        };
        
        return payload;
    };

    const gerarPayloadStepDadosContratuais = () => {
        // Step 3 - Dados Contratuais (apenas se não for self)
        if (self) return {};
        
        const dadosVaga = candidato.dados_vaga || {};
        
        return {
            // Dados básicos da admissão
            chapa: candidato.chapa,
            dt_admissao: candidato.dt_admissao,
            jornada: candidato.jornada,
            status: candidato.status,
            grau_instrucao: candidato.grau_instrucao,
            confianca: candidato.confianca,
            funcao_confianca: candidato.funcao_confianca,
            // Dados da vaga - apenas se foram explicitamente selecionados pelo usuário
            // Para centro de custo, prioriza o campo direto do candidato, depois dados_vaga
            ...(candidato.centro_custo ? { centro_custo: candidato.centro_custo } : (dadosVaga?.centro_custo_id ? { centro_custo: dadosVaga.centro_custo_id } : {})),
            // Para filial, prioriza o campo direto do candidato, depois dados_vaga
            ...(candidato.filial ? { filial: candidato.filial } : (dadosVaga?.filial_id ? { filial: dadosVaga.filial_id } : {})),
            ...(dadosVaga?.departamento_id ? { departamento: dadosVaga.departamento_id } : {}),
            // Para seção, prioriza o campo direto do candidato, depois dados_vaga
            ...(candidato.id_secao ? { id_secao: candidato.id_secao } : (dadosVaga?.secao_id ? { id_secao: dadosVaga.secao_id } : {})),
            // Para função, prioriza o campo direto do candidato, depois dados_vaga
            ...(candidato.id_funcao ? { id_funcao: candidato.id_funcao } : (dadosVaga?.funcao_id ? { id_funcao: dadosVaga.funcao_id } : {})),
            ...(dadosVaga?.cargo_id ? { cargo: dadosVaga.cargo_id } : {}),
            ...(candidato.id_horario ? { id_horario: candidato.id_horario } : (dadosVaga?.horario_id ? { id_horario: dadosVaga.horario_id } : {})),
            // Para horário, prioriza o campo direto do candidato, depois dados_vaga
            ...(candidato.id_horario ? { horario: candidato.id_horario } : (dadosVaga?.horario_id ? { horario: dadosVaga.horario_id } : {})),
            ...(dadosVaga?.sindicato_id ? { sindicato: dadosVaga.sindicato_id } : {}),
            // Dados adicionais
            tipo_admissao: candidato.tipo_admissao,
            codigo_ficha_registro: candidato.codigo_ficha_registro,
            codigo_situacao_fgts: candidato.codigo_situacao_fgts,
            codigo_jornada: candidato.codigo_jornada,
            tipo_funcionario: candidato.tipo_funcionario,
            // Novos campos
            natureza_esocial: candidato.natureza_esocial,
            codigo_ocorrencia_sefip: candidato.codigo_ocorrencia_sefip,
            codigo_categoria_sefip: candidato.codigo_categoria_sefip,
            motivo_admissao: candidato.motivo_admissao,
            indicativo_admissao: candidato.indicativo_admissao,
            codigo_categoria_esocial: candidato.codigo_categoria_esocial,
            tipo_regime_trabalhista: candidato.tipo_regime_trabalhista,
            funcao_emprego_cargoacumulavel: candidato.funcao_emprego_cargoacumulavel,
            tipo_recebimento: candidato.tipo_recebimento,
            mensal: candidato.mensal,
            calcula_inss: candidato.calcula_inss,
            calcula_irrf: candidato.calcula_irrf,
            letra: candidato.letra,
            contrato_tempo_parcial: candidato.contrato_tempo_parcial,
            tipo_regime_jornada: candidato.tipo_regime_jornada,
            tipo_situacao: candidato.tipo_situacao,
            tipo_regime_previdenciario: candidato.tipo_regime_previdenciario,
            tipo_contrato_prazo_determinado: candidato.tipo_contrato_prazo_determinado,
            tipo_contrato_trabalho: candidato.tipo_contrato_trabalho,
            natureza_atividade_esocial: candidato.natureza_atividade_esocial,
            // Dados adicionais
            perc_adiantamento: (() => {
                let perc = candidato.perc_adiantamento;
                if (typeof perc === 'string') {
                    perc = perc.replace('%', '').replace(',', '.').trim();
                    if (perc !== '') perc = parseFloat(perc);
                }
                return isNaN(perc) ? null : perc;
            })(),
            ajuda_custo: formatarSalario(candidato.ajuda_custo),
            arredondamento: formatarSalario(candidato.arredondamento),
            media_sal_maternidade: formatarSalario(candidato.media_sal_maternidade),
            // Salário
            salario: formatarSalario(candidato.salario)
        };
        
        
        return payload;
    };

    const gerarPayloadStepEducacao = () => {
        // Step 4 - Educação
        const payload = {
            grau_instrucao: candidato.grau_instrucao
        };
        
        return payload;
    };

    const gerarPayloadStepDependentes = () => {
        // Step Dependentes: não envia dados específicos, apenas valida
        const payload = {};
        
        return payload;
    };

    const gerarPayloadStepAnotacoes = () => {
        // Step Anotações
        return {
            anotacoes: candidato.anotacoes || ''
        };
    };

    const gerarPayloadStepLGPD = () => {
        // Step LGPD
        return {
            aceite_lgpd: candidato.aceite_lgpd
        };
    };

    // Função para obter o payload específico baseado no step atual
    const obterPayloadStepAtual = () => {
        switch (activeIndex) {
            case 0: // Documentos
                return gerarPayloadStepDocumentos();
            case 1: // Dados Pessoais
                return gerarPayloadStepDadosPessoais();
            case 2: // Dados Bancários
                return gerarPayloadStepDadosBancarios();
            case 3: // Dados Contratuais
                return gerarPayloadStepDadosContratuais();
            case getStepEducacaoIndex(): // Educação
                return gerarPayloadStepEducacao();
            case getStepDependentesIndex(): // Dependentes
                return gerarPayloadStepDependentes();
            default:
                // Para outros steps (habilidades, experiência, etc.)
                return {};
        }
    };

    return (
        <>
        <Toast ref={toast} style={{ zIndex: '99999!important' }} />
        <ConfirmDialog  />
        <ConteudoFrame>
            
            {/* Estilo para desabilitar navegação manual pelo header do stepper, mas permitir navegação programática */}
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
                    
                    /* Permitir navegação programática quando necessário */
                    .p-stepper-header.navegacao-programatica {
                        pointer-events: auto !important;
                    }
                    .p-stepper-header.navegacao-programatica * {
                        pointer-events: auto !important;
                    }
                    
                    /* Estilos para modo leitura */
                    .modo-leitura input,
                    .modo-leitura select,
                    .modo-leitura textarea {
                        background-color: #f5f5f5 !important;
                        color: #666 !important;
                        cursor: not-allowed !important;
                        opacity: 0.9 !important;
                    }
                    
                    .modo-leitura input:disabled,
                    .modo-leitura select:disabled,
                    .modo-leitura textarea:disabled {
                        background-color: #f5f5f5 !important;
                        color: #666 !important;
                        cursor: not-allowed !important;
                        opacity: 0.9 !important;
                    }
                    
                    .modo-leitura .p-dropdown {
                        background-color: #f5f5f5 !important;
                        opacity: 0.9 !important;
                        pointer-events: none !important;
                    }
                    
                    .modo-leitura .p-dropdown-label {
                        color: #666 !important;
                    }
                    
                    .modo-leitura .p-calendar {
                        opacity: 0.9 !important;
                        pointer-events: none !important;
                    }
                    
                    .modo-leitura .p-calendar input {
                        background-color: #f5f5f5 !important;
                        color: #666 !important;
                        cursor: not-allowed !important;
                    }
                    
                    .modo-leitura .p-checkbox {
                        opacity: 0.9 !important;
                        pointer-events: none !important;
                    }
                    
                    .modo-leitura .p-switch {
                        opacity: 0.9 !important;
                        pointer-events: none !important;
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    /* Estilos customizados para ConfirmDialog */
                    .p-confirm-dialog-message {
                        margin-left: 1rem !important;
                    }
                    
                    .p-confirm-dialog-icon {
                        margin-right: 0.5rem !important;
                    }
                    
                    .p-confirm-dialog-content {
                        display: flex !important;
                        align-items: flex-start !important;
                        gap: 0.75rem !important;
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
                    zIndex: 10
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
                                                    <RiUpload2Fill fill="var(--white)"/>
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
                                        opacity: 1
                                    }}>
                                        {finalizada ? 'Admissão Finalizada' : 'Preenchimento Concluído'}
                                    </span>
                                    
                                    {/* Warning para erros nas tarefas */}
                                    {verificarErrosTarefas() && (
                                        <button
                                            onClick={() => {
                                                const erros = verificarErrosTarefas();
                                                if (erros && erros.length > 0) {
                                                    abrirHistoricoTarefa(erros[0].tarefa);
                                                }
                                            }}
                                            style={{
                                                background: 'rgba(220, 53, 69, 0.2)',
                                                border: '1px solid rgba(220, 53, 69, 0.4)',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                marginLeft: '4px',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'rgba(220, 53, 69, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'rgba(220, 53, 69, 0.2)';
                                            }}
                                            title="Erro detectado nas tarefas. Clique para ver detalhes."
                                        >
                                            <FaExclamation size={10} fill="white" />
                                        </button>
                                    )}
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
                                    opacity: 1
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
                            

                        </div>
                    </div>
                </div>
            )}

            <div className={modoLeitura ? 'modo-leitura' : ''}> {/* Espaço para o footer fixo */}
                <Stepper 
                    headerPosition="top" 
                    ref={stepperRef} 
                    className="custom-stepper"
                    activeIndex={activeIndex}
                >
                    <StepperPanel header="Anexos">
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
                                    <StepDadosPessoais 
                                        nacionalidades={nacionalidades}
                                        classError={classError} 
                                        setClassError={setClassError}
                                        classInvalid={classInvalid}
                                        setClassInvalid={setClassInvalid}
                                        paises={paises}
                                        modoLeitura={modoLeitura} 
                                        opcoesDominio={opcoesDominio}
                                    />
                                </ScrollPanel>
                            </div>
                        </Container>
                    </StepperPanel>
                    
                    <StepperPanel header="Dados Bancários">
                        <Container padding={'0'} gap="10px">
                            <div className={styles.containerDadosPessoais} style={{ position: 'relative' }}>
                                <ScrollPanel className="responsive-scroll-panel" style={{ marginBottom: 10 }}>
                                    <StepDadosBancarios modoLeitura={modoLeitura} classError={classError} setClassError={setClassError} classInvalid={classInvalid} setClassInvalid={setClassInvalid} />
                                </ScrollPanel>
                            </div>
                        </Container>
                    </StepperPanel>
                    
                    {!self && (
                        <StepperPanel header="Dados Contratuais">
                            <Container padding={'0'}>
                                <div className={styles.containerDadosPessoais} style={{ position: 'relative' }}>
                                    <ScrollPanel className="responsive-scroll-panel" style={{ marginBottom: 10 }}>
                                        <StepVaga 
                                            filiais={filiais}
                                            departamentos={departamentos}
                                            secoes={secoes}
                                            buscarSecoesPorFilial={buscarSecoesPorFilial}
                                            cargos={cargos}
                                            centros_custo={centros_custo}
                                            horarios={horarios}
                                            funcoes={funcoes}
                                            funcoes_confianca={funcoes_confianca}
                                            sindicatos={sindicatos}
                                            modoLeitura={modoLeitura}
                                            opcoesDominio={opcoesDominio}
                                            availableDominioTables={availableDominioTables}
                                            classError={classError}
                                            setClassError={setClassError}
                                            classInvalid={classInvalid}
                                            setClassInvalid={setClassInvalid}
                                            marcarCampoSelecionado={marcarCampoSelecionado}
                                        />
                                    </ScrollPanel>
                                </div>
                            </Container>
                        </StepperPanel>
                    )}
                    
                    <StepperPanel header="Escolaridade">
                        <ScrollPanel className="responsive-scroll-panel">
                            <div style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                                <ScrollPanel className="responsive-inner-scroll">
                                    <StepEducacao modoLeitura={modoLeitura} classError={classError} setClassError={setClassError} classInvalid={classInvalid} setClassInvalid={setClassInvalid} />
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
                        <Container padding={'0'} gap="10px">
                            <div className={styles.containerDadosPessoais} style={{ position: 'relative' }}>
                                <ScrollPanel className="responsive-scroll-panel" style={{ marginBottom: 10 }}>
                                    <ScrollPanel className="responsive-inner-scroll">
                                        <StepDependentes classError={classError} setClassError={setClassError} classInvalid={classInvalid} setClassInvalid={setClassInvalid} modoLeitura={modoLeitura} toast={toast} />
                                    </ScrollPanel>
                            </ScrollPanel>
                            </div>
                        </Container>
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
        </ConteudoFrame>

        {/* Modal de confirmação */}
        {showModalConfirmacao && (
            <ModalOverlay onClick={handleOverlayClick}>
                <ModalContainer>
                    <ModalHeader>
                        <ModalTitle>
                            <HiCheckCircle fill="var(--secundaria)" /> Confirmação de Finalização
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
                                
                                // analista_tenant=RH
                                // analista=Outsourcing
                                const perfil = ArmazenadorToken.UserProfile;
                                
                                if (tarefaPendente?.tipo_codigo === 'aguardar_documento') {
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
                                } else if (tarefaPendente?.tipo_codigo === 'integrar_admissao_correcao') {
                                    return (
                                        <>
                                            Após esta confirmação, será realizada uma nova <strong>integração do colaborador</strong> <strong>{candidato?.nome || 'Candidato'}</strong> ao sistema.
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
                            <HiCheckCircle fill="var(--secundaria)" /> Sim, finalizar
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
                            <HiCheckCircle fill="var(--secundaria)" /> Confirmação de Salvamento de Dependentes
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
                        <ModalButton className="danger" onClick={handleRemoverDependentesESalvar}>
                            <FaTrash fill="var(--error)" /> Remover
                        </ModalButton>
                        <ModalButton className="primary" onClick={handleConfirmarDependentes}>
                            <HiCheckCircle size={20} fill="var(--white)" /> Sim, salvar dependentes
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
                                    ref={modalFileInputRef}
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                    id="candidato-image-change"
                                />
                                <ImageModalButton onClick={() => modalFileInputRef.current.click()}>
                                    <RiUpload2Fill /> Alterar Imagem
                                </ImageModalButton>
                                <ImageModalButton className="danger" onClick={handleRemoveImage}>
                                    <HiX fill="var(--white)" /> Remover Imagem
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

        {/* Modal de Corte de Imagem */}
        {showCropModal && (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10001,
                padding: '20px'
            }} onClick={(e) => {
                if (e.target === e.currentTarget) {
                    handleCancelCrop();
                }
            }}>
                <div style={{
                    background: '#fff',
                    borderRadius: '12px',
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    width: '800px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <h3 style={{ margin: 0, color: '#374151', fontSize: '18px' }}>
                            Cortar Imagem
                        </h3>
                        <button
                            onClick={handleCancelCrop}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#6b7280',
                                padding: '4px',
                                borderRadius: '4px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#374151'}
                            onMouseLeave={(e) => e.target.style.color = '#6b7280'}
                        >
                            ×
                        </button>
                    </div>

                    {/* Content */}
                    <div style={{
                        padding: '20px',
                        display: 'flex',
                        gap: '20px',
                        flex: 1,
                        minHeight: 0
                    }}>
                        {/* Área de Imagem Original */}
                        <div style={{
                            flex: showCropSelection && !isCropped ? 0.5 : 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f9fafb',
                            borderRadius: '8px',
                            padding: '20px',
                            minHeight: '400px'
                        }}>
                            {showCropSelection && !isCropped && (
                                <div style={{
                                    marginBottom: '10px',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color: '#374151'
                                }}>
                                    📷 Imagem Original
                                </div>
                            )}
                            {isCropped ? (
                                // Mostrar imagem cortada
                                <img
                                    src={croppedImageSrc}
                                    alt="Imagem cortada"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        borderRadius: '8px'
                                    }}
                                />
                            ) : (
                                // Mostrar imagem original
                                <img
                                    ref={setImageRef}
                                    src={imageSrc}
                                    alt="Imagem para cortar"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            )}
                        </div>
                        
                        {/* Área de Seleção de Corte */}
                        {showCropSelection && !isCropped && (
                            <div style={{
                                flex: 0.5,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#f0f9ff',
                                borderRadius: '8px',
                                padding: '20px',
                                minHeight: '400px',
                                border: '2px dashed #0ea5e9'
                            }}>
                                <div style={{
                                    marginBottom: '10px',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color: '#0ea5e9'
                                }}>
                                    ✂️ Área de Seleção
                                </div>
                                <ReactCrop
                                    crop={crop}
                                    onChange={handleCropChange}
                                    onComplete={handleCropComplete}
                                    aspect={1}
                                    minWidth={50}
                                    minHeight={50}
                                    maxWidth={90}
                                    maxHeight={90}
                                    keepSelection
                                    locked={false}
                                    ruleOfThirds
                                >
                                    <img
                                        src={imageSrc}
                                        alt="Imagem para cortar"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </ReactCrop>
                            </div>
                        )}

                        {/* Controles */}
                        <div style={{
                            width: '250px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            {!isCropped ? (
                                // Controles para imagem original
                                <>
                                    {!showCropSelection ? (
                                        // Botão para ativar seleção de corte
                                        <button
                                            onClick={() => setShowCropSelection(true)}
                                            style={{
                                                width: '100%',
                                                background: '#374151',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '12px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                color: '#fff',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = '#1f2937'}
                                            onMouseLeave={(e) => e.target.style.background = '#374151'}
                                        >
                                            ✂️ Cortar
                                        </button>
                                    ) : (
                                        // Controles quando seleção está ativa
                                        <>
                                            <button
                                                onClick={applyCrop}
                                                disabled={!hasCropChanged}
                                                style={{
                                                    width: '100%',
                                                    background: !hasCropChanged ? '#9ca3af' : '#059669',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    padding: '12px',
                                                    cursor: !hasCropChanged ? 'not-allowed' : 'pointer',
                                                    fontSize: '14px',
                                                    color: '#fff',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (hasCropChanged) e.target.style.background = '#047857';
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (hasCropChanged) e.target.style.background = '#059669';
                                                }}
                                            >
                                                ✅ Aplicar Corte
                                            </button>
                                            
                                            <button
                                                onClick={() => setShowCropSelection(false)}
                                                style={{
                                                    width: '100%',
                                                    background: '#f3f4f6',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '6px',
                                                    padding: '10px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                                                onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                                            >
                                                🔄 Resetar Seleção
                                            </button>
                                        </>
                                    )}
                                    
                                    {/* Instruções */}
                                    <div style={{
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        fontSize: '13px',
                                        color: '#6b7280',
                                        lineHeight: '1.5'
                                    }}>
                                        <strong style={{ color: '#374151' }}>Como usar:</strong><br/>
                                        {!showCropSelection ? (
                                            <>
                                                • Clique em "Ativar Seleção de Corte" para cortar<br/>
                                                • Ou clique em "Salvar" para usar a imagem inteira
                                            </>
                                        ) : (
                                            <>
                                                • Arraste para selecionar a área quadrada (1:1)<br/>
                                                • A seleção mantém sempre proporção quadrada<br/>
                                                • Clique em "Aplicar Corte" para ver o resultado<br/>
                                                • Ou clique em "Resetar" para cancelar
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : (
                                // Controles para imagem cortada
                                <>
                                    <button
                                        onClick={() => {
                                            setIsCropped(false);
                                            setCroppedImageSrc('');
                                            setShowCropSelection(false);
                                        }}
                                        style={{
                                            width: '100%',
                                            background: '#f3f4f6',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            padding: '10px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                                        onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                                    >
                                        🔄 Voltar e Editar
                                    </button>
                                    
                                    {/* Instruções */}
                                    <div style={{
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        fontSize: '13px',
                                        color: '#6b7280',
                                        lineHeight: '1.5'
                                    }}>
                                        <strong style={{ color: '#374151' }}>Corte aplicado!</strong><br/>
                                        • Clique em "Salvar" para fazer upload<br/>
                                        • Ou clique em "Voltar e Editar" para ajustar
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                        padding: '16px 20px',
                        borderTop: '1px solid #e5e7eb',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '12px'
                    }}>
                        <button
                            onClick={handleCancelCrop}
                            style={{
                                background: '#f3f4f6',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                padding: '10px 16px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                            onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                        >
                            × Cancelar
                        </button>
                        <button
                            onClick={handleCropImage}
                            disabled={uploading || (showCropSelection && !isCropped)}
                            style={{
                                background: uploading || (showCropSelection && !isCropped) ? '#9ca3af' : '#374151',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '10px 16px',
                                cursor: uploading || (showCropSelection && !isCropped) ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (!uploading && !(showCropSelection && !isCropped)) e.target.style.background = '#1f2937';
                            }}
                            onMouseLeave={(e) => {
                                if (!uploading && !(showCropSelection && !isCropped)) e.target.style.background = '#374151';
                            }}
                        >
                            {uploading ? (
                                <>
                                    <div style={{
                                        border: '2px solid white',
                                        borderTop: '2px solid transparent',
                                        borderRadius: '50%',
                                        width: '16px',
                                        height: '16px',
                                        animation: 'spin 1s linear infinite'
                                    }}></div>
                                    Processando...
                                </>
                            ) : (
                                <>
                                    <HiCheckCircle fill="var(--secundaria)" /> 
                                    {showCropSelection && !isCropped ? 'Aplique ou cancele o corte' : (isCropped ? 'Salvar' : 'Salvar Imagem Original')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}
        {/* Modal de Histórico de Tarefa */}
        <ModalHistoricoTarefa 
            opened={showHistoricoTarefa}
            aoFechar={() => setShowHistoricoTarefa(false)}
            tarefa={null}
            logs={selectedTarefaLogs}
        />
        </>
    );
};

export default function Wrapper() {
    return (
        <CandidatoProvider>
            <CandidatoRegistro />
        </CandidatoProvider>
    );
}
