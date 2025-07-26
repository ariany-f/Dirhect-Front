import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import BotaoVoltar from "@components/BotaoVoltar"
import { useEffect, useState } from "react"
import Loading from "@components/Loading"
import { Link, useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import http from "@http"
import { ArmazenadorToken } from '@utils';

function EsqueciASenha() {
    
    const [classError, setClassError] = useState([])
    const [ready, setReady] = useState(false)
    const [loading, setLoading] = useState(false)
    const navegar = useNavigate()

    const {
        usuario,
        setCpf,
        setEmail,
        solicitarCodigoRecuperacaoSenha
    } = useSessaoUsuarioContext()

    async function handleEsqueciASenha() {
        const data = {
            username: import.meta.env.VITE_API_USER,
            password: import.meta.env.VITE_API_PASS
        }
        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 15);
        try {
            const response = await http.post(`/app-login/`, data);
            ArmazenadorToken.definirToken(response.access, null, null, null);
            
            return response;
        } catch (error) {
            setLoading(false);
            console.log(error);
            throw error;
        }
    }

    useEffect(() =>{
        ArmazenadorToken.removerToken();
        ArmazenadorToken.removerTempToken();
        ArmazenadorToken.removerPermissoes();
        ArmazenadorToken.removerCompany();
        async function init() {
            let tentativas = 0;
            let sucesso = false;
            while (tentativas < 3 && !sucesso) {
                try {
                    await handleEsqueciASenha();
                    sucesso = true;
                } catch (error) {
                    tentativas++;
                    if (tentativas >= 3) {
                        toast.error('Erro ao conectar com o serviço de autenticação. Tente novamente mais tarde.');
                        break;
                    }
                }
            }
            setReady(true);
        }
        init();
    }, [])

    const sendData = (evento) => {

        if(!usuario.email) {
            toast.info('Preencha e-mail!');
            return;
        }

        evento.preventDefault()

        document.querySelectorAll('input').forEach(function(element) {
            if(element.value !== '')
            {
                if(classError.includes(element.name))
                {
                    setClassError(classError.filter(item => item !== element.name))
                }
            }
            else
            {
                if(!classError.includes(element.name))
                {
                    setClassError(estadoAnterior => [...estadoAnterior, element.name])
                }
            }
        })

        if(document.querySelectorAll("form .error").length === 0 && document.querySelectorAll('input:not([value]), input[value=""]').length === 0)
        {
            setLoading(true);
            solicitarCodigoRecuperacaoSenha()
                .then((response) => {
                    if(response.detail && response.detail !== "Se o email estiver registrado no sistema, você receberá um link para redefinição de senha.")
                    {
                        toast.error(response.detail)
                    }
                    else
                    {
                        if(response.detail)
                        {
                            toast.success(response.detail)
                        }
                        navegar('/esqueci-a-senha/seguranca')
                    }
                })
                .catch(erro => {
                    if(erro.detail)
                    {
                        toast.error(erro.detail)
                    }
                    else
                    {
                        toast.error('Erro ao solicitar código de recuperação de senha!')
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }

    if (!ready) {
        return <Loading opened={true} />;
    }

    return (
        <>
            <Loading opened={loading} />
            <Frame gap="16px">
                <BotaoVoltar />
                <Titulo>
                    <h2>Esqueceu sua senha?</h2>
                    <SubTitulo>
                    Para recuperar sua senha, precisamos do e-mail da conta
                    </SubTitulo>
                </Titulo>
            </Frame>
            <form>
                <Frame>
                    <CampoTexto tipo="email" camposVazios={classError} name="email" valor={usuario.email} setValor={setEmail} label="E-mail do responsável" placeholder="Digite o E-mail do responsável" />
                </Frame>
            </form>
            <Botao aoClicar={sendData} estilo="vermilion" size="medium" filled>Confirmar</Botao>
        </>
    )
}

export default EsqueciASenha