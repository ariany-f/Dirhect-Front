import Titulo from '@components/Titulo'
import QuestionCard from '@components/QuestionCard'
import { AiFillQuestionCircle } from 'react-icons/ai'
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
import { ArmazenadorToken } from '@utils'

function ColaboradorDependentes() {

    let { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [dependentes, setDependentes] = useState([])
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState(1);
    const { t } = useTranslation('common');

    useEffect(() => {
        setLoading(true);
        let url = `dependente/?format=json&id_funcionario=${id}`;

        if (sortField) {
            const orderPrefix = sortOrder === -1 ? '-' : '';
            url += `&ordering=${orderPrefix}${sortField}`;
        }

        http.get(url)
            .then(response => {
                setDependentes(response || []);
            })
            .catch(erro => {
                console.error("Erro ao carregar dependentes:", erro);
                setDependentes([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id, sortField, sortOrder]);

    const onSort = (event) => {
        setSortField(event.sortField);
        setSortOrder(event.sortOrder);
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
                    {ArmazenadorToken.hasPermission('add_dependente') &&
                        <Link to={`/colaborador/detalhes/${id}/dependentes/adicionar`}>
                            <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> {t('add')} Dependente</Botao>
                        </Link>
                    }
                </BotaoGrupo>
            </BotaoGrupo>
            <DataTableDependentes 
                search={false} 
                dependentes={dependentes} 
                sortField={sortField} 
                sortOrder={sortOrder} 
                onSort={onSort}
            />
        </>
    )
}

export default ColaboradorDependentes