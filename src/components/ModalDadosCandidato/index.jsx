import React from 'react';
import styled from 'styled-components';
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles';
import Frame from '@components/Frame';
import Titulo from '@components/Titulo';
import { RiCloseFill, RiUser3Line } from 'react-icons/ri';
import BotaoGrupo from '@components/BotaoGrupo';
import Botao from '@components/Botao';
import { Tag } from 'primereact/tag';

const InfoLinha = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 8px 0;
  border-bottom: 1px solid var(--neutro-100);
  font-size: 15px;
  width: 100%;
`;

const Label = styled.span`
  color: var(--neutro-500);
  font-weight: 500;
`;

const Valor = styled.span`
  color: var(--neutro-800);
  font-weight: 600;
`;

function ModalDadosCandidato({ opened = false, aoFechar, candidato }) {
  if (!candidato) return null;
  const dados = candidato.candidato || candidato;

  const getStatusColor = (status) => {
    if (!status) return 'var(--neutro-400)';
    switch (status) {
      case 'A':
        return 'var(--green-500)';
      case 'R':
        return 'var(--error)';
      case 'S':
        return 'var(--primaria)';
      case 'C':
        return 'var(--neutro-500)';
      default:
        return 'var(--neutro-400)';
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return '-----';
    switch (status) {
      case 'A':
        return 'Aprovado';
      case 'R':
        return 'Rejeitado';
      case 'S':
        return 'Processo de Seleção';
      case 'C':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const vagaConfigurada = dados.vagas_configuradas?.[0];

  return (
    <OverlayRight $opened={opened}>
      <DialogEstilizadoRight open={opened} $opened={opened} $width="35vw">
        <Frame $gap="16px">
          <Titulo>
            <button className="close" onClick={aoFechar} formMethod="dialog">
              <RiCloseFill size={20} className="fechar" />
            </button>
            <BotaoGrupo align="space-between">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 18 }}><RiUser3Line style={{ marginRight: 8 }} />{dados.nome || '-'}</span>
                {vagaConfigurada?.status && (
                  <Tag 
                    value={getStatusLabel(vagaConfigurada.status)}
                    style={{
                      backgroundColor: getStatusColor(vagaConfigurada.status),
                      color: 'white',
                      fontWeight: 600,
                      fontSize: 13,
                      borderRadius: 8,
                      padding: '4px 12px',
                      textTransform: 'capitalize',
                    }}
                  />
                )}
              </div>
            </BotaoGrupo>
          </Titulo>
          <div style={{ padding: '30px 0 0 0', width: '100%'}}>
            <InfoLinha>
              <Label>Nome Completo</Label>
              <Valor>{dados.nome || '-'}</Valor>
            </InfoLinha>
            <InfoLinha>
              <Label>Email</Label>
              <Valor>{dados.email || '-'}</Valor>
            </InfoLinha>
            <InfoLinha>
              <Label>CPF</Label>
              <Valor>{dados.cpf || '-'}</Valor>
            </InfoLinha>
            <InfoLinha>
              <Label>Telefone</Label>
              <Valor>{dados.telefone || '-'}</Valor>
            </InfoLinha>
            <InfoLinha>
              <Label>Data de Nascimento</Label>
              <Valor>{dados.dt_nascimento ? new Date(dados.dt_nascimento).toLocaleDateString('pt-BR') : '-'}</Valor>
            </InfoLinha>
            <InfoLinha>
              <Label>Data de Início</Label>
              <Valor>{dados.dt_inicio ? new Date(dados.dt_inicio).toLocaleDateString('pt-BR') : '-'}</Valor>
            </InfoLinha>
            <InfoLinha>
              <Label>Data do Exame Médico</Label>
              <Valor>{dados.dt_exame_medico ? new Date(dados.dt_exame_medico).toLocaleDateString('pt-BR') : '-'}</Valor>
            </InfoLinha>
            <InfoLinha>
              <Label>Salário</Label>
              <Valor>{dados.salario ? `R$ ${Number(dados.salario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</Valor>
            </InfoLinha>
            {dados.observacao && (
              <InfoLinha>
                <Label>Observação</Label>
                <Valor>{dados.observacao}</Valor>
              </InfoLinha>
            )}
          </div>
        </Frame>
      </DialogEstilizadoRight>
    </OverlayRight>
  );
}

export default ModalDadosCandidato;

