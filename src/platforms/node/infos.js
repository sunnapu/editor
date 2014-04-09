define([
    "platform/fs"
], function(LocalFs) {

    return {
        name: "Desktop",
        fs: {
            local: LocalFs
        }
    };
});