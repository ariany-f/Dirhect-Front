import Titulo from '@components/Titulo'
import QuestionCard from '@components/QuestionCard'
import { AiFillQuestionCircle } from 'react-icons/ai'
import styled from 'styled-components'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import http from '@http'
import Loading from '@components/Loading'
import DataTableDependentes from '@components/DataTableDependentes'
import { GrAddCircle } from 'react-icons/gr'
import styles from '@pages/Colaboradores/Colaboradores.module.css'
import BotaoGrupo from '@components/BotaoGrupo'
import Botao from '@components/Botao'
import { useTranslation } from 'react-i18next'

function ColaboradorDependentes() {

    let { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [dependentes, setDependentes] = useState(null)
    const [pessoasfisicas, setPessoasFisicas] = useState(null)
    const [funcionarios, setFuncionarios] = useState(null)
    const [dep_pess, setDepPess] = useState(null)
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const { t } = useTranslation('common');

    useEffect(() => {
        if(!dep_pess) {
            carregarDependentes(sortField, sortOrder);
        }
    }, [dep_pess, sortField, sortOrder])

    useEffect(() => {
        // Só carrega pessoas físicas se há dependentes
        if(dependentes && dependentes.length > 0 && !pessoasfisicas) {
            carregarPessoasFisicas();
        }
        // Se não há dependentes, finaliza o loading diretamente
        else if(dependentes && dependentes.length === 0) {
            setDepPess([]);
            setLoading(false);
        }
    }, [dependentes, pessoasfisicas])

    useEffect(() => {
        // Só processa se há dependentes e pessoas físicas
        if (pessoasfisicas && dependentes && dependentes.length > 0 && !dep_pess) {
            const processados = dependentes.map(item => {
                const pessoa = pessoasfisicas.find(pessoa => pessoa.id === item.id_pessoafisica);
                return { 
                    ...item, 
                    dados_pessoa_fisica: pessoa || null,
                    funcionario: item.id_funcionario || null
                };
            });
            setDepPess(processados);
            setLoading(false);
        }
    }, [dependentes, pessoasfisicas, dep_pess])

    const carregarDependentes = (sort = '', order = '') => {
        setLoading(true);
        let url = `dependente/?format=json&id_funcionario=${id}`;
        if (sort && order) {
            url += `&ordering=${order === 'desc' ? '-' : ''}${sort}`;
        }
        http.get(url)
            .then(response => {
                setDependentes(response)
                // Não seta loading false aqui, será feito no useEffect
            })
            .catch(erro => {
                setLoading(false); // Só seta false em caso de erro
            })
    };

    const carregarPessoasFisicas = () => {
        // Não seta loading true aqui pois já está true do carregarDependentes
        http.get('pessoa_fisica/?format=json')
            .then(response => {
                setPessoasFisicas(response)
                // Não seta loading false aqui, será feito no useEffect
            })
            .catch(erro => {
                setLoading(false); // Só seta false em caso de erro
            })
    };

    const onSort = ({ field, order }) => {
        setSortField(field);
        setSortOrder(order);
        setDepPess(null);
        setDependentes(null);
        setPessoasFisicas(null); // Reset também pessoas físicas para forçar nova busca se necessário
        carregarDependentes(field, order);
    };

    return (
        <>
            <Loading opened={loading} />
            <BotaoGrupo align="space-between">

                <Titulo>
                    <QuestionCard alinhamento="start" element={<h6>Dependentes</h6>}>
                        <AiFillQuestionCircle className="question-icon" size={20} />
                    </QuestionCard>
                </Titulo>
                    
                <BotaoGrupo align="end">
                    <Link to="/colaborador/registro">
                        <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> {t('add')} Dependente</Botao>
                    </Link>
                </BotaoGrupo>
            </BotaoGrupo>
            <DataTableDependentes search={false} dependentes={dep_pess} sortField={sortField} sortOrder={sortOrder} onSort={onSort}/>
        </>
    )
}

export default ColaboradorDependentes