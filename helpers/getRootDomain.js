export const getRootDomain = (link) => {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(link);
      const hostname = parsedUrl.hostname;
      const parts = hostname.split('.');

      let rootDomain;
      if (parts.length > 2) {
        rootDomain = parts[parts.length - 2];
      } else if (parts.length === 2) {
        rootDomain = parts[0];
      } else {
        // Handle edge cases, return empty string
        rootDomain = 'Could not identify.';
      }

      if (rootDomain) {
        rootDomain = rootDomain.charAt(0).toUpperCase() + rootDomain.slice(1);
      }

      resolve(rootDomain);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
