/**
 * DressCode - Rede Social de Moda
 * Arquivo: UsuarioService.js
 * Descrição: Service para gerenciar usuários no LocalStorage
 */

import { Usuario } from '../models/Usuario.js';

export class UsuarioService {
    constructor() {
        // Chave única para armazenar usuários no localStorage
        this.storageKey = 'dresscode_users';
        
        // Cache em memória para otimizar operações
        this.cache = null;
        this.cacheTimestamp = null;
        this.cacheTTL = 5 * 60 * 1000; // 5 minutos em milissegundos
        
        // Inicializar com dados de exemplo se estiver vazio
        this.inicializarDadosExemplo();
    }
    
    /**
     * Inicializa dados de exemplo se não houver usuários cadastrados
     */
    inicializarDadosExemplo() {
        const usuarios = this.listarUsuarios();
        if (usuarios.length === 0) {
            console.log('Inicializando dados de exemplo...');
            
            // Criar alguns usuários de exemplo
            const usuariosExemplo = [
                {
                    username: 'fashionista_sp',
                    email: 'ana.silva@email.com',
                    nomeCompleto: 'Ana Silva',
                    dataNascimento: '1995-03-15',
                    endereco: {
                        cep: '01310-100',
                        logradouro: 'Avenida Paulista',
                        cidade: 'São Paulo',
                        estado: 'SP'
                    },
                    estilos: ['elegante', 'minimalista'],
                    marcas: ['Zara', 'Mango']
                },
                {
                    username: 'street_style_rj',
                    email: 'carlos.santos@email.com',
                    nomeCompleto: 'Carlos Santos',
                    dataNascimento: '1992-08-22',
                    endereco: {
                        cep: '22070-900',
                        logradouro: 'Avenida Atlântica',
                        cidade: 'Rio de Janeiro',
                        estado: 'RJ'
                    },
                    estilos: ['streetwear', 'casual'],
                    marcas: ['Nike', 'Adidas', 'Supreme']
                }
            ];
            
            usuariosExemplo.forEach(dados => {
                const usuario = new Usuario(dados);
                usuario.aceitouTermos = true;
                this.salvarUsuario(usuario);
            });
        }
    }
    
    /**
     * Lista todos os usuários salvos
     * @returns {Array<Usuario>} Array com todos os usuários
     */
    listarUsuarios() {
        try {
            // Verificar cache primeiro
            if (this.isCacheValido()) {
                return this.cache;
            }
            
            const dadosStorage = localStorage.getItem(this.storageKey);
            
            if (!dadosStorage) {
                this.atualizarCache([]);
                return [];
            }
            
            const dadosArray = JSON.parse(dadosStorage);
            
            // Converter dados em instâncias da classe Usuario
            const usuarios = dadosArray.map(dados => new Usuario(dados));
            
            // Atualizar cache
            this.atualizarCache(usuarios);
            
            return usuarios;
            
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            return [];
        }
    }
    
