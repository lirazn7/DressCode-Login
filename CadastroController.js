/**
 * DressCode - Rede Social de Moda
 * Arquivo: CadastroController.js
 * Descrição: Controller principal que gerencia o fluxo do wizard de cadastro
 */

import { Usuario } from '../models/Usuario.js';
import { UsuarioService } from '../services/UsuarioService.js';
import { CepService } from '../services/CepService.js';
import { CadastroView } from '../views/CadastroView.js';

export class CadastroController {
    constructor() {
        // Inicializar services
        this.usuarioService = new UsuarioService();
        this.cepService = new CepService();
        
        // Inicializar view
        this.view = new CadastroView();
        
        // Estado do wizard
        this.currentStep = 1;
        this.totalSteps = 6;
        this.dadosTemporarios = {};
        
        // Elementos DOM
        this.startRegisterBtn = document.getElementById('startRegisterBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.submitBtn = document.getElementById('submitBtn');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.viewProfileBtn = document.getElementById('viewProfileBtn');
        
        // Configurar debounce para validações
        this.debounceTimers = {};
    }
    
    /**
     * Inicializa o controller configurando event listeners
     */
    inicializar() {
        try {
            console.log('Inicializando DressCode Controller...');
            
            // Verificar se elementos essenciais existem
            if (!this.startRegisterBtn) {
                throw new Error('Botão "startRegisterBtn" não encontrado no DOM');
            }
            
            this.configurarEventListeners();
            this.configurarValidacaoEspecializada();
            this.mostrarTelaInicial();
            
            // Marcar como inicializado
            window.dressCodeInicializado = true;
            
            console.log('DressCode inicializado com sucesso!');
            return true;
            
        } catch (error) {
            console.error('Erro na inicialização do Controller:', error);
            throw error;
        }
    }
    
    /**
     * Configura todos os event listeners da aplicação
     */
    configurarEventListeners() {
        console.log('Configurando event listeners...');
        
        // Botão para iniciar cadastro
        if (this.startRegisterBtn) {
            console.log('Configurando event listener para startRegisterBtn');
            this.startRegisterBtn.addEventListener('click', (e) => {
                console.log('Botão "Criar Minha Conta" clicado!');
                e.preventDefault();
                this.iniciarCadastro();
            });
            
            // Adicionar classe para indicar que está funcional
            this.startRegisterBtn.style.cursor = 'pointer';
            console.log('Event listener do startRegisterBtn configurado com sucesso');
        } else {
            console.error('ERRO: startRegisterBtn não encontrado!');
        }
        
        // Navegação do wizard
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.voltarEtapa();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.proximaEtapa();
            });
        }
        
        // Finalizar cadastro
        if (this.submitBtn) {
            this.submitBtn.addEventListener('click', () => {
                this.finalizarCadastro();
            });
        }
        
        // Modal de sucesso
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => {
                this.fecharModal();
            });
        }
        
        if (this.viewProfileBtn) {
            this.viewProfileBtn.addEventListener('click', () => {
                this.visualizarPerfil();
            });
        }
        
        // Fechar modal clicando fora
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.fecharModal();
            }
        });
        
        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.fecharModal();
            }
        });
    }
    
    /**
     * Configura validações especializadas para campos específicos
     */
    configurarValidacaoEspecializada() {
        // Validação de username único
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.addEventListener('blur', () => {
                this.validarUsernameUnico(usernameInput.value);
            });
        }
        
        // Validação de email único
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                this.validarEmailUnico(emailInput.value);
            });
        }
        
        // Busca automática de CEP
        const cepInput = document.getElementById('cep');
        if (cepInput) {
            cepInput.addEventListener('blur', () => {
                this.buscarEnderecoPorCep(cepInput.value);
            });
            
            // Também buscar quando CEP ficar completo
            cepInput.addEventListener('input', () => {
                const cepLimpo = cepInput.value.replace(/\D/g, '');
                if (cepLimpo.length === 8) {
                    clearTimeout(this.debounceTimers.cep);
                    this.debounceTimers.cep = setTimeout(() => {
                        this.buscarEnderecoPorCep(cepInput.value);
                    }, 1000);
                }
            });
        }
        
        // Validação de confirmação de senha
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                this.validarConfirmacaoSenha();
            });
        }
        
        // Validação de termos obrigatórios
        const termosInput = document.getElementById('aceitarTermos');
        if (termosInput) {
            termosInput.addEventListener('change', () => {
                this.validarAceiteTermos();
            });
        }
    }
    
    /**
     * Mostra a tela inicial de boas-vindas
     */
    mostrarTelaInicial() {
        this.view.showWelcomeSection();
        this.currentStep = 1;
    }
    
    /**
     * Inicia o processo de cadastro
     */
    iniciarCadastro() {
        console.log('Iniciando processo de cadastro...');
        this.view.showRegistrationSection();
        this.currentStep = 1;
        this.view.currentStep = 1;
        this.view.showStep(1);
    }
    
    /**
     * Avança para a próxima etapa do wizard
     */
    async proximaEtapa() {
        console.log(`Tentando avançar da etapa ${this.currentStep}...`);
        
        // Coletar dados da etapa atual
        this.view.collectStepData(this.currentStep);
        
        // Validar etapa atual
        const etapaValida = await this.validarEtapaAtual();
        
        if (!etapaValida) {
            console.log('Etapa atual possui erros, não é possível avançar');
            return;
        }
        
        // Copiar dados da view para controlador
        Object.assign(this.dadosTemporarios, this.view.formData);
        
        // Avançar para próxima etapa
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.view.currentStep = this.currentStep;
            this.view.showStep(this.currentStep);
            console.log(`Avançado para etapa ${this.currentStep}`);
        }
    }
    
    /**
     * Volta para a etapa anterior
     */
    voltarEtapa() {
        if (this.currentStep > 1) {
            // Salvar dados atuais
            this.view.collectStepData(this.currentStep);
            Object.assign(this.dadosTemporarios, this.view.formData);
            
            this.currentStep--;
            this.view.currentStep = this.currentStep;
            this.view.showStep(this.currentStep);
            console.log(`Voltou para etapa ${this.currentStep}`);
        }
    }
    
    /**
     * Valida a etapa atual do formulário
     */
    async validarEtapaAtual() {
        console.log(`Validando etapa ${this.currentStep}...`);
        
        const etapaValida = this.view.validateStep(this.currentStep);
        
        if (!etapaValida) {
            console.log(`Etapa ${this.currentStep} possui campos inválidos`);
            return false;
        }
        
        // Validações específicas por etapa
        switch (this.currentStep) {
            case 1:
                return await this.validarEtapa1();
            case 2:
                return this.validarEtapa2();
            case 3:
                return await this.validarEtapa3();
            case 4:
                return this.validarEtapa4();
            case 5:
                return this.validarEtapa5();
            case 6:
                return this.validarEtapa6();
            default:
                return true;
        }
    }
    
    /**
     * Valida etapa 1: Identidade
     */
    async validarEtapa1() {
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        
        // Verificar username único
        const usernameValido = await this.validarUsernameUnico(username);
        
        // Verificar email único
        const emailValido = this.validarEmailUnico(email);
        
        // Verificar confirmação de senha
        const senhaValida = this.validarConfirmacaoSenha();
        
        return usernameValido && emailValido && senhaValida;
    }
    
    /**
     * Valida etapa 2: Dados pessoais
     */
    validarEtapa2() {
        const nomeCompleto = document.getElementById('nomeCompleto').value;
        const dataNascimento = document.getElementById('dataNascimento').value;
        
        // Verificar se nome tem pelo menos nome e sobrenome
        if (!nomeCompleto.includes(' ')) {
            this.mostrarErroInput('nomeCompleto', 'Informe nome e sobrenome');
            return false;
        }
        
        // Verificar idade mínima
        if (dataNascimento) {
            const idade = this.calcularIdade(dataNascimento);
            if (idade < 13) {
                this.mostrarErroInput('dataNascimento', 'Idade mínima: 13 anos');
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Valida etapa 3: Endereço
     */
    async validarEtapa3() {
        const cep = document.getElementById('cep').value;
        
        if (!cep) {
            this.mostrarErroInput('cep', 'CEP é obrigatório');
            return false;
        }
        
        // Verificar se endereço foi preenchido (indica que CEP foi encontrado)
        const logradouro = document.getElementById('logradouro').value;
        if (!logradouro) {
            this.mostrarErroInput('cep', 'CEP inválido ou não encontrado');
            return false;
        }
        
        return true;
    }
    
    /**
     * Valida etapa 4: Estilo pessoal
     */
    validarEtapa4() {
        // Validar limite de marcas (já validado na view, mas double-check)
        const marcas = this.view.formData.marcas || [];
        if (marcas.length > 5) {
            this.mostrarFeedbackGeral('Máximo de 5 marcas permitido', 'error');
            return false;
        }
        
        return true;
    }
    
    /**
     * Valida etapa 5: Redes sociais
     */
    validarEtapa5() {
        // Validar URLs de redes sociais
        const website = document.getElementById('website').value;
        if (website && !/^https?:\/\/.+/.test(website)) {
            this.mostrarErroInput('website', 'URL deve começar com http:// ou https://');
            return false;
        }
        
        return true;
    }
    
    /**
     * Valida etapa 6: Preferências
     */
    validarEtapa6() {
        // Verificar aceite obrigatório dos termos
        return this.validarAceiteTermos();
    }
    
    /**
     * Valida se username é único
     */
    async validarUsernameUnico(username) {
        if (!username) return false;
        
        const usuario = new Usuario({ username });
        const usuarios = this.usuarioService.listarUsuarios();
        const validacao = usuario.validarUsernameUnico(usuarios, username);
        
        const usernameInput = document.getElementById('username');
        const feedback = usernameInput.closest('.input-container')?.querySelector('.input-feedback');
        
        if (!validacao.isValid) {
            this.view.showInputFeedback(feedback, validacao.message, 'error');
            
            // Gerar sugestões se username está em conflito
            if (validacao.message.includes('já está em uso')) {
                const sugestoes = usuario.gerarSugestoesUsername(usuarios, username);
                this.view.showUsernameSuggestions(sugestoes);
            }
            
            return false;
        } else {
            this.view.showInputFeedback(feedback, validacao.message, 'success');
            this.view.hideUsernameSuggestions();
            return true;
        }
    }
    
    /**
     * Valida se email é único
     */
    validarEmailUnico(email) {
        if (!email) return false;
        
        const usuarioExistente = this.usuarioService.buscarPorEmail(email);
        const emailInput = document.getElementById('email');
        const feedback = emailInput.closest('.input-container')?.querySelector('.input-feedback');
        
        if (usuarioExistente) {
            this.view.showInputFeedback(feedback, 'Este email já está cadastrado', 'error');
            return false;
        } else {
            this.view.showInputFeedback(feedback, 'Email disponível', 'success');
            return true;
        }
    }
    
    /**
     * Valida confirmação de senha
     */
    validarConfirmacaoSenha() {
        const senha = document.getElementById('password').value;
        const confirmacao = document.getElementById('confirmPassword').value;
        const confirmInput = document.getElementById('confirmPassword');
        const feedback = confirmInput.closest('.input-container')?.querySelector('.input-feedback');
        
        if (confirmacao && senha !== confirmacao) {
            this.view.showInputFeedback(feedback, 'Senhas não coincidem', 'error');
            return false;
        } else if (confirmacao) {
            this.view.showInputFeedback(feedback, 'Senhas coincidem', 'success');
            return true;
        }
        
        return true;
    }
    
    /**
     * Valida aceite dos termos de uso
     */
    validarAceiteTermos() {
        const termosCheckbox = document.getElementById('aceitarTermos');
        
        if (!termosCheckbox.checked) {
            // Mostrar feedback próximo ao checkbox
            const checkboxContainer = termosCheckbox.closest('.checkbox-label');
            this.mostrarFeedbackGeral('É obrigatório aceitar os termos de uso', 'error');
            return false;
        }
        
        return true;
    }
    
    /**
     * Busca endereço por CEP usando o CepService
     */
    async buscarEnderecoPorCep(cep) {
        if (!cep) return;
        
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length !== 8) return;
        
        console.log(`Buscando CEP: ${cepLimpo}`);
        
        this.view.showCepLoading();
        
        try {
            const resultado = await this.cepService.buscarCep(cepLimpo);
            
            this.view.hideCepLoading();
            
            const cepInput = document.getElementById('cep');
            const feedback = cepInput.closest('.input-container')?.querySelector('.input-feedback');
            
            if (resultado.sucesso) {
                console.log('CEP encontrado:', resultado.dados);
                
                this.view.preencherEndereco(resultado.dados);
                this.view.showInputFeedback(feedback, `CEP encontrado: ${resultado.dados.cidade}, ${resultado.dados.estado}`, 'success');
                
                // Salvar dados do endereço
                this.dadosTemporarios.endereco = {
                    ...this.dadosTemporarios.endereco,
                    ...resultado.dados
                };
                
            } else {
                console.log('Erro ao buscar CEP:', resultado.erro);
                
                this.view.limparEndereco();
                this.view.showInputFeedback(feedback, resultado.erro, 'error');
            }
            
        } catch (error) {
            console.error('Erro inesperado ao buscar CEP:', error);
            
            this.view.hideCepLoading();
            this.view.limparEndereco();
            
            const cepInput = document.getElementById('cep');
            const feedback = cepInput.closest('.input-container')?.querySelector('.input-feedback');
            this.view.showInputFeedback(feedback, 'Erro ao buscar CEP. Tente novamente.', 'error');
        }
    }
    
    /**
     * Finaliza o processo de cadastro
     */
    async finalizarCadastro() {
        console.log('Finalizando cadastro...');
        
        // Coletar dados da última etapa
        this.view.collectStepData(this.currentStep);
        Object.assign(this.dadosTemporarios, this.view.formData);
        
        // Validar etapa final
        const etapaValida = await this.validarEtapaAtual();
        if (!etapaValida) {
            console.log('Etapa final inválida, não é possível finalizar');
            return;
        }
        
        try {
            // Preparar dados do usuário
            const dadosUsuario = this.prepararDadosUsuario();
            
            // Criar instância do usuário
            const usuario = new Usuario(dadosUsuario);
            
            // Validar todos os campos
            const validacaoGeral = usuario.validarTodosOsCampos();
            if (!validacaoGeral.isValid) {
                console.error('Dados inválidos:', validacaoGeral.erros);
                this.mostrarFeedbackGeral(`Erro: ${validacaoGeral.erros.join(', ')}`, 'error');
                return;
            }
            
            // Salvar usuário
            const sucesso = this.usuarioService.salvarUsuario(usuario);
            
            if (sucesso) {
                console.log('Usuário cadastrado com sucesso:', usuario.username);
                
                // Mostrar modal de sucesso
                this.view.showSuccessModal(usuario);
                
                // Limpar dados temporários
                this.dadosTemporarios = {};
                
            } else {
                console.error('Falha ao salvar usuário');
                this.mostrarFeedbackGeral('Erro ao salvar cadastro. Tente novamente.', 'error');
            }
            
        } catch (error) {
            console.error('Erro ao finalizar cadastro:', error);
            this.mostrarFeedbackGeral('Erro inesperado. Tente novamente.', 'error');
        }
    }
    
    /**
     * Prepara dados coletados para criação do usuário
     */
    prepararDadosUsuario() {
        const dados = { ...this.dadosTemporarios };
        
        // Processar endereço
        dados.endereco = {
            cep: dados.cep || '',
            logradouro: dados.logradouro || '',
            numero: dados.numero || '',
            complemento: dados.complemento || '',
            bairro: dados.bairro || '',
            cidade: dados.cidade || '',
            estado: dados.estado || ''
        };
        
        // Processar redes sociais
        dados.redesSociais = {
            instagram: dados.instagram || '',
            tiktok: dados.tiktok || '',
            pinterest: dados.pinterest || '',
            website: dados.website || ''
        };
        
        // Processar preferências de privacidade
        dados.privacidade = {
            perfilPublico: dados.privacidadePerfil === 'publico',
            mostrarRedesSociais: dados.mostrarRedesSociais === true,
            aparecerSugestoes: dados.aparecerSugestoes !== false,
            indexarBusca: dados.indexarBusca !== false
        };
        
        // Processar notificações
        dados.notificacoes = {
            email: dados.notifEmail !== false,
            seguidor: dados.notifSeguidor !== false,
            curtida: dados.notifCurtida !== false,
            comentario: dados.notifComentario !== false
        };
        
        // Configurações adicionais
        dados.aceitouTermos = dados.aceitarTermos === true;
        dados.newsletter = dados.newsletter === true;
        
        return dados;
    }
    
    /**
     * Calcula idade com base na data de nascimento
     */
    calcularIdade(dataNascimento) {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mesAtual = hoje.getMonth();
        const mesNascimento = nascimento.getMonth();
        
        if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        
        return idade;
    }
    
    /**
     * Mostra erro específico em um input
     */
    mostrarErroInput(inputId, mensagem) {
        const input = document.getElementById(inputId);
        const feedback = input?.closest('.input-container')?.querySelector('.input-feedback');
        
        if (feedback) {
            this.view.showInputFeedback(feedback, mensagem, 'error');
        }
    }
    
    /**
     * Mostra feedback geral na interface
     */
    mostrarFeedbackGeral(mensagem, tipo = 'info') {
        // Criar elemento de feedback temporário
        const feedback = document.createElement('div');
        feedback.className = `feedback-geral ${tipo}`;
        feedback.textContent = mensagem;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--${tipo === 'error' ? 'error' : tipo === 'success' ? 'success' : 'info'}-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(feedback);
        
        // Remover após 5 segundos
        setTimeout(() => {
            feedback.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                feedback.remove();
            }, 300);
        }, 5000);
    }
    
    /**
     * Fecha modal de sucesso
     */
    fecharModal() {
        this.view.hideSuccessModal();
        
        // Resetar formulário e voltar ao início
        this.view.resetForm();
        this.dadosTemporarios = {};
        this.mostrarTelaInicial();
    }
    
    /**
     * Visualiza perfil criado (placeholder para futuras funcionalidades)
     */
    visualizarPerfil() {
        console.log('Funcionalidade de visualização de perfil será implementada em versões futuras');
        this.mostrarFeedbackGeral('Perfil criado com sucesso! Funcionalidade de visualização em desenvolvimento.', 'info');
        this.fecharModal();
    }
}