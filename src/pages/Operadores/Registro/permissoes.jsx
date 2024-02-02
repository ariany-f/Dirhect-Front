import { useOperadorContext } from '../../../contexts/Operador';
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import SwitchInput from '@components/SwitchInput'
import RadioButton from '@components/RadioButton'
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import DottedLine from '@components/DottedLine';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import styles from './Registro.module.css'
import { useState } from 'react';

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

const CardLine = styled.div`
    padding: 24px 0px;
    border-bottom: 1px solid var(--neutro-200);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:nth-child(1) {
        padding-top: 8px;
    }
    &:last-of-type {
        border-bottom: none;
        padding-bottom: 8px;
    }
`

function OperadorRegistroPermissoes () {
    const { 
        operador,
        setRoles,
        submeterOperador
    } = useOperadorContext()

    const navegar = useNavigate()
    const [checkedAll, setCheckedAll] = useState(false)
    const [selectedRole, setSelectedRole] = useState('read')

    const adicionarOperador = () => {
        setRoles(
            {
                "status": true,
                "all": checkedAll,
                "read": (selectedRole === 'read'),
                "financial": (selectedRole === 'financial'),
                "human_Resources": (selectedRole === 'human_Resources'),
            }
        )
        submeterOperador().then(response => {
            if(response.status === 'success')
            {
                navegar('/operador/registro/sucesso')
            }
        })
    } 

    function handleChange(valor)
    {
        setSelectedRole(valor)
    }

    return (
        <Frame>
            <Texto weight={500} size="12px">Nome do operador</Texto>
            <Titulo>
                <h3>{operador.name}</h3>
            </Titulo>
            <DottedLine />
            <Titulo>
                <h6>Permissões</h6>
                <SubTitulo>
                    Defina as permissões de uso da conta para seu operador:
                </SubTitulo>
            </Titulo>
            <div className={styles.card_dashboard}>
                <CardLine>
                    <Titulo>
                        <b>Controle total da conta</b>
                        <SubTitulo>O colaborador tem acesso total a conta.</SubTitulo>
                    </Titulo>
                    <SwitchInput checked={checkedAll} onChange={setCheckedAll} />
                </CardLine>
            </div>
            
            <div className={styles.card_dashboard}>
                <CardLine>
                    <Titulo>
                        <b>Visualização</b>
                        <SubTitulo>O colaborador apenas pode visualizar a plataforma.</SubTitulo>
                    </Titulo>
                    {!checkedAll &&
                        <RadioButton name="role_option" top="0" value={'read'} checked={selectedRole === 'read'} onSelected={() => handleChange('read')}/>
                    }
                </CardLine>
                <CardLine>
                    <Titulo>
                        <b>Financeiro</b>
                        <SubTitulo>Controle do saldo, adição de crédito da conta e extrato da conta.</SubTitulo>
                    </Titulo>
                    {!checkedAll &&
                        <RadioButton name="role_option" top="0" value={'financial'} checked={selectedRole === 'financial'} onSelected={() => handleChange('financial')}/>
                    }
                </CardLine>
                <CardLine>
                    <Titulo>
                        <b>Recursos Humanos (RH)</b>
                        <SubTitulo>Controle de colaboradores, e gerenciamento de cartões.</SubTitulo>
                    </Titulo>
                    {!checkedAll &&
                        <RadioButton name="role_option" top="0" value={'human_Resources'} checked={selectedRole === 'human_Resources'} onSelected={() => handleChange('human_Resources')}/>
                    }
                </CardLine>
            </div>
            <ContainerButton>
                <Botao aoClicar={() => navegar(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                <Botao aoClicar={adicionarOperador} estilo="vermilion" size="medium" filled>Adicionar operador</Botao>
            </ContainerButton>
        </Frame>
    )
}
export default OperadorRegistroPermissoes