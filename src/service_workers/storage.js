export const saveAlias = async (id, keyword, url) => {
    try {
        const result = await chrome.storage.sync.get('aliases');
        const aliases = result.aliases || {};

        aliases[id] = { keyword, url };

        await chrome.storage.sync.set({ aliases: aliases });

        return { status: 'success' };
    } catch (error) {
        return { status: 'error', error: error };
    }
};

export const removeAlias = async (id) => {
    try {
        const result = await chrome.storage.sync.get('aliases');
        const aliases = result.aliases || {};

        delete aliases[id];

        await chrome.storage.sync.set({ aliases: aliases });
        return { status: 'success' };
    } catch (error) {
        return { status: 'error', error: error };
    }
};
