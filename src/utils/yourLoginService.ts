export const yourLoginService = (userID: string): Promise<string> => {
  return new Promise<string>(resolve => {
    setTimeout(() => {
      resolve(`${userID}:${Date.now()}`);
    }, 1000);
  });
};
