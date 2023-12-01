import DepartamentoCard from '@components/DepartamentoCard'
import CampoTexto from '@components/CampoTexto'
import departments from '@json/departments.json'
import styles from './Departamento.module.css'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import http from '@http'

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
        http.get('api/dashboard/department')
            .then(response => {
                if(response.data.departments)
                {
                    setDepartamentos(response.data.departments)
                }
            })
            .catch(erro => console.log(erro))
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
            
            <div className={styles.cardsDepartamento}>
                {departamentos.map(department => {
                    return (
                    <DepartamentoCard key={department.public_id} department={department}/>
                    )
                })}
            </div>
        </>
    )
}

export default DepartamentoLista