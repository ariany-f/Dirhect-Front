import React from 'react';
import { Calendar } from 'primereact/calendar';
import styles from '../CampoTexto/CampoTexto.module.css';
import periodStyles from './CampoDataPeriodo.css';
import { addLocale } from 'primereact/api';

function CampoDataPeriodo({
    label,
    required = false,
    errorMessage = '',
    disabledDates = [],
    minDate = null,
    maxDate = null,
    className = '',
    onFocus,
    onKeyDown,
    autoComplete = 'on',
    maxLength,
    id,
    name,
    value,
    onChange,
    $width = '100%',
    placeholder = '',
    disabled = false,
    readonly = false,
    reference = null,
    ...rest
}) {
    console.log('minDate', minDate)
    return (
        <div className={styles.inputContainer + ' '}>
            {label && (
                <label htmlFor={name} className={styles.label} style={{ marginBottom: '4px', display: 'block' }}>
                    {label}{required && <span style={{ color: 'var(--error)' }}> *</span>}
                </label>
            )}
            <Calendar
                ref={reference}
                id={id || name}
                name={name}
                value={value}
                onChange={onChange}
                dateFormat="dd/mm/yy"
                placeholder={placeholder}
                style={{ width: $width }}
                inputClassName={styles.campo + (className ? ' ' + className : '')}
                panelClassName={periodStyles.panel}
                disabledDates={disabledDates}
                minDate={minDate}
                maxDate={maxDate}
                disabled={disabled}
                readOnlyInput={readonly}
                locale="pt"
                className={errorMessage ? 'error' : ''}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
                autoComplete={autoComplete}
                maxLength={maxLength}
            />
            {errorMessage && (
                <p className={styles.erroMessage}>{errorMessage}</p>
            )}
        </div>
    );
}

export default CampoDataPeriodo;
