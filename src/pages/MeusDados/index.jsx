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

    // if(!empresa)
    //   {
    //        // Buscar clientes
    //        http.get(`cliente/?format=json`)
    //        .then(async (response) => {
    //            let clientes = response; // Supondo que a resposta seja um array de clientes

    //            // Mapear cada cliente para incluir tenant, pessoa_juridica e domain
    //            const clientesCompletos = await Promise.all(clientes.map(async (cliente) => {
    //                try {
    //                    // Buscar o tenant
    //                    const tenantResponse = await http.get(`client_tenant/${cliente.id_tenant}/?format=json`);
    //                    const tenant = tenantResponse || {};

    //                    // Buscar a pessoa jurídica
    //                    const pessoaJuridicaResponse = await http.get(`pessoa_juridica/${cliente.pessoa_juridica}/?format=json`);
    //                    const pessoaJuridica = pessoaJuridicaResponse || {};


    //                    // Retornar o objeto consolidado
    //                    return {
    //                        ...cliente,
    //                        tenant,
    //                        pessoaJuridica
    //                    };
    //                } catch (erro) {
    //                    console.error("Erro ao buscar dados do cliente:", erro);
    //                    return { ...cliente, tenant: {}, pessoaJuridica: {}, domain: null };
    //                }
    //            }));

    //            // Atualizar o estado com os clientes completos
    //            setTenants(clientesCompletos);
               
    //       })
    //       .catch(erro => {
    //           console.error("Erro ao buscar clientes:", erro);
    //       });
    //   }
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
            <Botao estilo={location.pathname == '/usuario'?'black':''} size="small" tab>Dados Usuário</Botao>
          </Link>
          <Link className={styles.link} to="/usuario/sistema">
            <Botao estilo={location.pathname == '/usuario/sistema'?'black':''} size="small" tab>Sistema</Botao>
          </Link>
          <Link className={styles.link} to="/usuario/empresa">
            <Botao estilo={location.pathname == '/usuario/empresa'?'black':''} size="small" tab>{usuario?.company_domain}</Botao>
          </Link>
          <Link className={styles.link} to="/usuario/email">
            <Botao estilo={location.pathname == '/usuario/email'?'black':''} size="small" tab>Emails</Botao>
          </Link>
        </BotaoGrupo>
      </BotaoGrupo>
      <Outlet/>
    </ConteudoFrame>
  );
}

export default MeusDados;