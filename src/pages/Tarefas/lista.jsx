import styled from "styled-components"
import { Link, Outlet, useLocation, useOutlet, useOutletContext } from "react-router-dom"
import React, { createContext, useContext, useState } from 'react';
import DataTableTarefas from '@components/DataTableTarefas'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const TarefasLista = () => {

    const location = useLocation();
    const context = useOutletContext()

    return (
        <ConteudoFrame>
            <DataTableTarefas tarefas={context} />
        </ConteudoFrame>
    );
};

export default TarefasLista; 