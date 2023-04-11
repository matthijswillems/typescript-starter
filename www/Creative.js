var content = {};
var Creative = {};

window.Creative = {
  get width() {
    return document.documentElement.clientWidth;
  },
  get height() {
    return document.documentElement.clientHeight;
  },
  click: function (url, query) {
    // Manual override in creative's code
    if (typeof this.onclick === 'function') return this.onclick(url, query);

    if (!query) var query = {};
    if (Array.isArray(url) || (content && content[url])) {
      window.dispatchEvent(
        new CustomEvent('lemonpi.interaction/click', {
          detail: {
            placeholder: url,
            query,
          },
        }),
      );
    } else {
      content.tempClick = {
        type: 'click',
        value: url,
      };
      window.dispatchEvent(
        new CustomEvent('lemonpi.interaction/click', {
          detail: {
            placeholder: 'tempClick',
            query,
          },
        }),
      );

      delete content.tempClick;
    }
  },
};

window.addEventListener('error', function (e) {
  document.getElementById('fallback').style.display = 'block';
  document.getElementById('fallback').style.opacity = '1';
  if (
    Creative &&
    Creative.fallback &&
    typeof Creative.fallback === 'function'
  ) {
    Creative.fallback(e);
  }
  return false;
});
