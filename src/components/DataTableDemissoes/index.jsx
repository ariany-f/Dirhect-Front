import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Real } from '@utils/formats'
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import { GrAddCircle } from 'react-icons/gr';
import { ArmazenadorToken } from '@utils';
import ModalSelecionarColaborador from '@components/ModalSelecionarColaborador';
import ModalDemissao from '@components/ModalDemissao';
import http from '@http';
import { FaUserTimes } from 'react-icons/fa';

function DataTableDemissao({ 
    demissoes, 
    colaborador = null, 
    sortField, 
    sortOrder, 
    onSort, 
    aoAtualizar,
    // Props para paginação via servidor
    paginator = false,
    rows = 10,
    totalRecords = 0,
    first = 0,
    onPage,
    onSearch,
    showSearch = true
}) {

    const[selectedVaga, setSelectedVaga] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [tiposDemissao, setTiposDemissao] = useState({});
    const [loadingTipos, setLoadingTipos] = useState(true);
    const navegar = useNavigate()

    const [modalSelecaoAberto, setModalSelecaoAberto] = useState(false);
    const [modalDemissaoAberto, setModalDemissaoAberto] = useState(false);
    const [colaboradorSelecionado, setColaboradorSelecionado] = useState(null);

    // Buscar tipos de demissão
    useEffect(() => {
        setLoadingTipos(true);
        http.get('tabela_dominio/tipo_demissao/')
            .then(response => {
                const tipos = {};
                
                // Verificar diferentes estruturas possíveis da resposta
                const registros = response.registros || response.results || response.data || response;
                
                if (Array.isArray(registros)) {
                    registros.forEach((tipo, index) => {
                        if (tipo.id_origem && tipo.descricao) {
                            tipos[tipo.id_origem] = tipo.descricao;
                        }
                    });
                }
                
                setTiposDemissao(tipos);
            })
            .catch(error => {
                console.error('Erro ao buscar tipos de demissão:', error);
            })
            .finally(() => {
                setLoadingTipos(false);
            });
    }, []);

    const representativeTipoDemissaoTemplate = (rowData) => {
        if (loadingTipos) {
            return 'Carregando...';
        }
        
        const tipoCodigo = String(rowData.tipo_demissao); // Converter para string
        const tipoDescricao = tiposDemissao[tipoCodigo] || rowData.tipo_demissao_descricao;
        
        if (tipoDescricao) {
            return tipoDescricao;
        }
        
        // Fallback: mostrar o código se não encontrar a descrição
        return tipoCodigo || 'Não definido';
    }

    const representativeMotivoDemissaoTemplate = (rowData) => {
        const motivo = rowData?.motivo_demissao_descricao;
        // Fallback: mostrar o código se não encontrar a descrição
        return motivo || 'Não definido';
    }

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    function verDetalhes(value)
    {
        console.log(value)
    }

    const handleColaboradorSelecionado = (colaborador) => {
        setColaboradorSelecionado(colaborador);
        setModalSelecaoAberto(false);
        setModalDemissaoAberto(true);
    };

    const handleSalvarDemissao = (dadosDemissao) => {
        http.post(`demissao/`, {
            colaborador: colaboradorSelecionado.id,
            ...dadosDemissao
        })
        .then(() => {
            alert('Solicitação de demissão enviada com sucesso!');
            setModalDemissaoAberto(false);
            if (aoAtualizar) {
                aoAtualizar();
            }
        })
        .catch(erro => {
            console.error("Erro ao enviar solicitação de demissão", erro);
            const errorMessage = erro.response?.data?.detail || 'Falha ao enviar solicitação de demissão.';
            alert(errorMessage);
        });
    };

    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    const representativeColaboradorTemplate = (rowData) => {
        const cpf = rowData?.funcionario_pessoa_fisica?.cpf ?
        formataCPF(rowData?.funcionario_pessoa_fisica?.cpf)
        : '---';
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.funcionario_pessoa_fisica?.nome}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                CPF:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{cpf}</p>
            </div>
        </div>
    }

    const representativeDataDemissaoTemplate = (rowData) => {
        return new Date(rowData.dt_demissao).toLocaleDateString("pt-BR")
    }

    const representativeChapaTemplate = (rowData) => {
        return (
            <Texto weight={600}>{rowData?.chapa}</Texto>
        )
    }

    const handleSort = (event) => {
        if (onSort) {
            onSort({
                field: event.sortField,
                order: event.sortOrder === 1 ? 'asc' : 'desc'
            });
        }
    };

    const totalDemissoesTemplate = () => {
        return 'Total de Demissões: ' + (totalRecords ?? 0);
    };

    return (
        <>
            {!colaborador && showSearch &&
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar por candidato" />
                </span>
                {ArmazenadorToken.hasPermission('view_funcionario') &&
                    <BotaoGrupo>
                        <Botao aoClicar={() => setModalSelecaoAberto(true)} estilo="vermilion" size="small"><FaUserTimes fill="var(--secundaria)" stroke="white" /> Solicitar Demissão</Botao>
                    </BotaoGrupo>
                }
            </div>}
            {!loadingTipos && (
                <DataTable 
                    value={demissoes} 
                    emptyMessage="Não foram encontradas demissões pendentes" 
                    selection={selectedVaga} 
                    onSelectionChange={(e) => verDetalhes(e.value)} 
                    selectionMode="single" 
                    paginator={paginator}
                    lazy={paginator}
                    rows={rows} 
                    totalRecords={totalRecords}
                    first={first}
                    onPage={onPage}
                    tableStyle={{ minWidth: (!colaborador ? '68vw' : '48vw') }}
                    sortField={sortField}
                    sortOrder={sortOrder === 'desc' ? -1 : 1}
                    onSort={handleSort}
                    removableSort
                    showGridlines
                    stripedRows
                    footerColumnGroup={
                        paginator ? (
                            <ColumnGroup>
                                <Row>
                                    <Column footer={totalDemissoesTemplate} style={{ textAlign: 'right', fontWeight: 600 }} />
                                </Row>
                            </ColumnGroup>
                        ) : null
                    }
                >
                    {!colaborador &&
                        <Column body={representativeChapaTemplate} header="Matrícula" sortable field="chapa" style={{ width: '10%' }}></Column>
                    }
                    {!colaborador &&
                        <Column body={representativeColaboradorTemplate} header="Colaborador"  field="funcionario_pessoa_fisica.nome" sortField="id_pessoafisica__nome" sortable style={{ width: '30%' }}></Column>
                    }
                    <Column body={representativeDataDemissaoTemplate} field="dt_demissao" header="Data Demissão" sortable style={{ width: '20%' }}></Column>
                    <Column body={representativeTipoDemissaoTemplate} field="tipo_demissao_descricao" header="Tipo Demissão" sortable style={{ width: '20%' }}></Column>
                    <Column body={representativeMotivoDemissaoTemplate} field="motivo_demissao" header="Motivo" sortable style={{ width: '20%' }}></Column>
                </DataTable>
            )}
            {loadingTipos && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    Carregando tipos de demissão...
                </div>
            )}
            <ModalSelecionarColaborador 
                opened={modalSelecaoAberto}
                aoFechar={() => setModalSelecaoAberto(false)}
                aoSelecionar={handleColaboradorSelecionado}
            />
            {modalDemissaoAberto && (
                <ModalDemissao 
                    opened={modalDemissaoAberto}
                    aoFechar={() => setModalDemissaoAberto(false)}
                    colaborador={colaboradorSelecionado}
                    aoSalvar={handleSalvarDemissao}
                />
            )}
        </>
    )
}

export default DataTableDemissao