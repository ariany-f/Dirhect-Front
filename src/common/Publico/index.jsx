import MainSectionPublico from "@components/MainSectionPublico"
import EstilosGlobais from '@components/GlobalStyles'
import BannerMini from "@components/BannerMini"
import MainContainer from "@components/MainContainer"
import RightContainer from "@components/RightContainer"
import PrecisoDeAjuda from "@components/PrecisoDeAjuda"
import { Outlet } from "react-router-dom"
import RodapePublico from "@components/RodapePublico"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { useLocation } from "react-router-dom";
import { ArmazenadorToken } from "@utils"
import { useEffect } from "react"

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Publico() {
    const query = useQuery();

    useEffect(() => {
        console.log(query)
        console.log(query.get("tenant"))
        if(query.get("tenant"))
        {
            ArmazenadorToken.definirCompany('', query.get("tenant"))
        }
    }, []);

    return (
        <>
            <EstilosGlobais />
            <MainSectionPublico>
                <RightContainer>
                <MainContainer>
                        <Outlet />
                    <RodapePublico />
                </MainContainer>
                </RightContainer>
                <BannerMini />
                
                <Analytics />
                <SpeedInsights />
            </MainSectionPublico>
        </>
    )
}

export default Publico