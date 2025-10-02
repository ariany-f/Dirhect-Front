import http from '@http'
import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from 'react-router-dom';
import Frame from "@components/Frame"
import DataTableColaboradores from '@components/DataTableColaboradores'
import { Toast } from 'primereact/toast';
import Texto from '@components/Texto';
import Titulo from '@components/Titulo';
import Loading from '@components/Loading';

function EstruturaListaColaboradores() {

    let { id } = useParams()
    const location = useLocation()
    const [colaboradores, setColaboradores] = useState([])
    const [loading, setLoading] = useState(false)
    const [estrutura, setEstrutura] = useState(null)
    const [paginaAtual, setPaginaAtual] = useState(1)
    const [totalRegistros, setTotalRegistros] = useState(0)
    const [registrosPorPagina] = useState(20)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortField, setSortField] = useState('')
    const [sortOrder, setSortOrder] = useState('')
    const toast = useRef(null)

    // Extrair o tipo da URL
    const getTipoFromPath = () => {
        const path = location.pathname;
        if (path.includes('/filial/detalhes/')) return 'filial';
        if (path.includes('/departamento/detalhes/')) return 'departamento';
        if (path.includes('/secao/detalhes/')) return 'secao';
        if (path.includes('/cargo/detalhes/')) return 'cargo';
        if (path.includes('/funcao/detalhes/')) return 'funcao';
        if (path.includes('/sindicato/detalhes/')) return 'sindicato';
        if (path.includes('/horario/detalhes/')) return 'horario';
        if (path.includes('/centro_custo/detalhes/')) return 'centro-custo';
        return null;
    };

    const tipo = getTipoFromPath();

    useEffect(() => {
        if(id && tipo) {
            carregarEstrutura();
            carregarColaboradores();
        }
    }, [id, tipo, paginaAtual, searchTerm, sortField, sortOrder])

    const carregarEstrutura = async () => {
        try {
            let endpoint = '';
            switch(tipo) {
                case 'filial':
                    endpoint = `filial/${id}/`;
                    break;
                case 'departamento':
                    endpoint = `departamento/${id}/`;
                    break;
                case 'secao':
                    endpoint = `secao/${id}/`;
                    break;
                case 'cargo':
                    endpoint = `cargo/${id}/`;
                    break;
                case 'funcao':
                    endpoint = `funcao/${id}/`;
                    break;
                case 'sindicato':
                    endpoint = `sindicato/${id}/`;
                    break;
                case 'horario':
                    endpoint = `horario/${id}/`;
                    break;
                case 'centro-custo':
                    endpoint = `centro_custo/${id}/`;
                    break;
                default:
                    console.error('Tipo de estrutura não reconhecido:', tipo);
                    return;
            }

            const response = await http.get(endpoint);
            setEstrutura(response);
        } catch (error) {
            console.error('Erro ao carregar estrutura:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível carregar os dados da estrutura',
                life: 3000
            });
        }
    };

    const carregarColaboradores = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: paginaAtual,
                page_size: registrosPorPagina
            });

            // Adicionar filtro baseado no tipo de estrutura
            if (tipo === 'filial') {
                params.append('filial__id', id);
            } else if (tipo === 'departamento') {
                params.append('departamento__id', id);
            } else if (tipo === 'secao') {
                params.append('id_secao__id', id);
            } else if (tipo === 'cargo') {
                params.append('id_funcao__id_cargo', id);
            } else if (tipo === 'funcao') {
                params.append('id_funcao__id', id);
            } else if (tipo === 'sindicato') {
                params.append('sindicato', id);
            } else if (tipo === 'horario') {
                params.append('horario', id);
            } else if (tipo === 'centro-custo') {
                params.append('centro_custo__id', id);
            }

            if (searchTerm.trim()) {
                params.append('search', searchTerm.trim());
            }

            // Adicionar ordenação se existir
            if (sortField && sortOrder) {
                const orderParam = sortOrder === 'desc' ? '-' : '';
                params.append('ordering', `${orderParam}${sortField}`);
            }

            const response = await http.get(`funcionario/?${params.toString()}`);
            
            if (response.results) {
                setColaboradores(response.results);
                setTotalRegistros(response.count || 0);
            } else {
                setColaboradores(response);
                setTotalRegistros(response.length || 0);
            }
        } catch (error) {
            console.error('Erro ao carregar colaboradores:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível carregar os colaboradores',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onPage = (event) => {
        setPaginaAtual(event.page + 1);
    };

    const onSearch = (search) => {
        setSearchTerm(search);
        setPaginaAtual(1);
    };

    const onSort = ({ field, order }) => {
        setSortField(field);
        setSortOrder(order);
        setPaginaAtual(1);
    };

    const getNomeEstrutura = () => {
        if (!estrutura) return '---';
        
        switch(tipo) {
            case 'filial':
                return estrutura.nome;
            case 'departamento':
                return estrutura.nome;
            case 'secao':
                return estrutura.nome;
            case 'cargo':
                return estrutura.nome;
            case 'funcao':
                return estrutura.nome;
            case 'sindicato':
                return estrutura.descricao || estrutura.nome;
            case 'horario':
                return estrutura.descricao || estrutura.nome;
            case 'centro-custo':
                return estrutura.nome;
            default:
                return '---';
        }
    };

    const getTituloEstrutura = () => {
        const tipos = {
            'filial': 'Filial',
            'departamento': 'Departamento',
            'secao': 'Seção',
            'cargo': 'Cargo',
            'funcao': 'Função',
            'sindicato': 'Sindicato',
            'horario': 'Horário',
            'centro-custo': 'Centro de Custo'
        };
        return tipos[tipo] || 'Estrutura';
    };
   
    return (
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <DataTableColaboradores 
                colaboradores={colaboradores} 
                showSearch={true}
                paginator={true}
                rows={registrosPorPagina}
                totalRecords={totalRegistros}
                first={(paginaAtual - 1) * registrosPorPagina}
                onPage={onPage}
                onSearch={onSearch}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={onSort}
            />
        </Frame>
    )
}

export default EstruturaListaColaboradores