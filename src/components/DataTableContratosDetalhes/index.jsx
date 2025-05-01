import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdSettings } from 'react-icons/md'
import './DataTable.css'
import BadgeGeral from '@components/BadgeGeral';
import BotaoGrupo from '@components/BotaoGrupo';
import styles from '@pages/Contratos/Contratos.module.css'
import Botao from '@components/Botao';
import { useEffect, useRef, useState } from 'react';
import http from '@http';
import { Tag } from 'primereact/tag';
import ModalAlterarRegrasBeneficio from '../ModalAlterar/regras_beneficio';
import { FaPen} from 'react-icons/fa';
import styled from 'styled-components';
import { Toast } from 'primereact/toast';
import { GrAddCircle } from 'react-icons/gr';
import IconeBeneficio from '@components/IconeBeneficio';
import { Tooltip } from 'primereact/tooltip';
import ModalAdicionarElegibilidadeItemContrato from '../ModalAdicionarElegibilidadeItemContrato';
import { Real } from '@utils/formats'

const Col12 = styled.div`
    display: flex;
    gap: 6px;
    justify-content: space-between;
`;

const Col4 = styled.div`
    width: ${(props) => (props.expanded ? "calc(33% - 6px)" : "100%")};
    transition: all 0.3s ease;
    padding: 0px;
`;

const Col5 = styled.div`
    width: ${(props) => (props.expanded ? "calc(44% - 6px)" : "100%")};
    transition: all 0.3s ease;
    padding: 0px;
`;

const Col7 = styled.div`
    width: ${(props) => (props.expanded ? "calc(66% - 6px)" : "100%")};
    transition: all 0.3s ease;
    padding: 0px;
`;

