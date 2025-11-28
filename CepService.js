/**
 * DressCode - Rede Social de Moda
 * Arquivo: CepService.js
 * Descrição: Service para integração com API ViaCEP para busca de endereços
 */

export class CepService {
    constructor() {
        // URL base da API ViaCEP
        this.baseUrl = 'https://viacep.com.br/ws';
        
        // Cache local para evitar consultas desnecessárias
        this.cache = new Map();
        
        // Timeout para requisições em milissegundos
        this.timeout = 5000;
    }
    
    /**
     * Busca endereço pelo CEP na API ViaCEP
     * @param {string} cep - CEP para buscar (com ou sem formatação)
     * @returns {Promise<Object>} Dados do endereço ou erro
     */
    async buscarCep(cep) {
        try {
            // Limpar e validar CEP
            const cepLimpo = this.limparCep(cep);
            const validacao = this.validarFormatoCep(cepLimpo);
            
            if (!validacao.isValid) {
                return {
                    sucesso: false,
                    erro: validacao.message,
                    dados: null
                };
            }
            
            // Verificar cache primeiro
            if (this.cache.has(cepLimpo)) {
                const dadosCache = this.cache.get(cepLimpo);
                console.log(`CEP ${cepLimpo} encontrado no cache`);
                return {
                    sucesso: true,
                    erro: null,
                    dados: dadosCache,
                    fonte: 'cache'
                };
            }
            
            // Fazer requisição para API
            console.log(`Buscando CEP ${cepLimpo} na API ViaCEP...`);
            const url = `${this.baseUrl}/${cepLimpo}/json/`;
            
            const response = await this.fazerRequisicaoComTimeout(url);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }
            
            const dados = await response.json();
            
            // Verificar se o CEP existe (API retorna erro: true para CEPs inválidos)
            if (dados.erro === true || dados.erro === "true") {
                return {
                    sucesso: false,
                    erro: 'CEP não encontrado. Verifique se o CEP está correto.',
                    dados: null
                };
            }
            
            // Processar e padronizar dados
            const dadosProcessados = this.processarDadosEndereco(dados);
            
            // Salvar no cache
            this.cache.set(cepLimpo, dadosProcessados);
            
            console.log(`CEP ${cepLimpo} encontrado com sucesso:`, dadosProcessados);
            
            return {
                sucesso: true,
                erro: null,
                dados: dadosProcessados,
                fonte: 'api'
            };
            
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            
            // Determinar tipo de erro
            let mensagemErro = 'Erro ao buscar CEP. Tente novamente.';
            
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                mensagemErro = 'Erro de conexão. Verifique sua internet e tente novamente.';
            } else if (error.message.includes('timeout')) {
                mensagemErro = 'Timeout na consulta. Tente novamente em alguns segundos.';
            } else if (error.message.includes('HTTP')) {
                mensagemErro = 'Serviço de CEP temporariamente indisponível.';
            }
            
