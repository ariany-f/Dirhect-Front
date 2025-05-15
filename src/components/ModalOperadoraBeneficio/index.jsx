import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import CheckboxContainer from '@components/CheckboxContainer'
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import DropdownItens from "@components/DropdownItens"
import { RiCloseFill } from 'react-icons/ri'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import http from "@http"
import styled from "styled-components"
import styles from './ModalAdicionarDepartamento.module.css'
import { useDepartamentoContext } from "@contexts/Departamento"
import IconeBeneficio from '@components/IconeBeneficio';
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import { useTranslation } from "react-i18next"
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
function ModalOperadoraBeneficios({ opened = false, aoClicar, aoFechar, aoSucesso, aoSalvar, beneficiosOperadora = [] }) {
    
    const [classError, setClassError] = useState([]);
    const [beneficios, setBeneficios] = useState([]);
    const [dropdownBeneficios, setDropdownBeneficios] = useState([]);
    const [beneficio, setBeneficio] = useState(null);
    const { t } = useTranslation('common');
    const { usuario } = useSessaoUsuarioContext()
    
    useEffect(() => {
        if(opened && beneficios.length === 0) {
            let url = '/beneficio/?format=json';
            if (usuario?.tipo !== 'global') url += `&ativo=true`;
            http.get(url)
                .then(response => {
                    setBeneficios(response);
                   // Extrair apenas os IDs dos benefícios já associados à operadora
                   const idsBeneficiosOperadora = beneficiosOperadora.map(b => b.beneficio.id);
                    
                   // Filtrar benefícios que ainda não estão na operadora
                   const beneficiosDisponiveis = response.filter(beneficio => 
                       !idsBeneficiosOperadora.includes(beneficio.id)
                   );
                    
                    // Formatando os benefícios para o dropdown com ícones
                    const novosBeneficios = beneficiosDisponiveis.map(item => ({
                        name: item.descricao,
                        code: item.id,
                        descricao: item.descricao,
                        tipo: item.tipo,
                        icone: item.icone || item.descricao,
                        icon: item.icone || item.descricao
                    }));
                    
                    setDropdownBeneficios(novosBeneficios);
                });
        }
    }, [opened, beneficiosOperadora]);

    // Restante do código permanece o mesmo...
    const beneficioOptionTemplate = (option) => {
        if (!option) return <div>Selecione um benefício</div>;
        
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                padding: '0 12px'
            }}>
                <IconeBeneficio nomeIcone={option.icon} size={18} />
                <span>{option.name}</span>
            </div>
        );
    };

    const beneficioValueTemplate = (option) => {
        if (!option) return <span>Selecione um benefício</span>;
        
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px'
            }}>
                <IconeBeneficio nomeIcone={option.icon} size={18} />
                <span>{option.name}</span>
            </div>
        );
    };

    const validarESalvar = () => {
        if (!beneficio?.code) {
            setClassError(['beneficio']);
            return;
        }
        aoSalvar(beneficio);
    };

    return (
        <>
            {opened && (
                <Overlay>
                    <DialogEstilizado open={opened}>
                        <Frame>
                            <Titulo>
                                <button className="close" onClick={aoFechar}>
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                                <h6>{t('add')} Benefício à Operadora</h6>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="24px 0px">
                            <DropdownItens 
                                camposVazios={classError.includes('beneficio') ? ['beneficio'] : []}
                                valor={beneficio} 
                                setValor={setBeneficio} 
                                options={dropdownBeneficios} 
                                label="Benefício*" 
                                name="beneficio" 
                                placeholder="Selecione um benefício"
                                optionTemplate={beneficioOptionTemplate}
                                valueTemplate={beneficioValueTemplate}
                            />
                        </Frame>
                        
                        <div className={styles.containerBottom}>
                            <Botao 
                                aoClicar={aoFechar} 
                                estilo="neutro" 
                                size="medium" 
                                filled
                            >
                                Cancelar
                            </Botao>
                            <Botao 
                                aoClicar={validarESalvar} 
                                estilo="vermilion" 
                                size="medium" 
                                filled
                            >
                                Confirmar
                            </Botao>
                        </div>
                    </DialogEstilizado>
                </Overlay>
            )}
        </>
    );
}

export default ModalOperadoraBeneficios;