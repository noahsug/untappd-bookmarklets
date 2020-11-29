javascript: (() => {
  function copy(str) {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.value = str;
    input.select();
    document.execCommand('copy') || console.error('copy failed');
  }

  const selectors = {
    item: '.beer-item',
    name: '.beer-details .name a',
    rating: '.rating-container .num',
  };

  const items = document.querySelectorAll(selectors.item);
  const data = [...items].map((item) => {
    const nameNode = item.querySelector(selectors.name);
    const ratingNode = item.querySelector(selectors.rating);
    return {
      link: nameNode.href,
      name: nameNode.textContent.toLowerCase(),
      // "(4.37)" -> "4.37"
      rating: ratingNode.textContent.match(/\d.\d+/)[0],
    };
  });

  const json = JSON.stringify(data);
  copy(json);
})();
