# DressCode - Rede Social de Moda

Uma aplicação web moderna para conectar apaixonados por moda, desenvolvida com arquitetura MVC usando HTML5, CSS3 e JavaScript ES6+ com módulos.

## 📋 Sobre o Projeto

O DressCode é uma rede social focada em moda que permite aos usuários criarem perfis personalizados, compartilharem seus estilos favoritos e se conectarem com outros entusiastas da moda. Este é o MVP (Produto Mínimo Viável) com funcionalidade completa de cadastro em 6 etapas.

## 🚀 Funcionalidades Implementadas

### ✅ Cadastro Completo em 6 Etapas
1. **Identidade**: Username, email e senha com validação em tempo real
2. **Dados Pessoais**: Nome completo, data de nascimento, gênero e biografia
3. **Endereço**: Integração com API ViaCEP para busca automática por CEP
4. **Estilo Pessoal**: Seleção de estilos e marcas favoritas (máximo 5)
5. **Redes Sociais**: Conexão com Instagram, TikTok, Pinterest e website
6. **Preferências**: Configurações de privacidade e notificações

### ✅ Validações Implementadas
- **Username único**: Verificação contra LocalStorage com sugestões automáticas
- **Email válido e único**: Validação de formato e unicidade
- **CEP com ViaCEP**: Busca automática e preenchimento de endereço
- **Senhas coincidentes**: Validação de confirmação de senha
- **Idade mínima**: Usuários devem ter pelo menos 13 anos
- **Limite de marcas**: Máximo 5 marcas favoritas
- **Termos obrigatórios**: Aceite dos termos de uso

### ✅ Interface e UX
- **Design Mobile-First**: Responsivo para 320px, 768px e 1024px
- **Identidade Visual Roxa**: Baseada na cor #8B5CF6
- **Barra de Progresso**: Indicador visual das etapas
- **Feedback Visual**: Estados de sucesso/erro em inputs
- **Modal de Confirmação**: Resumo do perfil ao final
- **Animações Suaves**: Transições e micro-interações

### ✅ Tecnologias e Arquitetura
- **HTML5 Semântico**: Estrutura acessível e bem organizada
- **CSS3 Moderno**: Variables, Grid, Flexbox, Animations
- **JavaScript ES6+**: Módulos, Classes, Async/Await
- **Arquitetura MVC**: Separação clara de responsabilidades
- **LocalStorage**: Persistência de dados local
- **API Integration**: ViaCEP para busca de endereços

## 📁 Estrutura do Projeto

```
dresscode/
├── index.html                 # Página principal
├── assets/
│   └── css/
│       └── style.css          # Estilos CSS completos
├── src/
│   ├── models/
│   │   └── Usuario.js         # Model do usuário com validações
│   ├── views/
│   │   └── CadastroView.js    # View do wizard de cadastro
│   ├── controllers/
│   │   └── CadastroController.js # Controller principal
│   └── services/
│       ├── UsuarioService.js  # Service para gerenciar usuários
│       └── CepService.js      # Service para integração ViaCEP
├── README.md                  # Documentação do projeto
└── TestPlan.md               # Plano de testes
```

## 🛠️ Como Executar

1. **Download do Projeto**: Baixe todos os arquivos mantendo a estrutura de pastas
2. **Navegador Web**: Abra o arquivo `index.html` em qualquer navegador moderno
3. **Sem Instalação**: Não é necessário servidor web ou instalação adicional
4. **Pronto para Usar**: A aplicação funcionará imediatamente

### Requisitos do Sistema
- Navegador moderno com suporte a ES6+ (Chrome 61+, Firefox 60+, Safari 11+, Edge 79+)
- Conexão com internet para:
  - Ícones Font Awesome (CDN)
  - API ViaCEP para busca de endereços

## 🧪 Teste Rápido

Para testar rapidamente a aplicação:

### Dados de Teste Sugeridos
```
Username: usuario_teste_2024
Email: teste@dresscode.com
Senha: MinhaSenh@123
Nome: João Silva Santos
Nascimento: 1995-03-15
CEP: 01310-100 (Av. Paulista, São Paulo)
Estilos: Casual, Elegante
Marcas: Zara, Nike, Adidas
Instagram: @joao_style
```

### CEPs para Teste
- `01310-100` - Av. Paulista, São Paulo/SP
- `20040-020` - Centro, Rio de Janeiro/RJ
- `30112-000` - Centro, Belo Horizonte/MG
- `80010-000` - Centro, Curitiba/PR

## 📱 Responsividade

A aplicação foi desenvolvida com abordagem **Mobile-First** e testada nas seguintes resoluções:

- **📱 Mobile**: 320px - 767px
- **📱 Tablet**: 768px - 1023px  
- **💻 Desktop**: 1024px+

## 🎨 Identidade Visual

