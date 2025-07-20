import http from '@http'
import Loading from '@components/Loading'
import { useEffect, useState } from "react";
import DataTableVagas from '@components/DataTableVagas';
import { Link, useOutletContext } from 'react-router-dom'

function VagasAbertas() {
    
    const [loading, setLoading] = useState(true)
    const [vagas, setVagas] = useState([])
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [first, setFirst] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const context = useOutletContext();

    const loadData = (currentPage, currentPageSize, search = '', sort = '') => {
        setLoading(true);
        const orderParam = (sort && sort !== '-null') ? `&ordering=${sort}` : '';
        http.get(`vagas/?format=json&status=A&page=${currentPage}&page_size=${currentPageSize}${search ? `&search=${search}` : ''}${orderParam}`)
            .then(response => {
                setVagas(response.results || response);
                setTotalRecords(response.count || 0);
                setTotalPages(response.total_pages || 0);
            })
            .catch(error => {   
                console.log(error);
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
    
    if (loading && !vagas.length) {
        return <Loading opened={loading} />
    }
    
    return (
        <DataTableVagas 
            vagas={vagas} 
            paginator={true}
            rows={pageSize}
            totalRecords={totalRecords}
            first={first}
            onPage={onPage}
            onSearch={onSearch}
            onSort={onSort}
            sortField={sortField}
            sortOrder={sortOrder}
        />
    )
}

export default VagasAbertas