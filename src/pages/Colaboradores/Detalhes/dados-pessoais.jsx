import { useEffect, useRef, useState } from "react"
import http from '@http'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import BotaoSemBorda from '@components/BotaoSemBorda'
import ContainerHorizontal from '@components/ContainerHorizontal'
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import { Link, useOutletContext, useParams } from "react-router-dom"
import { Skeleton } from 'primereact/skeleton'
import styles from './Detalhes.module.css'
import { RiEditBoxFill } from 'react-icons/ri'
import { Toast } from 'primereact/toast'
import ModalAlterarTelefone from '@components/ModalAlterar/telefone'
import ModalAlterarEmail from '@components/ModalAlterar/email'
import collaborators from '@json/colaboradores.json'

function ColaboradorDadosPessoais() {

    let { id } = useParams()
    const [colaborador, setColaborador] = useState(null)
    const context = useOutletContext()
    const [modalTelefoneOpened, setModalTelefoneOpened] = useState(false)
    const [modalEmailOpened, setModalEmailOpened] = useState(false)
    const toast = useRef(null)
    
    const {
        usuario,
        solicitarCodigoLogin
    } = useSessaoUsuarioContext()

    useEffect(() => {
        if(context && (!colaborador))
        {
            setColaborador(context);
        }
        else {
            console.log(colaborador)
        }
    }, [colaborador, context])

    function editarEmail(email) {
      
        solicitarCodigoLogin()
        .then((response) => {
            if(response.success)
            {
                let obj = {}
                obj['email'] = email
                obj['code'] = response.data.code
                http.post(`api/collaborator/update/${id}`, obj)
                .then(response => {
                   if(response.success)
                    {
                        toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                        setModalTelefoneOpened(false)
                    }
                })
                .catch(erro => console.log(erro))
            }
        })
    }

    function editarTelefone(telefone) {
       
        let obj = {}
        const phoneCode = telefone.substring(0, 2);
        const phoneNumber = telefone.substring(2).trim();
        obj['phone_code'] = phoneCode
        obj['phone_number'] = phoneNumber
      
        http.post(`api/collaborator/update/${id}`, obj)
        .then(response => {
           if(response.success)
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
            {colaborador?.dados_pessoa_fisica?.nome ?
                <Texto weight="800">{colaborador?.dados_pessoa_fisica?.nome}</Texto>
                : <Skeleton variant="rectangular" width={200} height={25} />
            }
            <Texto>Nome social</Texto>
            {colaborador ?
                (colaborador?.collaborator && colaborador?.collaborator?.social_reason ?
                    <Texto weight="800">{colaborador?.collaborator.social_reason}</Texto>
                    : '--')
                : <Skeleton variant="rectangular" width={200} height={25} />
            }
            <Texto>CPF</Texto>
            {colaborador?.dados_pessoa_fisica?.cpf ?
                <Texto weight="800">{formataCPF(colaborador?.dados_pessoa_fisica?.cpf)}</Texto>
                : <Skeleton variant="rectangular" width={200} height={25} />
            }
        </div>
        <Titulo><h6>Informações de contato</h6></Titulo>

        <div className={styles.card_dashboard}>
            <ContainerHorizontal width="50%">
                <Frame gap="5px">
                    <Texto>Telefone/Celular</Texto>
                    {colaborador?.phones && colaborador?.phones.length ?
                        <Texto weight="800">{colaborador?.phones[0].phone_code + colaborador?.phones[0].phone_number}</Texto>
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
                    {colaborador?.user && colaborador?.user?.email ?
                        <Texto weight="800">{colaborador?.user.email}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </Frame>
                <BotaoSemBorda>
                    <RiEditBoxFill size={18} />
                    <Link onClick={() => setModalEmailOpened(true)} className={styles.link}>Alterar</Link>
                </BotaoSemBorda>
            </ContainerHorizontal>
        </div>
        <ModalAlterarTelefone dadoAntigo={((colaborador?.phones && colaborador?.phones.length) ? (colaborador?.phones[0].phone_code + colaborador?.phones[0].phone_number) : '')} aoClicar={editarTelefone} opened={modalTelefoneOpened} aoFechar={() => setModalTelefoneOpened(!modalTelefoneOpened)} />
        <ModalAlterarEmail dadoAntigo={(colaborador?.user ? colaborador?.user?.email : '')} aoClicar={editarEmail} opened={modalEmailOpened} aoFechar={() => setModalEmailOpened(!modalEmailOpened)} />
       
        </>
    )
}

export default ColaboradorDadosPessoais