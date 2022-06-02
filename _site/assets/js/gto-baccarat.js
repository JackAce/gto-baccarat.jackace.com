
$(document).ready(function() {
    updateUi();
  
      // Use the keys to decrement cards
    $(document).keypress(function(e) {
      if (document.activeElement.id === "") {
          // No element has focus
        if (e.which >= 48 && e.which <= 57) {
            decrement(e.which - 48);
        }
      }
    });
  
  });
  
  function performCalculation() {
    var result = getStatistics();
  
    $("#totalBankerWinsDiv").text(formatLong(result.totalBankerWins));
    $("#totalPlayerWinsDiv").text(formatLong(result.totalPlayerWins));
    $("#totalTiesDiv").text(formatLong(result.totalTies));
  
    $("#bankerWinPercentageDiv").text(formatPercent(result.bankerWinPercentage));
    $("#playerWinPercentageDiv").text(formatPercent(result.playerWinPercentage));
    $("#tiePercentageDiv").text(formatPercent(result.tiePercentage));
  
    $("#bankerWinEvDiv").text(formatPercent(result.bankerWinEv));
    $("#playerWinEvDiv").text(formatPercent(result.playerWinEv));
    $("#tieEvDiv").text(formatPercent(result.tieEv));
    
    setEvClass("#bankerWinEvDiv");
    setEvClass("#playerWinEvDiv");
    setEvClass("#tieEvDiv");
  }
  
  function setEvClass(elementId) {
    var value = parseFloat($(elementId).text());
    if (value > 0) {
      $(elementId).attr("class", "amt-pos");
    }
    else {
      $(elementId).attr("class", "amt-neg");
    }
  }
  
  function formatPercent(value, decimalPlaces = 4) {
    return (value * 100).toFixed(decimalPlaces) + '%';
  }
  
  function formatLong(number) {
    number = number + '';
    x = number.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }
  
  function updateUi() {
    for (var i = 0; i < 10; i++) {
      setBarProperties(i);
    }
    
    performCalculation();
  }
  
  function setBarProperties(index) {
    var cardCount = parseInt($("#cards" + index).val());
  
    $("#barGraph" + index).height(cardCount + 1);
  
    if (cardCount > 0) {
      $("#barGraph" + index).attr("class", "bar");
    } else {
      $("#barGraph" + index).attr("class", "barEmpty");
    }
  }
  
  function decrement(index) {
    var currentValue = parseInt($("#cards" + index).val());
    if (currentValue > 0) {
      $("#cards" + index).val(--currentValue);
    }
    else {
      $("#cards" + index).val(0);
    }
    updateUi();
  }
  
  function increment(index) {
    var currentValue = parseInt($("#cards" + index).val());
    $("#cards" + index).val(++currentValue);
    updateUi();
  }
  
  function resetDecks(decks) {
    $("#cards0").val(16 * decks);
    for (var i = 1; i < 10; i++) {
        $("#cards" + i).val(4 * decks)
    }
    updateUi();
  }
  
  function bankerShouldHit(bankerTotal, playersThirdCard) {
      // Player didn't draw a 3rd card
      if (playersThirdCard === null) {
  
          // Change bankerTotal <= 5 to bankerTotal <= 6 to improve banker EV
      if (bankerTotal <= 5) {
          // Banker should have option to hit or stand on 6
        return true;
      }
      return false;
    }
  
      if (bankerTotal >= 7) {
        return false;
    }
      if (bankerTotal === 6 && [0, 1, 2, 3, 4, 5, 8, 9].includes(playersThirdCard)) {
        return false;
    }
      if (bankerTotal === 5 && [0, 1, 2, 3, 8, 9].includes(playersThirdCard)) 	{
        return false;
    }
    // Change [0, 1, 8, 9] to [0, 8, 9] to improve banker EV
      if (bankerTotal === 4 && [0, 1, 8, 9].includes(playersThirdCard)) {
        return false;
    }
      if (bankerTotal === 3 && playersThirdCard === 8) {
        return false;
    }  
    return true;
  }
  
  function playerShouldHit(playerTotal) {
      // Player should have an option to stand on 4 or 5
      return playerTotal <= 5;
  }
  
  function getStatistics() {
    var deck = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < 10; i++) {
        deck[i] = parseInt($("#cards" + i).val());
    }
  
    var combinations = 1;
    var totalPlayerWins = 0;
    var totalBankerWins = 0;
    var totalTies = 0;
  
    for (var p1 = 0; p1 < 10; p1++)
    {
      if (deck[p1] == 0)
      {
        // Abort calculations if we're out of the card
        continue;
      }
      combinations *= deck[p1];
      deck[p1]--;
  
      for (var p2 = 0; p2 < 10; p2++)
      {
        if (deck[p2] == 0)
        {
          // Abort calculations if we're out of the card
          continue;
        }
        combinations *= deck[p2];
        deck[p2]--;
  
        for (var p3 = 0; p3 < 10; p3++)
        {
          if (deck[p3] == 0)
          {
            // Abort calculations if we're out of the card
            continue;
          }
          combinations *= deck[p3];
          deck[p3]--;
  
          for (var b1 = 0; b1 < 10; b1++)
          {
            if (deck[b1] == 0)
            {
              // Abort calculations if we're out of the card
              continue;
            }
            combinations *= deck[b1];
            deck[b1]--;
  
            for (var b2 = 0; b2 < 10; b2++)
            {
              if (deck[b2] == 0)
              {
                // Abort calculations if we're out of the card
                continue;
              }
              combinations *= deck[b2];
              deck[b2]--;
  
              for (var b3 = 0; b3 < 10; b3++)
              {
                if (deck[b3] == 0)
                {
                  // Abort calculations if we're out of the card
                  continue;
                }
                combinations *= deck[b3];
  
                var playerTotal = (p1 + p2) % 10;
                var bankerTotal = (b1 + b2) % 10;
  
                if (playerTotal < 8 && bankerTotal < 8)
                {
                  // Neither player nor banker has a "natural"
                  if (playerShouldHit(playerTotal))
                  {
                    // Player hits 5 or less
                    playerTotal = (p1 + p2 + p3) % 10;
  
                    if (bankerShouldHit(bankerTotal, p3))
                    {
                      bankerTotal = (b1 + b2 + b3) % 10;
                    }
                  }
                  else
                  {
                      // Player didn't draw, so hit up to 5
                    if (bankerShouldHit(bankerTotal, null))
                    {
                      bankerTotal = (b1 + b2 + b3) % 10;
                    }
                  }
                }
  
                if (playerTotal > bankerTotal)
                {
                  totalPlayerWins += combinations;
                }
                else if (bankerTotal > playerTotal)
                {
                  totalBankerWins += combinations;
                }
                else
                {
                  totalTies += combinations;
                }
  
                combinations /= deck[b3];
              }
              // Add the cards back
              deck[b2]++;
              combinations /= deck[b2];
            }
            // Add the cards back
            deck[b1]++;
            combinations /= deck[b1];
          }
          // Add the cards back
          deck[p3]++;
          combinations /= deck[p3];
        }
        // Add the cards back
        deck[p2]++;
        combinations /= deck[p2];
      }
      // Add the cards back
      deck[p1]++;
      combinations /= deck[p1];
    }
  
    var totalCombinations = totalBankerWins + totalPlayerWins + totalTies;
  
    return {
      totalBankerWins: totalBankerWins,
      totalPlayerWins: totalPlayerWins,
      totalTies: totalTies,
      totalCombinations: totalCombinations,
      bankerWinPercentage: totalBankerWins / totalCombinations,
      playerWinPercentage: totalPlayerWins / totalCombinations,
      tiePercentage: totalTies / totalCombinations,
      bankerWinEv: ((totalBankerWins * 0.95) - totalPlayerWins) / totalCombinations,
      playerWinEv: (totalPlayerWins - totalBankerWins) / totalCombinations,
      tieEv: (8 * totalTies - totalBankerWins - totalPlayerWins) / totalCombinations
    }
  }
  