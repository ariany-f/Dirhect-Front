import Titulo from '@components/Titulo'
import QuestionCard from '@components/QuestionCard'
import { AiFillQuestionCircle } from 'react-icons/ai'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import http from '@http'
import Loading from '@components/Loading'
import DataTableDependentes from '@components/DataTableDependentes'

function ColaboradorDependentes() {

    let { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [dependentes, setDependentes] = useState(null)
    const [pessoasfisicas, setPessoasFisicas] = useState(null)
    const [funcionarios, setFuncionarios] = useState(null)
    const [dep_pess, setDepPess] = useState(null)
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    useEffect(() => {
        if(!dep_pess) {
            carregarDependentes(sortField, sortOrder);
        }
        if(!pessoasfisicas) {
            carregarPessoasFisicas();
        }
        if (pessoasfisicas && dependentes && !dep_pess) {
            const processados = dependentes.map(item => {
                const pessoa = pessoasfisicas.find(pessoa => pessoa.id === item.id_pessoafisica);
                return { 
                    ...item, 
                    dados_pessoa_fisica: pessoa || null,
                    funcionario: item.id_funcionario || null
                };
            });
            setDepPess(processados);
            setLoading(false)
        }
    }, [dependentes, pessoasfisicas, dep_pess, sortField, sortOrder])

    const carregarDependentes = (sort = '', order = '') => {
        setLoading(true);
        let url = `dependente/?format=json&id_funcionario=${id}`;
        if (sort && order) {
            url += `&ordering=${order === 'desc' ? '-' : ''}${sort}`;
        }
        http.get(url)
            .then(response => {
                setDependentes(response)
            })
            .catch(erro => {})
            .finally(function() {
                setLoading(false)
            })
    };

    const carregarPessoasFisicas = () => {
        setLoading(true);
        http.get('pessoa_fisica/?format=json')
            .then(response => {
                setPessoasFisicas(response)
            })
            .catch(erro => {})
            .finally(function() {
                setLoading(false)
            })
    };

    const onSort = ({ field, order }) => {
        setSortField(field);
        setSortOrder(order);
        setDepPess(null);
        setDependentes(null);
        carregarDependentes(field, order);
    };

    return (
        <>
            <Loading opened={loading} />
            <Titulo>
                <QuestionCard alinhamento="start" element={<h6>Dependentes</h6>}>
                    <AiFillQuestionCircle className="question-icon" size={20} />
                </QuestionCard>
            </Titulo>
            <DataTableDependentes search={false} dependentes={dep_pess} sortField={sortField} sortOrder={sortOrder} onSort={onSort}/>
        </>
    )
}

export default ColaboradorDependentes