import http from '@http'
import { useEffect } from "react";
import BotaoGrupo from '@components/BotaoGrupo'
import BotaoSemBorda from '@components/BotaoSemBorda'
import Botao from '@components/Botao'
import { GrAddCircle } from 'react-icons/gr'
import styles from './Beneficios.module.css'
import { FaMapPin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Beneficios() {

    useEffect(() => {
        http.get('api/dashboard/benefit')
            .then(response => {
                console.log(response)
            })
            .catch(erro => console.log(erro))
    }, [])

    const url = window.location.pathname;
    return (
        <>
            <BotaoGrupo align="space-between">
                <BotaoSemBorda color="var(--primaria)">
                    <FaMapPin/><Link to={'/beneficio/onde-usar'} className={styles.link}>Onde usar</Link>
                </BotaoSemBorda>
                <Link to="/beneficio/selecao-tipo-recarga">
                    <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Disponibilizar benefícios</Botao>
                </Link>
            </BotaoGrupo>
        </>
    )
}

export default Beneficios