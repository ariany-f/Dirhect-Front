import { useState, useEffect, useRef } from 'react';
import Titulo from '@components/Titulo';
import SubTitulo from '@components/SubTitulo';
import Frame from '@components/Frame';
import Texto from '@components/Texto';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import CampoTexto from '@components/CampoTexto';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import styled from 'styled-components';
import styles from './MeusDados.module.css';
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"

const ConteudoFrame = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

function MeusDados() {
  const [loading, setLoading] = useState(false);
  const [empresa, setEmpresa] = useState(null);
  const toast = useRef(null);
  const location = useLocation();

  const {
      usuario,
      retornarCompanySession,
      setSessionCompany,
  } = useSessaoUsuarioContext()

  useEffect(() => {
    setLoading(true);
    // setTimeout(() => {
    //   setEmpresa({
    //     logo: null,
    //     razaoSocial: 'Minha Empresa LTDA',
    //     cnpj: '12345678000199',
    //     nomeFantasia: 'Minha Empresa',
    //     endereco: 'Rua Exemplo, 123, Centro, Cidade/UF',
    //     dadosBancarios: {
    //       banco: 'Banco XPTO',
    //       agencia: '1234',
    //       conta: '56789-0',
    //     },
    //     corPrincipal: '#1A237E',
    //     dadosFaturamento: {
    //       email: 'faturamento@empresa.com',
    //       inscricaoEstadual: '123456789',
    //       inscricaoMunicipal: '987654321',
    //     },
    //     colaboradorPodeEditar: true,
    //     integracoes: {
    //       zapier: false,
    //       rm: false,
    //       sap: false,
    //     },
    //     timezone: 'America/Sao_Paulo',
    //     feriados: [],
    //     idioma: 'pt-BR',
    //   });
    //   setLoading(false);
    // }, 1000);
  }, []);

  const handleSalvar = () => {
    toast.current.show({ severity: 'success', summary: 'Salvo', detail: 'Configurações salvas!', life: 3000 });
  };

  return (
    <ConteudoFrame>
      <Toast ref={toast} />
      <BotaoGrupo align="space-between">
        <BotaoGrupo>
          <Link className={styles.link} to="/usuario">
            <Botao estilo={location.pathname == '/usuario'?'black':''} size="small" tab>Dados Pessoais</Botao>
          </Link>
          <Link className={styles.link} to="/usuario/endereco">
            <Botao estilo={location.pathname == '/usuario/endereco'?'black':''} size="small" tab>Endereço</Botao>
          </Link>
          <Link className={styles.link} to="/usuario/dados-faturamento">
            <Botao estilo={location.pathname == '/usuario/dados-faturamento'?'black':''} size="small" tab>Dados de faturamento</Botao>
          </Link>
          <Link className={styles.link} to="/usuario/sistema">
            <Botao estilo={location.pathname == '/usuario/sistema'?'black':''} size="small" tab>Sistema</Botao>
          </Link>
        </BotaoGrupo>
      </BotaoGrupo>
      <Outlet/>
    </ConteudoFrame>
  );
}

export default MeusDados;