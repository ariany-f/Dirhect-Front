import React, { useState } from 'react';
import styled from 'styled-components';
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles';
import Frame from '@components/Frame';
import Titulo from '@components/Titulo';
import BotaoGrupo from '@components/BotaoGrupo';
import Botao from '@components/Botao';
import DropdownItens from '@components/DropdownItens';
import { RiCloseFill, RiStethoscopeLine } from 'react-icons/ri';

const Col12 = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
`;

const Col6 = styled.div`
  flex: 1 1 calc(50% - 8px);
`;

const listaMedicos = [
  { code: 1, name: 'Dr. João Cardoso' },
  { code: 2, name: 'Dra. Maria Fernanda' },
  { code: 3, name: 'Dr. Paulo Henrique' },
  { code: 4, name: 'Dra. Ana Paula' },
];

function ModalExameMedico({ opened = false, aoFechar, aoAgendar }) {
  const [medico, setMedico] = useState(null);
  const [data, setData] = useState('');

  const handleAgendar = () => {
    if (medico && data) {
      aoAgendar({ medico, data });
    } else {
      alert('Selecione o médico e a data!');
    }
  };

  return (
    <OverlayRight $opened={opened}>
      <DialogEstilizadoRight open={opened} $opened={opened} $width="30vw">
        <Frame>
          <Titulo>
            <button className="close" onClick={aoFechar} formMethod="dialog">
              <RiCloseFill size={20} className="fechar" />
            </button>
            <BotaoGrupo align="space-between">
              <h6><RiStethoscopeLine style={{ marginRight: 8 }} />Agendar Exame Médico</h6>
            </BotaoGrupo>
          </Titulo>
          <Frame padding="30px 0 0 0">
            <Col12>
                <Col6>
                <DropdownItens
                    valor={medico}
                    setValor={setMedico}
                    options={listaMedicos}
                    placeholder="Selecione o médico"
                    label="Médico"
                />
                </Col6>
                <Col6>
                <label style={{ fontWeight: 500, marginBottom: 4 }}>Data do Exame</label>
                <input
                    type="date"
                    value={data}
                    onChange={e => setData(e.target.value)}
                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                />
                </Col6>
            </Col12>
          </Frame>
        </Frame>
        <div style={{width: '100%', padding: '12px'}}>
          <BotaoGrupo align="end">
            <Botao size="small" estilo="neutro" aoClicar={aoFechar}>
              Cancelar
            </Botao>
            <Botao size="small" aoClicar={handleAgendar}>
              Agendar
            </Botao>
          </BotaoGrupo>
        </div>
      </DialogEstilizadoRight>
    </OverlayRight>
  );
}

export default ModalExameMedico;
