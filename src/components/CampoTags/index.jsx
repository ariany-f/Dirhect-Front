import { useState, useRef, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { InputText } from 'primereact/inputtext'

const Container = styled.div`
    position: relative;
    width: 100%;
    max-width: 100%;
`

const InputWrapper = styled.div`
    border-radius: 4px;
    outline: .4px solid var(--neutro-400);
    background: var(--background-label);
    padding: 12px 16px;
    border: none;
    display: flex;
    align-items: center;
    font-weight: 600;
    width: 100%;
    min-height: 46px;
    cursor: text;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;

    &:disabled {
        background-color: #e9ecef;
        color: #444;
    }

    &.error {
        outline: 1px solid var(--error);
    }

    &:not(:disabled) {
        &:active {
            outline-color: var(--primaria);
            background: var(--white);
        }

        &:focus-within {
            outline-color: var(--primaria);
            background: var(--white);
        }
    }
`

const TagsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    width: 100%;
    min-height: 22px;
    flex-wrap: wrap;
    padding-right: 0;
    align-content: center;
    row-gap: 4px;
`

const StyledInput = styled(InputText)`
    border: none;
    background: transparent;
    outline: none;
    flex: 1;
    min-width: 30px;
    font-weight: 600;
    font-size: 14px;
    padding: 0px 12px;
    margin: 0;
    height: 32px!important;
    line-height: 22px;
    display: flex;
    align-items: center;
    align-self: center;

    &::placeholder {
        color: var(--neutro-200);
        font-feature-settings: 'clig' off, 'liga' off;
        font-family: var(--font-secondaria);
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 22px;
    }

    &:disabled {
        background-color: transparent;
        color: #444;
    }
`

const SuggestionsDropdown = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid var(--neutro-300);
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-height: 200px;
    overflow-y: auto;
    display: ${props => props.$show ? 'block' : 'none'};
`

const SuggestionItem = styled.div`
    padding: 8px 16px;
    cursor: pointer;
    border-bottom: 1px solid var(--neutro-200);
    font-size: 14px;
    font-weight: 500;

    &:hover {
        background-color: var(--neutro-100);
    }

    &:last-child {
        border-bottom: none;
    }
`

const Tag = styled.span`
    background-color: var(--primaria);
    color: var(--secundaria);
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    white-space: nowrap;
    line-height: 1.2;
    height: 24px;
    flex-shrink: 0;
    align-self: center;

    &:hover {
        background-color: var(--secundaria-500);
    }
`

const RemoveButton = styled.span`
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    line-height: 1;

    &:hover {
        opacity: 0.8;
    }
`

function CampoTags({ 
    label, 
    placeholder = "Digite para buscar opções...", 
    options = [], 
    value = [], 
    onChange, 
    name,
    disabled = false,
    camposVazios = [],
    required = false,
    maxTags = null,
    allowCustomTags = false
}) {
    const [inputValue, setInputValue] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const inputRef = useRef(null)
    const dropdownRef = useRef(null)

    const classeCampoVazio = camposVazios.filter((val) => val === name)

    // Filtra opções baseado no input e remove as já selecionadas
    const filteredOptions = useMemo(() => {
        return options.filter(option => {
            const matchesInput = inputValue.trim() ? option.name.toLowerCase().includes(inputValue.toLowerCase()) : true
            const notSelected = !value.some(selected => selected.code === option.code)
            return matchesInput && notSelected
        })
    }, [inputValue, options, value])

    // Fecha dropdown quando clica fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }

    const handleInputFocus = () => {
        setShowSuggestions(true)
    }

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault()
            // Se há sugestões, seleciona a primeira
            if (filteredOptions.length > 0) {
                addTag(filteredOptions[0])
            } else if (allowCustomTags) {
                // Cria uma nova tag com o texto digitado
                const newTag = {
                    name: inputValue.trim(),
                    code: inputValue.trim().toLowerCase().replace(/\s+/g, '_')
                }
                addTag(newTag)
            }
        } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
            // Remove o último tag se o input estiver vazio
            removeTag(value[value.length - 1])
        }
    }

    const addTag = (option) => {
        if (maxTags && value.length >= maxTags) {
            return
        }
        
        const newValue = [...value, option]
        onChange(newValue)
        setInputValue('')
        setShowSuggestions(false)
        
        // Foca no input novamente
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    const removeTag = (tagToRemove) => {
        const newValue = value.filter(tag => tag.code !== tagToRemove.code)
        onChange(newValue)
    }

    const handleSuggestionClick = (option) => {
        addTag(option)
    }

    return (
        <Container ref={dropdownRef}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '8px',
                position: 'relative',
                width: '100%',
                maxWidth: '100%'
            }}>
                {label && (
                    <label htmlFor={name} style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'var(--neutro-600)',
                        marginBottom: '4px',
                        display: 'block'
                    }}>
                        {label}{required && <span style={{color: 'var(--error)'}}> *</span>}
                    </label>
                )}
                
                <InputWrapper 
                    className={classeCampoVazio.includes(name) ? 'error' : ''}
                    onClick={() => {
                        inputRef.current?.focus()
                        setShowSuggestions(true)
                    }}
                >
                    <TagsContainer>
                        {value.map((tag) => (
                            <Tag key={tag.code} onClick={(e) => {
                                e.stopPropagation()
                                removeTag(tag)
                            }}>
                                {tag.name}
                                <RemoveButton>×</RemoveButton>
                            </Tag>
                        ))}
                        
                        <StyledInput
                            ref={inputRef}
                            id={name}
                            value={inputValue}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            onKeyDown={handleInputKeyDown}
                            onClick={() => setShowSuggestions(true)}
                            placeholder={value.length === 0 ? placeholder : ""}
                            disabled={disabled}
                            autoComplete="off"
                        />
                    </TagsContainer>
                </InputWrapper>

                                        <SuggestionsDropdown $show={showSuggestions}>
                    {filteredOptions.map((option, index) => (
                        <SuggestionItem
                            key={option.code}
                            onClick={() => handleSuggestionClick(option)}
                            onMouseDown={(e) => e.preventDefault()} // Previne blur do input
                        >
                            {option.name}
                        </SuggestionItem>
                    ))}
                </SuggestionsDropdown>
            </div>

            {(classeCampoVazio.includes(name) ? (
                <p style={{
                    color: 'var(--error)',
                    fontFeatureSettings: "'clig' off, 'liga' off",
                    fontFamily: 'Inter',
                    fontSize: '12px',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: '18px'
                }}>Você deve preencher esse campo</p>
            ) : (
                <p style={{
                    color: 'var(--error)',
                    fontFeatureSettings: "'clig' off, 'liga' off",
                    fontFamily: 'Inter',
                    fontSize: '12px',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: '18px'
                }}>&nbsp;</p>
            ))}
        </Container>
    )
}

export default CampoTags
