import MainSection from "@components/MainSection"
import EstilosGlobais from '@components/GlobalStyles';
import BarraLateral from "@components/BarraLateral"
import Cabecalho from "@components/Cabecalho"
import MainContainer from "@components/MainContainer"
import { Outlet } from "react-router-dom";
import { useState } from "react";

function Autenticado() {

    return (
        <>
            <EstilosGlobais />
            <MainSection>
                <BarraLateral />
                <MainContainer align="flex-start">
                    <Cabecalho nomeEmpresa="Soluções Industriais Ltda" />
                    <Outlet />
                </MainContainer>
            </MainSection>
        </>
    )
}
export default Autenticado