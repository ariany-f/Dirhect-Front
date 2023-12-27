import CampoTexto from '@components/CampoTexto'
import styles from './Departamento.module.css'
import styled from 'styled-components'
import { Skeleton } from 'primereact/skeleton'
import { useEffect, useState } from 'react'
import http from '@http'
import DataTableDepartamentos from '../../components/DataTableDepartamentos'

const CardText = styled.div`
    display: flex;
    width: 584px;
    padding: 10px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    background: var(--neutro-100);
`

function DepartamentoLista() {

    const [search, setSearch] = useState('');
    const [departamentos, setDepartamentos] = useState([])

    useEffect(() => {
        if(departamentos.length === 0)
        {
            http.get('api/dashboard/department')
                .then(response => {
                    if(response.data.departments)
                    {
                        setDepartamentos(response.data.departments)
                    }
                })
                .catch(erro => console.log(erro))
        }
    }, [departamentos])

    return (
        <>
            <CardText>
                <p className={styles.subtitulo}>Sempre que cadastrar um novo colaborador, você terá a opção de colocá-lo em um departamento, isso facilita na organização e na recarga de benefícios.</p>
            </CardText>
            {departamentos.lenght ?
                <CampoTexto name="search" width={'320px'} valor={search} setValor={setSearch} type="search" label="" placeholder="Buscar um departamento" />
                : <></>
            }
            {departamentos.length ?
            <>
                <DataTableDepartamentos departamentos={departamentos} />
            </>
            :   <>
                    <Skeleton variant="rectangular" width={320} height={70} />
                    <br/><br/>
                    <Skeleton variant="rectangular" width={1000} height={80} />
                    <Skeleton variant="rectangular" width={1000} height={80} />
                    <Skeleton variant="rectangular" width={1000} height={80} />
                </>
            }
        </>
    )
}

export default DepartamentoLista