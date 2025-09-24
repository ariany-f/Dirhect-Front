import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom'
import BotaoGrupo from "@components/BotaoGrupo"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import BotaoSemBorda from "@components/BotaoSemBorda"
import Titulo from "@components/Titulo"
import { Skeleton } from 'primereact/skeleton'
import { FaPencilAlt } from 'react-icons/fa'
import { MdCancel } from "react-icons/md"
import Loading from "@components/Loading"
import { Toast } from 'primereact/toast'
import DataTablePremiacaoEditarValor from "@components/DataTablePremiacaoEditarValor";
import { useConfiguracaoElegibilidadeContext } from "@contexts/ConfiguracaoElegibilidade";
import DropdownItens from "@components/DropdownItens";
import CustomImage from "@components/CustomImage";
import Botao from "@components/Botao";
import http from "@http";
import styled from "styled-components";
import { RiBusFill, RiComputerLine, RiShoppingCartFill, RiGasStationFill, RiEBike2Fill } from 'react-icons/ri'
import { FaCar, FaCoins, FaQuestion, FaTheaterMasks, FaTooth } from 'react-icons/fa'
import { BiBookReader } from 'react-icons/bi'
import { PiForkKnifeFill } from 'react-icons/pi'
import { MdOutlineMedicalServices, MdOutlineFastfood, MdSecurity, MdDirectionsBike } from 'react-icons/md'
import styles from '@components/BadgeBeneficio/BadgeBeneficio.module.css'
import { IoFastFoodSharp } from 'react-icons/io5'
import { FaHeartPulse, FaMoneyBillTransfer } from 'react-icons/fa6'
import ModalConfigurarBeneficios from "../../components/ModalConfigurarBeneficios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import IconeBeneficio from "@components/IconeBeneficio"
import { Real } from '@utils/formats'

// Estilos reutilizáveis (pode mover para um arquivo separado)
const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
    width: 100%;
`;

const Col6 = styled.div`
    flex: 1 1 calc(50% - 8px);
`;


const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

const LadoALado = styled.div`
    display: flex;
    gap: 24px;
    & span {
        display: flex;
        align-items: center;
    }
`

function ElegibilidadeEditarValor() {

    const navegar = useNavigate()
    let { tipo } = useParams()
    const [itensAdicionados, setItemAdicionados] = useState([])
    const {
        elegibilidade,
        setItemContrato,
        setFiliais,
        setDepartamentos
    } = useConfiguracaoElegibilidadeContext()
    const [loading, setLoading] = useState(false)
    const [modalBeneficioOpened, setModalBeneficioOpened] = useState(false)
    const toast = useRef(null)

    useEffect(() => {
      if(!elegibilidade)
      {
        setFiliais([])
        setDepartamentos([])
        setItemContrato([])
        navegar(-1)
      }
    }, [elegibilidade])

    function voltar()
    {
        setItemContrato([])
        navegar(-1)
    }
    
    function enviarNovaConfiguracao(configuracao) {
        setLoading(true);
    
        // Buscar os detalhes do item no endpoint
        http.get(`contrato_beneficio_item/${configuracao.contrato_item}/?format=json`)
        .then(response => {
            setItemAdicionados(response);
            setItemContrato(response);
            setModalBeneficioOpened(false);
        })
        .catch(error => {
            console.error('Erro ao buscar detalhes do item:', error);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    return (
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            {elegibilidade ? (
                <>
                    <BotaoGrupo align="space-between">
                        <Titulo>
                            <h6>Itens Elegíveis</h6>
                        </Titulo>
                        <Botao 
                            aoClicar={() => setModalBeneficioOpened(true)}
                            estilo="primaria"
                            size="medium"
                            filled
                        >
                            Adicionar Item
                        </Botao>
                    </BotaoGrupo>
                    
                    {/* Tabela de itens adicionados */}
                    {elegibilidade.itens_contrato.length > 0 ? (
                        <div style={{ marginTop: '20px' }}>
                            <DataTable 
                                value={elegibilidade.itens_contrato}
                                emptyMessage="Nenhum item adicionado"
                                tableStyle={{ minWidth: '72vw' }}
                            >
                                <Column 
                                    field="rowData.beneficio.nome_operadora" 
                                    header="Operadora" 
                                    style={{ width: '20%' }}
                                    body={(rowData) => (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <CustomImage src={rowData.beneficio.image_operadora} alt={rowData.beneficio.nome_operadora} title={rowData.beneficio.nome_operadora} width={24} height={24} />
                                            <Texto>{rowData.beneficio.nome_operadora}</Texto>
                                        </div>
                                    )}
                                />
                                <Column 
                                    field="rowData.beneficio.dados_beneficio.descricao" 
                                    header="Benefício" 
                                    style={{ width: '10%' }}
                                    body={(rowData) => (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <IconeBeneficio nomeIcone={rowData?.beneficio?.dados_beneficio?.icone ?? rowData?.beneficio?.dados_beneficio?.descricao}/>
                                            {rowData?.beneficio?.dados_beneficio?.descricao}
                                        </div>
                                    )}
                                />
                                <Column 
                                    field="descricao" 
                                    header="Descrição" 
                                    style={{ width: '10%' }}
                                />
                                <Column 
                                    field="valor" 
                                    header="Valor" 
                                    style={{ width: '10%' }}
                                    body={(rowData) => Real.format(rowData.valor || 0)}
                                />
                                <Column 
                                    field="valor_empresa" 
                                    header="Valor Empresa" 
                                    style={{ width: '10%' }}
                                    body={(rowData) => Real.format(rowData.valor_empresa || 0)}
                                />
                                <Column 
                                    field="valor_colaborador" 
                                    header="Valor Colaborador" 
                                    style={{ width: '10%' }}
                                    body={(rowData) => Real.format(rowData.valor_desconto || 0)}
                                />
                            </DataTable>
                        </div>
                    ) : (
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <Texto>Nenhum item de contrato adicionado ainda</Texto>
                        </div>
                    )}
                    
                    <ContainerButton>
                        <Botao aoClicar={voltar} estilo="neutro" size="medium" filled>
                            Voltar
                        </Botao>
                        <Botao 
                            aoClicar={() => console.log('Salvar', itensAdicionados)}
                            estilo="vermilion" 
                            size="medium" 
                            filled
                            disabled={itensAdicionados.length === 0}
                        >
                            Salvar Configuração
                        </Botao>
                    </ContainerButton>
                </>
            ) : (
                <Skeleton variant="rectangular" width={300} height={60} />
            )}
            <ModalConfigurarBeneficios opened={modalBeneficioOpened} aoFechar={() => setModalBeneficioOpened(false)} aoSalvar={enviarNovaConfiguracao} />
        </Frame>
    )
}

export default ElegibilidadeEditarValor