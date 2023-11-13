import Texto from '@components/Texto'
import styles from './Departamento.module.css'
import styled from 'styled-components';
import BadgeBeneficio from './BadgeBeneficio';
import colaboradores from '@json/colaboradores.json'
import { Link } from 'react-router-dom';

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

    const clbdr = colaboradores.filter(colaborador => {
        return colaborador.departments.hasOwnProperty(department.name)
    });

    return (
        <Link to={`/departamento/detalhes/${department.public_id}`}>
        <div className={styles.departamento}>
            <div className={styles.left}>
                <Texto weight={700} className={styles.departmentName}>{department.name}</Texto>
                {(clbdr.length) ?
                    <div className={styles.recuo} weight={500} color="var(--neutro-500)">
                        Colaboradores:&nbsp;
                        <NumeroColaboradores weight={700}>{clbdr.length}</NumeroColaboradores>
                    </div>
                : ''}
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