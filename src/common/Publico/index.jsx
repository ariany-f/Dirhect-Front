import MainSectionPublico from "@components/MainSectionPublico"
import EstilosGlobais from '@components/GlobalStyles'
import BannerMini from "@components/BannerMini"
import MainContainer from "@components/MainContainer"
import RightContainer from "@components/RightContainer"
import PrecisoDeAjuda from "@components/PrecisoDeAjuda"
import { Navigate, Outlet } from "react-router-dom"
import RodapePublico from "@components/RodapePublico"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { useLocation } from "react-router-dom";
import { ArmazenadorToken } from "@utils"
import { useEffect } from "react"
import BrandColors from '@utils/brandColors'
import { useResponsive } from '@hooks/useResponsive'
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Publico() {
    const query = useQuery();
    const { isMobile } = useResponsive();

    const {
        usuarioEstaLogado
    } = useSessaoUsuarioContext()

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

    return (
        <>
        {!usuarioEstaLogado ?
            <>
                <EstilosGlobais />
                <MainSectionPublico>
                    {isMobile ? 
                        <Outlet />
                    : (
                        <>
                            <RightContainer>
                                <MainContainer>
                                    <Outlet />
                                    {import.meta.env.VITE_OPTIONS_WHITE_LABEL === 'true' && (
                                        <img 
                                            style={{ 
                                                width: '70px', 
                                                margin: '0px auto', 
                                                filter: 'grayscale(1) brightness(0.8) opacity(0.8)', 
                                                WebkitFilter: 'grayscale(1) brightness(0.8) opacity(0.8)',
                                                mixBlendMode: 'multiply'
                                            }} 
                                            src={BrandColors.getPoweredByLogo()} 
                                            alt="Powered by" 
                                        />
                                    )}
                                </MainContainer>
                            </RightContainer>
                            <BannerMini />
                        </>
                    )}
                    {import.meta.env.VITE_VERCEL_ENV && <Analytics />}
                    {import.meta.env.VITE_VERCEL_ENV && <SpeedInsights />}
                </MainSectionPublico>
            </>
        :  
            <Navigate to="/" replace={true}/>
        }
        </>
    )
}

export default Publico