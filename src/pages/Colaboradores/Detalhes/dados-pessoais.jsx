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
import ModalAlterarTelefone from '@components/ModalAlterar/telefone'
import ModalAlterarEmail from '@components/ModalAlterar/email'

function ColaboradorDadosPessoais() {

    let { id } = useParams()
    const [colaborador, setColaborador] = useState({})
    const [modalTelefoneOpened, setModalTelefoneOpened] = useState(false)
    const [modalEmailOpened, setModalEmailOpened] = useState(false)
    const toast = useRef(null)

    useEffect(() => {
        http.get(`api/collaborator/show/${id}`)
            .then(response => {
                if (response.data.collaborator) {
                    setColaborador(response.data.collaborator)
                }
            })
            .catch(erro => console.log(erro))
    }, [modalTelefoneOpened, modalEmailOpened])

    function editarEmail(email) {
        let obj = {}
        obj['email'] = email
      
        http.put(`api/collaborator/update/${id}`, obj)
        .then(response => {
            if(response.status === 'success')
            {
                toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                setModalTelefoneOpened(false)
            }
        })
        .catch(erro => console.log(erro))
    }

    function editarTelefone(telefone) {
        let obj = {}
        obj['phone_number'] = telefone
      
        http.put(`api/dashboard/collaborator/${id}`, obj)
        .then(response => {
            if(response.status === 'success')
            {
                toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                setModalTelefoneOpened(false)
            }
        })
        .catch(erro => console.log(erro))
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
                    <Link onClick={() => setModalTelefoneOpened(true)} className={styles.link}>Alterar</Link>
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
                    <Link onClick={() => setModalEmailOpened(true)} className={styles.link}>Alterar</Link>
                </BotaoSemBorda>
            </ContainerHorizontal>
        </div>
        <ModalAlterarTelefone dadoAntigo={colaborador?.phone_number} aoClicar={editarTelefone} opened={modalTelefoneOpened} aoFechar={() => setModalTelefoneOpened(!modalTelefoneOpened)} />
        <ModalAlterarEmail dadoAntigo={colaborador?.email} aoClicar={editarEmail} opened={modalEmailOpened} aoFechar={() => setModalEmailOpened(!modalEmailOpened)} />
       
        </>
    )
}

export default ColaboradorDadosPessoais