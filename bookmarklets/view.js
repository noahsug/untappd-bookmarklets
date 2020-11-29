javascript: (() => {
  const beers = JSON.parse('$JSON_DATA$');
  /*const beers = JSON.parse(
    '[{"link":"https://untappd.com/b/tree-house-brewing-company-king-jjjuliusss/1616182","name":"king jjjuliusss","rating":"4.76"},{"link":"https://untappd.com/b/tree-house-brewing-company-very-gggreennn/3268966","name":"very gggreennn","rating":"4.7"},{"link":"https://untappd.com/b/tree-house-brewing-company-very-hazy/885563","name":"very hazy","rating":"4.69"},{"link":"https://untappd.com/b/tree-house-brewing-company-king-julius/273734","name":"king julius","rating":"4.68"},{"link":"https://untappd.com/b/tree-house-brewing-company-juice-machine/616287","name":"juice machine","rating":"4.62"},{"link":"https://untappd.com/b/tree-house-brewing-company-very-green/689944","name":"very green","rating":"4.62"},{"link":"https://untappd.com/b/tree-house-brewing-company-jjjuliusss/1122985","name":"jjjuliusss!","rating":"4.6"},{"link":"https://untappd.com/b/tree-house-brewing-company-vanilla-bean-truth/3965172","name":"vanilla bean truth","rating":"4.6"},{"link":"https://untappd.com/b/tree-house-brewing-company-triple-shot-batch-1000/2987667","name":"triple shot (batch 1000)","rating":"4.59"},{"link":"https://untappd.com/b/tree-house-brewing-company-absurdism/2800606","name":"absurdism","rating":"4.58"},{"link":"https://untappd.com/b/tree-house-brewing-company-indulgence/3157016","name":"indulgence","rating":"4.58"},{"link":"https://untappd.com/b/tree-house-brewing-company-doubleganger/1856235","name":"doubleganger","rating":"4.57"},{"link":"https://untappd.com/b/tree-house-brewing-company-le-peloton/1347322","name":"le peloton","rating":"4.53"},{"link":"https://untappd.com/b/tree-house-brewing-company-gggreennn/2690117","name":"gggreennn!","rating":"4.52"},{"link":"https://untappd.com/b/tree-house-brewing-company-curiosity-forty-eight/2647666","name":"curiosity forty eight","rating":"4.52"},{"link":"https://untappd.com/b/tree-house-brewing-company-and-so-it-goes/3695725","name":"and so it goes","rating":"4.52"},{"link":"https://untappd.com/b/tree-house-brewing-company-triple-shot/992218","name":"triple shot","rating":"4.52"},{"link":"https://untappd.com/b/tree-house-brewing-company-eternity/3994972","name":"eternity","rating":"4.51"},{"link":"https://untappd.com/b/tree-house-brewing-company-juice-project/3998079","name":"juice project","rating":"4.51"},{"link":"https://untappd.com/b/tree-house-brewing-company-impermanence/2578605","name":"impermanence","rating":"4.51"},{"link":"https://untappd.com/b/tree-house-brewing-company-julius/237985","name":"julius","rating":"4.5"},{"link":"https://untappd.com/b/tree-house-brewing-company-moment-of-clarity/2478938","name":"moment of clarity","rating":"4.48"},{"link":"https://untappd.com/b/tree-house-brewing-company-haze/718853","name":"haze","rating":"4.48"},{"link":"https://untappd.com/b/tree-house-brewing-company-curiosity-seventeen/1138884","name":"curiosity seventeen","rating":"4.48"},{"link":"https://untappd.com/b/tree-house-brewing-company-mega-treat/4018649","name":"mega treat","rating":"4.48"}]'
  );*/

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

  function removeSpecialCharacters(text) {
    return text.replace(/[^a-z0-9 ]/g, '');
  }

  function matchesBeer(text, beer) {
    return removeSpecialCharacters(text.toLowerCase()).includes(beer.name);
  }

  beers.forEach((beer) => {
    // "triple shot (batch 1000)" -> "triple shot"
    const paren = beer.name.indexOf('(');
    if (paren !== -1) {
      beer.name = beer.name.slice(0, paren).trim();
    }

    // "gggreennn!" -> gggreennn"
    beer.name = removeSpecialCharacters(beer.name);
  });

  const textNodes = getTextNodes(document.body);
  textNodes.forEach((node) => {
    const beer = beers.find((beer) => matchesBeer(node.data, beer));
    if (beer) {
      node.data += ` (${beer.rating})`;
    }
  });
})();
