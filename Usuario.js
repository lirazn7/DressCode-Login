/**
 * DressCode - Rede Social de Moda
 * Arquivo: Usuario.js
 * Descrição: Model do usuário com validações e regras de negócio
 */

export class Usuario {
    /**
     * Construtor da classe Usuario
     * @param {Object} dados - Dados do usuário para inicialização
     */
    constructor(dados = {}) {
        // Identificação única
        this.id = dados.id || this.gerarId();
        
        // Dados de identidade
        this.username = dados.username || '';
        this.email = dados.email || '';
        this.senha = dados.senha || '';
        
        // Dados pessoais
        this.nomeCompleto = dados.nomeCompleto || '';
        this.dataNascimento = dados.dataNascimento || '';
        this.genero = dados.genero || '';
        this.telefone = dados.telefone || '';
        this.bio = dados.bio || '';
        
        // Endereço
        this.endereco = {
            cep: dados.endereco?.cep || '',
            logradouro: dados.endereco?.logradouro || '',
            numero: dados.endereco?.numero || '',
            complemento: dados.endereco?.complemento || '',
            bairro: dados.endereco?.bairro || '',
            cidade: dados.endereco?.cidade || '',
            estado: dados.endereco?.estado || ''
        };
        
        // Estilo pessoal
        this.estilos = dados.estilos || [];
        this.marcas = dados.marcas || [];
        this.corFavorita = dados.corFavorita || '#8B5CF6';
        
        // Redes sociais
        this.redesSociais = {
            instagram: dados.redesSociais?.instagram || '',
            tiktok: dados.redesSociais?.tiktok || '',
            pinterest: dados.redesSociais?.pinterest || '',
            website: dados.redesSociais?.website || ''
        };
        
        // Preferências e privacidade
        this.privacidade = {
            perfilPublico: dados.privacidade?.perfilPublico !== false, // padrão true
            mostrarRedesSociais: dados.privacidade?.mostrarRedesSociais !== false, // padrão true
            aparecerSugestoes: dados.privacidade?.aparecerSugestoes !== false, // padrão true
            indexarBusca: dados.privacidade?.indexarBusca !== false // padrão true
        };
        
        // Notificações
        this.notificacoes = {
            email: dados.notificacoes?.email !== false, // padrão true
            seguidor: dados.notificacoes?.seguidor !== false, // padrão true
            curtida: dados.notificacoes?.curtida !== false, // padrão true
            comentario: dados.notificacoes?.comentario !== false // padrão true
        };
        
        // Configurações adicionais
        this.aceitouTermos = dados.aceitouTermos || false;
        this.newsletter = dados.newsletter || false;
        
        // Metadados
        this.dataCriacao = dados.dataCriacao || new Date().toISOString();
        this.dataAtualizacao = new Date().toISOString();
    }
    
