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
//= require ./base_router

(function() {
  "use strict";
  App.Routers.Template = App.Routers.BaseRouter.extend({
    routes: {
      "templates": "index",
      "templates/new": "new",
      "templates/import": "import", // new?
      "templates/:id": "show",
      "templates/:id/edit": "edit"
    },

    index: function() {
      new App.Views.TemplatesIndex();
    },

    new: function() {
      new App.Views.TemplateEdit();
    },

    import: function() {
      new App.Views.TemplateImport();
    },

    show: function(id) {
      new App.Views.TemplateShow({id: id});
    },

    edit: function(id) {
      new App.Views.TemplateEdit({id: id});
    }
  });
})();