    /**
     * Salva um usuário no localStorage
     * @param {Usuario} usuario - Instância do usuário a ser salvo
     * @returns {boolean} Sucesso da operação
     */
    salvarUsuario(usuario) {
        try {
            if (!(usuario instanceof Usuario)) {
                throw new Error('Parâmetro deve ser uma instância da classe Usuario');
            }
            
            // Validar dados do usuário antes de salvar
            const validacao = usuario.validarTodosOsCampos();
            if (!validacao.isValid) {
                console.error('Usuário inválido:', validacao.erros);
                return false;
            }
            
            const usuarios = this.listarUsuarios();
            
            // Verificar se é atualização ou novo usuário
            const indiceExistente = usuarios.findIndex(u => u.id === usuario.id);
            
            if (indiceExistente >= 0) {
                // Atualizar usuário existente
                usuarios[indiceExistente] = usuario;
                console.log(`Usuário ${usuario.username} atualizado com sucesso`);
            } else {
                // Verificar unicidade do username e email
                const usernameExiste = usuarios.some(u => u.username.toLowerCase() === usuario.username.toLowerCase());
                if (usernameExiste) {
                    console.error('Username já existe:', usuario.username);
                    return false;
                }
                
                const emailExiste = usuarios.some(u => u.email.toLowerCase() === usuario.email.toLowerCase());
                if (emailExiste) {
                    console.error('Email já existe:', usuario.email);
                    return false;
                }
                
                // Adicionar novo usuário
                usuarios.push(usuario);
                console.log(`Usuário ${usuario.username} criado com sucesso`);
            }
            
            // Salvar no localStorage
            const dadosParaSalvar = usuarios.map(u => u.toJSON());
            localStorage.setItem(this.storageKey, JSON.stringify(dadosParaSalvar));
            
            // Atualizar cache
            this.atualizarCache(usuarios);
            
            return true;
            
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            return false;
        }
    }
    
    /**
     * Busca usuário por username
     * @param {string} username - Username para buscar
     * @returns {Usuario|null} Usuário encontrado ou null
     */
    buscarPorUsername(username) {
        try {
            if (!username || typeof username !== 'string') {
                return null;
            }
            
            const usuarios = this.listarUsuarios();
            return usuarios.find(usuario => 
                usuario.username.toLowerCase() === username.toLowerCase()
            ) || null;
            
        } catch (error) {
            console.error('Erro ao buscar usuário por username:', error);
            return null;
        }
    }
    
    /**
     * Busca usuário por email
     * @param {string} email - Email para buscar
     * @returns {Usuario|null} Usuário encontrado ou null
     */
    buscarPorEmail(email) {
        try {
            if (!email || typeof email !== 'string') {
                return null;
            }
            
            const usuarios = this.listarUsuarios();
            return usuarios.find(usuario => 
                usuario.email.toLowerCase() === email.toLowerCase()
            ) || null;
            
        } catch (error) {
            console.error('Erro ao buscar usuário por email:', error);
            return null;
        }
    }
    
