const baseUrl = "/api/notes"; //http://localhost:3001/api/notes

export const getAll = () => {
  return fetch(`${baseUrl}`);
};

export const create = (body) => {
  return fetch(`${baseUrl}`,{
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(body)
  });
};

export const update = (updatedNota) => {
  return fetch(`${baseUrl}/${updatedNota.id}`,{
    method: "PUT",
    headers: new Headers({ "Content-Type" : "application/json"}),
    body: JSON.stringify(updatedNota)
  });
};