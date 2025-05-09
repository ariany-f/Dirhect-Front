import http from '@http'
import { useEffect, useRef, useState } from 'react'
import Titulo from '@components/Titulo'
import SubTitulo from '@components/SubTitulo'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import { Skeleton } from 'primereact/skeleton'
import styles from './MeusDados.module.css'
import { Toast } from 'primereact/toast'
import CampoTexto from '@components/CampoTexto'
import Botao from '@components/Botao'
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import styled from 'styled-components';
import { ArmazenadorToken } from '@utils';

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const Col6 = styled.div`
    padding: 20px;
    flex: 1 1 50%;
`;

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: flex-end;
    & button {
        width: initial;
    }
`;

function MeusDadosDadosFaturamento() {
    const [loading, setLoading] = useState(false)
    const [dados, setDados] = useState(null)
    const toast = useRef(null)

    const { usuario } = useSessaoUsuarioContext();

    useEffect(() => {
        setLoading(true)
        if (usuario && usuario.companies && usuario.companies.length > 0) {
            const selecionada = usuario.companies.find(c => String(c.id_tenant) === String(ArmazenadorToken.UserCompanyPublicId)) || usuario.companies[0];

            const pj = selecionada.pessoaJuridica;
            setDados({
                razaoSocial: pj.razao_social || '',
                cnpj: pj.cnpj || '',
                nomeFantasia: pj.nome_fantasia || '',
                banco: '',
                agencia: '',
                conta: '',
                email: pj.email || '',
                inscricaoEstadual: pj.inscricao_estadual || '',
                inscricaoMunicipal: pj.inscricao_municipal || '',
            });
        }
        setLoading(false)
    }, [usuario])

    const handleChange = (campo, valor) => {
        setDados(prev => ({ ...prev, [campo]: valor }))
    }

    const handleSalvar = () => {
        toast.current.show({ severity: 'success', summary: 'Salvo', detail: 'Dados de faturamento salvos!', life: 3000 })
    }

    return (
        <form>
            <Toast ref={toast} />
            <Frame estilo="spaced">
                <Titulo>
                    <h6>Dados de Faturamento</h6>
                </Titulo>
            </Frame>
            <Col12>
                <Col6>
                    <Texto>Razão Social</Texto>
                    {loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dados?.razaoSocial} setValor={v => handleChange('razaoSocial', v)} />}
                </Col6>
                <Col6>
                    <Texto>CNPJ</Texto>
                    {loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dados?.cnpj} setValor={v => handleChange('cnpj', v)} />}
                </Col6>
            </Col12>
            <Col12>
                <Col6>
                    <Texto>Nome Fantasia</Texto>
                    {loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dados?.nomeFantasia} setValor={v => handleChange('nomeFantasia', v)} />}
                </Col6>
                <Col6>
                    <Texto>Banco</Texto>
                    {loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dados?.banco} setValor={v => handleChange('banco', v)} />}
                </Col6>
            </Col12>
            <Col12>
                <Col6>
                    <Texto>Agência</Texto>
                    {loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dados?.agencia} setValor={v => handleChange('agencia', v)} />}
                </Col6>
                <Col6>
                    <Texto>Conta</Texto>
                    {loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dados?.conta} setValor={v => handleChange('conta', v)} />}
                </Col6>
            </Col12>
            <Col12>
                <Col6>
                    <Texto>E-mail de faturamento</Texto>
                    {loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dados?.email} setValor={v => handleChange('email', v)} />}
                </Col6>
                <Col6>
                    <Texto>Inscrição Estadual</Texto>
                    {loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dados?.inscricaoEstadual} setValor={v => handleChange('inscricaoEstadual', v)} />}
                </Col6>
            </Col12>
            <Col12>
                <Col6>
                    <Texto>Inscrição Municipal</Texto>
                    {loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dados?.inscricaoMunicipal} setValor={v => handleChange('inscricaoMunicipal', v)} />}
                </Col6>
            </Col12>
            <ContainerButton>
                <Botao estilo="vermilion" size="medium" aoClicar={handleSalvar}>Salvar Dados</Botao>
            </ContainerButton>
        </form>
    )
}

export default MeusDadosDadosFaturamento