/**
 * DressCode - Rede Social de Moda
 * Arquivo: CadastroView.js
 * Descrição: View responsável por renderizar e gerenciar a interface do wizard de cadastro
 */

export class CadastroView {
    constructor() {
        console.log('🎨 Inicializando CadastroView...');
        
        // Elementos principais da interface
        this.welcomeSection = document.getElementById('welcomeSection');
        this.registrationSection = document.getElementById('registrationSection');
        this.progressFill = document.getElementById('progressFill');
        this.progressSteps = document.querySelectorAll('.step');
        this.formSteps = document.querySelectorAll('.form-step');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.submitBtn = document.getElementById('submitBtn');
        this.successModal = document.getElementById('successModal');
        this.registrationForm = document.getElementById('registrationForm');
        
        // Verificar elementos críticos
        const elementosCriticos = ['welcomeSection', 'registrationSection'];
        for (const elemento of elementosCriticos) {
            if (!this[elemento]) {
                console.error(`❌ Elemento crítico não encontrado: ${elemento}`);
            }
        }
        
        // Estado atual
        this.currentStep = 1;
        this.totalSteps = 6;
        
        // Dados temporários do formulário
        this.formData = {};
        
        // Inicializar funcionalidades (com try-catch para evitar erros)
        try {
            this.initializeMasks();
            this.setupRealTimeValidation();
            this.setupMarcasTags();
            this.setupEstilosSelection();
            this.setupCharacterCounter();
            console.log('✅ CadastroView inicializada com sucesso');
        } catch (error) {
            console.error('⚠️ Erro na inicialização da CadastroView:', error);
        }
    }
    
