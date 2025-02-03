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
    const [pessoasfisicas, setPessoasFisicas] = useState(null)
    const [func_pss, setFuncPess] = useState(null)

    useEffect(() => {
        if(!funcionarios)
        {
            http.get('funcionario/?format=json')
                .then(response => {
                    setFuncionarios(response)
                })
                .catch(erro => console.log(erro))
        }
        if(!pessoasfisicas) {
            
            http.get('pessoa_fisica/?format=json')
                .then(response => {
                    setPessoasFisicas(response)
                })
                .catch(erro => console.log(erro))
        }

        if (pessoasfisicas && funcionarios && !func_pss) {
            const processados = funcionarios.map(item => {
                const pessoa = pessoasfisicas.find(pessoa => pessoa.id === item.id_pessoafisica);
                return { ...item, pessoa_fisica: pessoa || null }; // Adiciona `pessoa_fisica` ao item
            });
        
            setFuncPess(processados); // Atualiza o estado com os dados processados
        }
    }, [funcionarios, pessoasfisicas, func_pss])
    
    return (
        <ConteudoFrame>
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
                <QuestionCard alinhamento="end" element={<AiFillQuestionCircle className="question-icon" size={18} />}>
                    <Link to={'/linhas-transporte/como-funciona'} style={{fontSize: '14px', marginLeft: '8px'}}>Como funciona?</Link>
                </QuestionCard>
            <Outlet context={func_pss} />
            <ModalImportarPlanilha opened={modalOpened} aoFechar={() => setModalOpened(false)} />
        </ConteudoFrame>
    )
}

export default Colaboradores