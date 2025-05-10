// export const Services = localStorage.getItem("data");
export const storeData = (dataName, data) => {
  localStorage.setItem(dataName, JSON.stringify(data));
  console.log("Data stored in localStorage:", data);
};

export const getData = (dataName) => {
  const data = localStorage.getItem(dataName);
  return data ? JSON.parse(data) : null;
};
