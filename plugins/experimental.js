exports.defineTags = function(dictionary) {
    dictionary.defineTag("experimental", {
        mustHaveValue: false,
        canHaveType: false,
        canHaveName: true,
        onTagged: function(doclet, tag) {
            doclet.experimental = true;
        }
    });
};