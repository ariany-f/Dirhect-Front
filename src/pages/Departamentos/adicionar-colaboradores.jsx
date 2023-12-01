import http from '@http'
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from 'react-router-dom'
import BotaoGrupo from "@components/BotaoGrupo"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import BotaoSemBorda from "@components/BotaoSemBorda"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import { Skeleton } from 'primereact/skeleton'
import { FaPencilAlt } from 'react-icons/fa'
import { MdCancel } from "react-icons/md"
import styles from './Departamento.module.css'
import CampoTexto from '../../components/CampoTexto'
import { Toast } from 'primereact/toast'

function DepartamentoAdicionarColaboradores() {

    let { id } = useParams()
    const [departamento, setDepartamento] = useState(null)
    const [edicaoAberta, setEdicaoAberta] = useState(false)
    const [nomeDepartamento, setNomeDepartamento] = useState('')
    const toast = useRef(null)

    useEffect(() => {
        http.get("api/dashboard/department/"+id)
            .then(response => {
                if(response.status === 'success')
                {
                    setDepartamento(response.department)
                }
            })
            .catch(erro => console.log(erro))
    }, [edicaoAberta])

    const [colaboradores, setColaboradores] = useState([])

    useEffect(() => {
        http.get('api/dashboard/collaborator')
            .then(response => {
                setColaboradores(response.data.collaborators)
            })
            .catch(erro => console.log(erro))
    }, [])

    const editarDepartamento = (evento) => {
        if (evento.key === 'Enter') {
            evento.preventDefault()
            const obj = {
                status: departamento.status,
                name: nomeDepartamento,
                description: departamento.description
            }
    
            http.put(`api/dashboard/department/${id}`, obj)
            .then(response => {
                if(response.status === 'success')
                {
                    toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                    setEdicaoAberta(false)
                }
            })
            .catch(erro => console.log(erro))
        }        
    }

    return (
        <Frame>
            <Toast ref={toast} />
            <Texto weight={500} size="12px">Nome do departamento</Texto>
            {departamento ?
                <>
                    <BotaoGrupo align="space-between">
                        {
                            edicaoAberta ? 
                                <div style={{display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '8px'}}>
                                    <input autoFocus onKeyUp={(evento) => editarDepartamento(evento)} style={{fontSize: '28px',fontWeight: '700', width: '70%', boxSizing: 'border-box', height: '35px'}} type="text" value={nomeDepartamento} onChange={(evento) => setNomeDepartamento(evento.target.value)} placeholder={departamento.name}/>
                                    <MdCancel style={{cursor: 'pointer', fill: 'var(--primaria)'}} size={24} onClick={() => setEdicaoAberta(false)} />
                                </div>
                            :
                            <>
                                <Titulo>
                                    <h3>{departamento.name}</h3>
                                </Titulo>
                                <BotaoSemBorda $color="var(--error)">
                                    <FaPencilAlt /><Link onClick={() => setEdicaoAberta(true)} className={styles.link}>Editar</Link>
                                </BotaoSemBorda>
                            </>
                        }
                    
                    </BotaoGrupo>
                    <div style={{width: '100%', borderBottom: '1px dotted var(--neutro-300)', marginTop: '24px', marginBottom: '24px'}} ></div>
                    <Titulo>
                        <h6>Selecione os colaboradores</h6>
                        <SubTitulo>
                            Os colaboradores selecionados serão incluídos nesse novo departamento
                        </SubTitulo>
                    </Titulo>
                </>
            : <Skeleton variant="rectangular" width={300} height={60} />
            }
        </Frame>
    )
}

export default DepartamentoAdicionarColaboradores