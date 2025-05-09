import { useState, useEffect, useRef } from 'react';
import Titulo from '@components/Titulo';
import Frame from '@components/Frame';
import SubTitulo from '@components/SubTitulo';
import Texto from '@components/Texto';
import CampoTexto from '@components/CampoTexto';
import { Skeleton } from 'primereact/skeleton';
import Botao from '@components/Botao';
import { Toast } from 'primereact/toast';
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import styled from 'styled-components';
import { ColorPicker } from 'primereact/colorpicker';
import { RiUpload2Fill } from 'react-icons/ri';
import { Dropdown } from 'primereact/dropdown';

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const Col6 = styled.div`
    padding: 20px;
    flex: 1 1 50%;
`;

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: flex-end;
    & button {
        width: initial;
    }
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
`;

const ImageUploadContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin: 0;
    width: 120px;
    padding-top: 20px;
    padding-bottom: 20px;
`;

const UploadArea = styled.label`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    border: 2px dashed var(--primaria);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: ${props => props.$hasImage ? 'transparent' : 'var(--neutro-50)'};
    overflow: hidden;
    &:hover {
        border-color: var(--primaria-escuro);
        background-color: var(--neutro-100);
    }
`;

const UploadPreview = styled.img`
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
`;

const UploadIcon = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--primaria);
    & svg {
        font-size: 32px;
        margin-bottom: 8px;
    }
`;

const UploadText = styled.span`
    text-align: center;
    color: var(--neutro-600);
    padding: 0 8px;
    font-size: 12px;
