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
  function processBeerName(nameAndHints) {
    const paren = nameAndHints.indexOf('(');
    if (paren === -1) {
      return { hints: [], name: processText(nameAndHints) };
    }

    const nameText = nameAndHints.slice(0, paren - 1);
    const hintText = nameAndHints.slice(paren + 1, -1);

    const name = processText(nameText);
    const hints = processText(hintText).split(' ');
    return { name, hints };
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
      const { name, hints } = processBeerName(beer.name);
      const words = name.split(' ');

      addToTrie(trie, words, { name, rating: beer.rating, hints });
    });

    return trie;
  }

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

    const bestMatch = {
      hintsMatching: -1,
      rating: 0,
    };

    for (let i = 0; i < words.length; i++) {
      const beers = getMatchingBeersFromWord(trie, words, i);

      for (let beerIndex = 0; beerIndex < beers.length; beerIndex++) {
        const { rating, hints } = beers[beerIndex];

        if (hints.length === 0) return { rating };

        const matchingHints = hints.filter((hint) => words.includes(hint));
        if (matchingHints.length === hints.length) return { rating };

        if (matchingHints.length > bestMatch.hintsMatching) {
          bestMatch.hintsMatching = matchingHints.length;
          bestMatch.rating = rating;
        }
      }
    }

    return bestMatch.rating === 0 ? null : bestMatch;
  }

  function run(beers) {
    const trie = buildTrie(beers);

    // console.log(JSON.stringify(trie, null, 2));

    const textNodes = getTextNodes(document.body);
    // const textNodes = [{ data: 'joe nope' }];

    textNodes.forEach((node) => {
      const text = node.data.trim();
      if (!text) return;

      const match = getMatchingBeer(trie, text);

      if (match) {
        // trim trailing whitespace
        node.data = node.data.replace(/\s+$/, '');

        node.data += ` (${match.rating}${match.hintsMatching != null ? '?' : ''})`;
      }
    });
  }

  run(JSON.parse(`$JSON_DATA$`));
  // run([
  //   { name: 'joe ', rating: 4.3 },
  //   { name: 'j', rating: 4.6 },
  // ]);
})();
