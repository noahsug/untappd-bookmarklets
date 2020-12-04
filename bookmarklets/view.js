javascript: (() => {
  function processText(text) {
    text = text.toLowerCase();

    text = text
      .replace('double dry hopped', 'ddh')
      .replace('triple dry hopped', 'tdh')
      .replace('barrel-aged', 'ba')
      .replace('barrel aged', 'ba')
      .replace('w/ ', 'with ')
      .replace(' & ', ' ')
      .replace(' + ', ' ')
      .replace(' plus ', ' ');

    // replace tabs and new lines with spaces
    text = text.replace(/\s/g, ' ');

    // "gggreennn!" -> gggreennn"
    text = text.replace(/[^a-z0-9 ]/g, '');

    // remove extra white space
    text = text.replace(/[ ]+/g, ' ');

    // Batch 1000 or B1000 -> 1000
    text = text.replace(/\b(batch|b) ?([0-9]+)/, '$2');

    return text;
  }

  // "Triple Shot (Batch 1000)" -> { name: "triple shot", hints: ['batch', '1000'] }
  function processBeerName(fullName) {
    const paren = fullName.indexOf('(');
    if (paren === -1) {
      return { hints: [], name: processText(fullName), fullName };
    }

    const nameText = fullName.slice(0, paren - 1);
    const hintText = fullName.slice(paren + 1, -1);

    const name = processText(nameText);
    const hints = processText(hintText).split(' ');
    return { name, hints, fullName };
  }

  function addToTrie(trie, words, value, i = 0) {
    const word = words[i];
    trie[word] = trie[word] || {};

    if (i === words.length - 1) {
      trie[word].values = trie[word].values || [];
      trie[word].values.push(value);
    } else {
      trie[word].trie = trie[word].trie || {};
      addToTrie(trie[word].trie, words, value, i + 1);
    }
  }

  function buildTrie(beers) {
    const trie = {};
    beers.forEach((beer) => {
      const { name, fullName, hints } = processBeerName(beer.name);
      const words = name.split(' ');

      addToTrie(trie, words, Object.assign(beer, { fullName, name, hints }));
    });

    return trie;
  }

  function getTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, (node) => !!node.data);

    const results = [];
    while (walker.nextNode()) {
      results.push(walker.currentNode);
    }

    return results;
  }

  function getMatchingBeersFromWord(trie, words, i) {
    const match = trie[words[i]];
    if (!match) return [];

    if (!match.trie) {
      return match.values || [];
    }

    const longerMatches = getMatchingBeersFromWord(match.trie, words, i + 1);
    if (longerMatches.length > 0) {
      return longerMatches;
    }

    return match.values || [];
  }

  function getMatchingBeer(trie, rawText) {
    const text = processText(rawText);
    const words = text.split(' ');

    let bestMatch = {
      hintsMatching: -1,
    };

    for (let i = 0; i < words.length; i++) {
      const beers = getMatchingBeersFromWord(trie, words, i);

      for (let beerIndex = 0; beerIndex < beers.length; beerIndex++) {
        const beer = beers[beerIndex];

        if (beer.hints.length === 0) return beer;

        const matchingHints = beer.hints.filter((hint) => words.includes(hint));
        if (matchingHints.length === beer.hints.length) return beer;

        if (matchingHints.length > bestMatch.hintsMatching) {
          bestMatch = Object.assign(beer, { hintsMatching: matchingHints.length });
        }
      }
    }

    return bestMatch.hintsMatching === -1 ? null : bestMatch;
  }

  function run(beers) {
    const trie = buildTrie(beers);

    const textNodes = getTextNodes(document.body);

    console.log('Beers found:');
    textNodes.forEach((node) => {
      const text = node.data.trim();
      if (!text) return;

      const beer = getMatchingBeer(trie, text);

      if (beer) {
        // trim trailing whitespace
        node.data = node.data.replace(/\s+$/, '');

        console.log(beer.fullName, `(${beer.rating})`);

        node.data += ` (${beer.rating}${beer.hintsMatching != null ? '?' : ''})`;
      }
    });
  }

  run(JSON.parse(`$JSON_DATA$`));
})();
