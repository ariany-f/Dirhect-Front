import { Outlet } from "react-router-dom"
import { DependentesProvider } from "@contexts/Dependentes"
import { useEffect, useState } from "react"
import http from "@http"
import Loading from '@components/Loading'
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"

function Dependentes() {

    const [loading, setLoading] = useState(true)
    const [dependentes, setDependentes] = useState(null)
    const [pessoasfisicas, setPessoasFisicas] = useState(null)
    const [funcionarios, setFuncionarios] = useState(null)
    const [dep_pess, setDepPess] = useState(null)
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [first, setFirst] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const {
        usuario
    } = useSessaoUsuarioContext()

    const loadData = (currentPage, currentPageSize, search = '', sort = '-id') => {
        setLoading(true);
        let url = `dependente/?format=json&page=${currentPage}&page_size=${currentPageSize}`;
        
        if (usuario.tipo === 'funcionario') {
            url += `&id_funcionario=${usuario.public_id}`;
        }
        
        if (search) {
            url += `&search=${search}`;
        }
        
        if (sort && sort !== '-null') {
            url += `&ordering=${sort}`;
        }

        http.get(url)
            .then(response => {
                setDependentes(response.results || response);
                setTotalRecords(response.count || 0);
                setTotalPages(response.total_pages || 0);
            })
            .catch(erro => {
                console.log(erro);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadData(page, pageSize, searchTerm);
    }, []);

    const onPage = (event) => {
        const newPage = event.page + 1;
        const newPageSize = event.rows;
        
        setFirst(event.first);
        setPage(newPage);
        setPageSize(newPageSize);
        
        loadData(newPage, newPageSize, searchTerm, getSortParam());
    };

    const onSearch = (search) => {
        setSearchTerm(search);
        setPage(1);
        setFirst(0);
        loadData(1, pageSize, search, getSortParam());
    };

    const getSortParam = () => {
        if (!sortField) return '';
        return `${sortOrder === 'desc' ? '-' : ''}${sortField}`;
    };

    const onSort = ({ field, order }) => {
        setSortField(field);
        setSortOrder(order);
        loadData(page, pageSize, searchTerm, `${order === 'desc' ? '-' : ''}${field}`);
    };

    return (
        <DependentesProvider>
            <Loading opened={loading && !dependentes} />
            <Outlet context={{ 
                dependentes, 
                sortField, 
                sortOrder, 
                onSort,
                // Props para paginação via servidor
                paginator: true,
                rows: pageSize,
                totalRecords,
                first,
                onPage,
                onSearch,
                searchValue: searchTerm
            }} />
        </DependentesProvider>
    )
}

export default Dependentes