$(document).ready(function () {
  let searchInput = $('#reimu-search-input');
  let searchResult = $('#reimu-hits');
  let pagination = $('#pagination');
  let itemsPerPage = 10;
  let currentPage = 1;

  searchInput.append('<form id="search-form"><input type="text" id="search-text"></form>');

  $.getJSON('/search.json', function (data) {
    $('#search-form').on('submit', function (event) {
      event.preventDefault();
      let inputText = $('#search-text').val();
      searchResult.empty();
      pagination.empty();
      if (inputText) {
        let hits = data.filter(function (post) {
          return post.title && post.title.toLowerCase().includes(inputText.toLowerCase()) ||
                 post.content && post.content.toLowerCase().includes(inputText.toLowerCase());
        });

        let totalPages = Math.ceil(hits.length / itemsPerPage);
        for (let i = 1; i <= totalPages; i++) {
          pagination.append('<span class="page-number">' + i + '</span>');
        }

        $('.page-number').click(function () {
          currentPage = $(this).text();
          displayHits(hits, currentPage, itemsPerPage);
        });

        displayHits(hits, currentPage, itemsPerPage);
      }
    });
  });

  function displayHits(hits, page, itemsPerPage) {
    searchResult.empty();
    let start = (page - 1) * itemsPerPage;
    let end = start + itemsPerPage;
    let hitsToDisplay = hits.slice(start, end);
    hitsToDisplay.forEach(function (hit) {
      searchResult.append('<a href="' + hit.url + '" class="reimu-hit-item-link">' + hit.title + '</a>');
    });
  }

  $('.popup-trigger').on('click', function (e) {
    e.stopPropagation();
    $('body').append('<div class="popoverlay">').css('overflow', 'hidden');
    $('.popup').toggle();
    $('#search-text').focus();
  });

  $('.popup-btn-close').click(function () {
    $('.popup').hide();
    $('.popoverlay').remove();
    $('body').css('overflow', '');
  });
});
