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
import { useEffect, useState } from "react"
import BrandColors from '@utils/brandColors'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Publico() {
    const query = useQuery();

    useEffect(() => {
        if(query.get("tenant"))
        {
            ArmazenadorToken.definirCompany('', query.get("tenant"))
        }
    }, []);

    // Aplicar cores da marca dinamicamente
    useEffect(() => {
        BrandColors.applyBrandColorsWhenReady();
    }, []);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
    }, []);
    

    return (
        <>
            <EstilosGlobais />
            <MainSectionPublico>
                    {isMobile ? 
                        <Outlet />
                    : <>
                        <RightContainer>
                            <MainContainer>
                                <Outlet />
                            </MainContainer>
                        </RightContainer>
                        <BannerMini />
                    </>
                    }
                {import.meta.env.VITE_VERCEL_ENV && <Analytics />}
                {import.meta.env.VITE_VERCEL_ENV && <SpeedInsights />}
            </MainSectionPublico>
        </>
    )
}

export default Publico