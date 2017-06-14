describe("Check Core Initialize Status", function() {

    it("Check if core ist loaded", function() {

        expect(ENV).toBeDefined();
        expect(RACK).toBeDefined();
        expect(PLATFORM).toBeDefined();
        expect(DEBUG).toBeDefined();
        expect(CORE).toBeDefined();
        expect(CONFIG).toBeDefined();
        expect(APP).toBeDefined();
    });

    it("Check if framework contains all required functions", function() {

        expect(APP).toHaveObject("EVENT");
        expect(APP).toHaveObject("MAPPER");
        expect(APP).toHaveObject("MODEL");
        expect(APP).toHaveObject("ROUTE");
        expect(APP).toHaveObject("CONTROLLER");
        expect(APP).toHaveObject("LAYOUT");
        expect(APP).toHaveObject("CONFIG");
        expect(APP).toHaveObject("CRC32");
        expect(APP).toHaveObject("DEVICE");
        expect(APP).toHaveObject("HANDLER");
        expect(APP).toHaveObject("HELPER");
        expect(APP).toHaveObject("HTML");
        expect(APP).toHaveObject("STORAGE");
        expect(APP).toHaveObject("VARS");
        expect(APP).toHaveObject("VIEW");
        expect(APP).toHaveObject("LANG");
        expect(APP).toHaveObject("PAYLOAD");
        expect(APP).toHaveObject("PLUGIN");
        expect(APP).toHaveObject("WORKER");

        expect(APP).toHaveMethod("INIT");
        expect(APP).toHaveMethod("MAIN");
        expect(APP).toHaveMethod("SETUP");
    });

    it("Check if core contains all required functions", function() {

        expect(CORE).toHaveMethod("preventEvent");
        expect(CORE).toHaveMethod("parseNode");
        expect(CORE).toHaveMethod("buildPattern");
        expect(CORE).toHaveMethod("ajax");
        //todo: to method
        expect(CORE).toHaveObject("console");
    });

    it("Check CORE.parseNode()", function() {

        var node = CORE.parseNode({
            tag: "div",
            attr: {
                class: "test",
                id: "test"
            }
        });

        expect(CORE.hasClass(node, 'test')).toBe(true);
        expect(node.id).toBe("test");
    });

    it("Check CORE.buildPattern()", function() {

        var node = CORE.buildPattern([{

            tag: "div",
            attr: {
                class: "test",
                id: "test"
            },
            child: [{
                tag: "div",
                attr: {
                    class: "test_child",
                    id: "test_child",
                    style: 'display: none;',
                    'data-id': 'id_1'
                }
            }]

        }], document.createElement("div"));

        node = node.firstChild;
        expect(CORE.hasClass(node, 'test')).toBe(true);
        expect(node.id).toBe("test");

        node = node.firstChild;
        expect(CORE.hasClass(node, 'test_child')).toBe(true);
        expect(CORE.getStyle(node, 'display')).toBe('none');
        expect(node.id).toBe("test_child");
        expect(node.dataset.id).toBe('id_1');
    });

    //it("Check CORE.setMouseTouchEvent()", function() {
    //
    //    CORE.setMouseTouchEvent('search-input-field', function(){}, true);
    //    expect(CORE.getById('search-input-field').onmousedown)
    //        .toBe(CORE.getById('search-input-field').ontouchstart);
    //});
});