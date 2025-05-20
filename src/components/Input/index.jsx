import React from 'react';
import PropTypes from 'prop-types';
import { InputText} from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Password } from 'primereact/password';
import { InputOtp } from 'primereact/inputotp';
import { InputSwitch } from 'primereact/inputswitch';
import { FloatLabel } from 'primereact/floatlabel';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { classNames } from 'primereact/utils';
import { Controller } from 'react-hook-form';
import { useTranslation } from "react-i18next";

const Input = ({
  type = 'text',
  id,
  name,
  label,
  control,
  defaultValue,
  required = false,
  icon,
  iconPosition = 'left',
  floatLabel = false,
  className,
  disabled = false,
  placeholder,
  mask,
  keyfilter,
  toggleMask = false,
  feedback = true,
  rows = 5,
  cols = 30,
  autoResize = false,
  length = 4,
  integerOnly = false,
  rules = {},
  showPasswordFeedback = true,
  showClear = false,
  ...props
}) => {
  const { t } = useTranslation('common');

  // Configura regras de validação padrão baseadas no tipo
  const getDefaultValidationRules = () => {
    const defaultRules = { ...rules };

    if (required) {
      defaultRules.required = 'Este campo é obrigatório';
    }

    switch (type) {
      case 'email':
        defaultRules.pattern = {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Por favor, insira um email válido'
        };
        break;
      
      case 'password':
        defaultRules.minLength = {
          value: 6,
          message: 'A senha deve ter pelo menos 6 caracteres'
        };
        break;
      
      case 'number':
        if (integerOnly) {
          defaultRules.validate = (value) => 
            Number.isInteger(Number(value)) || 'Apenas números inteiros são permitidos';
        }
        break;
      
      case 'mask':
        if (mask) {
          defaultRules.validate = (value) => {
            const maskRequiredChars = mask.split('').filter(c => c === '9' || c === 'A' || c === 'a');
            const valueChars = value ? value.replace(/[^0-9a-zA-Z]/g, '') : '';
            return (
              valueChars.length >= maskRequiredChars.length || 
              'Preencha todos os campos obrigatórios'
            );
          };
        }
        break;
      
      default:
        break;
    }

    return defaultRules;
  };

  const validationRules = getDefaultValidationRules();

  // Renderiza o ícone se fornecido
  const renderIcon = () => {
    if (!icon) return null;
    return <InputIcon className={icon} position={iconPosition} />;
  };

  // Renderiza o campo com ícone
  const renderWithIcon = (input) => {
    if (!icon) return input;
    return (
      <IconField iconPosition={iconPosition}>
        {renderIcon()}
        {input}
      </IconField>
    );
  };

  // Renderiza o float label
  const renderWithFloatLabel = (input) => {
    if (!floatLabel) return input;
    return <FloatLabel>{input}</FloatLabel>;
  };

  // Seleciona o tipo de input
  const renderInput = (onChange, onBlur, value, invalid) => {
    const commonProps = {
      id,
      name,
      value: value || '',
      onChange: (e) => onChange(e.target ? e.target.value : e.value),
      onBlur,
      disabled,
      placeholder: floatLabel ? undefined : placeholder,
      className: classNames(className, { 'p-invalid': invalid }, 'w-full'),
      invalid: invalid,
      ...props
    };

    switch (type) {
      case 'text':
        return <InputText {...commonProps} keyfilter={keyfilter} />;
      case 'email':
        return <InputText {...commonProps} />;
      case 'search':
        return <InputText {...commonProps} keyfilter={keyfilter} showClear />;
      case 'number':
        return <InputNumber {...commonProps} mode={integerOnly ? 'decimal' : 'currency'} />;
      case 'password':
        return (
          <Password
            {...commonProps}
            feedback={showPasswordFeedback}
            toggleMask={toggleMask}
            promptLabel={t('password_prompt', 'Digite sua senha')}
            weakLabel={t('password_weak', 'Fraca')}
            mediumLabel={t('password_medium', 'Média')}
            strongLabel={t('password_strong', 'Forte')}
            style={{ width: '100%', minWidth: '100%', display: 'block' }}
            inputStyle={{ width: '100%', minWidth: '100%', display: 'block' }}
            invalid={invalid}
          />
        );
      case 'textarea':
        return <InputTextarea {...commonProps} rows={rows} cols={cols} autoResize={autoResize} />;
      case 'mask':
        return <InputMask {...commonProps} mask={mask} />;
      case 'switch':
        return <InputSwitch {...commonProps} checked={value} onChange={(e) => onChange(e.value)} />;
      case 'otp':
        return <InputOtp {...commonProps} length={length} onChange={(e) => onChange(e.value)} />;
      default:
        return <InputText {...commonProps} />;
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={validationRules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <div className="relative w-full text-left">
          {!floatLabel && label && (
            <label htmlFor={id} className="w-full">
              {label}
              {required && <span className="text-red-500"> *</span>}
            </label>
          )}
          
          {renderWithFloatLabel(renderWithIcon(renderInput(onChange, onBlur, value, !!error)))}
          
          {floatLabel && label && (
            <label htmlFor={id} className="w-full text-left">
              {label}
              {required && <span className="text-red-500"> *</span>}
            </label>
          )}
          
          {error && (
            <span className="block mt-1 text-sm text-red-500 font-medium text-left">
              {error.message}
            </span>
          )}
        </div>
      )}
    />
  );
};

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'textarea', 'mask', 'switch', 'otp']),
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  control: PropTypes.object.isRequired,
  defaultValue: PropTypes.any,
  required: PropTypes.bool,
  icon: PropTypes.string,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  floatLabel: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  mask: PropTypes.string,
  keyfilter: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)]),
  toggleMask: PropTypes.bool,
  feedback: PropTypes.bool,
  rows: PropTypes.number,
  cols: PropTypes.number,
  autoResize: PropTypes.bool,
  length: PropTypes.number,
  integerOnly: PropTypes.bool,
  rules: PropTypes.object,
  showPasswordFeedback: PropTypes.bool,
  showClear: PropTypes.bool,
};

export default Input;