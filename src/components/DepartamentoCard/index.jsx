import Texto from '@components/Texto'
import styles from './Departamento.module.css'
import styled from 'styled-components';
import http from '@http'
import BadgeBeneficio from '@components/BadgeBeneficio';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Skeleton } from 'primereact/skeleton';

const NumeroColaboradores = styled.p`
    color: var(--base-black);
    font-feature-settings: 'clig' off, 'liga' off;
    /* Dashboard/14px/Bold */
    font-family: var(--fonte-secundaria);
    font-size: 14px;
    font-weight: 700;
    line-height: 20px; /* 142.857% */
`

function DepartamentoCard({department}) {
    
    const [clbdr, setClbdr] = useState(null)

    useEffect(() => {
        http.get('api/collaborator/index')
            .then(response => {
                if(response.success)
                {
                    const filtered = response.data.collaborators.filter(colaborador => {
                        return (department.name in colaborador.departments)
                    })
                    setClbdr(filtered)
                }
            })
            .catch(erro => console.log(erro))
    }, [])
    
    return (
        <Link to={`/departamento/detalhes/${department.public_id}`}>
        <div className={styles.departamento}>
            <div className={styles.left}>
                <Texto weight={700} className={styles.departmentName}>{department.name}</Texto>
                <div className={styles.recuo} weight={500} color="var(--neutro-500)">
                    Colaboradores:&nbsp;
                    {clbdr ? 
                        <NumeroColaboradores weight={700}>{clbdr.length}</NumeroColaboradores>
                        : <Skeleton variant="rectangular" width={10} height={20} />
                    }
                </div>
            </div>
            <div className={styles.right}>
                <Texto weight={500}>Benefícios configurados</Texto>
                <div className={styles.beneficios}>
                    {department.benefits.map((benefit, index) => {
                        return (
                            <BadgeBeneficio key={index} nomeBeneficio={benefit}/>
                        )
                    })}
                </div>
            </div>
        </div>
        </Link>
    )
}

export default DepartamentoCard