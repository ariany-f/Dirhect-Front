import { useState, useEffect, useRef } from 'react';
import Titulo from '@components/Titulo';
import Frame from '@components/Frame';
import Texto from '@components/Texto';
import CampoTexto from '@components/CampoTexto';
import { Skeleton } from 'primereact/skeleton';
import Botao from '@components/Botao';
import { Toast } from 'primereact/toast';
import styles from './MeusDados.module.css';
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

function MeusDadosEndereco() {
    const [loading, setLoading] = useState(false);
    const [endereco, setEndereco] = useState(null);
    const toast = useRef(null);

    const { usuario } = useSessaoUsuarioContext();

    useEffect(() => {
        setLoading(true);
        if (usuario && usuario.companies && usuario.companies.length > 0) {
            const selecionada = usuario.companies.find(c => String(c.id_tenant) === String(ArmazenadorToken.UserCompanyPublicId)) || usuario.companies[0];

            const pj = selecionada.pessoaJuridica;
            setEndereco({
                cep: pj.cep || '',
                logradouro: pj.logradouro || '',
                bairro: pj.bairro || '',
                numero: pj.numero_logradouro || '',
                complemento: pj.complemento || '',
                cidade: '', // Pode buscar cidade pelo id_municipio se desejar
                estado: '', // Pode buscar estado pelo id_municipio se desejar
            });
        }
        setLoading(false);
    }, [usuario]);

    const handleChange = (campo, valor) => {
        setEndereco(prev => ({ ...prev, [campo]: valor }));
    };

    const handleSalvar = () => {
        toast.current.show({ severity: 'success', summary: 'Salvo', detail: 'Endereço salvo!', life: 3000 });
    };

    return (
        <form>
            <Toast ref={toast} />
            <Frame estilo="spaced">
                <Titulo>
                    <h6>Endereço cadastrado</h6>
                </Titulo>
            </Frame>
            <Col12>
                <Col6>
                    <Texto>CEP</Texto>
                    {loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={endereco?.cep} setValor={v => handleChange('cep', v)} />}
                </Col6>
                <Col6>
                    <Texto>Logradouro</Texto>
                    {loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={endereco?.logradouro} setValor={v => handleChange('logradouro', v)} />}
                </Col6>
            </Col12>
            <Col12>
                <Col6>
                    <Texto>Bairro</Texto>
                    {loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={endereco?.bairro} setValor={v => handleChange('bairro', v)} />}
                </Col6>
                <Col6>
                    <Texto>Número</Texto>
                    {loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={endereco?.numero} setValor={v => handleChange('numero', v)} />}
                </Col6>
            </Col12>
            <Col12>
                <Col6>
                    <Texto>Complemento</Texto>
                    {loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={endereco?.complemento} setValor={v => handleChange('complemento', v)} />}
                </Col6>
                <Col6>
                    <Texto>Cidade</Texto>
                    {loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={endereco?.cidade} setValor={v => handleChange('cidade', v)} />}
                </Col6>
            </Col12>
            <Col12>
                <Col6>
                    <Texto>Estado</Texto>
                    {loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={endereco?.estado} setValor={v => handleChange('estado', v)} />}
                </Col6>
            </Col12>
            <ContainerButton>
                <Botao estilo="vermilion" size="medium" aoClicar={handleSalvar}>Salvar Endereço</Botao>
            </ContainerButton>
        </form>
    );
}

export default MeusDadosEndereco;