### Paleta de Cores
- **Primary**: #8B5CF6 (Roxo principal)
- **Secondary**: #EC4899 (Rosa complementar)
- **Success**: #10B981 (Verde sucesso)
- **Error**: #EF4444 (Vermelho erro)
- **Warning**: #F59E0B (Amarelo atenção)

### Tipografia
- **Fonte Principal**: Inter (via system fonts)
- **Tamanhos**: Sistema modular de 0.75rem a 4rem
- **Pesos**: 300 (Light), 500 (Medium), 600 (SemiBold), 700 (Bold)

## 💾 Armazenamento de Dados

### LocalStorage
- **Chave**: `dresscode_users`
- **Formato**: Array JSON com objetos de usuário
- **Capacidade**: ~10MB (limite do navegador)
- **Cache**: Sistema de cache em memória para otimização

### Estrutura de Dados do Usuário
```javascript
{
  id: "user_timestamp_random",
  username: "string",
  email: "string",
  nomeCompleto: "string",
  dataNascimento: "YYYY-MM-DD",
  endereco: {
    cep: "12345-678",
    logradouro: "string",
    bairro: "string",
    cidade: "string",
    estado: "XX"
  },
  estilos: ["casual", "elegante"],
  marcas: ["Marca1", "Marca2"],
  redesSociais: {
    instagram: "@usuario",
    tiktok: "@usuario",
    pinterest: "@usuario",
    website: "https://..."
  },
  privacidade: {
    perfilPublico: true,
    mostrarRedesSociais: true
  },
  // ... outros campos
}
```

## 🔧 Funcionalidades Técnicas

### Validações em Tempo Real
- **Debounce**: 500ms para validações durante digitação
- **Feedback Visual**: Classes CSS dinâmicas (valid/invalid)
- **Mensagens Contextuais**: Feedback específico por tipo de erro

### Integração ViaCEP
- **Timeout**: 5 segundos por requisição
- **Cache Local**: Armazenamento de CEPs consultados
- **Retry Logic**: Tratamento de erros de rede
- **Loading States**: Indicadores visuais durante busca

### Sugestões de Username
- **Algoritmo Inteligente**: 3 sugestões automáticas quando há conflito
- **Padrões**: username + números, ano atual, sufixos temáticos
- **Interface**: Seleção fácil com clique

## 📋 Casos de Uso

### Fluxo Principal - Cadastro Completo
1. Usuário clica em "Criar Minha Conta"
2. Preenche dados de identidade (username, email, senha)
3. Sistema valida unicidade em tempo real
4. Preenche dados pessoais com validação de idade
5. Insere CEP e sistema busca endereço automaticamente
6. Seleciona estilos e adiciona até 5 marcas favoritas
7. Conecta redes sociais (opcional)
8. Configura preferências de privacidade
9. Aceita termos obrigatórios
10. Sistema cria perfil e exibe modal de sucesso
11. Usuário pode baixar dados em JSON ou visualizar perfil

### Tratamento de Erros
- **Username duplicado**: Exibe sugestões automáticas
- **Email duplicado**: Mensagem de erro clara
- **CEP inválido**: Limpa campos e informa erro
- **Campos obrigatórios**: Destaque visual e mensagem
- **Rede indisponível**: Timeout e mensagem de retry

## 🔒 Privacidade e Termos

### Configurações de Privacidade
- **Perfil Público/Privado**: Controla visibilidade geral
- **Exibir Redes Sociais**: Mostrar/ocultar links sociais
- **Sugestões de Usuário**: Aparecer em descoberta
- **Indexação de Busca**: Permitir busca por nome/username

### Notificações
- **Email**: Notificações por email
- **Seguidores**: Notificar novos seguidores
- **Curtidas**: Notificar curtidas em posts
- **Comentários**: Notificar comentários

## 🚧 Funcionalidades Futuras

Esta é a versão MVP. Funcionalidades planejadas para próximas versões:
- Sistema de login e autenticação
- Feed de posts e imagens
- Sistema de seguir/seguidores
- Chat entre usuários
- Explorar tendências
- Sistema de curtidas e comentários
- Filtros e busca avançada
- Backend real com banco de dados
- API própria para mobile

## 🤝 Contribuição

Este é um projeto acadêmico, mas sugestões são bem-vindas:
1. Abra uma issue para reportar bugs
2. Sugira melhorias na interface
3. Proponha novas funcionalidades
4. Contribua com testes

## 📄 Licença

Projeto desenvolvido para fins acadêmicos. Todos os direitos reservados.

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o arquivo `TestPlan.md` para casos de teste
2. Confira o console do navegador para logs detalhados
3. Teste com diferentes CEPs se houver problemas de endereço
4. Limpe o LocalStorage se necessário: `localStorage.clear()`

---

**DressCode** - Conectando o mundo através da moda! 👗✨