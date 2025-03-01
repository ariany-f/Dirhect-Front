import { Outlet } from 'react-router-dom'
import { BalanceProvider } from '@contexts/Balance'

function ExtratoCommon() {

    return (
        <BalanceProvider>
            <Outlet />
        </BalanceProvider>
    )
}

export default ExtratoCommon