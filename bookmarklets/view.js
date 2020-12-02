javascript: (() => {
  const beers = JSON.parse(`$JSON_DATA$`);

  function getTextNodes(root, result = []) {
    if (root.nodeType === Node.TEXT_NODE) {
      result.push(root);
    } else {
      root.childNodes.forEach((node) => {
        getTextNodes(node, result);
      });
    }
    return result;
  }

  function processText(text) {
    text = text.toLowerCase();

    text = text
      .replace('double dry hopped', 'ddh')
      .replace('triple dry hopped', 'tdh')
      .replace('barrel-aged', 'ba')
      .replace('barrel aged', 'ba')
      .replace('w/', 'with')
      .replace(' & ', ' and ')
      .replace(' + ', ' and ');

    // "gggreennn!" -> gggreennn"
    text = text.replace(/[^a-z0-9 ]/g, '');

    text = text.replace(/[ ]+/g, ' ');

    return text;
  }

  function matchesBeer(text, beer) {
    return processText(text).includes(beer.name);
  }

  beers.forEach((beer) => {
    // "triple shot (batch 1000)" -> "triple shot"
    const paren = beer.name.indexOf('(');
    if (paren !== -1) {
      beer.name = beer.name.slice(0, paren).trim();
    }

    beer.name = processText(beer.name);
  });

  const textNodes = getTextNodes(document.body);
  textNodes.forEach((node) => {
    const beer = beers.find((beer) => matchesBeer(node.data, beer));
    if (beer) {
      node.data += ` (${beer.rating})`;
    }
  });
})();