    /**
     * Gera um ID único para o usuário usando timestamp e random
     * @returns {string} ID único
     */
    gerarId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2);
        return `user_${timestamp}_${random}`;
    }
    
    /**
     * Valida se o email tem formato correto
     * @param {string} email - Email a ser validado
     * @returns {Object} Resultado da validação com isValid e message
     */
    validarEmail(email = this.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            return { isValid: false, message: 'Email é obrigatório' };
        }
        
        if (!emailRegex.test(email)) {
            return { isValid: false, message: 'Formato de email inválido' };
        }
        
        // Validações adicionais
        if (email.length > 254) {
            return { isValid: false, message: 'Email muito longo (máximo 254 caracteres)' };
        }
        
        const localPart = email.split('@')[0];
        if (localPart.length > 64) {
            return { isValid: false, message: 'Parte local do email muito longa (máximo 64 caracteres)' };
        }
        
        return { isValid: true, message: 'Email válido' };
    }
    
    /**
     * Valida se o username é único na lista de usuários existentes
     * @param {Array} listaUsuarios - Lista de usuários existentes
     * @param {string} username - Username a ser validado
     * @returns {Object} Resultado da validação
     */
    validarUsernameUnico(listaUsuarios, username = this.username) {
        if (!username) {
            return { isValid: false, message: 'Username é obrigatório' };
        }
        
        // Validar formato do username
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            return { 
                isValid: false, 
                message: 'Username deve ter 3-20 caracteres (letras, números e underscore apenas)' 
            };
        }
        
        // Verificar se já existe
        const usuarioExistente = listaUsuarios.find(
            usuario => usuario.username.toLowerCase() === username.toLowerCase() && usuario.id !== this.id
        );
        
        if (usuarioExistente) {
            return { isValid: false, message: 'Este username já está em uso' };
        }
        
        return { isValid: true, message: 'Username disponível' };
    }
    
    /**
     * Gera sugestões de username quando há conflito
     * @param {Array} listaUsuarios - Lista de usuários existentes
     * @param {string} usernameBase - Username base para gerar sugestões
     * @returns {Array} Array com 3 sugestões de username
     */
    gerarSugestoesUsername(listaUsuarios, usernameBase) {
        const sugestoes = [];
        const baseClean = usernameBase.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
        
        // Sugestão 1: Base + números aleatórios
        for (let i = 0; i < 100; i++) {
            const numero = Math.floor(Math.random() * 999) + 1;
            const sugestao = `${baseClean}${numero}`;
            if (this.validarUsernameUnico(listaUsuarios, sugestao).isValid) {
                sugestoes.push(sugestao);
                break;
            }
        }
        
        // Sugestão 2: Base + ano atual
        const anoAtual = new Date().getFullYear();
        const sugestaoAno = `${baseClean}${anoAtual}`;
        if (this.validarUsernameUnico(listaUsuarios, sugestaoAno).isValid) {
            sugestoes.push(sugestaoAno);
        }
        
        // Sugestão 3: Base + underscore + números
        for (let i = 0; i < 100; i++) {
            const numero = Math.floor(Math.random() * 99) + 10;
            const sugestao = `${baseClean}_${numero}`;
            if (this.validarUsernameUnico(listaUsuarios, sugestao).isValid) {
                sugestoes.push(sugestao);
                break;
            }
        }
        
        // Se não conseguiu 3 sugestões, preenche com variações
        while (sugestoes.length < 3) {
            const sufixos = ['style', 'fashion', 'look', 'outfit', 'trend'];
            const sufixo = sufixos[Math.floor(Math.random() * sufixos.length)];
            const numero = Math.floor(Math.random() * 999) + 1;
            const sugestao = `${baseClean}_${sufixo}${numero}`;
            
            if (this.validarUsernameUnico(listaUsuarios, sugestao).isValid && !sugestoes.includes(sugestao)) {
                sugestoes.push(sugestao);
            }
        }
        
        return sugestoes.slice(0, 3);
    }
    
    /**
     * Calcula a idade do usuário com base na data de nascimento
     * @returns {number} Idade em anos
     */
    calcularIdade() {
        if (!this.dataNascimento) return 0;
        
        const hoje = new Date();
        const nascimento = new Date(this.dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mesAtual = hoje.getMonth();
        const mesNascimento = nascimento.getMonth();
        
        if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        
        return idade;
    }
    
    /**
     * Valida se o usuário não excedeu o limite de 5 marcas favoritas
     * @param {Array} marcas - Array de marcas a ser validado
     * @returns {Object} Resultado da validação
     */
    validarMarcasLimite(marcas = this.marcas) {
        const limite = 5;
        
        if (!Array.isArray(marcas)) {
            return { isValid: false, message: 'Marcas deve ser um array' };
        }
        
        if (marcas.length > limite) {
            return { 
                isValid: false, 
                message: `Máximo de ${limite} marcas permitido (${marcas.length} selecionadas)` 
            };
        }
        
        return { 
            isValid: true, 
            message: `${marcas.length}/${limite} marcas selecionadas` 
        };
    }
    
    /**
     * Valida o CEP (formato brasileiro)
     * @param {string} cep - CEP a ser validado
     * @returns {Object} Resultado da validação
     */
    validarCep(cep = this.endereco.cep) {
        if (!cep) {
            return { isValid: false, message: 'CEP é obrigatório' };
        }
        
        const cepLimpo = cep.replace(/\D/g, '');
        
        if (cepLimpo.length !== 8) {
            return { isValid: false, message: 'CEP deve ter 8 dígitos' };
        }
        
        // Verificar se não é um CEP inválido conhecido
        const cepsInvalidos = ['00000000', '11111111', '22222222', '33333333', '44444444', '55555555', '66666666', '77777777', '88888888', '99999999'];
        if (cepsInvalidos.includes(cepLimpo)) {
            return { isValid: false, message: 'CEP inválido' };
        }
        
        return { isValid: true, message: 'CEP válido' };
    }
    
    /**
     * Valida a senha do usuário
     * @param {string} senha - Senha a ser validada
     * @returns {Object} Resultado da validação
     */
    validarSenha(senha = this.senha) {
        if (!senha) {
            return { isValid: false, message: 'Senha é obrigatória' };
        }
        
        if (senha.length < 8) {
            return { isValid: false, message: 'Senha deve ter pelo menos 8 caracteres' };
        }
        
        if (senha.length > 50) {
            return { isValid: false, message: 'Senha muito longa (máximo 50 caracteres)' };
        }
        
        // Verificar se tem pelo menos uma letra e um número
        const temLetra = /[a-zA-Z]/.test(senha);
        const temNumero = /[0-9]/.test(senha);
        
        if (!temLetra || !temNumero) {
            return { isValid: false, message: 'Senha deve conter pelo menos uma letra e um número' };
        }
        
        return { isValid: true, message: 'Senha válida' };
    }
    
    /**
     * Valida a data de nascimento
     * @param {string} data - Data de nascimento a ser validada
     * @returns {Object} Resultado da validação
     */
    validarDataNascimento(data = this.dataNascimento) {
        if (!data) {
            return { isValid: false, message: 'Data de nascimento é obrigatória' };
        }
        
        const nascimento = new Date(data);
        const hoje = new Date();
        
        if (isNaN(nascimento.getTime())) {
            return { isValid: false, message: 'Data de nascimento inválida' };
        }
        
        const idade = this.calcularIdade();
        
        if (idade < 13) {
            return { isValid: false, message: 'Usuário deve ter pelo menos 13 anos' };
        }
        
        if (idade > 120) {
            return { isValid: false, message: 'Data de nascimento inválida' };
        }
        
        return { isValid: true, message: 'Data de nascimento válida' };
    }
    
    /**
     * Valida nome completo
     * @param {string} nome - Nome a ser validado
     * @returns {Object} Resultado da validação
     */
    validarNomeCompleto(nome = this.nomeCompleto) {
        if (!nome) {
            return { isValid: false, message: 'Nome completo é obrigatório' };
        }
        
        if (nome.trim().length < 2) {
            return { isValid: false, message: 'Nome deve ter pelo menos 2 caracteres' };
        }
        
        if (nome.trim().length > 100) {
            return { isValid: false, message: 'Nome muito longo (máximo 100 caracteres)' };
        }
        
        // Verificar se tem pelo menos um espaço (nome e sobrenome)
        if (!nome.trim().includes(' ')) {
            return { isValid: false, message: 'Informe nome e sobrenome' };
        }
        
        return { isValid: true, message: 'Nome válido' };
    }
    
    /**
     * Valida todos os campos obrigatórios do usuário
     * @returns {Object} Resultado da validação geral
     */
    validarTodosOsCampos() {
        const erros = [];
        
        // Validar campos obrigatórios
        const validacoes = [
            this.validarNomeCompleto(),
            this.validarEmail(),
            this.validarSenha(),
            this.validarDataNascimento(),
            this.validarCep(),
            this.validarMarcasLimite()
        ];
        
        validacoes.forEach(validacao => {
            if (!validacao.isValid) {
                erros.push(validacao.message);
            }
        });
        
        // Verificar termos de uso
        if (!this.aceitouTermos) {
            erros.push('É obrigatório aceitar os termos de uso');
        }
        
        return {
            isValid: erros.length === 0,
            erros: erros
        };
    }
    
    /**
     * Converte o objeto usuário para JSON
     * @returns {Object} Objeto JavaScript com todos os dados do usuário
     */
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            nomeCompleto: this.nomeCompleto,
            dataNascimento: this.dataNascimento,
            idade: this.calcularIdade(),
            genero: this.genero,
            telefone: this.telefone,
            bio: this.bio,
            endereco: { ...this.endereco },
            estilos: [...this.estilos],
            marcas: [...this.marcas],
            corFavorita: this.corFavorita,
            redesSociais: { ...this.redesSociais },
            privacidade: { ...this.privacidade },
            notificacoes: { ...this.notificacoes },
            aceitouTermos: this.aceitouTermos,
            newsletter: this.newsletter,
            dataCriacao: this.dataCriacao,
            dataAtualizacao: this.dataAtualizacao
        };
    }
    
    /**
     * Cria uma cópia simplificada do usuário para exibição pública
     * @returns {Object} Dados públicos do usuário
     */
    toPublicJSON() {
        const publicData = {
            id: this.id,
            username: this.username,
            nomeCompleto: this.nomeCompleto,
            bio: this.bio,
            estilos: [...this.estilos],
            marcas: [...this.marcas],
            corFavorita: this.corFavorita,
            cidade: this.endereco.cidade,
            estado: this.endereco.estado,
            idade: this.calcularIdade(),
            dataCriacao: this.dataCriacao
        };
        
        // Adicionar redes sociais se o usuário permitir
        if (this.privacidade.mostrarRedesSociais) {
            publicData.redesSociais = { ...this.redesSociais };
        }
        
        return publicData;
    }
    
    /**
     * Atualiza os dados do usuário
     * @param {Object} novosDados - Novos dados para atualizar
     * @returns {boolean} Sucesso da operação
     */
    atualizar(novosDados) {
        try {
            // Campos que podem ser atualizados
            const camposPermitidos = [
                'username', 'email', 'nomeCompleto', 'dataNascimento', 'genero', 
                'telefone', 'bio', 'endereco', 'estilos', 'marcas', 'corFavorita',
                'redesSociais', 'privacidade', 'notificacoes', 'newsletter'
            ];
            
            camposPermitidos.forEach(campo => {
                if (novosDados.hasOwnProperty(campo)) {
                    if (campo === 'endereco' || campo === 'redesSociais' || campo === 'privacidade' || campo === 'notificacoes') {
                        // Para objetos, fazer merge
                        this[campo] = { ...this[campo], ...novosDados[campo] };
                    } else if (campo === 'estilos' || campo === 'marcas') {
                        // Para arrays, substituir
                        this[campo] = [...(novosDados[campo] || [])];
                    } else {
                        // Para valores simples
                        this[campo] = novosDados[campo];
                    }
                }
            });
            
            // Atualizar timestamp
            this.dataAtualizacao = new Date().toISOString();
            
            return true;
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            return false;
        }
    }
}