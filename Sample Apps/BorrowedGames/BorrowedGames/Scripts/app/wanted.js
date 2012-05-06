(function() {
  var wantedGame, wantedGameView, wantedGames, wantedGamesUrl, wantedGamesView;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  wantedGamesUrl = "";
  this.wanted = {
    init: function(urls) {
      wantedGamesUrl = urls.wantedGamesUrl;
      return this.view = new wantedGamesView();
    },
    getWantedGames: function() {
      return this.view.refresh();
    }
  };
  wantedGame = Backbone.Model.extend({
    name: function() {
      return this.get("Name");
    },
    console: function() {
      return this.get("Console");
    },
    owner: function() {
      return this.get("Owner").Handle;
    },
    canReturnGame: function() {
      return this.get("ReturnGame");
    },
    shortName: function() {
      var name;
      name = this.name();
      if (name.length > 41) {
        name = name.substring(0, 40) + "... ";
      }
      return name += " (" + this.console() + ")";
    },
    undoRequest: function() {
      return $.post(this.get("DeleteWant"), {}, __bind(function() {
        preferred.getPreferredGames();
        return this.change();
      }, this));
    },
    returnGame: function() {
      return $.post(this.get("ReturnGame"), {}, __bind(function() {
        preferred.getPreferredGames();
        return this.change();
      }, this));
    }
  });
  wantedGames = Backbone.Collection.extend({
    model: wantedGame,
    url: function() {
      return wantedGamesUrl;
    }
  });
  wantedGamesView = Backbone.View.extend({
    el: "#wantedGames",
    initialize: function() {
      this.wantedGames = new wantedGames();
      this.wantedGames.bind('reset', this.render, this);
      return this.wantedGames.fetch();
    },
    refresh: function() {
      return this.wantedGames.fetch();
    },
    render: function() {
      $(this.el).empty();
      return this.wantedGames.each(__bind(function(game) {
        return this.addGame(game);
      }, this));
    },
    addGame: function(game) {
      var view;
      view = new wantedGameView({
        model: game
      });
      view.render();
      return $(this.el).append(view.el);
    }
  });
  wantedGameView = Backbone.View.extend({
    className: 'border',
    initialize: function() {
      return this.model.bind('change', this.apply, this);
    },
    apply: function() {
      return $(this.el).fadeOut();
    },
    events: {
      "click .cancel": "delete"
    },
    "delete": function() {
      if (!this.model.canReturnGame()) {
        this.model.undoRequest();
      }
      if (this.model.canReturnGame()) {
        return this.model.returnGame();
      }
    },
    render: function() {
      if (!this.model.canReturnGame()) {
        this.renderRequestedGame();
      }
      if (this.model.canReturnGame()) {
        this.renderBorrowedGame();
      }
      return this;
    },
    renderRequestedGame: function() {
      var game;
      game = $.tmpl(this.requestedGameTemplate, {
        gameName: this.model.shortName(),
        owner: this.model.owner()
      });
      $(this.el).html(game);
      return toolTip.init(game.find(".cancel"), "UndoRequest", "Don't want the game?<br/>Click to undo request.", "You get the idea...<br/>Undo request.", function() {
        return game.find(".cancel").offset().left - 125;
      }, function() {
        return game.find(".cancel").offset().top - 75;
      });
    },
    renderBorrowedGame: function() {
      var game;
      game = $.tmpl(this.borrowedGameTemplate, {
        gameName: this.model.shortName(),
        owner: this.model.owner()
      });
      $(this.el).html(game);
      return toolTip.init(game.find(".cancel"), "ReturnGame", "All done with the game?<br/>Click to mark it as returned.", "You get the idea...<br/>Return game.", function() {
        return game.find(".cancel").offset().left - 125;
      }, function() {
        return game.find(".cancel").offset().top - 75;
      });
    },
    borrowedGameTemplate: '\
  <div class="menubar">\
    <a href="javascript:;"\
       style="text-decoration: none; color: black; float: right; padding-left: 15px"\
       class="cancel">&nbsp;</a>\
    <div style="clear: both">&nbsp;</div>\
  </div>\
    <span style="float: right; font-size: 30px; color: silver; margin-right: 10px" class="brand">\
      Borrowed\
    </span>\
    <div style="font-size: 20px">${gameName}</div>\
    <div>${owner}</div>\
    ',
    requestedGameTemplate: '\
  <div class="menubar">\
    <a href="javascript:;"\
       style="text-decoration: none; color: black; float: right; padding-left: 15px"\
       class="cancel">&nbsp;</a>\
    <div style="clear: both">&nbsp;</div>\
  </div>\
    <span style="float: right; font-size: 30px; color: silver; margin-right: 10px" class="brand">\
      Requested\
    </span>\
    <div style="font-size: 20px">${gameName}</div>\
    <div>${owner}</div>\
    '
  });
}).call(this);
