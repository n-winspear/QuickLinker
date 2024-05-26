export const sortQuickLinks = (quickLinks) => {
  return new Promise((resolve, reject) => {
    try {
      const keys = Object.keys(quickLinks);
      keys.sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' })
      );
      const sortedObj = {};
      keys.forEach((key) => {
        sortedObj[key] = quickLinks[key];
      });
      resolve(sortedObj);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
