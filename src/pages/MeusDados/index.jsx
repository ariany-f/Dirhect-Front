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
import { ArmazenadorToken } from '@utils';
import { RiInformationLine } from 'react-icons/ri';

const ConteudoFrame = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const InfoMessage = styled.div`
  background-color: var(--blue-50);
  color: var(--blue-700);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--blue-200);
  display: flex;
  align-items: center;
  gap: 12px;
`;

function MeusDados() {
  const [loading, setLoading] = useState(false);
  const [empresa, setEmpresa] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const toast = useRef(null);
  const location = useLocation();
  const [podeAlterarCliente, setPodeAlterarCliente] = useState(false);
  const [kitAdmissional, setKitAdmissional] = useState(false);

  const {
      usuario,
      retornarCompanySession,
      setSessionCompany,
  } = useSessaoUsuarioContext()

  useEffect(() => {
    // Verifica a permissão para alterar cliente
    setPodeAlterarCliente(ArmazenadorToken.hasPermission('change_cliente') && ArmazenadorToken.IsAdmin && ArmazenadorToken.IsAdmin === 'true');
    setKitAdmissional(import.meta.env.VITE_OPTIONS_KIT_ADMISSIONAL === 'true' && ArmazenadorToken.IsAdmin && ArmazenadorToken.IsAdmin === 'true');

    setLoading(true);
  }, []);

  useEffect(() => {
    if (usuario) {
        let name = usuario.company_domain; // Fallback inicial

        if (usuario.companies && usuario.companies.length > 0) {
            const companyId = ArmazenadorToken.UserCompanyPublicId;
            const selecionada = usuario.companies.find(c => String(c.id_tenant.id) === String(companyId)) || usuario.companies[0];
            
            if (selecionada?.pessoaJuridica) {
                const pj = selecionada.pessoaJuridica;
                name = pj.nome_fantasia || pj.razao_social || name;
            }
        }
        setCompanyName(name);
    }
  }, [usuario]);

  const handleSalvar = () => {
    toast.current.show({ severity: 'success', summary: 'Salvo', detail: 'Configurações salvas!', life: 3000 });
  };

  return (
    <ConteudoFrame>
      <Toast ref={toast} />
      

      {podeAlterarCliente && usuario && usuario.companies && usuario.companies.length > 1 && (
        <InfoMessage>
            <RiInformationLine size={24} />
            <Texto>
                Você pode alterar a empresa selecionada no menu superior.
            </Texto>
        </InfoMessage>
      )}
      <BotaoGrupo align="space-between">
        <BotaoGrupo>
          <Link className={styles.link} to="/usuario">
            <Botao estilo={location.pathname == '/usuario'?'black':''} size="small" tab>Dados Usuário</Botao>
          </Link>
          {ArmazenadorToken.IsAdmin && ArmazenadorToken.IsAdmin === 'true' && (
            <Link className={styles.link} to="/usuario/sistema">
              <Botao estilo={location.pathname == '/usuario/sistema'?'black':''} size="small" tab>Sistema</Botao>
            </Link>
          )}
          {ArmazenadorToken.IsAdmin && ArmazenadorToken.IsAdmin === 'true' && (
            <Link className={styles.link} to="/usuario/email">
              <Botao estilo={location.pathname == '/usuario/email'?'black':''} size="small" tab>Emails</Botao>
            </Link>
          )}
          {kitAdmissional && (
            <Link className={styles.link} to="/usuario/kit-admissional">
              <Botao estilo={location.pathname.startsWith('/usuario/kit-admissional') ? 'black' : ''} size="small" tab>Kit Admissional</Botao>
            </Link>
          )}
          {podeAlterarCliente && (
            <Link className={styles.link} to="/usuario/empresa">
                <Botao estilo={location.pathname == '/usuario/empresa'?'black':''} size="small" tab>{companyName || 'Empresa'}</Botao>
            </Link>
          )}
        </BotaoGrupo>
      </BotaoGrupo>

      <Outlet/>
    </ConteudoFrame>
  );
}

export default MeusDados;