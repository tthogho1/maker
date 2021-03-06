// Copyright 2014 TIS inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
(function() {
  "use strict";

  Backbone.ViewClass = function() {
    Backbone.View.apply(this, arguments);
  };

  Backbone.ViewClass.prototype = _.clone(Backbone.View.prototype);

  Backbone.ViewClass.extend = function(props) {
    var SuperClass = this;
    var Class = function() {
      SuperClass.apply(this, arguments);
    };

    Class.prototype = Object.create(SuperClass.prototype, {
      constructor: {
        value: Class,
        writable: true,
        configurable: true
      }
    });

    var fnTest = /console\.log/.test(function(){console.log();}) ? /\b_super\b/ : /.*/;
    Object.keys(props).forEach(function (key) {
      var prop   = props[key],
          _super = SuperClass.prototype[key],
          isMethodOverride = (typeof prop === 'function' && typeof _super === 'function' && fnTest.test(prop));

      if (isMethodOverride) {
        Class.prototype[key] = function () {
          var ret,
              tmp = this._super;

          this._super = _super;
          //  Object.defineProperty(this, '_super', {
          //    value: SuperClass.prototype[key],//_super,
          //    configurable: true
          //  });

          ret = prop.apply(this, arguments);

          this._super = tmp;
          //  Object.defineProperty(this, '_super', {
          //    value: tmp,
          //    configurable: true
          //  });

          return ret;
        };
      }
      else {
        Class.prototype[key] = prop;
      }
    });

    Class.extend = SuperClass.extend;

    return Class;
  };

  Backbone.ExtendedView = Backbone.ViewClass.extend({
    initialize: function() {
      _.bindAll(this);

      this.render = _.wrap(this.render, function(func) {
        func.apply(Array.prototype.slice.apply(arguments, [1]));

        $("[data-i18n]").i18n();
      });
    },

    partial: function(template, object) {
      if(JST[template] === undefined) {
        throw "Template '" + template + "' is not found.";
      }

      return JST[template].call(this, object);
    },

    __onload: function() {
      //  初回のみ画面の描画、イベントの設定を行う
      if($(".__container").find(this.$el).length === 0) {
        Backbone.Router.previous = { view: this, fragment: Backbone.history.fragment };
        $(".__container").children().remove();
        $(".__container").append(this.$el);

        this.render();
        this.onload();

        //  Alert消去時はView#errorsも消去する
        var self = this;
        this.$el.on("click", ".alert button", function(e) {
          var index = self.$(".alert button").index(e.target);
          self.errors.splice(index, 1);
        });
      }

      //  ActivityIndicatorを非表示にする
      $("div.activity-indicator").fadeOut(100);
    },

    //  Abstract method
    onload: function() {},

    wait: function() {
      //  ログイン済みの場合は合わせてログインユーザ情報を取得する
      var deferreds = _.toArray(arguments);
      if(App.Session.isLogin()) {
        deferreds.push(App.Session.getCurrentUser());
      }

      //  400ms以上かかる場合にはActivityIndicatorを表示する
      var timer = setTimeout(function() {
        $("div.activity-indicator").fadeIn(200);
      }, 400);

      var view = this;
      return $.when.apply($, deferreds).done(function() {
        clearTimeout(timer);
        view.__onload();
      }).fail(function(jq) {
        if(Backbone.Router.previous && jq) {
          var message = JSON.parse(jq.responseText).message;
          console.error("[Error] " + message);

          Backbone.Router.previous.view.errors = Backbone.Router.previous.view.errors || [];
          Backbone.Router.previous.view.errors.push({ type: "danger", title: "Error", message: message });
          Backbone.Router.previous.view.render();

          Backbone.history.navigate(Backbone.Router.previous.fragment, { trigger: false, replace: true});
        }

        //  ActivityIndicatorを非表示にする
        $("div.activity-indicator").fadeOut(100);
        clearTimeout(timer);
      });
    }
  });

})();
