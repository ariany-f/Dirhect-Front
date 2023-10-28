import { useState } from "react";
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import CampoTexto from '@components/CampoTexto';
import DataTableColaboradores from '@components/DataTableColaboradores';
import { GrAddCircle } from 'react-icons/gr'
import styles from './Colaboradores.module.css'
import styled from "styled-components";

import colaboradores from '@json/colaboradores.json'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`

function Colaboradores() {

    const [search, setSearch] = useState('');
    
    return (
        <ConteudoFrame>
            <BotaoGrupo align="space-between">
                <BotaoGrupo>
                    <Botao estilo="black" size="small" tab>Cadastrados</Botao>
                    <Botao estilo="" size="small" tab>Aguardando cadastro</Botao>
                    <Botao estilo="" size="small" tab>Desativados</Botao>
                </BotaoGrupo>
                <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Cadastrar Individualmente</Botao>
            </BotaoGrupo>

            <CampoTexto name="search" width={'320px'} valor={search} setValor={setSearch} type="search" label="" placeholder="Buscar um time" />
            
            <DataTableColaboradores colaboradores={colaboradores} />

        </ConteudoFrame>
    )
}

export default Colaboradores