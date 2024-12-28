export const saveToken = (token: string) => {
  return localStorage.setItem("token", token);
};

export const retrieveToken = () => {
  return localStorage.getItem("token");
};
