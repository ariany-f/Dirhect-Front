import { Outlet } from "react-router-dom"
import { DependentesProvider } from "@contexts/Dependentes"
import { useEffect, useState } from "react"
import http from "@http"
import Loading from '@components/Loading'
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"

function Dependentes() {

    const [loading, setLoading] = useState(false)
    const [dependentes, setDependentes] = useState(null)
    const [pessoasfisicas, setPessoasFisicas] = useState(null)
    const [funcionarios, setFuncionarios] = useState(null)
    const [dep_pess, setDepPess] = useState(null)
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const {
        usuario
    } = useSessaoUsuarioContext()

    useEffect(() => {
        if(!dependentes)
        {
            setLoading(true)
            if(usuario.tipo == 'funcionario')
            {
                carregarDependentes(usuario.public_id, sortField, sortOrder)
            }
            else
            {
                carregarDependentes(null, sortField, sortOrder)
            }
        }
    }, [dependentes])

    const carregarDependentes = (idFuncionario = null, sort = '', order = '') => {
        let url = 'dependente/?format=json';
        if (idFuncionario) {
            url += `&id_funcionario=${idFuncionario}`;
        }
        if (sort && order) {
            url += `&ordering=${order === 'desc' ? '-' : ''}${sort}`;
        }
        http.get(url)
            .then(response => {
                setDependentes(response.results || response)
            })
            .catch(erro => {
                setLoading(false)
            })
            .finally(function() {
                setLoading(false)
            })
    }

    const onSort = ({ field, order }) => {
        setSortField(field);
        setSortOrder(order);
        if(usuario.tipo == 'funcionario') {
            carregarDependentes(usuario.public_id, field, order);
        } else {
            carregarDependentes(null, field, order);
        }
    };

    return (
        <DependentesProvider>
            <Loading opened={loading} />
            <Outlet context={{ dependentes, sortField, sortOrder, onSort }} />
        </DependentesProvider>
    )
}

export default Dependentes