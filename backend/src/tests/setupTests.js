const { _resetMockFirestore } = require('../__mocks__/firebase/firestore');

beforeEach(() => {
    _resetMockFirestore(); 
    jest.clearAllMocks(); 
});