const generateId = () => {
    const CHARACTERS = '0123456789ABCDEF';
    const ID_LENGTH = 8;

    let id = '';
    for (let i = 0; i < ID_LENGTH; i++) {
        id += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
    }
    return id;
};

export default generateId;