            return {
                sucesso: false,
                erro: mensagemErro,
                dados: null
            };
        }
    }
    
    /**
     * Remove caracteres não numéricos do CEP
     * @param {string} cep - CEP a ser limpo
     * @returns {string} CEP apenas com números
     */
    limparCep(cep) {
        if (!cep || typeof cep !== 'string') {
            return '';
        }
        return cep.replace(/\D/g, '');
    }
    
    /**
     * Valida o formato do CEP
     * @param {string} cep - CEP limpo para validar
     * @returns {Object} Resultado da validação
     */
    validarFormatoCep(cep) {
        if (!cep) {
            return {
                isValid: false,
                message: 'CEP é obrigatório'
            };
        }
        
        if (cep.length !== 8) {
            return {
                isValid: false,
                message: 'CEP deve conter exatamente 8 dígitos'
            };
        }
        
        // Verificar padrões inválidos conhecidos
        const padroes_invalidos = [
            /^0{8}$/, // 00000000
            /^1{8}$/, // 11111111
            /^2{8}$/, // 22222222
            /^3{8}$/, // 33333333
            /^4{8}$/, // 44444444
            /^5{8}$/, // 55555555
            /^6{8}$/, // 66666666
            /^7{8}$/, // 77777777
            /^8{8}$/, // 88888888
            /^9{8}$/, // 99999999
        ];
        
        for (const padrao of padroes_invalidos) {
            if (padrao.test(cep)) {
                return {
                    isValid: false,
                    message: 'CEP com formato inválido'
                };
            }
        }
        
        return {
            isValid: true,
            message: 'CEP válido'
        };
    }
    
    /**
     * Processa e padroniza os dados retornados da API ViaCEP
     * @param {Object} dadosApi - Dados brutos da API
     * @returns {Object} Dados processados e padronizados
     */
    processarDadosEndereco(dadosApi) {
        return {
            cep: this.formatarCep(dadosApi.cep || ''),
            logradouro: this.capitalizar(dadosApi.logradouro || ''),
            complemento: dadosApi.complemento || '',
            bairro: this.capitalizar(dadosApi.bairro || ''),
            cidade: this.capitalizar(dadosApi.localidade || ''),
            estado: dadosApi.uf?.toUpperCase() || '',
            ibge: dadosApi.ibge || '',
            gia: dadosApi.gia || '',
            ddd: dadosApi.ddd || '',
            siafi: dadosApi.siafi || ''
        };
    }
    
    /**
     * Formatar CEP com hífen (12345-678)
     * @param {string} cep - CEP sem formatação
     * @returns {string} CEP formatado
     */
    formatarCep(cep) {
        const cepLimpo = this.limparCep(cep);
        if (cepLimpo.length === 8) {
            return `${cepLimpo.substring(0, 5)}-${cepLimpo.substring(5)}`;
        }
        return cepLimpo;
    }
    
    /**
     * Capitaliza primeira letra de cada palavra
     * @param {string} texto - Texto a ser capitalizado
     * @returns {string} Texto capitalizado
     */
    capitalizar(texto) {
        if (!texto || typeof texto !== 'string') {
            return '';
        }
        
        return texto
            .toLowerCase()
            .split(' ')
            .map(palavra => {
                // Não capitalizar preposições e artigos
                const naoCapitalizar = ['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'na', 'no', 'com', 'por'];
                if (naoCapitalizar.includes(palavra)) {
                    return palavra;
                }
                return palavra.charAt(0).toUpperCase() + palavra.slice(1);
            })
            .join(' ')
            .replace(/^\w/, c => c.toUpperCase()); // Sempre capitalizar primeira palavra
    }
    
    /**
     * Faz requisição HTTP com timeout configurado
     * @param {string} url - URL para fazer requisição
     * @returns {Promise<Response>} Response da requisição
     */
    async fazerRequisicaoComTimeout(url) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error(`Timeout: Requisição cancelada após ${this.timeout}ms`);
            }
            throw error;
        }
    }
    
    /**
     * Busca múltiplos CEPs de forma otimizada
     * @param {Array<string>} ceps - Array de CEPs para buscar
     * @returns {Promise<Array>} Array com resultados das buscas
     */
    async buscarMultiplosCeps(ceps) {
        const promises = ceps.map(cep => this.buscarCep(cep));
        const resultados = await Promise.allSettled(promises);
        
        return resultados.map((resultado, index) => ({
            cep: ceps[index],
            resultado: resultado.status === 'fulfilled' ? resultado.value : {
                sucesso: false,
                erro: 'Erro interno na busca',
                dados: null
            }
        }));
    }
    
    /**
     * Limpa o cache de CEPs
     * @param {string} cep - CEP específico para limpar (opcional)
     */
    limparCache(cep = null) {
        if (cep) {
            const cepLimpo = this.limparCep(cep);
            this.cache.delete(cepLimpo);
            console.log(`Cache do CEP ${cepLimpo} removido`);
        } else {
            this.cache.clear();
            console.log('Cache de CEPs completamente limpo');
        }
    }
    
    /**
     * Retorna estatísticas do cache
     * @returns {Object} Estatísticas do cache
     */
    obterEstatisticasCache() {
        return {
            totalItens: this.cache.size,
            cepsCache: Array.from(this.cache.keys()),
            memoriaAproximada: `${Math.round(JSON.stringify([...this.cache]).length / 1024)} KB`
        };
    }
    
    /**
     * Valida se o serviço ViaCEP está disponível
     * @returns {Promise<boolean>} Status de disponibilidade
     */
    async verificarDisponibilidade() {
        try {
            // Testar com CEP válido conhecido (Av. Paulista, São Paulo)
            const resultado = await this.buscarCep('01310-100');
            return resultado.sucesso;
        } catch (error) {
            console.error('Serviço ViaCEP indisponível:', error);
            return false;
        }
    }
    
    /**
     * Obtém informações sobre os estados brasileiros
     * @returns {Array} Lista de estados com códigos e nomes
     */
    obterEstados() {
        return [
            { codigo: 'AC', nome: 'Acre' },
            { codigo: 'AL', nome: 'Alagoas' },
            { codigo: 'AP', nome: 'Amapá' },
            { codigo: 'AM', nome: 'Amazonas' },
            { codigo: 'BA', nome: 'Bahia' },
            { codigo: 'CE', nome: 'Ceará' },
            { codigo: 'DF', nome: 'Distrito Federal' },
            { codigo: 'ES', nome: 'Espírito Santo' },
            { codigo: 'GO', nome: 'Goiás' },
            { codigo: 'MA', nome: 'Maranhão' },
            { codigo: 'MT', nome: 'Mato Grosso' },
            { codigo: 'MS', nome: 'Mato Grosso do Sul' },
            { codigo: 'MG', nome: 'Minas Gerais' },
            { codigo: 'PA', nome: 'Pará' },
            { codigo: 'PB', nome: 'Paraíba' },
            { codigo: 'PR', nome: 'Paraná' },
            { codigo: 'PE', nome: 'Pernambuco' },
            { codigo: 'PI', nome: 'Piauí' },
            { codigo: 'RJ', nome: 'Rio de Janeiro' },
            { codigo: 'RN', nome: 'Rio Grande do Norte' },
            { codigo: 'RS', nome: 'Rio Grande do Sul' },
            { codigo: 'RO', nome: 'Rondônia' },
            { codigo: 'RR', nome: 'Roraima' },
            { codigo: 'SC', nome: 'Santa Catarina' },
            { codigo: 'SP', nome: 'São Paulo' },
            { codigo: 'SE', nome: 'Sergipe' },
            { codigo: 'TO', nome: 'Tocantins' }
        ];
    }
}