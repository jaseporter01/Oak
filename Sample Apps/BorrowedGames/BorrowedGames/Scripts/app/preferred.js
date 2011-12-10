(function() {
  var addGameToPage, bindStatus, gameElementFor, gameTemplate, initView, preferredGames, setRequested;
  preferredGames = null;
  initView = function() {
    return preferredGames = $("#preferredGames");
  };
  addGameToPage = function(game) {
    var $game;
    $game = gameElementFor(game);
    return preferredGames.append($game);
  };
  setRequested = function($game) {};
  gameElementFor = function(game) {
    var $game, gameName, searchString, userId;
    searchString = "http://www.google.com/search?q=" + encodeURIComponent(game.Name + " ") + "site:gamespot.com&btnI=3564";
    userId = game.Owner.Id;
    gameName = game.Name;
    if (game.Name.length > 45) {
      gameName = game.Name.substring(0, 40) + "... ";
    }
    gameName += " (" + game.Console + ")";
    $game = $.tmpl(gameTemplate, {
      gameId: game.Id,
      gameName: gameName,
      searchString: searchString,
      owner: game.Owner.Handle,
      userId: userId
    });
    $game.game = game;
    $game.takeActionLink = function() {
      return $game.find("#takeAction" + game.Id + "_" + userId);
    };
    $game.statusLink = function() {
      return $game.find("#status" + game.Id + "_" + userId);
    };
    $game.closeLink = function() {
      return $game.find("#closeLink" + game.Id + "_" + userId);
    };
    bindStatus($game);
    $game.UpdateState();
    return $game;
  };
  bindStatus = function($game) {
    var closeLink, game, statusLink, takeAction, userId;
    game = $game.game;
    takeAction = $game.takeActionLink();
    statusLink = $game.statusLink();
    closeLink = $game.closeLink();
    userId = $game.game.Owner.Id;
    $game.Status = function() {
      if ($game.game.Requested) {
        return "Requested";
      }
      return "Preferred";
    };
    $game.UpdateState = function() {
      return $game[$game.Status()]();
    };
    $game.Requested = function() {
      takeAction.hide();
      takeAction.remove();
      statusLink.html("Requested");
      statusLink.fadeIn();
      closeLink.unbind('click');
      closeLink.click(function() {
        return alert("todo");
      });
      return toolTip.init(closeLink, "UndoRequest", "Click to undo game request.", "You get the idea...<br/>Click to undo game request.", function() {
        return $game.offset().left + 100;
      }, function() {
        return $game.offset().top + -25;
      });
    };
    return $game.Preferred = function() {
      takeAction.click(function() {
        return $.post(preferred.urls.requestGameUrl, {
          gameId: game.Id,
          followingId: userId
        }, function() {
          takeAction.fadeOut();
          $game.game.Requested = true;
          return $game.UpdateState();
        });
      });
      toolTip.init(takeAction, "RequestGame", "Click here to request the game.", "You get the idea...<br/>Request game.", function() {
        return $game.offset().left + 100;
      }, function() {
        return takeAction.offset().top;
      });
      toolTip.init(closeLink, "NotInterested", "Not interested?<br/>Click to remove it.", "You get the idea...<br/>Remove game.", function() {
        return $game.offset().left + 100;
      }, function() {
        return $game.offset().top + -25;
      });
      return closeLink.click(function() {
        return $.post(preferred.urls.notInterestedUrl, {
          gameId: game.Id
        }, function() {
          return $game.fadeOut();
        });
      });
    };
  };
  this.preferred = {
    init: function(urls) {
      initView();
      this.urls = urls;
      return this.getPreferredGames();
    },
    getPreferredGames: function() {
      return $.getJSON(this.urls.preferredGamesUrl, function(games) {
        var game, _i, _len;
        preferredGames.html('');
        for (_i = 0, _len = games.length; _i < _len; _i++) {
          game = games[_i];
          addGameToPage(game);
        }
        preferredGames.append($("<div />").css({
          clear: "both"
        }));
        if (!games.length) {
          return preferredGames.html("Games you don't own (that your friends have) will show up here.");
        }
      });
    }
  };
  gameTemplate = '\
  <div id="game${gameId}_${userId}" class="border dropshadow" style="float: left; width: 100px; height: 160px">\
    <div style="padding-bottom: 5px; margin-bottom: 10px; border-bottom: 1px silver solid; height: 20px">\
      <span id="status${gameId}_${userId}" style="float: left; font-size: 15px; display: none; color: #EC7600;" class="brand"></span>\
      <a href="javascript:;" id="closeLink${gameId}_${userId}" \
         style="text-decoration: none; color: black; float: right; padding-left: 15px" \
         class="cancel">&nbsp;</a>\
      <div style="clear: both">&nbsp;</div>\
    </div>\
    <div style="font-size: 12px; height: 70px; padding-bottom: 3px">\
      <a style="color: black;" href="${searchString}" target="_blank">${gameName}</a><br/>\
    </div>\
    <div style="font-size: 12px; height: 30px; padding-bottom: 3px">\
      ${owner}\
    </div>\
    <div style="padding-bottom: 5px; margin-bottom: 10px; border-top: 1px silver solid">\
      <a href="javascript:;" id="takeAction${gameId}_${userId}" style="font-size: 12px">request game</a>\
    </div>\
  </div>\
  ';
}).call(this);