(function($) {
    // TODO: make the node ID configurable
    var treeNode = $('#jsdoc-toc-nav');

    // initialize the tree
    treeNode.tree({
        autoEscape: false,
        closedIcon: '&#x21e2;',
        data: [{"label":"<a href=\"Vec.html\">Vec</a>","id":"Vec","children":[]},{"label":"<a href=\"-_Set.html\">_Set</a>","id":"_Set","children":[]},{"label":"<a href=\"constructors.html\">constructors</a>","id":"constructors","children":[]},{"label":"<a href=\"iter_utils.html\">iter_utils</a>","id":"iter_utils","children":[]},{"label":"<a href=\"logic_utils.html\">logic_utils</a>","id":"logic_utils","children":[]},{"label":"<a href=\"math_utils.html\">math_utils</a>","id":"math_utils","children":[]},{"label":"<a href=\"misc_utils.html\">misc_utils</a>","id":"misc_utils","children":[]},{"label":"<a href=\"object_utils.html\">object_utils</a>","id":"object_utils","children":[]},{"label":"<a href=\"string_utils.html\">string_utils</a>","id":"string_utils","children":[]},{"label":"<a href=\"type_casts.html\">type_casts</a>","id":"type_casts","children":[]},{"label":"<a href=\"type_checks.html\">type_checks</a>","id":"type_checks","children":[]}],
        openedIcon: ' &#x21e3;',
        saveState: false,
        useContextMenu: false
    });

    // add event handlers
    // TODO
})(jQuery);
