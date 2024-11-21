import styles from './Registro.module.css'
import MainContainer from "@components/MainContainer"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import Botao from "@components/Botao"
import { Link, useNavigate } from 'react-router-dom'
import Support from '@assets/Support.svg'
import { useColaboradorContext } from '../../../contexts/Colaborador'

function ColaboradorRegistroSucesso() {

    const navigate = useNavigate()
    const { 
        colaborador,
        setName,
        setEmail,
        setDocument,
        setPhoneNumber,
        setAddressPostalCode,
        setAddressStreet,
        setAdicionarDepartamento,
        setAddressNumber,
        setAddressComplement,
        setAddressDistrict,
        setAddressCity,
        setAddressState,
        setSolicitarCartao,
        setDepartments,
    } = useColaboradorContext()
    
    function cadastrarOutro() {
        setName('')
        setDocument('')
        setEmail('')
        setPhoneNumber('')
        setAddressPostalCode('')
        setAddressStreet('')
        setAdicionarDepartamento(false)
        setAddressNumber('')
        setAddressComplement('')
        setAddressDistrict('')
        setAddressCity('')
        setAddressState('')
        setSolicitarCartao(false)
        setDepartments([])
        navigate('/colaborador/registro')
    }

    return (
        <>
            <MainContainer align="center" padding="5vw 25vw">
                <img src={Support} size={100}/>
                <Titulo>
                    <h6>Colaborador cadastrado</h6>
                    <SubTitulo fontSize="14px" color="var(--black)" weight="400">Seu colaborador recebeu um <b>e-mail para confirmar seu cadastro</b> e assim conseguir acesso a plataforma</SubTitulo>
                </Titulo>
                <div className={styles.ButtonContainer}>
                    <Link onClick={navigate('/colaborador')}>
                        <Botao weight='light' estilo="neutro">Voltar</Botao>
                    </Link>
                    <Botao aoClicar={cadastrarOutro} weight='light' filled>Cadastrar outro</Botao>
                </div>
            </MainContainer>
        </>
    )
}

export default ColaboradorRegistroSucesso