# Componentes de Coluna

Este módulo fornece componentes de coluna reutilizáveis para criar layouts responsivos.

## Componentes Disponíveis

- `Col1` até `Col12`: Colunas básicas com larguras de 8.33% até 100%
- `Col6Centered`, `Col4Centered`: Variações centralizadas
- `Col6Input`: Variação específica para inputs
- `ColContainer`: Container para agrupar colunas

## Uso Básico

```jsx
import { Col12, Col6, Col4, ColContainer } from '@components/Colunas';

function MeuComponente() {
    return (
        <ColContainer>
            <Col12>
                <h1>Título em largura total</h1>
            </Col12>
            
            <Col6>
                <p>Coluna com 50% de largura</p>
            </Col6>
            
            <Col6>
                <p>Outra coluna com 50% de largura</p>
            </Col6>
            
            <Col4>
                <p>Coluna com 33.33% de largura</p>
            </Col4>
            
            <Col4>
                <p>Coluna com 33.33% de largura</p>
            </Col4>
            
            <Col4>
                <p>Coluna com 33.33% de largura</p>
            </Col4>
        </ColContainer>
    );
}
```

## Props Disponíveis

Todas as colunas aceitam as seguintes props:

- `$gap`: Espaçamento entre elementos (default: '16px')
- `$padding`: Padding interno (default: '0')
- `$justify`: Alinhamento horizontal (default: 'flex-start')
- `$align`: Alinhamento vertical (default: 'flex-start')
- `$width`: Largura personalizada (opcional)

Exemplo com props:

```jsx
<ColContainer $gap="24px" $justify="space-between">
    <Col6 $padding="16px" $align="center">
        Conteúdo
    </Col6>
    <Col6 $padding="16px" $align="center">
        Conteúdo
    </Col6>
</ColContainer>
```

## Responsividade

Todos os componentes são responsivos e se ajustam para 100% de largura em telas menores que 760px.

## Variações Especiais

### Colunas Centralizadas

```jsx
<Col6Centered>
    Conteúdo centralizado horizontalmente e verticalmente
</Col6Centered>

<Col4Centered>
    Conteúdo centralizado em uma coluna menor
</Col4Centered>
```

### Coluna para Inputs

```jsx
<Col6Input>
    <input type="text" />
</Col6Input>
``` 