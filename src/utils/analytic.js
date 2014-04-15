define([
    "hr/utils"
], function(_) {
    var pkg = node.require("../package.json");
    var Mixpanel = node.require('mixpanel');
    var mixpanel = Mixpanel.init('01eb2b950ae09a5fdb15a98dcc5ff20e');

    var track = function(e, data) {
        console.log("track", e);
        mixpanel.track("editor."+e, _.extend(data || {}, {
            'version': pkg.version,
            'platform': process.platform,
            'arch': process.arch
        }));
    };

    track("start");

    return {
        track: track
    };
});