function DataTableContratosDetalhes({ beneficios, onUpdate }) {
    
    const[selectedBeneficio, setSelectedBeneficio] = useState(0)
    const[selectedItemBeneficio, setSelectedItemBeneficio] = useState(0)
    const [modalOpened, setModalOpened] = useState(false)
    const [modalElegibilidadeOpened, setModalElegibilidadeOpened] = useState(false)
    const [sendData, setSendData] = useState({})
    const [selectedItems, setSelectedItems] = useState([])
    const toast = useRef(null)
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })

    // Processa os benefícios para adicionar os componentes de ícone
    const processarBeneficios = (beneficios) => {
        return beneficios.map(beneficio => {

            // Se já tiver o ícone processado, mantém como está
            if (beneficio.dados_beneficio.icone) {
                return beneficio;
            }
            
            return {
                ...beneficio,
                dados_beneficio: {
                    ...beneficio.dados_beneficio,
                    icone: (beneficio.dados_beneficio.icone || beneficio.dados_beneficio.descricao || 'default')
                }
            };
        });
    };

    // Estado para os benefícios processados
    const [beneficiosProcessados, setBeneficiosProcessados] = useState([]);

    // Processa os benefícios quando eles são recebidos
    useEffect(() => {
        if (beneficios && beneficios.length > 0) {
            const processed = processarBeneficios(beneficios);
            setBeneficiosProcessados(processed);
            
            // Seleciona o primeiro benefício por padrão
            if (processed.length > 0) {
                setSelectedBeneficio(processed[0]);
                setSelectedItems(processed[0].itens || []);
            }
        }
    }, [beneficios]);

    const representativeValorTemplate = (rowData) => {
        return (
            Real.format(rowData.valor)
        )
    }

    const representativeExtensivelTemplate = (rowData) => {
        return (
           rowData.extensivo_dependentes ? <Tag severity="success" value="Sim"/> : <Tag severity="danger" value="Não"/>
        )
    }

    const representativeEmpresaTemplate = (rowData) => {
        return (
            Real.format(rowData.valor_empresa)
        )
    }

    const representativeTemplate  = (rowData) => {
        return (
            rowData.descricao
        )
    }

    const representativeDescontoTemplate = (rowData) => {
        return (
            Real.format(rowData.valor_desconto)
        )
    }
    
    const representativeOptionsTemplate = (rowData) => {
        return (
            <div style={{display: 'flex', gap: '20px'}}>
                <Tooltip target=".settings" mouseTrack mouseTrackRight={10} />
                <MdSettings className="settings" data-pr-tooltip="Configurar Elegibilidade" size={16} onClick={() => {
                    setSelectedItemBeneficio(rowData)
                    setModalElegibilidadeOpened(true)
                }} />
                <Tooltip target=".edit" mouseTrack mouseTrackLeft={10} />
                <FaPen className="edit" data-pr-tooltip="Editar Item" size={16} onClick={() => {
                    setSelectedItemBeneficio(rowData)
                    setSendData(rowData)
                    setModalOpened(true)
                }} />
            </div>
        )
    }

    const representativeBeneficiosTemplate = (rowData) => {
        const isActive = selectedBeneficio == rowData;
        
        return (
            <div key={rowData?.dados_beneficio?.id}>
                <BadgeGeral 
                    severity={isActive ? 'info' : ''} 
                    weight={500} 
                    nomeBeneficio={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <IconeBeneficio 
                                nomeIcone={rowData?.dados_beneficio?.icone} 
                                size={20}
                            />
                            <div>
                                {rowData?.dados_beneficio?.descricao}
                            </div>
                        </div>
                    }  
                />
            </div>
        );
    };

    const alterarRegras = (id, descricao, tipo_calculo, tipo_desconto, extensivo_dependentes, valor, empresa, desconto) => {
        if(descricao == '' || valor == '' || empresa == '' || desconto == '') {
            toast.current.show({severity:'error', summary: 'Erro', detail: 'Preencha todos os campos!', life: 3000});
        } else {
            // Função para converter valor monetário em número
            const converterParaNumero = (valorMonetario) => {
                return parseFloat(valorMonetario.replace('R$', '').replace('.', '').replace(',', '.').trim());
            };

            let data = {
                descricao: descricao,
                tipo_calculo: tipo_calculo,
                tipo_desconto: tipo_desconto,
                contrato_beneficio: parseInt(selectedBeneficio.id),
                extensivel_depentende: extensivo_dependentes ?  true : false,
                parametro_aplicacao: "I",
                numero_decimal: true,
                valor: converterParaNumero(valor),
                valor_empresa: converterParaNumero(empresa),
                valor_desconto: converterParaNumero(desconto)
            }
            
            if(id) {
                http.put(`contrato_beneficio_item/${id}/`, data)
                .then(response => {
                    if(response.id) {
                        toast.current.show({severity:'success', summary: 'Atualizado!', detail: 'Sucesso!', life: 3000});
                        // Notifica o componente pai sobre a atualização
                        if (onUpdate) {
                            onUpdate();
                        }
                    }
                })
                .catch(erro => {
                    toast.current.show({severity:'error', summary: 'Não foi possível atualizar', detail: 'Erro!', life: 3000});
                })
                .finally(function() {
                    setModalOpened(false)
                })
            } else {
                http.post(`contrato_beneficio_item/`, data)
                .then(response => {
                    if(response.id) {
                        // Atualiza a lista de itens do benefício selecionado
                        const updatedItems = [...selectedItems, response];
                        setSelectedItems(updatedItems);
                        
                        // Atualiza o benefício selecionado
                        const updatedBeneficios = beneficiosProcessados.map(beneficio => {
                            if (beneficio.id === selectedBeneficio.id) {
                                return {
                                    ...beneficio,
                                    itens: updatedItems
                                };
                            }
                            return beneficio;
                        });
                        
                        setBeneficiosProcessados(updatedBeneficios);
                        toast.current.show({severity:'success', summary: 'Adicionado com Sucesso', detail: 'Sucesso!', life: 3000});
                        // Notifica o componente pai sobre a atualização
                        if (onUpdate) {
                            onUpdate();
                        }
                    }
                })
                .catch(erro => {
                    toast.current.show({severity:'error', summary: 'Não foi possível adicionar', detail: 'Erro!', life: 3000});
                })
                .finally(function() {
                    setModalOpened(false)
                })
            }
        }
    }

    const onRowSelect = (e) => {
        setSelectedBeneficio(e.value);
        setSelectedItems(e.value.itens || []);
    };

    function salvarGrupos(data) {
        const transformarDados = (dados) => {
            const resultado = {
                regra_elegibilidade: []
            };
    
            dados.forEach((item, index) => {
                if (!item.data || item.data.length === 0) return; // Ignora se não tiver dados
    
                const campo = {
                    'Filial': 'filial',
                    'Departamento': 'departamento',
                    'Seção': 'secao',
                    'Centro de Custo': 'centro_custo',
                    'Cargo': 'cargo',
                    'Função': 'funcao',
                    'Sindicato': 'sindicato',
                    'Horário': 'horario'
                }[item.tipo];
    
                if (campo) {
                    // Cria um novo objeto para cada regra
                    const novaRegra = {};
                    novaRegra[campo] = {
                        index: index,
                        id: item.data.map(d => d.id)
                    };
                    
                    resultado.regra_elegibilidade.push(novaRegra);
                }
            });
    
            return resultado;
        };
    
        const dadosTransformados = transformarDados(data);
    
        http.put(`contrato_beneficio_item/${selectedItemBeneficio.id}/?format=json`, dadosTransformados)
        .then(response => {
            // Atualiza o item selecionado com os novos dados
            const updatedItem = {
                ...selectedItemBeneficio,
                regra_elegibilidade: dadosTransformados.regra_elegibilidade
            };
            
            // Atualiza o item na lista de itens selecionados
            const updatedItems = selectedItems.map(item => 
                item.id === selectedItemBeneficio.id ? updatedItem : item
            );
            
            setSelectedItems(updatedItems);
            setSelectedItemBeneficio(updatedItem);
            
            toast.current.show({severity:'success', summary: 'Salvo com sucesso', life: 3000});
        })
        .catch(erro => {
            toast.current.show({severity:'error', summary: 'Não foi possível atualizar', detail: 'Erro!', life: 3000});
        })
        .finally(() => {
            setModalElegibilidadeOpened(false);
        });
    }
    return (
        <>
            <Toast ref={toast} />
            <Col12>
                <Col4 expanded={selectedBeneficio}>
                    <DataTable 
                        value={beneficiosProcessados} 
                        filters={filters} 
                        globalFilterFields={['nome']} 
                        emptyMessage="Não foram encontrados beneficios vinculados à este contrato" 
                        paginator 
                        rows={10}
                        selection={selectedBeneficio} 
                        onSelectionChange={onRowSelect}
                        selectionMode="single"
                    >
                        <Column body={representativeBeneficiosTemplate} field="dados_beneficio.descricao" header="Benefício" style={{ width: '95%' }}></Column>
                    </DataTable>
                </Col4>

                {selectedBeneficio && selectedItems ? 
                    <Col7 expanded={selectedBeneficio}>
                        <BotaoGrupo align="space-between">
                            <h5>{selectedBeneficio.dados_beneficio.descricao}</h5>
                            <Botao aoClicar={() => {setSendData({});setSelectedItemBeneficio(null);setModalOpened(true);}} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon} fill="white" color="white"/> Adicionar Itens</Botao>
                        </BotaoGrupo>
                        <DataTable  
                            selection={selectedItemBeneficio}
                            selectionMode="single"
                            emptyMessage="Não há configurações cadastradas" 
                            value={selectedItems} 
                        >
                            <Column body={representativeTemplate} field="descricao" header="Descrição" style={{ width: '25%' }} />
                            <Column body={representativeExtensivelTemplate} field="extensivel_depentende" header="Extensível Dependente" style={{ width: '10%' }} />
                            <Column body={representativeValorTemplate} field="valor" header="Valor" style={{ width: '12%' }} />
                            <Column body={representativeEmpresaTemplate} field="valor_empresa" header="Empresa" style={{ width: '15%' }} />
                            <Column body={representativeDescontoTemplate} field="valor_desconto" header="Desconto" style={{ width: '15%' }} />
                            <Column body={representativeOptionsTemplate} header="" style={{ width: '15%' }} />
                        </DataTable>
                    </Col7>
                : null
                }
            </Col12>
            <ModalAdicionarElegibilidadeItemContrato item={selectedItemBeneficio} aoSalvar={salvarGrupos} aoFechar={() => setModalElegibilidadeOpened(false)} opened={modalElegibilidadeOpened} />
            <ModalAlterarRegrasBeneficio contrato={selectedItemBeneficio?.id} aoSalvar={alterarRegras} aoFechar={() => setModalOpened(false)} opened={modalOpened} nomeBeneficio={selectedBeneficio?.dados_beneficio?.descricao} iconeBeneficio={selectedBeneficio?.dados_beneficio?.icone} dadoAntigo={sendData} />
        </>
    )
}

export default DataTableContratosDetalhes