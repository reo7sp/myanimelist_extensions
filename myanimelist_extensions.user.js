// ==UserScript==
// @name MyAnimeList extensions
// @description Adds useful data to lists on myanimelist.net
// @author Oleg Morozenkov
// @version 0.1
// @license MIT
// @encoding utf-8
// @homepage https://github.com/reo7sp/myanimelist_extensions
// @updateURL https://raw.githubusercontent.com/reo7sp/myanimelist_extensions/master/myanimelist_extensions.user.js
// @downloadURL https://raw.githubusercontent.com/reo7sp/myanimelist_extensions/master/myanimelist_extensions.user.js
// @include http*://myanimelist.net/animelist/*
// ==/UserScript==

var avgScoreRegex = /<div class="fl-l score".+?>\s+(.+?)\s+<\/div>/;
var avgScoreVotesRegex = /<div class="fl-l score".+?data-user="(.+?) /;
var genresRegex = /<span class="dark_text">Genres:<\/span>\s+(.+?)<\/div>/;

// list header
$listHeader = $('.list-table-header');
$listHeader.append('<th class="header-title avgScore">Genres</th>');
$listHeader.append('<th class="header-title avgScore">MAL score</th>');
$listHeader.append('<th class="header-title avgScoreVotes">Votes</th>');

// list entries
$('.list-item .list-table-data').each(function () {
  var $listEntry = $(this);

  $listEntry.append('<td class="data genres">-</td>');
  $listEntry.append('<td class="data avgScore">-</td>');
  $listEntry.append('<td class="data avgScoreVotes">-</td>');

  var href = $listEntry.find('.title .link').attr('href');
  var localStorageGenresKey = 'mal-reo-ext-genres-' + href;
  var localStorageAvgScoreKey = 'mal-reo-ext-avgScore-' + href;
  var localStorageAvgScoreVotesKey = 'mal-reo-ext-avgScoreVotes-' + href;

  if (localStorageGenresKey in localStorage && localStorageAvgScoreKey in localStorage && localStorageAvgScoreVotesKey in localStorage) {
    $listEntry.find('.data.genres').html(localStorage[localStorageGenresKey]);
    $listEntry.find('.data.avgScore').html(localStorage[localStorageAvgScoreKey]);
    $listEntry.find('.data.avgScoreVotes').html(localStorage[localStorageAvgScoreVotesKey]);
  } else {
    $.ajax(href).done(function (html) {
      var genres = html.match(genresRegex)[1];
      var avgScore = html.match(avgScoreRegex)[1];
      var avgScoreVotes = html.match(avgScoreVotesRegex)[1];
      localStorage[localStorageGenresKey] = genres;
      localStorage[localStorageAvgScoreKey] = avgScore;
      localStorage[localStorageAvgScoreVotesKey] = avgScoreVotes;
      $listEntry.find('.data.genres').html(genres);
      $listEntry.find('.data.avgScore').html(avgScore);
      $listEntry.find('.data.avgScoreVotes').html(avgScoreVotes);
    });
  }
});
