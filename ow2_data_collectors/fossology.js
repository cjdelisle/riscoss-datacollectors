/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var JSDom = require("jsdom");

// var s = document.createElement('script'); s.src="http://code.jquery.com/jquery.js"; document.body.appendChild(s);

var getCount = function (name, $) {
    var k = $('td:contains(' + JSON.stringify(name) + ')');
    var x = k[k.length-1];
    return Number(x.previousSibling.textContent);
};

var makeReq = function (url, callback) {
    var out = [];
    JSDom.env(url, ["http://code.jquery.com/jquery.js"], function (errors, window) {
        var $ = window.$;
        out.push({ id:'Unique_Lic', value: getCount("Unique licenses", $) });
        out.push({ id:'Number_Lic', value: getCount("Licenses found", $) });
        var noLicense = getCount("Files with no licenses", $);
        var fileCount = getCount("Files", $);
        out.push({ id:'Files_No_Lic', value: noLicense });
        out.push({ id:'Number_Files', value: fileCount });
        out.push({ id:'Ratio_No_Lic', value: (noLicense / fileCount) });
        callback(out);
    });
};

var run = function (conf) {
    makeReq(conf.url, function (data) {
        data.forEach(function (elem) {
            elem.type = 'NUMBER';
            elem.target = conf.targetEntity;
        });
        console.log('-----BEGIN RISK DATA-----');
        console.log(JSON.stringify(data));
        console.log('-----END RISK DATA-----');
    });
};

var main = function () {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    var data = "";
    process.stdin.on('data', function(chunk) { data += chunk; });
    process.stdin.on('end', function() { run(JSON.parse(data)); });
};
main();
