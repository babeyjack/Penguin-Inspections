const getDomain = () => {
  const href = /:\/\/([^/]+)/.exec(window.location.href);
  if(href) {
      const splitHref = href[1].split(".");
      if(splitHref[0] != "localhost:3000"){
        return splitHref[0];
      }
    } 
    return "";
  }

export default getDomain;