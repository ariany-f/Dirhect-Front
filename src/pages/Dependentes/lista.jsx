import http from '@http'
import { useEffect } from "react"
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import { GrAddCircle } from 'react-icons/gr'
import styles from './Dependentes.module.css'
import styled from "styled-components"
import { Link, useOutletContext } from "react-router-dom"
import QuestionCard from '@components/QuestionCard'
import Management from '@assets/Management.svg'
import { AiFillQuestionCircle } from 'react-icons/ai'
import DataTableDependentes from '@components/DataTableDependentes'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const ContainerSemRegistro = styled.div`
    display: flex;
    padding: 96px 12px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
    width: 100%;
    text-align: center;
    & p {
        margin: 0 auto;
    }

    & h6 {
        width: 60%;
    }
`

function DependentesListagem() {

    const context = useOutletContext()
    const dependentes = context?.dependentes;
    const sortField = context?.sortField;
    const sortOrder = context?.sortOrder;
    const onSort = context?.onSort;
    const paginator = context?.paginator;
    const rows = context?.rows;
    const totalRecords = context?.totalRecords;
    const first = context?.first;
    const onPage = context?.onPage;
    const onSearch = context?.onSearch;
    
    useEffect(() => {
        if(context && (!dependentes))
        {
            // setDependentes(context)
        }
    }, [dependentes, context])

    
    return (
        <ConteudoFrame>
            {
                dependentes ?
                    <DataTableDependentes 
                        dependentes={dependentes} 
                        sortField={sortField} 
                        sortOrder={sortOrder} 
                        onSort={onSort}
                        paginator={paginator}
                        rows={rows}
                        totalRecords={totalRecords}
                        first={first}
                        onPage={onPage}
                        onSearch={onSearch}
                    />
                :
                <ContainerSemRegistro>
                <section className={styles.container}>
                        <img src={Management} />
                        <h6>Não há dependentes registrados</h6>
                        <p>Aqui você verá todos os dependentes registradas.</p>
                    </section>
                </ContainerSemRegistro>
            }

        </ConteudoFrame>
    )
}

export default DependentesListagem