import { useEffect, useRef, useState } from "react"
import http from '@http'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import BotaoSemBorda from '@components/BotaoSemBorda'
import ContainerHorizontal from '@components/ContainerHorizontal'
import { Link, useParams } from "react-router-dom"
import { Skeleton } from 'primereact/skeleton'
import styles from './Detalhes.module.css'
import { RiEditBoxFill } from 'react-icons/ri'
import { Toast } from 'primereact/toast'
import ModalAlterar from "@components/ModalAlterar"

function ColaboradorDadosPessoais() {

    let { id } = useParams()
    const [colaborador, setColaborador] = useState({})
    const [modalOpened, setModalOpened] = useState(false)
    const [parametroEdicao, setParametroEdicao] = useState(null)
    const [dadoEdicao, setDadoEdicao] = useState(null)
    const toast = useRef(null)

    useEffect(() => {
        http.get(`api/dashboard/collaborator/${id}`)
            .then(response => {
                if (response.collaborator) {
                    setColaborador(response.collaborator)
                }
            })
            .catch(erro => console.log(erro))
    }, [modalOpened])

    function editarColaborador(dado){

        let obj = {}
        obj[parametroEdicao] = dado

        http.put(`api/dashboard/collaborator/${id}`, obj)
        .then(response => {
            if(response.status === 'success')
            {
                toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                setModalOpened(false)
            }
        })
        .catch(erro => console.log(erro))
    }

    function AbrirModalEditarColaborador(parametro, dado_antigo){
        setParametroEdicao(parametro)
        setModalOpened(true)
        setDadoEdicao(dado_antigo)
    }

    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    return (
        <>
        <Toast ref={toast} />
        <Titulo><h6>Informações gerais</h6></Titulo>
        <div className={styles.card_dashboard}>
            <Texto>Nome completo</Texto>
            {colaborador.name ?
                <Texto weight="800">{colaborador?.name}</Texto>
                : <Skeleton variant="rectangular" width={200} height={25} />
            }
            <Texto>Nome social</Texto>
            {colaborador ?
                (colaborador.social ?
                    <Texto weight="800">{colaborador?.social}</Texto>
                    : '--')
                : <Skeleton variant="rectangular" width={200} height={25} />
            }
            <Texto>CPF</Texto>
            {colaborador.document ?
                <Texto weight="800">{formataCPF(colaborador?.document)}</Texto>
                : <Skeleton variant="rectangular" width={200} height={25} />
            }
        </div>
        <Titulo><h6>Informações de contato</h6></Titulo>

        <div className={styles.card_dashboard}>
            <ContainerHorizontal width="50%">
                <Frame gap="5px">
                    <Texto>Telefone/Celular</Texto>
                    {colaborador.phone_number ?
                        <Texto weight="800">{colaborador?.phone_number}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </Frame>
                <BotaoSemBorda>
                    <RiEditBoxFill size={18} />
                    <Link onClick={() => AbrirModalEditarColaborador('phone_number', colaborador.phone_number)} className={styles.link}>Alterar</Link>
                </BotaoSemBorda>
            </ContainerHorizontal>
            <ContainerHorizontal width="50%">
                <Frame gap="5px">
                    <Texto>E-mail</Texto>
                    {colaborador.email ?
                        <Texto weight="800">{colaborador?.email}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </Frame>
                <BotaoSemBorda>
                    <RiEditBoxFill size={18} />
                    <Link onClick={() => AbrirModalEditarColaborador('email', colaborador.email)} className={styles.link}>Alterar</Link>
                </BotaoSemBorda>
            </ContainerHorizontal>
        </div>
        <ModalAlterar aoClicar={editarColaborador} opened={modalOpened} aoFechar={() => setModalOpened(!modalOpened)} parametroParaEditar={parametroEdicao} dadoAntigo={dadoEdicao}  />
        </>
    )
}

export default ColaboradorDadosPessoais