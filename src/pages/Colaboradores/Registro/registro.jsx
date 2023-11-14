import CampoTexto from "@components/CampoTexto"
import { useState } from "react"

function ColaboradorRegistro() {

    const [classError, setClassError] = useState([])
    const [document, setDocument] = useState('')
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [celular, setCelular] = useState('')

    return (
        <>
            <CampoTexto 
                camposVazios={classError} 
                patternMask={['999.999.999-99']} 
                name="document" 
                valor={document} 
                setValor={setDocument} 
                type="text" 
                label="CPF" 
                placeholder="Digite o CPF do colaborador" />
            <CampoTexto 
                camposVazios={classError} 
                name="nome" 
                valor={nome} 
                setValor={setNome} 
                type="text" 
                label="Nome do colaborador" 
                placeholder="Digite o nome completo do colaborador" />
            <CampoTexto 
                camposVazios={classError} 
                name="email" 
                valor={email} 
                setValor={setEmail} 
                type="email" 
                label="Email do colaborador" 
                placeholder="Digite o email do colaborador" />
            <CampoTexto 
                camposVazios={classError} 
                patternMask={['99 9999 9999']} 
                name="celular" 
                valor={celular} 
                setValor={setCelular} 
                type="text" 
                label="Celular do colaborador" 
                placeholder="Digite o telefone do colaborador" />
        </>
    )
}

export default ColaboradorRegistro