const mockFirestoreData = {};

// Função para resetar o estado do banco de dados mockado antes de cada teste.
const resetMockFirestore = () => {
    // Itera sobre as chaves (nomes das coleções) e limpa os dados
    for (const key in mockFirestoreData) {
        if (Object.prototype.hasOwnProperty.call(mockFirestoreData, key)) {
            delete mockFirestoreData[key];
        }
    }
};

// Mock para a função addDoc
const addDoc = jest.fn((collectionRef, data) => {
    const collectionName = collectionRef._query.collectionId; // Obtém o nome da coleção do objeto de referência
    const newId = `mockId_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`; // Gera um ID único simulado
    if (!mockFirestoreData[collectionName]) {
        mockFirestoreData[collectionName] = {};
    }
    mockFirestoreData[collectionName][newId] = data; // Armazena os dados no mock
    return Promise.resolve({ id: newId }); // Retorna uma Promise resolvida com o ID
});

// Mock para a função setDoc
const setDoc = jest.fn((docRef, data, options) => {
    const collectionName = docRef._key.path.segments[0];
    const id = docRef._key.path.segments[1];
    if (!mockFirestoreData[collectionName]) {
        mockFirestoreData[collectionName] = {};
    }
    if (options && options.merge) {
        mockFirestoreData[collectionName][id] = { ...mockFirestoreData[collectionName][id], ...data };
    } else {
        mockFirestoreData[collectionName][id] = data;
    }
    return Promise.resolve();
});

// Mock para a função getDoc
const getDoc = jest.fn((docRef) => {
    const collectionName = docRef._key.path.segments[0];
    const id = docRef._key.path.segments[1];
    const data = mockFirestoreData[collectionName] ? mockFirestoreData[collectionName][id] : undefined;
    return Promise.resolve({
        exists: () => !!data, // Simula o método exists()
        data: () => ({ id, ...data }), // Retorna o ID junto com os dados para consistência com o Firestore real
        id: id,
    });
});

// Mock para a função getDocs
const getDocs = jest.fn((collectionRefOrQuery) => {
    let items = [];
    let collectionName;
    let dataToFilter;

    if (collectionRefOrQuery._query && collectionRefOrQuery._query.collectionId) {
        // É um objeto de query (resultado de collection().where())
        collectionName = collectionRefOrQuery._query.collectionId;
        dataToFilter = mockFirestoreData[collectionName] || {};

        if (collectionRefOrQuery._query.constraints && collectionRefOrQuery._query.constraints.length > 0) {
            // Simula o filtro 'where'
            const constraint = collectionRefOrQuery._query.constraints[0]; // Simplificado para uma única condição 'where'
            const [field, operator, value] = constraint._args;

            dataToFilter = Object.fromEntries(
                Object.entries(dataToFilter).filter(([, item]) => {
                    // Implementação básica de operadores. Expanda conforme necessário.
                    if (operator === '==') {
                        return item[field] === value;
                    }
                    return true;
                })
            );
        }
    } else {
        // É apenas uma referência de coleção
        collectionName = collectionRefOrQuery._query.collectionId;
        dataToFilter = mockFirestoreData[collectionName] || {};
    }

    items = Object.entries(dataToFilter);

    return Promise.resolve({
        docs: items.map(([id, data]) => ({
            id,
            data: () => data,
            exists: () => true,
        })),
    });
});

// Mock para a função updateDoc
const updateDoc = jest.fn((docRef, data) => {
    const collectionName = docRef._key.path.segments[0];
    const id = docRef._key.path.segments[1];
    if (mockFirestoreData[collectionName] && mockFirestoreData[collectionName][id]) {
        mockFirestoreData[collectionName][id] = { ...mockFirestoreData[collectionName][id], ...data };
        return Promise.resolve();
    }
    return Promise.reject(new Error(`Documento com ID ${id} não encontrado na coleção ${collectionName} para atualização`));
});

// Mock para a função deleteDoc
const deleteDoc = jest.fn((docRef) => {
    const collectionName = docRef._key.path.segments[0];
    const id = docRef._key.path.segments[1];
    if (mockFirestoreData[collectionName] && mockFirestoreData[collectionName][id]) {
        delete mockFirestoreData[collectionName][id];
        return Promise.resolve();
    }
    return Promise.reject(new Error(`Documento com ID ${id} não encontrado na coleção ${collectionName} para exclusão`));
});

// Mocks para as funções que criam referências (collection, doc, query, where)
const collection = jest.fn((dbInstance, collectionName) => ({
    // Propriedade interna para que as funções mockadas de addDoc, getDoc, etc., saibam qual coleção usar
    _query: { collectionId: collectionName },
    // Adicione outras propriedades ou métodos que seus serviços podem chamar diretamente na referência de coleção, se houver
}));

const doc = jest.fn((dbInstance, collectionName, id) => ({
    // Propriedade interna para que as funções mockadas de getDoc, updateDoc, deleteDoc saibam qual documento usar
    _key: { path: { segments: [collectionName, id] } },
    // Adicione outras propriedades ou métodos que seus serviços podem chamar diretamente na referência de documento, se houver
}));

const query = jest.fn((collectionRef, ...constraints) => ({
    _query: {
        collectionId: collectionRef._query.collectionId,
        constraints: constraints, // Armazena as constraints para serem usadas por getDocs
    },
}));

const where = jest.fn((field, operator, value) => ({ _methodName: 'where', _args: [field, operator, value] }));


// Mock para initializeApp e getFirestore (retornam objetos vazios, pois a interação é mockada)
const initializeApp = jest.fn(() => ({}));
const getFirestore = jest.fn(() => ({}));

// Exporta as funções mockadas e os dados internos para serem acessados e manipulados nos testes
module.exports = {
    initializeApp,
    getFirestore,
    collection,
    addDoc,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    _mockFirestoreData: mockFirestoreData, 
    _resetMockFirestore: resetMockFirestore, 
};