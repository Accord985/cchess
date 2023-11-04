// TODO: add id to the blocks; move the pieces into the block

'use strict';

(function() {
  window.addEventListener('load', init);
  let team = 1;
  const verified = true; // for now all moves are allowed as no rules are considered

  function init() {
    populateBoard();
    let rivalSelector = '.team-' + ((team === 1) ? 2 : 1);
    let rivalPieces = qsa(rivalSelector);
    for (let i = 0; i < rivalPieces.length; i++) {
      rivalPieces[i].classList.add('rival');
    }

    let pieces = qsa('#pieces div');
    for (let i = 0; i < pieces.length; i++) {
      pieces[i].addEventListener('click', selectPiece);
    }
    let positions = qsa("#squares > div")
    for (let i = 0; i < positions.length; i++) {
      positions[i].addEventListener('click', selectSquare);
    }
  }

  // rank: 10th=0-8; 9th=9-17
  // file: 1=8,17,...; 2=7,16,...
  function populateBoard() {
    let board = id('squares');
    for (let i = 0; i < 90; i++) {
      let newItem = gen('div');
      let rank = 10 - Math.floor(i / 9);
      let file = 9 - i % 9;
      newItem.id = 'square' + rank + '-' + file;
      board.append(newItem);
    }
  }

  function selectPiece(evt) {
    let selected = evt.target;
    if (!selected.classList.contains('rival')) {
      if (selected.classList.contains('selected')) {
        selected.classList.remove('selected');
      } else {
        if (qs('.selected')) {
          qs('.selected').classList.remove('selected');
        }
        selected.classList.add('selected');
      }
    } else {
      let coordinate = getCoordinates(evt.target);
      let rank = Math.floor(coordinate / 10);
      let file = coordinate % 10;
      if (qs('.selected') && verified) {
        evt.target.classList.add('captured');
        moveSelected(rank, file);
      }
    }
  }

  function selectSquare(evt) {
    let squareCoord = evt.target.id.substring(6).split('-');
    let squareRank = parseInt(squareCoord[0]);
    let squareFile = parseInt(squareCoord[1]);
    let pieceInPos = qs(".rank-"+squareRank+".file-"+squareFile);
    if (qs('.selected')) {
      if (pieceInPos) {
        if (pieceInPos.classList.contains('rival')) {
          pieceInPos.classList.add('captured');
          moveSelected(squareRank, squareFile);
        } else if (!pieceInPos.classList.contains('selected')) {
          qs('.selected').classList.remove('selected');
          pieceInPos.classList.add('selected');
        } else {
          pieceInPos.classList.remove("selected");
        }
      } else {
        moveSelected(squareRank, squareFile);
      }
    } else {
      if (pieceInPos && !pieceInPos.classList.contains('rival')) {
        pieceInPos.classList.add('selected');
      }
    }
  }

  function getCoordinates(piece) {
    let file = 0;
    let rank = 0;
    for (let i = 0; i < piece.classList.length; i++) {
      if (piece.classList[i].startsWith('file-')) {
        file = parseInt(piece.classList[i].substring(5));
      } else if (piece.classList[i].startsWith('rank-')) {
        rank = parseInt(piece.classList[i].substring(5));
      }
    }
    if (file <= 0 || rank <= 0 || file > 9 || rank > 10) {
      throw new Error('Illegal piece position');
    }
    return rank * 10 + file;
  }

  function moveSelected(rank, file) {
    let previous = qs('.selected');
    for (let i = 1; i <= 10; i++) {
      previous.classList.remove('file-'+i); // no file-10 but it's fine
      previous.classList.remove('rank-'+i);
    }
    previous.classList.add('file-'+file);
    previous.classList.add('rank-'+rank);
    previous.classList.remove('selected');
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();