`;

function MeusDadosSistema() {
    const [loading, setLoading] = useState(false);
    const [sistema, setSistema] = useState({
        logo: null,
        logoPreview: '',
        corPrincipal: '#1A237E',
        colaboradorPodeEditar: true,
        integracoes: {
            zapier: false,
            rm: false,
            sap: false,
        },
        timezone: 'America/Sao_Paulo',
        feriadosTipo: 'nacionais',
        feriadosUF: '',
        idioma: 'pt-BR',
    });
    const toast = useRef(null);
    const fileInputRef = useRef(null);

    const { usuario } = useSessaoUsuarioContext();

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleChange = (campo, valor) => {
        setSistema(prev => ({ ...prev, [campo]: valor }));
    };

    const handleIntegracaoChange = (campo, valor) => {
        setSistema(prev => ({ ...prev, integracoes: { ...prev.integracoes, [campo]: valor } }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setSistema(prev => ({ ...prev, logo: file, logoPreview: event.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setSistema(prev => ({ ...prev, logo: null, logoPreview: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSalvar = () => {
        toast.current.show({ severity: 'success', summary: 'Salvo', detail: 'Configurações do sistema salvas!', life: 3000 });
    };

    const feriadosOptions = [
        { label: 'Nacionais', value: 'nacionais' },
        { label: 'Estaduais', value: 'estaduais' },
    ];

    const estados = [
        { label: 'AC', value: 'AC' }, { label: 'AL', value: 'AL' }, { label: 'AP', value: 'AP' }, { label: 'AM', value: 'AM' },
        { label: 'BA', value: 'BA' }, { label: 'CE', value: 'CE' }, { label: 'DF', value: 'DF' }, { label: 'ES', value: 'ES' },
        { label: 'GO', value: 'GO' }, { label: 'MA', value: 'MA' }, { label: 'MT', value: 'MT' }, { label: 'MS', value: 'MS' },
        { label: 'MG', value: 'MG' }, { label: 'PA', value: 'PA' }, { label: 'PB', value: 'PB' }, { label: 'PR', value: 'PR' },
        { label: 'PE', value: 'PE' }, { label: 'PI', value: 'PI' }, { label: 'RJ', value: 'RJ' }, { label: 'RN', value: 'RN' },
        { label: 'RS', value: 'RS' }, { label: 'RO', value: 'RO' }, { label: 'RR', value: 'RR' }, { label: 'SC', value: 'SC' },
        { label: 'SP', value: 'SP' }, { label: 'SE', value: 'SE' }, { label: 'TO', value: 'TO' },
    ];

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'pt', name: 'Português' },
    ];

    const timezones = [
        { label: 'São Paulo (GMT-3)', value: 'America/Sao_Paulo' },
        { label: 'Brasília (GMT-3)', value: 'America/Sao_Paulo' },
        { label: 'Buenos Aires (GMT-3)', value: 'America/Argentina/Buenos_Aires' },
        { label: 'Lisboa (GMT+0)', value: 'Europe/Lisbon' },
        { label: 'Nova York (GMT-5)', value: 'America/New_York' },
        { label: 'Londres (GMT+0)', value: 'Europe/London' },
        { label: 'Tóquio (GMT+9)', value: 'Asia/Tokyo' },
        { label: 'Los Angeles (GMT-8)', value: 'America/Los_Angeles' },
        { label: 'Paris (GMT+1)', value: 'Europe/Paris' },
        { label: 'Berlim (GMT+1)', value: 'Europe/Berlin' },
        { label: 'Dubai (GMT+4)', value: 'Asia/Dubai' },
        { label: 'Cidade do México (GMT-6)', value: 'America/Mexico_City' },
    ];

    return (
        <form>
            <Toast ref={toast} />
            <Frame estilo="spaced">
                <Titulo>
                    <h6>Configurações do Sistema</h6>
                </Titulo>
            </Frame>
            <Col12>
                <Col6>
                    <SubTitulo>Identidade Visual</SubTitulo>
                    <Texto>Logo</Texto>
                    <ImageUploadContainer>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            id="sistema-logo-upload"
                        />
                        <UploadArea htmlFor="sistema-logo-upload" $hasImage={!!sistema.logoPreview}>
                            {sistema.logoPreview ? (
                                <UploadPreview src={sistema.logoPreview} alt="Preview da logo" />
                            ) : (
                                <UploadIcon>
                                    <RiUpload2Fill size={'28px'} />
                                    <UploadText>Clique para adicionar uma logo</UploadText>
                                    <UploadText>(PNG, JPG, até 2MB)</UploadText>
                                </UploadIcon>
                            )}
                        </UploadArea>
                        {sistema.logoPreview && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Botao aoClicar={() => fileInputRef.current.click()} estilo="neutro" size="small">Alterar Logo</Botao>
                                <Botao aoClicar={handleRemoveLogo} estilo="erro" size="small">Remover Logo</Botao>
                            </div>
                        )}
                    </ImageUploadContainer>
                    <Texto>Cor principal</Texto>
                    {loading ? <Skeleton width={80} height={30} /> : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <ColorPicker value={sistema.corPrincipal} onChange={e => handleChange('corPrincipal', e.value)} style={{ height: 40 }} />
                            <span style={{ marginLeft: 8, fontFamily: 'monospace' }}>{sistema.corPrincipal}</span>
                        </div>
                    )}
                </Col6>
                <Col6>
                    <SubTitulo>Integrações</SubTitulo>
                    {loading ? <Skeleton width={200} height={25} /> : (
                        <>
                            <CheckboxLabel><input type="checkbox" checked={sistema?.integracoes?.rm} onChange={e => handleIntegracaoChange('rm', e.target.checked)} /> RM</CheckboxLabel>
                            <CheckboxLabel><input type="checkbox" checked={sistema?.integracoes?.sap} onChange={e => handleIntegracaoChange('sap', e.target.checked)} /> SAP</CheckboxLabel>
                            <CheckboxLabel><input type="checkbox" checked={sistema?.integracoes?.sap} onChange={e => handleIntegracaoChange('sap', e.target.checked)} /> SAP - SuccessFactors</CheckboxLabel>
                            <CheckboxLabel><input type="checkbox" checked={sistema?.integracoes?.lg} onChange={e => handleIntegracaoChange('lg', e.target.checked)} /> LG</CheckboxLabel>
                            <CheckboxLabel><input type="checkbox" checked={sistema?.integracoes?.protheus} onChange={e => handleIntegracaoChange('protheus', e.target.checked)} /> Protheus</CheckboxLabel>
                            <CheckboxLabel><input type="checkbox" checked={sistema?.integracoes?.datasul} onChange={e => handleIntegracaoChange('datasul', e.target.checked)} /> DataSul</CheckboxLabel>
                        </>
                    )}
                </Col6>
            </Col12>
            <Col12>
                <Col6>
                    <SubTitulo>Localização</SubTitulo>
                    {loading ? <Skeleton width={200} height={25} /> : (
                        <>
                            <Texto>Timezone</Texto>
                            <Dropdown
                                value={timezones.find(tz => tz.value === sistema.timezone) || timezones[0]}
                                options={timezones}
                                onChange={e => handleChange('timezone', e.value.value)}
                                optionLabel="label"
                                placeholder="Selecione o timezone"
                                style={{ width: '100%', height: 65, display: 'flex', alignItems: 'center', marginBottom: 16 }}
                            />
                            <Texto>Idioma padrão</Texto>
                            <Dropdown
                                value={languages.find(lang => lang.code === sistema.idioma)}
                                options={languages}
                                onChange={e => handleChange('idioma', e.value.code)}
                                optionLabel="name"
                                placeholder="Selecione o idioma"
                                style={{ width: '100%', height: 65, display: 'flex', alignItems: 'center' }}
                            />
                        </>
                    )}
                </Col6>
                <Col6>
                    <SubTitulo>Feriados</SubTitulo>
                    {loading ? <Skeleton width={200} height={25} /> : (
                        <>
                            <Texto>Tipo de feriado</Texto>
                            <Dropdown 
                                value={sistema.feriadosTipo}
                                options={feriadosOptions}
                                onChange={e => handleChange('feriadosTipo', e.value)}
                                placeholder="Selecione o tipo de feriado"
                                style={{ width: '100%', marginBottom: 16, height: 65, display: 'flex', alignItems: 'center' }}
                            />
                            {sistema.feriadosTipo === 'estaduais' && (
                                <>
                                    <Texto>Estado (UF)</Texto>
                                    <Dropdown
                                        value={sistema.feriadosUF}
                                        options={estados}
                                        onChange={e => handleChange('feriadosUF', e.value)}
                                        placeholder="Selecione o estado"
                                        style={{ width: '100%', height: 65, display: 'flex', alignItems: 'center' }}
                                    />
                                </>
                            )}
                        </>
                    )}
                </Col6>
            </Col12>
            <ContainerButton>
                <Botao estilo="vermilion" size="medium" aoClicar={handleSalvar}>Salvar Configurações</Botao>
            </ContainerButton>
        </form>
    );
}

export default MeusDadosSistema;
