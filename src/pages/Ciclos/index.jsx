import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import Titulo from '@components/Titulo';
import BotaoVoltar from '@components/BotaoVoltar';
import styled from 'styled-components';
import { Outlet, useNavigate } from 'react-router-dom';
import DataTableCiclos from '@components/DataTableCiclos';
import { useEffect, useState } from 'react';
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import ciclosData from '@json/ciclos.json';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`;

function Ciclos() {
    const {
        usuario,
        setCompanies,
        setSessionCompany,
        setCompanyDomain,
        setCompanySymbol,
        setCompanyLogo,
        usuarioEstaLogado
    } = useSessaoUsuarioContext()

    const [dadosCiclos, setDadosCiclos] = useState([]);
    const navegar = useNavigate();

    useEffect(() => {
        console.log('Dados carregados do JSON:', ciclosData); // Debug
        if (Array.isArray(ciclosData)) {
            setDadosCiclos(ciclosData);
        } else {
            console.error('Os dados do ciclos.json não são um array:', ciclosData);
            setDadosCiclos([]);
        }
    }, []);

    return (
        <ConteudoFrame>
            <Outlet context={{ ciclos: dadosCiclos, tipoUsuario: usuario.tipo }} />
        </ConteudoFrame>
    );
}

export default Ciclos; 