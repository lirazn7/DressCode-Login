# Plano de Testes - DressCode

Este documento descreve os casos de teste para validar as funcionalidades da aplicação DressCode, uma rede social de moda.

## 📋 Casos de Teste Obrigatórios

### 1. Teste de Cadastro Completo com Dados Válidos

**Objetivo**: Verificar se é possível completar todo o fluxo de cadastro com dados válidos e se os dados são persistidos corretamente no LocalStorage.

**Pré-condições**: 
- Aplicação aberta no navegador
- LocalStorage limpo (opcional)

**Dados de Entrada**:
```
Etapa 1 - Identidade:
- Username: teste_usuario_2024
- Email: teste.usuario@email.com
- Senha: MinhaSenh@123
- Confirmar Senha: MinhaSenh@123

Etapa 2 - Dados Pessoais:
- Nome Completo: Maria Silva Santos
- Data de Nascimento: 15/03/1995
- Gênero: Feminino
- Telefone: (11) 99999-8888
- Bio: Apaixonada por moda sustentável e estilo minimalista.

Etapa 3 - Endereço:
- CEP: 01310-100
(Aguardar preenchimento automático)

Etapa 4 - Estilo Pessoal:
- Estilos: Selecionar "Elegante" e "Minimalista"
- Marcas: Zara, Mango, COS
- Cor Favorita: Manter padrão (#8B5CF6)

Etapa 5 - Redes Sociais:
- Instagram: @maria_style
- TikTok: @maria_fashion
- Pinterest: @maria_looks
- Website: https://mariastyle.com

Etapa 6 - Preferências:
- Manter todas as configurações padrão
- Marcar "Aceitar Termos de Uso"
```

**Passos**:
1. Abrir a aplicação no navegador
2. Clicar em "Criar Minha Conta"
3. Preencher todos os campos da Etapa 1
4. Clicar em "Próximo" 
5. Preencher todos os campos da Etapa 2
6. Clicar em "Próximo"
7. Inserir o CEP e aguardar preenchimento automático
8. Preencher número da residência
9. Clicar em "Próximo"
10. Selecionar os estilos desejados
11. Adicionar as marcas favoritas
12. Clicar em "Próximo"
13. Preencher as redes sociais
14. Clicar em "Próximo"
15. Configurar preferências e aceitar termos
16. Clicar em "Finalizar Cadastro"

**Resultado Esperado**:
- Modal de sucesso é exibido
- Resumo do perfil está correto
- Botão de download funciona
- Dados são salvos no LocalStorage com chave "dresscode_users"
- Arquivo JSON baixado contém todos os dados inseridos
- Usuário pode iniciar novo cadastro após fechar modal

---

### 2. Teste de Bloqueio de Username Duplicado

**Objetivo**: Verificar se o sistema impede cadastro com username já existente e oferece sugestões.

**Pré-condições**: 
- Pelo menos um usuário já cadastrado com username "teste_usuario"

**Dados de Entrada**:
```
- Username: teste_usuario (já existente)
- Email: novo.email@teste.com
- Senha: NovaSenh@123
- Confirmar Senha: NovaSenh@123
```

**Passos**:
1. Iniciar novo cadastro
2. Na Etapa 1, inserir username que já existe
3. Preencher email válido e único
4. Preencher senhas
5. Tentar avançar para próxima etapa

**Resultado Esperado**:
- Mensagem de erro: "Este username já está em uso"
- Campo username fica com borda vermelha
- Aparecem 3 sugestões de username disponível
- Não é possível avançar para próxima etapa
- Ao clicar em uma sugestão, o campo é preenchido automaticamente
- Com sugestão selecionada, é possível avançar

---

### 3. Teste de Busca de CEP Válido

**Objetivo**: Verificar integração com API ViaCEP e preenchimento automático de endereço.

**Pré-condições**: 
- Conexão com internet ativa
- Aplicação na Etapa 3 (Endereço)

