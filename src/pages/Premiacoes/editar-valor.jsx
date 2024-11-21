import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom'
import BotaoGrupo from "@components/BotaoGrupo"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import BotaoSemBorda from "@components/BotaoSemBorda"
import Titulo from "@components/Titulo"
import { Skeleton } from 'primereact/skeleton'
import { FaPencilAlt } from 'react-icons/fa'
import { MdCancel } from "react-icons/md"
import Loading from "@components/Loading"
import styles from './SaldoLivre.module.css'
import { Toast } from 'primereact/toast'
import DataTablePremiacaoEditarValor from "../../components/DataTablePremiacaoEditarValor";
import { useRecargaSaldoLivreContext } from "../../contexts/RecargaSaldoLivre";

function PremiacaoEditarValor() {

    const navegar = useNavigate()
    let { tipo } = useParams()
    const {
        recarga,
        setNome,
        setColaboradores,
        setDepartamentos,
        submeterSaldoLivre
    } = useRecargaSaldoLivreContext()
    const [loading, setLoading] = useState(false)
    const [edicaoAberta, setEdicaoAberta] = useState(false)
    const toast = useRef(null)

    useEffect(() => {
      if(!recarga.name)
      {
        setColaboradores([])
        setDepartamentos([])
        navegar(-1)
      }
    }, [])

    const editarRecarga = (evento) => {
        if (evento.key === 'Enter') {
            evento.preventDefault()
            setEdicaoAberta(false)
        }
    }

    return (
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <Texto weight={500} size="12px">Nome da recarga</Texto>
            {recarga ?
                <>
                    <BotaoGrupo align="space-between">
                        {
                            edicaoAberta ? 
                                <div style={{display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '8px'}}>
                                    <input autoFocus onKeyUp={(evento) => editarRecarga(evento)} style={{fontSize: '28px',fontWeight: '700', width: '70%', boxSizing: 'border-box', height: '35px'}} type="text" value={recarga.name} onChange={(evento) => setNome(evento.target.value)} placeholder={recarga.name}/>
                                    <MdCancel style={{cursor: 'pointer', fill: 'var(--primaria)'}} size={24} onClick={() => setEdicaoAberta(false)} />
                                </div>
                            :
                            <>
                                <Titulo>
                                    <h3>{recarga.name}</h3>
                                </Titulo>
                                <BotaoSemBorda $color="var(--error)">
                                    <FaPencilAlt /><Link onClick={() => setEdicaoAberta(true)} className={styles.link}>Editar</Link>
                                </BotaoSemBorda>
                            </>
                        }
                    </BotaoGrupo>
                    <DataTablePremiacaoEditarValor aoEnviar={submeterSaldoLivre} tipo={tipo} recarga={tipo === 'colaboradores' ? recarga.collaborators : recarga.departamentos} />
                </>
            : <Skeleton variant="rectangular" width={300} height={60} />
            }
        </Frame>
    )
}

export default PremiacaoEditarValor