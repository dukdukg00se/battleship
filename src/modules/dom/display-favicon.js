function setFavicon(imgSrc) {
  const icon = document.querySelector('link[rel="shortcut icon"]');
  icon.href = imgSrc;
}

export default setFavicon;