    /**
     * Inicializa máscaras para inputs de telefone e CEP
     */
    initializeMasks() {
        const telefoneInput = document.getElementById('telefone');
        const cepInput = document.getElementById('cep');
        
        // Máscara para telefone (11) 99999-9999
        if (telefoneInput) {
            telefoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length <= 11) {
                    if (value.length <= 2) {
                        value = value.replace(/(\d{0,2})/, '($1');
                    } else if (value.length <= 6) {
                        value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
                    } else if (value.length <= 10) {
                        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                    } else {
                        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                    }
                }
                
                e.target.value = value;
            });
        }
        
        // Máscara para CEP 12345-678
        if (cepInput) {
            cepInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length <= 8) {
                    if (value.length > 5) {
                        value = value.replace(/(\d{5})(\d{0,3})/, '$1-$2');
                    }
                }
                
                e.target.value = value;
            });
        }
    }
    
    /**
     * Configura validação em tempo real para todos os inputs
     */
    setupRealTimeValidation() {
        const inputs = this.registrationForm.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="date"], input[type="tel"], input[type="url"]');
        
        inputs.forEach(input => {
            // Validação ao perder foco
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
            
            // Validação durante digitação (com debounce)
            let timeout;
            input.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.validateInput(input);
                }, 500);
            });
        });
    }
    
    /**
     * Configura o sistema de tags para marcas favoritas
     */
    setupMarcasTags() {
        const marcasInput = document.getElementById('marcasInput');
        const tagsDisplay = document.getElementById('tagsDisplay');
        const marcasFeedback = document.getElementById('marcasFeedback');
        
        if (!marcasInput || !tagsDisplay) return;
        
        let marcasSelecionadas = [];
        const maxMarcas = 5;
        
        marcasInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                
                const marca = marcasInput.value.trim();
                if (marca && marcasSelecionadas.length < maxMarcas && !marcasSelecionadas.includes(marca)) {
                    marcasSelecionadas.push(marca);
                    this.renderMarcas(tagsDisplay, marcasSelecionadas, marcasInput, marcasFeedback);
                    marcasInput.value = '';
                    
                    // Atualizar dados do formulário
                    this.formData.marcas = marcasSelecionadas;
                } else if (marcasSelecionadas.length >= maxMarcas) {
                    this.showInputFeedback(marcasFeedback, 'Máximo de 5 marcas permitido', 'error');
                } else if (marcasSelecionadas.includes(marca)) {
                    this.showInputFeedback(marcasFeedback, 'Marca já adicionada', 'error');
                }
            }
        });
        
        // Inicializar renderização
        this.renderMarcas(tagsDisplay, marcasSelecionadas, marcasInput, marcasFeedback);
    }
    
    /**
     * Renderiza as tags de marcas selecionadas
     */
    renderMarcas(container, marcas, input, feedback) {
        container.innerHTML = '';
        
        marcas.forEach((marca, index) => {
            const tag = document.createElement('div');
            tag.className = 'tag-item';
            tag.innerHTML = `
                <span>${marca}</span>
                <span class="tag-remove" onclick="this.parentElement.remove(); this.updateMarcas(${index})">×</span>
            `;
            
            // Adicionar evento de remoção
            const removeBtn = tag.querySelector('.tag-remove');
            removeBtn.addEventListener('click', () => {
                marcas.splice(index, 1);
                this.formData.marcas = marcas;
                this.renderMarcas(container, marcas, input, feedback);
            });
            
            container.appendChild(tag);
        });
        
        // Atualizar feedback
        const restantes = 5 - marcas.length;
        if (restantes > 0) {
            this.showInputFeedback(feedback, `${marcas.length}/5 marcas selecionadas`, 'info');
        } else {
            this.showInputFeedback(feedback, 'Limite máximo atingido', 'error');
        }
    }
    
    /**
     * Configura seleção de estilos pessoais
     */
    setupEstilosSelection() {
        const styleGrid = document.getElementById('styleGrid');
        if (!styleGrid) return;
        
        let estilosSelecionados = [];
        
        const styleCards = styleGrid.querySelectorAll('.style-card');
        styleCards.forEach(card => {
            card.addEventListener('click', () => {
                const estilo = card.dataset.style;
                
                if (card.classList.contains('selected')) {
                    // Remover seleção
                    card.classList.remove('selected');
                    estilosSelecionados = estilosSelecionados.filter(s => s !== estilo);
                } else {
                    // Adicionar seleção
                    card.classList.add('selected');
                    estilosSelecionados.push(estilo);
                }
                
                // Atualizar dados do formulário
                this.formData.estilos = estilosSelecionados;
            });
        });
    }
    
    /**
     * Configura contador de caracteres para textarea
     */
    setupCharacterCounter() {
        const bioTextarea = document.getElementById('bio');
        const charCounter = document.querySelector('.char-counter');
        
        if (bioTextarea && charCounter) {
            bioTextarea.addEventListener('input', () => {
                const length = bioTextarea.value.length;
                const maxLength = bioTextarea.maxLength || 300;
                charCounter.textContent = `${length}/${maxLength} caracteres`;
                
                if (length > maxLength * 0.9) {
                    charCounter.style.color = 'var(--warning-color)';
                } else {
                    charCounter.style.color = 'var(--gray-500)';
                }
            });
        }
    }
    
    /**
     * Valida um input específico
     */
    validateInput(input) {
        const value = input.value.trim();
        const inputContainer = input.closest('.input-container');
        const feedback = inputContainer?.querySelector('.input-feedback');
        
        let isValid = true;
        let message = '';
        let type = 'success';
        
        // Validações específicas por tipo de input
        switch (input.type) {
            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    isValid = false;
                    message = 'Email inválido';
                    type = 'error';
                } else if (value) {
                    message = 'Email válido';
                }
                break;
                
            case 'password':
                if (input.id === 'password') {
                    if (value.length < 8) {
                        isValid = false;
                        message = 'Senha deve ter pelo menos 8 caracteres';
                        type = 'error';
                    } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(value)) {
                        isValid = false;
                        message = 'Senha deve ter letras e números';
                        type = 'error';
                    } else {
                        message = 'Senha válida';
                    }
                } else if (input.id === 'confirmPassword') {
                    const password = document.getElementById('password').value;
                    if (value !== password) {
                        isValid = false;
                        message = 'Senhas não coincidem';
                        type = 'error';
                    } else if (value) {
                        message = 'Senhas coincidem';
                    }
                }
                break;
                
            case 'date':
                if (value) {
                    const birthDate = new Date(value);
                    const today = new Date();
                    const age = today.getFullYear() - birthDate.getFullYear();
                    
                    if (age < 13) {
                        isValid = false;
                        message = 'Idade mínima: 13 anos';
                        type = 'error';
                    } else if (age > 120) {
                        isValid = false;
                        message = 'Data inválida';
                        type = 'error';
                    } else {
                        message = `${age} anos`;
                    }
                }
                break;
                
            case 'tel':
                if (value && value.replace(/\D/g, '').length < 10) {
                    isValid = false;
                    message = 'Telefone incompleto';
                    type = 'error';
                } else if (value) {
                    message = 'Telefone válido';
                }
                break;
                
            case 'url':
                if (value && !/^https?:\/\/.+/.test(value)) {
                    isValid = false;
                    message = 'URL deve começar com http:// ou https://';
                    type = 'error';
                } else if (value) {
                    message = 'URL válida';
                }
                break;
                
            default:
                if (input.required && !value) {
                    isValid = false;
                    message = 'Campo obrigatório';
                    type = 'error';
                } else if (value && input.id === 'username') {
                    if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
                        isValid = false;
                        message = 'Username: 3-20 caracteres (letras, números e _)';
                        type = 'error';
                    } else {
                        message = 'Username válido';
                    }
                } else if (value && input.id === 'nomeCompleto') {
                    if (!value.includes(' ')) {
                        isValid = false;
                        message = 'Informe nome e sobrenome';
                        type = 'error';
                    } else {
                        message = 'Nome válido';
                    }
                }
                break;
        }
        
        // Aplicar estilos visuais
        if (value) {
            input.classList.toggle('valid', isValid);
            input.classList.toggle('invalid', !isValid);
            
            if (feedback && message) {
                this.showInputFeedback(feedback, message, type);
            }
        } else {
            input.classList.remove('valid', 'invalid');
            if (feedback) {
                this.hideInputFeedback(feedback);
            }
        }
        
        return isValid;
    }
    
    /**
     * Mostra feedback visual para um input
     */
    showInputFeedback(feedbackElement, message, type = 'info') {
        if (!feedbackElement) return;
        
        feedbackElement.textContent = message;
        feedbackElement.className = `input-feedback show ${type}`;
    }
    
    /**
     * Esconde feedback de um input
     */
    hideInputFeedback(feedbackElement) {
        if (!feedbackElement) return;
        
        feedbackElement.classList.remove('show');
    }
    
    /**
     * Mostra sugestões de username
     */
    showUsernameSuggestions(suggestions) {
        const suggestionsContainer = document.getElementById('usernameSuggestions');
        const suggestionsList = suggestionsContainer?.querySelector('.suggestions-list');
        
        if (!suggestionsContainer || !suggestionsList) return;
        
        suggestionsList.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = suggestion;
            item.addEventListener('click', () => {
                document.getElementById('username').value = suggestion;
                this.hideUsernameSuggestions();
                this.validateInput(document.getElementById('username'));
            });
            suggestionsList.appendChild(item);
        });
        
        suggestionsContainer.classList.remove('hidden');
    }
    
    /**
     * Esconde sugestões de username
     */
    hideUsernameSuggestions() {
        const suggestionsContainer = document.getElementById('usernameSuggestions');
        if (suggestionsContainer) {
            suggestionsContainer.classList.add('hidden');
        }
    }
    
    /**
     * Atualiza a barra de progresso
     */
    updateProgressBar() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Atualizar indicadores de step
        this.progressSteps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            
            if (index + 1 < this.currentStep) {
                step.classList.add('completed');
            } else if (index + 1 === this.currentStep) {
                step.classList.add('active');
            }
        });
    }
    
    /**
     * Mostra um step específico
     */
    showStep(stepNumber) {
        // Esconder todos os steps
        this.formSteps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Mostrar step atual
        const currentStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        
        // Atualizar botões de navegação
        this.updateNavigationButtons();
        
        // Atualizar barra de progresso
        this.updateProgressBar();
        
        // Focar no primeiro input do step
        this.focusFirstInput(stepNumber);
    }
    
    /**
     * Atualiza estado dos botões de navegação
     */
    updateNavigationButtons() {
        this.prevBtn.disabled = this.currentStep === 1;
        
        if (this.currentStep === this.totalSteps) {
            this.nextBtn.classList.add('hidden');
            this.submitBtn.classList.remove('hidden');
        } else {
            this.nextBtn.classList.remove('hidden');
            this.submitBtn.classList.add('hidden');
        }
    }
    
    /**
     * Foca no primeiro input do step atual
     */
    focusFirstInput(stepNumber) {
        const currentStep = document.querySelector(`[data-step="${stepNumber}"]`);
        const firstInput = currentStep?.querySelector('input:not([type="hidden"])');
        
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    }
    
    /**
     * Coleta dados do step atual
     */
    collectStepData(stepNumber) {
        const stepElement = document.querySelector(`[data-step="${stepNumber}"]`);
        const inputs = stepElement.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                this.formData[input.name] = input.checked;
            } else if (input.type === 'color') {
                this.formData[input.name] = input.value;
            } else {
                this.formData[input.name] = input.value.trim();
            }
        });
        
        // Dados especiais que já foram coletados
        if (stepNumber === 4) {
            // Estilos e marcas já estão em this.formData
        }
    }
    
    /**
     * Valida todos os campos de um step
     */
    validateStep(stepNumber) {
        const stepElement = document.querySelector(`[data-step="${stepNumber}"]`);
        const requiredInputs = stepElement.querySelectorAll('input[required], select[required]');
        let isStepValid = true;
        
        requiredInputs.forEach(input => {
            if (!this.validateInput(input)) {
                isStepValid = false;
            }
        });
        
        // Validações especiais por step
        if (stepNumber === 1) {
            // Verificar confirmação de senha
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password !== confirmPassword) {
                isStepValid = false;
            }
        }
        
        if (stepNumber === 6) {
            // Verificar aceite dos termos
            const termos = document.getElementById('aceitarTermos');
            if (!termos.checked) {
                isStepValid = false;
                const feedback = termos.closest('.checkbox-label')?.querySelector('.input-feedback');
                if (feedback) {
                    this.showInputFeedback(feedback, 'É obrigatório aceitar os termos', 'error');
                }
            }
        }
        
        return isStepValid;
    }
    
    /**
     * Mostra indicador de carregamento no CEP
     */
    showCepLoading() {
        const loading = document.getElementById('cepLoading');
        if (loading) {
            loading.classList.remove('hidden');
        }
    }
    
    /**
     * Esconde indicador de carregamento do CEP
     */
    hideCepLoading() {
        const loading = document.getElementById('cepLoading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }
    
    /**
     * Preenche campos de endereço com dados do CEP
     */
    preencherEndereco(dadosEndereco) {
        const campos = ['logradouro', 'bairro', 'cidade', 'estado'];
        
        campos.forEach(campo => {
            const input = document.getElementById(campo);
            if (input && dadosEndereco[campo]) {
                input.value = dadosEndereco[campo];
                input.classList.add('valid');
            }
        });
    }
    
    /**
     * Limpa campos de endereço
     */
    limparEndereco() {
        const campos = ['logradouro', 'bairro', 'cidade', 'estado'];
        
        campos.forEach(campo => {
            const input = document.getElementById(campo);
            if (input) {
                input.value = '';
                input.classList.remove('valid', 'invalid');
            }
        });
    }
    
    /**
     * Mostra modal de sucesso com resumo do perfil
     */
    showSuccessModal(usuario) {
        const profileSummary = document.getElementById('profileSummary');
        
        if (profileSummary) {
            profileSummary.innerHTML = `
                <h4>Resumo do seu perfil:</h4>
                <div class="profile-summary-item">
                    <span class="profile-summary-label">Username:</span>
                    <span class="profile-summary-value">@${usuario.username}</span>
                </div>
                <div class="profile-summary-item">
                    <span class="profile-summary-label">Nome:</span>
                    <span class="profile-summary-value">${usuario.nomeCompleto}</span>
                </div>
                <div class="profile-summary-item">
                    <span class="profile-summary-label">Email:</span>
                    <span class="profile-summary-value">${usuario.email}</span>
                </div>
                <div class="profile-summary-item">
                    <span class="profile-summary-label">Idade:</span>
                    <span class="profile-summary-value">${usuario.calcularIdade()} anos</span>
                </div>
                <div class="profile-summary-item">
                    <span class="profile-summary-label">Localização:</span>
                    <span class="profile-summary-value">${usuario.endereco.cidade}, ${usuario.endereco.estado}</span>
                </div>
                <div class="profile-summary-item">
                    <span class="profile-summary-label">Estilos:</span>
                    <span class="profile-summary-value">${usuario.estilos.join(', ') || 'Nenhum'}</span>
                </div>
                <div class="profile-summary-item">
                    <span class="profile-summary-label">Marcas favoritas:</span>
                    <span class="profile-summary-value">${usuario.marcas.join(', ') || 'Nenhuma'}</span>
                </div>
            `;
        }
        
        this.successModal.classList.remove('hidden');
        
        // Configurar botão de download
        const downloadBtn = document.getElementById('downloadProfileBtn');
        if (downloadBtn) {
            downloadBtn.onclick = () => this.downloadProfile(usuario);
        }
    }
    
    /**
     * Esconde modal de sucesso
     */
    hideSuccessModal() {
        this.successModal.classList.add('hidden');
    }
    
    /**
     * Download do perfil em JSON
     */
    downloadProfile(usuario) {
        const dataStr = JSON.stringify(usuario.toJSON(), null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `dresscode_perfil_${usuario.username}_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
    
    /**
     * Mostra seção de boas-vindas
     */
    showWelcomeSection() {
        this.welcomeSection.classList.remove('hidden');
        this.registrationSection.classList.add('hidden');
    }
    
    /**
     * Mostra seção de cadastro
     */
    showRegistrationSection() {
        this.welcomeSection.classList.add('hidden');
        this.registrationSection.classList.remove('hidden');
        
        // Resetar para primeiro step
        this.currentStep = 1;
        this.showStep(1);
    }
    
    /**
     * Reseta o formulário para um novo cadastro
     */
    resetForm() {
        this.registrationForm.reset();
        this.formData = {};
        this.currentStep = 1;
        
        // Limpar seleções especiais
        document.querySelectorAll('.style-card.selected').forEach(card => {
            card.classList.remove('selected');
        });
        
        document.getElementById('tagsDisplay').innerHTML = '';
        
        // Limpar feedbacks
        document.querySelectorAll('.input-feedback').forEach(feedback => {
            this.hideInputFeedback(feedback);
        });
        
        // Limpar classes de validação
        document.querySelectorAll('input.valid, input.invalid').forEach(input => {
            input.classList.remove('valid', 'invalid');
        });
    }
}