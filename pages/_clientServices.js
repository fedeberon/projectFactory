export const getProjects = async () => {
  try {
    const res = await fetch("/api/projects");
    if (!res.ok) {
      throw new Error(`An error: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(error);
  }
};

export const addProject = async (data, session) => {
  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`An error: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(error);
  }
};