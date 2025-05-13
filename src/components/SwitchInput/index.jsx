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
            background: ${props => props.$type ? props.$type : 'var(--primaria)'}!important;
            }
        }
    }

    & .p-inputswitch.p-highlight .p-inputswitch-slider {
        background: ${props => props.$type ? props.$type : 'var(--primaria)'}!important;
    }
`
function SwitchInput({checked = false, onChange = null, color = 'var(--primaria)'}){
    console.log(color)
    return (
        <SwitchContainer $type={color}>
            <InputSwitch checked={checked} onChange={(e) => onChange(e.value)} />
        </SwitchContainer>
    )
}
export default SwitchInput