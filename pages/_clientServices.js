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
