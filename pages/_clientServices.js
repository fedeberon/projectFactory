export const getProjects = async () => {
  try {
    const response = await fetch("/api/projects");
    if (!response.ok) {
      throw new Error(`An error: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const addProject = async (data, session) => {
  try {
    const response = await fetch("/api/projects", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`An error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const getProfessionals = async () => {
  try {
    const response = await fetch("/api/professionals");
    if (!response.ok) {
      throw new Error(`An error: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const addProfessional = async (data, session) => {
  try {
    const response = await fetch("/api/professionals", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`An error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const getProfessionalById = async (id) => {
  try {
    const response = await fetch(`/api/prefessionals/${id}`);
    if (!response.ok) {
      throw new Error(`An error: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}
