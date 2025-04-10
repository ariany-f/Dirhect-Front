import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Titulo from '@components/Titulo'
import BotaoVoltar from '@components/BotaoVoltar'
import styles from './SaldoLivre.module.css'
import { GrAddCircle } from 'react-icons/gr'
import QuestionCard from '@components/QuestionCard'
import Texto from '@components/Texto'
import http from '@http'
import CheckboxContainer from "@components/CheckboxContainer"
import Container from '@components/Container'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import DataTableFiliaisElegibilidade from '@components/DataTableFiliaisElegibilidade'
import DataTableSindicatosElegibilidade from '@components/DataTableSindicatosElegibilidade'
import DataTableDepartamentosElegibilidade from '@components/DataTableDepartamentosElegibilidade'
import DataTableSecoesElegibilidade from '@components/DataTableSecoesElegibilidade'
import DataTableCentrosCustoElegibilidade from '@components/DataTableCentrosCustoElegibilidade'
import DataTableCargosElegibilidade from '@components/DataTableCargosElegibilidade'
import DataTableFuncoesElegibilidade from '@components/DataTableFuncoesElegibilidade'
import DataTableHorariosElegibilidade from '@components/DataTableHorariosElegibilidade'
import Loading from '@components/Loading'
import Frame from '@components/Frame'
import styled from "styled-components"
import { Link, Outlet, useLocation, useOutlet, useOutletContext } from "react-router-dom"
import { FaDownload } from 'react-icons/fa'
import { useState, useEffect, useRef } from 'react'
import React, { createContext, useContext } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import DataTableElegibilidade from '@components/DataTableElegibilidade'
import { AiFillQuestionCircle } from 'react-icons/ai'
import { Toast } from 'primereact/toast'
import { TabPanel, TabView } from 'primereact/tabview'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`


let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const ElegibilidadeLista = () => {

    const location = useLocation();
    const context = useOutletContext()
    const toast = useRef(null)
    const [loading, setLoading] = useState(false)
    const [filiais, setFiliais] = useState(null)
    const [departamentos, setDepartamentos] = useState(null)
    const [secoes, setSecoes] = useState(null)
    const [cargos, setCargos] = useState(null)
    const [funcoes, setFuncoes] = useState(null)
    const [centros_custo, setCentrosCusto] = useState(null)
    const [sindicatos, setSindicatos] = useState(null)
    const [horarios, setHorarios] = useState(null)

    const fetchData = (endpoint, setter) => {
        http.get(`${endpoint}/?format=json`)
            .then(setter)
            .catch(console.error)
    };

    useEffect(() => {
        setLoading(true);
        fetchData('filial', setFiliais);
        fetchData('departamento', setDepartamentos);
        fetchData('secao', setSecoes);
        fetchData('cargo', setCargos);
        fetchData('centro_custo', setCentrosCusto);
        fetchData('sindicato', setSindicatos);
        fetchData('horario', setHorarios);
        fetchData('funcao', setFuncoes);
    }, []);

    useEffect(() => {
        if(context && context.length > 0) {
            const atualizarDados = () => {
                const adicionarElegibilidade = (entidade, setEntidade, nomeEntidade) => {
                    
                    setEntidade(prev =>
                        prev?.map(item => {
                            const correspondente = context.find(
                                el => el.content_type_name === nomeEntidade && el.entidade_id_origem === item.id
                            );
                            return {
                                ...item,
                                elegibilidade: correspondente || null
                            };
                        }) || []
                    );
                };
            
                adicionarElegibilidade(filiais, setFiliais, 'Filial');
                adicionarElegibilidade(departamentos, setDepartamentos, 'Departamento');
                adicionarElegibilidade(secoes, setSecoes, 'Secao');
                adicionarElegibilidade(cargos, setCargos, 'Cargo');
                adicionarElegibilidade(funcoes, setFuncoes, 'Funcao');
                adicionarElegibilidade(centros_custo, setCentrosCusto, 'Centro de Custo');
                adicionarElegibilidade(sindicatos, setSindicatos, 'Sindicato');
                adicionarElegibilidade(horarios, setHorarios, 'Horario');
                // Espera o próximo "tick" de renderização antes de liberar o loading
                requestAnimationFrame(() => {
                    setLoading(false);
                });
            };

            atualizarDados();
        }
        else
        {
            if(filiais && departamentos && secoes && cargos && funcoes && centros_custo && sindicatos && horarios && filiais.length  > 0 && departamentos.length > 0 && secoes.length > 0 && cargos.length > 0 && funcoes.length > 0 && centros_custo.length > 0 && sindicatos.length > 0 && horarios.length > 0)
            {
                setLoading(false)
            }
        }
    }, [context, filiais, departamentos, secoes, cargos, funcoes, centros_custo, sindicatos, horarios]);

    return (
        <ConteudoFrame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            <BotaoGrupo align="end">
                <BotaoGrupo>
                    <Link to="/elegibilidade/configurar">
                        <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Configurar</Botao>
                    </Link>
                </BotaoGrupo>
            </BotaoGrupo>
            <QuestionCard alinhamento="end" element={<AiFillQuestionCircle className="question-icon" size={18} />}>
                <Link to={'/elegibilidade/como-funciona'} style={{fontSize: '14px', marginLeft: '8px'}}>Como funciona?</Link>
            </QuestionCard>
            <Frame>
                <Container gap="32px">
                    <TabView>
                        <TabPanel header="Filiais">
                            <DataTableFiliaisElegibilidade filiais={filiais} showSearch={false} />
                        </TabPanel>
                        <TabPanel header="Departamentos">
                            <DataTableDepartamentosElegibilidade departamentos={departamentos} showSearch={false}  />
                        </TabPanel>
                        <TabPanel header="Seções">
                            <DataTableSecoesElegibilidade secoes={secoes} showSearch={false} />
                        </TabPanel>
                        <TabPanel header="Centros de Custo">
                            <DataTableCentrosCustoElegibilidade centros_custo={centros_custo} showSearch={false} />
                        </TabPanel>
                        <TabPanel header="Cargos">
                            <DataTableCargosElegibilidade cargos={cargos} showSearch={false} />
                        </TabPanel>
                        <TabPanel header="Funções">
                            <DataTableFuncoesElegibilidade funcoes={funcoes} showSearch={false} />
                        </TabPanel>
                        <TabPanel header="Sindicatos">
                            <DataTableSindicatosElegibilidade sindicatos={sindicatos} showSearch={false} />
                        </TabPanel>
                        <TabPanel header="Horários">
                            <DataTableHorariosElegibilidade horarios={horarios} showSearch={false} />
                        </TabPanel>
                    </TabView>
                </Container>
            </Frame>
    
        </ConteudoFrame>
    );
};

export default ElegibilidadeLista; 