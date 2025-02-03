import DataTableColaboradores from '@components/DataTableColaboradores'
import http from '@http'
import Loading from '@components/Loading'
// import collaborators from '@json/colaboradores.json'
import { useEffect, useState } from "react";
import styles from './Colaboradores.module.css'
import { useOutletContext } from 'react-router-dom';
import styled from "styled-components"
import Management from '@assets/Management.svg'

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

function ColaboradoresCadastrados() {
    
    const [loading, setLoading] = useState(false)
    const context = useOutletContext();
    const [colaboradores, setColaboradores] = useState([])

    useEffect(() => {
        if(context && (colaboradores.length === 0))
        {
            setColaboradores(context)
        }
    }, [colaboradores, context])

    return (
        <>
            <Loading opened={loading} />
            
            {
                colaboradores.length > 0 ?
                <DataTableColaboradores colaboradores={colaboradores} />
                :
                <ContainerSemRegistro>
                    <section className={styles.container}>
                        <img src={Management} />
                        <h6>Não há colaboradores registrados</h6>
                        <p>Aqui você verá todos os colaboradores registradas.</p>
                    </section>
                </ContainerSemRegistro>
            }
        </>
    )
}

export default ColaboradoresCadastrados