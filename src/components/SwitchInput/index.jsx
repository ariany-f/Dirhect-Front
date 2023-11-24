import styled from "styled-components"
import { InputSwitch } from 'primereact/inputswitch'

const SwitchContainer = styled.div`
    & .p-inputswitch {
        & span {
            border-radius: 50px;
        }
        & :before{
            border-radius: 25px;
        }
        &.p-inputswitch-checked {
            & span {
            background: var(--primaria)!important;
            }
        }
    }
`
function SwitchInput({checked = false, onChange = null}){

    return (
        <SwitchContainer>
            <InputSwitch checked={checked} onChange={(e) => onChange(e.value)} />
        </SwitchContainer>
    )
}
export default SwitchInput