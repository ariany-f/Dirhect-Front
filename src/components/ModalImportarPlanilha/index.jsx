import Botao from "@components/Botao"
import Frame from "@components/Frame"
import BotaoSemBorda from "@components/BotaoSemBorda"
import CardText from "@components/CardText"
import Titulo from "@components/Titulo"
import CampoTexto from "@components/CampoTexto"
import ContainerHorizontal from "@components/ContainerHorizontal"
import Texto from "@components/Texto"
import { RiCloseFill } from 'react-icons/ri'
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import Loading from '@components/Loading'
import http from '@http'
import styles from './ModalImportarPlanilha.module.css'
import { FaDownload } from "react-icons/fa"
import { useColaboradorContext } from "../../contexts/Colaborador"
import { useRef, useState } from "react"
import DottedLine from "@components/DottedLine"
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { addLocale } from "primereact/api"
import { FaTrash } from "react-icons/fa";


const Overlay = styled.div`
    background-color: rgba(0,0,0,0.80);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`
const DialogEstilizado = styled.dialog`
    display: flex;
    width: 40vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    border: none;
    margin: 0 auto;
    top: 22vh;
    padding: 24px;
    & button.close {
        & .fechar {
            box-sizing: initial;
            fill: var(--primaria);
            stroke: var(--primaria);
            color: var(--primaria);
        }
        position: absolute;
        right: 20px;
        top: 20px;
        cursor: pointer;
        border: none;
        background-color: initial;
    }
    & .icon {
        margin-right: 5px;
        box-sizing: initial;
        fill: var(--primaria);
        stroke: var(--primaria);
        color: var(--primaria);
    }
    & .frame:nth-of-type(1) {
        gap: 24px;
        & .frame {
            margin-bottom: 24px;
            & p{
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            & b {
                font-weight: 800;
                font-size: 14px;
            }
        }
    }
    & ul{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: var(--spacing-spacing-8-px, 8px);
        align-self: stretch;
    }
`  
function ModalImportarPlanilha({ opened = false, aoClicar, aoFechar }) {

    const navegar = useNavigate()
    const [planilha, setPlanilha] = useState(null)
    const [loading, setLoading] = useState(false)
    
    const ref = useRef(planilha)

    addLocale('pt', {
        accept: 'Sim',
        reject: 'Importar outra planilha'
    })

    const submeterPlanilha = () => {
        
        if(planilha)
        {
            setLoading(true)
            const body = new FormData();
            body.append('spreadsheet', planilha);
        
            http.post('api/dashboard/collaborator/import', body)
            .then((response) => {
                
                setLoading(false)
                return response
            })
            .catch(erro => {
                setLoading(false)
                return erro.response.data
            })
        }
        else
        {
            ref.current.value = null
            ref.current.click()
        }
    }

    const adicionarPlanilha = (valor) => 
    {
        setPlanilha(valor)
    }

    return(
        <>
            {opened &&
            <Overlay>
                <ConfirmDialog />
                <Loading opened={loading} />
                <DialogEstilizado id="modal-add-departamento" open={opened}>
                    <Frame>
                        <Titulo>
                             <form method="dialog">
                                <button className="close" onClick={aoFechar} formMethod="dialog">
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                            </form>
                            <h5>Adicionar colaborador por planilha</h5>
                        </Titulo>
                    </Frame>
                    <Frame padding="24px 0px">
                       <ul>
                            <li>Baixe o modelo</li>
                            <li>Preencha o arquivo e salve em formato XLS e faça o upload</li>
                       </ul>
                       <CardText gap="32px">
                            <p className={styles.subtitulo}>Atenção: Caso o envio dos cartões seja para a residência dos colaboradores é importante que os endereços sejam preenchidos no momento do cadastro.</p>
                        </CardText>
                        <DottedLine margin="2px"/>
                    </Frame>
                    <form method="dialog" style={{display: 'flex', flexDirection: 'column'}}>
                        {planilha &&
                            <ContainerHorizontal>
                                <Texto>{planilha?.name}</Texto>
                                <FaTrash style={{cursor: 'pointer'}} onClick={() => setPlanilha(null)} />
                            </ContainerHorizontal>
                        }
                        <CampoTexto reference={ref} name="planilha" type="file" setValor={adicionarPlanilha}></CampoTexto>
                        <Botao aoClicar={submeterPlanilha} estilo="vermilion" size="medium" filled>{!planilha ? 'Selecionar' : 'Enviar'} arquivo</Botao>
                        <div className={styles.containerBottom}>
                            <BotaoSemBorda color="var(--primaria)"><FaDownload/><a href={'./src/assets/exemplo_colaboradores_001.xlsx'} target="_blank" download>Baixar modelo</a></BotaoSemBorda>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalImportarPlanilha