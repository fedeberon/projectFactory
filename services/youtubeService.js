export const isValidVideo = (url) => {
    try {
      url.split("?v=")[1].split("&")[0];
      return true;
    } catch (err) {
      return false;
    }
};

export const getIdVideo = (videoPath) => {
    return videoPath.split("?v=")[1].split("&")[0];
};

export const getLinkToId = (id) => {
  return `https://www.youtube.com/watch?v=${id}`;
};