**Dados de Entrada**:
```
CEPs para teste:
- 01310-100 (Avenida Paulista, São Paulo/SP)
- 20040-020 (Centro, Rio de Janeiro/RJ) 
- 30112-000 (Centro, Belo Horizonte/MG)
```

**Passos**:
1. Chegar até a Etapa 3 do cadastro
2. Inserir CEP: 01310-100
3. Aguardar processamento
4. Verificar preenchimento dos campos

**Resultado Esperado**:
- Loading spinner aparece durante busca
- Campos são preenchidos automaticamente:
  - Logradouro: Avenida Paulista
  - Bairro: Bela Vista  
  - Cidade: São Paulo
  - Estado: SP
- Campos preenchidos ficam com borda verde
- Mensagem de sucesso: "CEP encontrado: São Paulo, SP"
- Campos número e complemento permanecem editáveis
- É possível avançar para próxima etapa

---

### 4. Teste de Limite de Marcas Favoritas

**Objetivo**: Verificar se o sistema bloqueia adição da 6ª marca e exibe feedback adequado.

**Pré-condições**: 
- Aplicação na Etapa 4 (Estilo Pessoal)

**Dados de Entrada**:
```
Marcas para teste:
1. Zara
2. Mango  
3. Nike
4. Adidas
5. H&M
6. Forever21 (deve ser bloqueada)
```

**Passos**:
1. Chegar até a Etapa 4 do cadastro
2. Adicionar primeira marca "Zara" e pressionar Enter
3. Adicionar segunda marca "Mango" e pressionar Enter
4. Continuar adicionando até 5 marcas
5. Tentar adicionar 6ª marca "Forever21"

**Resultado Esperado**:
- Cada marca adicionada aparece como tag colorida
- Contador mostra "X/5 marcas selecionadas"
- Após 5 marcas, contador mostra "5/5 - Limite máximo atingido"
- 6ª marca não é adicionada
- Mensagem de erro: "Máximo de 5 marcas permitido"
- Botão X em cada tag permite remoção
- Após remover uma marca, é possível adicionar outra

---

### 5. Teste de Responsividade

**Objetivo**: Verificar se a interface se adapta corretamente a diferentes resoluções de tela.

**Pré-condições**: 
- Aplicação aberta no navegador
- Ferramenta de desenvolvedor disponível para simular dispositivos

**Resoluções para Teste**:
```
- Mobile: 320px x 568px (iPhone SE)
- Mobile Grande: 375px x 667px (iPhone 8)
- Tablet: 768px x 1024px (iPad)
- Desktop: 1024px x 768px
- Desktop Grande: 1440px x 900px
```

**Passos**:
1. Abrir ferramenta de desenvolvedor (F12)
2. Ativar modo responsivo
3. Testar cada resolução da lista
4. Navegar por todas as etapas do cadastro
5. Verificar modal de sucesso

**Resultado Esperado**:

**Mobile (320px-767px)**:
- Header com logo e sem menu de navegação
- Layout de coluna única
- Barra de progresso com 6 steps visíveis
- Formulário ocupa largura total
- Botões empilhados verticalmente
- Tags de marca quebram linha adequadamente
- Modal ocupa 90% da tela

**Tablet (768px-1023px)**:
- Menu de navegação aparece no header
- Steps da barra de progresso mais espaçados
- Grid de estilos em 3-4 colunas
- Formulário com layout mais espaçoso

**Desktop (1024px+)**:
- Layout de duas colunas na tela inicial
- Barra de progresso com steps maiores
- Grid de estilos em 4 colunas
- Modal centralizado com tamanho fixo
- Hover effects funcionam

---

## 📋 Casos de Teste Adicionais

### 6. Teste de Validação de Email

**Dados de Entrada**: emails inválidos
```
- email_invalido (sem @)
- @dominio.com (sem parte local)  
- email@dominio (sem TLD)
- email@.com (domínio inválido)
```

