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

  window.$x = function(xml) {
    var prefix = '<dummy xmlns:cc="http://cloudconductor.org/namespaces/cc" xmlns:ccm="http://cloudconductor.org/namespaces/ccm" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';
    var suffix = '</dummy>';
    xml = prefix + xml + suffix;
    return $($.parseXML(xml).documentElement).children();
  };

})();