    /**
     * Busca usuário por ID
     * @param {string} id - ID para buscar
     * @returns {Usuario|null} Usuário encontrado ou null
     */
    buscarPorId(id) {
        try {
            if (!id || typeof id !== 'string') {
                return null;
            }
            
            const usuarios = this.listarUsuarios();
            return usuarios.find(usuario => usuario.id === id) || null;
            
        } catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            return null;
        }
    }
    
    /**
     * Gera um novo ID único
     * @returns {string} ID único gerado
     */
    gerarId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2);
        return `user_${timestamp}_${random}`;
    }
    
    /**
     * Remove um usuário do storage
     * @param {string} id - ID do usuário a ser removido
     * @returns {boolean} Sucesso da operação
     */
    removerUsuario(id) {
        try {
            const usuarios = this.listarUsuarios();
            const indiceUsuario = usuarios.findIndex(u => u.id === id);
            
            if (indiceUsuario === -1) {
                console.error('Usuário não encontrado para remoção:', id);
                return false;
            }
            
            usuarios.splice(indiceUsuario, 1);
            
            // Salvar no localStorage
            const dadosParaSalvar = usuarios.map(u => u.toJSON());
            localStorage.setItem(this.storageKey, JSON.stringify(dadosParaSalvar));
            
            // Atualizar cache
            this.atualizarCache(usuarios);
            
            console.log(`Usuário ${id} removido com sucesso`);
            return true;
            
        } catch (error) {
            console.error('Erro ao remover usuário:', error);
            return false;
        }
    }
    
    /**
     * Busca usuários por critérios específicos
     * @param {Object} criterios - Critérios de busca
     * @returns {Array<Usuario>} Usuários que atendem aos critérios
     */
    buscarUsuarios(criterios = {}) {
        try {
            let usuarios = this.listarUsuarios();
            
            // Filtrar por cidade
            if (criterios.cidade) {
                usuarios = usuarios.filter(u => 
                    u.endereco.cidade.toLowerCase().includes(criterios.cidade.toLowerCase())
                );
            }
            
            // Filtrar por estado
            if (criterios.estado) {
                usuarios = usuarios.filter(u => 
                    u.endereco.estado.toLowerCase() === criterios.estado.toLowerCase()
                );
            }
            
            // Filtrar por estilos
            if (criterios.estilos && criterios.estilos.length > 0) {
                usuarios = usuarios.filter(u => 
                    criterios.estilos.some(estilo => u.estilos.includes(estilo))
                );
            }
            
            // Filtrar por marcas
            if (criterios.marcas && criterios.marcas.length > 0) {
                usuarios = usuarios.filter(u => 
                    criterios.marcas.some(marca => u.marcas.includes(marca))
                );
            }
            
            // Filtrar por faixa etária
            if (criterios.idadeMin || criterios.idadeMax) {
                usuarios = usuarios.filter(u => {
                    const idade = u.calcularIdade();
                    let atendeCriterio = true;
                    
                    if (criterios.idadeMin && idade < criterios.idadeMin) {
                        atendeCriterio = false;
                    }
                    
                    if (criterios.idadeMax && idade > criterios.idadeMax) {
                        atendeCriterio = false;
                    }
                    
                    return atendeCriterio;
                });
            }
            
            // Filtrar apenas perfis públicos
            if (criterios.apenasPublicos) {
                usuarios = usuarios.filter(u => u.privacidade.perfilPublico);
            }
            
            return usuarios;
            
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            return [];
        }
    }
    
    /**
     * Obtém estatísticas gerais dos usuários
     * @returns {Object} Estatísticas dos usuários
     */
    obterEstatisticas() {
        try {
            const usuarios = this.listarUsuarios();
            
            const estatisticas = {
                totalUsuarios: usuarios.length,
                usuariosPublicos: usuarios.filter(u => u.privacidade.perfilPublico).length,
                usuariosPrivados: usuarios.filter(u => !u.privacidade.perfilPublico).length,
                mediaIdade: 0,
                estilosMaisPopulares: {},
                marcasMaisPopulares: {},
                estadosDistribuicao: {},
                usuariosPorMes: {}
            };
            
            if (usuarios.length > 0) {
                // Calcular média de idade
                const idades = usuarios.map(u => u.calcularIdade()).filter(idade => idade > 0);
                estatisticas.mediaIdade = idades.length > 0 ? 
                    Math.round(idades.reduce((sum, idade) => sum + idade, 0) / idades.length) : 0;
                
                // Estilos mais populares
                usuarios.forEach(u => {
                    u.estilos.forEach(estilo => {
                        estatisticas.estilosMaisPopulares[estilo] = (estatisticas.estilosMaisPopulares[estilo] || 0) + 1;
                    });
                });
                
                // Marcas mais populares
                usuarios.forEach(u => {
                    u.marcas.forEach(marca => {
                        estatisticas.marcasMaisPopulares[marca] = (estatisticas.marcasMaisPopulares[marca] || 0) + 1;
                    });
                });
                
                // Distribuição por estados
                usuarios.forEach(u => {
                    const estado = u.endereco.estado || 'Não informado';
                    estatisticas.estadosDistribuicao[estado] = (estatisticas.estadosDistribuicao[estado] || 0) + 1;
                });
                
                // Usuários cadastrados por mês
                usuarios.forEach(u => {
                    const data = new Date(u.dataCriacao);
                    const mesAno = `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, '0')}`;
                    estatisticas.usuariosPorMes[mesAno] = (estatisticas.usuariosPorMes[mesAno] || 0) + 1;
                });
            }
            
            return estatisticas;
            
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            return { totalUsuarios: 0 };
        }
    }
    
    /**
     * Exporta todos os dados dos usuários em formato JSON
     * @param {boolean} incluirPrivados - Se deve incluir dados privados
     * @returns {string} JSON com os dados
     */
    exportarDados(incluirPrivados = false) {
        try {
            const usuarios = this.listarUsuarios();
            
            const dadosExportacao = {
                timestamp: new Date().toISOString(),
                totalUsuarios: usuarios.length,
                usuarios: usuarios.map(usuario => 
                    incluirPrivados ? usuario.toJSON() : usuario.toPublicJSON()
                ),
                estatisticas: this.obterEstatisticas()
            };
            
            return JSON.stringify(dadosExportacao, null, 2);
            
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            return JSON.stringify({ erro: 'Falha na exportação' });
        }
    }
    
    /**
     * Importa dados de usuários de um JSON
     * @param {string} jsonDados - JSON com os dados para importar
     * @param {boolean} substituir - Se deve substituir dados existentes
     * @returns {Object} Resultado da importação
     */
    importarDados(jsonDados, substituir = false) {
        try {
            const dados = JSON.parse(jsonDados);
            
            if (!dados.usuarios || !Array.isArray(dados.usuarios)) {
                return { sucesso: false, erro: 'Formato de dados inválido' };
            }
            
            let usuariosImportados = 0;
            let erros = [];
            
            if (substituir) {
                // Limpar dados existentes
                localStorage.removeItem(this.storageKey);
                this.limparCache();
            }
            
            dados.usuarios.forEach((dadosUsuario, index) => {
                try {
                    const usuario = new Usuario(dadosUsuario);
                    if (this.salvarUsuario(usuario)) {
                        usuariosImportados++;
                    } else {
                        erros.push(`Usuário ${index + 1}: Falha ao salvar`);
                    }
                } catch (error) {
                    erros.push(`Usuário ${index + 1}: ${error.message}`);
                }
            });
            
            return {
                sucesso: true,
                usuariosImportados,
                totalUsuarios: dados.usuarios.length,
                erros
            };
            
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            return { sucesso: false, erro: error.message };
        }
    }
    
    /**
     * Limpa todos os dados de usuários
     * @returns {boolean} Sucesso da operação
     */
    limparTodosDados() {
        try {
            localStorage.removeItem(this.storageKey);
            this.limparCache();
            console.log('Todos os dados de usuários foram removidos');
            return true;
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            return false;
        }
    }
    
    /**
     * Verifica se o cache em memória é válido
     * @returns {boolean} Validade do cache
     */
    isCacheValido() {
        return this.cache !== null && 
               this.cacheTimestamp !== null && 
               (Date.now() - this.cacheTimestamp) < this.cacheTTL;
    }
    
    /**
     * Atualiza o cache em memória
     * @param {Array<Usuario>} usuarios - Usuários para cachear
     */
    atualizarCache(usuarios) {
        this.cache = usuarios;
        this.cacheTimestamp = Date.now();
    }
    
    /**
     * Limpa o cache em memória
     */
    limparCache() {
        this.cache = null;
        this.cacheTimestamp = null;
    }
    
    /**
     * Obtém informações sobre o armazenamento
     * @returns {Object} Informações do storage
     */
    obterInfoStorage() {
        try {
            const dados = localStorage.getItem(this.storageKey);
            const tamanhoKB = dados ? Math.round(dados.length / 1024) : 0;
            
            return {
                chavesStorage: this.storageKey,
                tamanhoKB: tamanhoKB,
                totalUsuarios: this.listarUsuarios().length,
                cacheAtivo: this.isCacheValido(),
                ultimaAtualizacaoCache: this.cacheTimestamp ? new Date(this.cacheTimestamp).toLocaleString() : 'Nunca'
            };
            
        } catch (error) {
            console.error('Erro ao obter info do storage:', error);
            return { erro: error.message };
        }
    }
}