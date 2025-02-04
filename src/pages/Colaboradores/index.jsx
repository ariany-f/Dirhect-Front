import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import BotaoSemBorda from '@components/BotaoSemBorda'
import { GrAddCircle } from 'react-icons/gr'
import styles from './Colaboradores.module.css'
import styled from "styled-components"
import { Link, Outlet, useLocation } from "react-router-dom"
import { FaDownload } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import ModalImportarPlanilha from '@components/ModalImportarPlanilha'
import QuestionCard from '@components/QuestionCard'
import { AiFillQuestionCircle } from 'react-icons/ai'
import http from '@http'
import Loading from '@components/Loading'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function Colaboradores() {

    const location = useLocation();
    const [modalOpened, setModalOpened] = useState(false)
    const [funcionarios, setFuncionarios] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(!funcionarios)
        {
            setLoading(true)
            http.get('funcionario/?format=json')
                .then(response => {
                    setFuncionarios(response)
                    setLoading(false)
                })
                .catch(erro => {
                    setLoading(false)
                })
        }
       
    }, [funcionarios])
    
    return (
        <ConteudoFrame>
            <Loading opened={loading} />
            <BotaoGrupo align="end">
                {/* <BotaoGrupo>
                    <Link className={styles.link} to="/colaborador">
                        <Botao estilo={location.pathname == '/colaborador'?'black':''} size="small" tab>Cadastrados</Botao>
                    </Link>
                </BotaoGrupo> */}
                <BotaoGrupo align="center">
                    <BotaoSemBorda color="var(--primaria)">
                        <FaDownload/><Link onClick={() => setModalOpened(true)} className={styles.link}>Importar planilha</Link>
                    </BotaoSemBorda>
                    <Link to="/colaborador/registro">
                        <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Cadastrar Individualmente</Botao>
                    </Link>
                </BotaoGrupo>
            </BotaoGrupo>
                {/* <QuestionCard alinhamento="end" element={<AiFillQuestionCircle className="question-icon" size={18} />}>
                    <Link to={'/linhas-transporte/como-funciona'} style={{fontSize: '14px', marginLeft: '8px'}}>Como funciona?</Link>
                </QuestionCard> */}
            <Outlet context={funcionarios} />
            <ModalImportarPlanilha opened={modalOpened} aoFechar={() => setModalOpened(false)} />
        </ConteudoFrame>
    )
}

export default Colaboradores