**Resultado Esperado**: Mensagem "Email inválido" para todos os casos

---

### 7. Teste de Validação de Senha

**Dados de Entrada**: senhas inválidas
```
- 123 (muito curta)
- somente_letras (sem números)
- 12345678 (sem letras)
```

**Resultado Esperado**: Mensagens específicas de erro para cada caso

---

### 8. Teste de Idade Mínima

**Dados de Entrada**: Data de nascimento que resulte em menos de 13 anos

**Resultado Esperado**: Erro "Idade mínima: 13 anos"

---

### 9. Teste de CEP Inválido

**Dados de Entrada**: CEPs inválidos
```
- 00000-000
- 12345 (incompleto)
- 99999-999 (inexistente)
```

**Resultado Esperado**: Mensagens de erro apropriadas e campos limpos

---

### 10. Teste de Navegação Entre Etapas

**Objetivo**: Verificar navegação usando botões Anterior/Próximo

**Passos**:
1. Completar Etapa 1 e avançar
2. Na Etapa 2, clicar em "Anterior"
3. Verificar se dados da Etapa 1 foram mantidos
4. Avançar novamente para Etapa 2

**Resultado Esperado**: Dados são mantidos ao navegar entre etapas

---

## 🛠️ Como Executar os Testes

### Preparação
1. Abrir aplicação no navegador
2. Abrir Console de Desenvolvedor (F12)
3. Limpar LocalStorage se necessário: `localStorage.clear()`

### Execução
1. Seguir passos descritos em cada caso de teste
2. Verificar resultados esperados
3. Anotar qualquer comportamento diferente do esperado
4. Verificar logs no console para diagnóstico

### Validação de Dados
Para verificar dados salvos no LocalStorage:
```javascript
// No console do navegador
JSON.parse(localStorage.getItem('dresscode_users'))
```

### Limpeza Entre Testes
```javascript
// Limpar todos os dados
localStorage.clear();

// Ou limpar apenas usuários DressCode
localStorage.removeItem('dresscode_users');
```

---

## 📊 Critérios de Aceitação

### ✅ Teste Passou
- Todos os passos executados com sucesso
- Resultado obtido igual ao esperado
- Sem erros no console do navegador
- Interface responsiva funcionando

### ❌ Teste Falhou  
- Resultado diferente do esperado
- Erros críticos no console
- Interface quebrada
- Perda de dados durante navegação

### ⚠️ Teste Parcial
- Funcionalidade principal OK
- Pequenos problemas de UX
- Mensagens de erro pouco claras
- Problemas menores de responsividade

---

## 📱 Teste de Compatibilidade

### Navegadores Suportados
- ✅ Chrome 61+ 
- ✅ Firefox 60+
- ✅ Safari 11+
- ✅ Edge 79+

### Dispositivos Testados
- 📱 iPhone SE (320px)
- 📱 iPhone 8 (375px) 
- 📱 Samsung Galaxy S20 (360px)
- 📱 iPad (768px)
- 💻 Desktop 1024px+

---

## 🚨 Problemas Conhecidos

### Limitações da Versão MVP
1. **Sem validação de servidor**: Apenas validação client-side
2. **LocalStorage limitado**: ~10MB de limite no navegador
3. **Dependência de internet**: ViaCEP requer conexão ativa
4. **Sem autenticação real**: Não há sistema de login

### Cenários de Falha Esperados
1. **Rede offline**: Busca de CEP falhará
2. **Browser muito antigo**: Módulos ES6 não funcionarão  
3. **LocalStorage desabilitado**: Dados não serão salvos
4. **JavaScript desabilitado**: Aplicação não funcionará

---

**Documento atualizado em**: Novembro de 2024  
**Versão**: 1.0 (MVP)  
**Responsável pelos testes**: Equipe de Desenvolvimento DressCode