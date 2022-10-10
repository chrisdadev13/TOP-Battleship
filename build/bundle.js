
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.50.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    class Ship {
        constructor(longitude, hitted, sunk = false) {
            this.longitude = longitude;
            this.hitted = hitted;
            this.sunk = sunk;
        }
        hit(target) {
            if (target == 'Hitted') {
                this.hitted.push(target);
            }
        }
        isSunk() {
            return this.longitude == this.hitted.length ? true : false;
        }
    }

    const BOARD_SIZE = 10;
    class Gameboard {
        constructor() {
            this.board = [];
            this.init();
        }
        init() {
            for (let row = 0; row < BOARD_SIZE; row++) {
                this.board[row] = [];
                for (let col = 0; col < BOARD_SIZE; col++) {
                    this.board[row][col] = 0;
                }
            }
        }
        receiveAttack(row, col) {
            if (this.board[row][col] == 0)
                this.board[row][col] = "X";
            else if (typeof this.board[row][col] == 'object')
                this.board[row][col] = "Hitted";
            this.board[row][col].hit('Hitted');
        }
        placeShip(ship, row, col, vertical) {
            if (vertical == true && this.isShipPlaceable(ship, row, col, vertical) == true) {
                for (let i = 0; i < ship.longitude; i++) {
                    this.board[row + i][col] = ship;
                }
                this.enableShipPlace(ship, row, col, vertical);
                return true;
            }
            else if (vertical == false && this.isShipPlaceable(ship, row, col, vertical) == true) {
                for (let i = 0; i < ship.longitude; i++) {
                    this.board[row][col + i] = ship;
                }
                this.enableShipPlace(ship, row, col, vertical);
                return true;
            }
        }
        enableShipPlace(ship, row, col, vertical) {
            let colsCounter = 0;
            let rowsCounter = 0;
            for (let i = col; i < 10; i++) {
                colsCounter++;
            }
            for (let i = row; i < 10; i++) {
                rowsCounter++;
            }
            if (vertical == true) {
                if (col == 0) {
                    if (row == 0) {
                        this.board[row + ship.longitude][col] = 1;
                        for (let i = row; i <= row + ship.longitude - 1; i++) {
                            this.board[i][col + 1] = 1;
                        }
                    }
                    else if (ship.longitude == rowsCounter) {
                        this.board[row - 1][col] = 1;
                        for (let i = row; i <= row + ship.longitude - 1; i++) {
                            this.board[i][col + 1] = 1;
                        }
                    }
                    else {
                        this.board[row - 1][col] = 1;
                        this.board[row + ship.longitude][col] = 1;
                        for (let i = row; i <= row + ship.longitude - 1; i++) {
                            this.board[i][col + 1] = 1;
                        }
                    }
                }
                else if (col == 9) {
                    if (row == 0) {
                        this.board[row + ship.longitude][col] = 1;
                        for (let i = row; i <= row + ship.longitude - 1; i++) {
                            this.board[i][col - 1] = 1;
                        }
                    }
                    else if (ship.longitude == rowsCounter) {
                        this.board[row - 1][col] = 1;
                        for (let i = row; i <= row + ship.longitude - 1; i++) {
                            this.board[i][col - 1] = 1;
                        }
                    }
                    else {
                        this.board[row - 1][col] = 1;
                        this.board[row + ship.longitude][col] = 1;
                        for (let i = row; i <= row + ship.longitude - 1; i++) {
                            this.board[i][col - 1] = 1;
                        }
                    }
                }
                else {
                    if (row == 0) {
                        this.board[row + ship.longitude][col] = 1;
                        for (let i = row; i <= row + ship.longitude - 1; i++) {
                            this.board[i][col - 1] = 1;
                            this.board[i][col + 1] = 1;
                        }
                    }
                    else if (ship.longitude == rowsCounter) {
                        this.board[row - 1][col] = 1;
                        for (let i = row; i <= row + ship.longitude - 1; i++) {
                            this.board[i][col - 1] = 1;
                            this.board[i][col + 1] = 1;
                        }
                    }
                    else {
                        this.board[row - 1][col] = 1;
                        this.board[row + ship.longitude][col] = 1;
                        for (let i = row; i <= row + ship.longitude - 1; i++) {
                            this.board[i][col - 1] = 1;
                            this.board[i][col + 1] = 1;
                        }
                    }
                }
            }
            else {
                if (row == 0) {
                    if (col == 0) {
                        this.board[row][col + ship.longitude] = 1;
                        for (let i = col; i <= col + ship.longitude - 1; i++) {
                            this.board[row + 1][i] = 1;
                        }
                    }
                    else if (ship.longitude == colsCounter) {
                        this.board[row][col - 1] = 1;
                        for (let i = col; i <= col + ship.longitude - 1; i++) {
                            this.board[row + 1][i] = 1;
                        }
                    }
                    else {
                        this.board[row][col + ship.longitude] = 1;
                        this.board[row][col - 1] = 1;
                        for (let i = col; i <= col + ship.longitude - 1; i++) {
                            this.board[row + 1][i] = 1;
                        }
                    }
                }
                else if (row == 9) {
                    if (col == 0) {
                        this.board[row][col + ship.longitude] = 1;
                        for (let i = col; i <= col + ship.longitude - 1; i++) {
                            this.board[row - 1][i] = 1;
                        }
                    }
                    else if (ship.longitude == colsCounter) {
                        this.board[row][col - 1] = 1;
                        for (let i = col; i <= col + ship.longitude - 1; i++) {
                            this.board[row - 1][i] = 1;
                        }
                    }
                    else {
                        this.board[row][col + ship.longitude] = 1;
                        this.board[row][col - 1] = 1;
                        for (let i = col; i <= col + ship.longitude - 1; i++) {
                            this.board[row - 1][i] = 1;
                        }
                    }
                }
                else {
                    if (col == 0) {
                        this.board[row][col + ship.longitude] = 1;
                        for (let i = col; i <= col + ship.longitude - 1; i++) {
                            this.board[row + 1][i] = 1;
                            this.board[row - 1][i] = 1;
                        }
                    }
                    else if (ship.longitude == colsCounter) {
                        this.board[row][col - 1] = 1;
                        for (let i = col; i <= col + ship.longitude - 1; i++) {
                            this.board[row + 1][i] = 1;
                            this.board[row - 1][i] = 1;
                        }
                    }
                    else {
                        this.board[row][col + ship.longitude] = 1;
                        this.board[row][col - 1] = 1;
                        for (let i = col; i <= col + ship.longitude - 1; i++) {
                            this.board[row + 1][i] = 1;
                            this.board[row - 1][i] = 1;
                        }
                    }
                }
            }
        }
        shipCollisions(ship, row, col, vertical) {
            let colCollision;
            let colsCounter = 0;
            let rowCollision;
            let rowsCounter = 0;
            let counter = 0;
            for (let i = col; i < 10; i++) {
                colsCounter++;
            }
            for (let i = row; i < 10; i++) {
                rowsCounter++;
            }
            if (vertical == false) {
                if (ship.longitude > colsCounter) {
                    return true;
                }
                else {
                    while (counter < ship.longitude) {
                        if (this.board[row][col + counter] != 0) {
                            colCollision = true;
                            break;
                        }
                        else if (this.board[row][col + counter] == 0)
                            colCollision = false;
                        counter++;
                    }
                }
                return colCollision;
            }
            else {
                if (ship.longitude > rowsCounter) {
                    return true;
                }
                else {
                    while (counter < ship.longitude) {
                        if (this.board[row + counter][col] != 0) {
                            rowCollision = true;
                            break;
                        }
                        else if (this.board[row + counter][col] == 0)
                            rowCollision = false;
                        counter++;
                    }
                }
                return rowCollision;
            }
        }
        isShipPlaceable(ship, row, col, vertical) {
            if (this.board[row][col] != 0 && this.shipCollisions(ship, row, col, vertical) == true) {
                return false;
            }
            else if (this.board[row][col] == 0 && this.shipCollisions(ship, row, col, vertical) == false) {
                return true;
            }
        }
        placeShipRandomly() {
            let counter = 0;
            let carrier = new Ship(4, [], false);
            let battleship = new Ship(4, [], false);
            let cruiser = new Ship(3, [], false);
            let submarine = new Ship(2, [], false);
            let patrol = new Ship(2, [], false);
            let row;
            let col;
            let verticalSelector;
            let vertical;
            do {
                verticalSelector = Math.random();
                vertical = verticalSelector > 0.5 ? true : false;
                row = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
                col = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
                switch (counter) {
                    case 0:
                        if (this.board[row][col] != 0) {
                            while (this.board[row][col] != 0) {
                                row = Math.floor(Math.random() * (9 + 1));
                                col = Math.floor(Math.random() * (9 + 1));
                            }
                            this.placeShip(carrier, row, col, vertical);
                        }
                        else {
                            this.placeShip(carrier, row, col, vertical);
                        }
                    case 1:
                        if (this.board[row][col] != 0) {
                            while (this.board[row][col] != 0) {
                                row = Math.floor(Math.random() * (9 + 1));
                                col = Math.floor(Math.random() * (9 + 1));
                            }
                            this.placeShip(battleship, row, col, vertical);
                        }
                        else {
                            this.placeShip(battleship, row, col, vertical);
                        }
                    case 2:
                        if (this.board[row][col] != 0) {
                            while (this.board[row][col] != 0) {
                                row = Math.floor(Math.random() * (9 + 1));
                                col = Math.floor(Math.random() * (9 + 1));
                            }
                            this.placeShip(cruiser, row, col, vertical);
                        }
                        else {
                            this.placeShip(cruiser, row, col, vertical);
                        }
                    case 3:
                        if (this.board[row][col] != 0) {
                            while (this.board[row][col] != 0) {
                                row = Math.floor(Math.random() * (9 + 1));
                                col = Math.floor(Math.random() * (9 + 1));
                            }
                            this.placeShip(submarine, row, col, vertical);
                        }
                        else {
                            this.placeShip(submarine, row, col, vertical);
                        }
                    case 4:
                        if (this.board[row][col] != 0) {
                            while (this.board[row][col] != 0) {
                                row = Math.floor(Math.random() * (9 + 1));
                                col = Math.floor(Math.random() * (9 + 1));
                            }
                            this.placeShip(patrol, row, col, vertical);
                        }
                        else {
                            this.placeShip(patrol, row, col, vertical);
                        }
                }
                counter++;
            } while (counter < 6);
        }
    }

    /* src/components/ShipUI.svelte generated by Svelte v3.50.1 */
    const file$2 = "src/components/ShipUI.svelte";

    function get_each_context_9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (41:0) {:else}
    function create_else_block(ctx) {
    	let div1;
    	let div0;
    	let div0_id_value;
    	let mounted;
    	let dispose;

    	function select_block_type_2(ctx, dirty) {
    		if (/*count*/ ctx[4] == 0) return create_if_block_6;
    		if (/*count*/ ctx[4] == 1) return create_if_block_7;
    		if (/*count*/ ctx[4] == 2) return create_if_block_8;
    		if (/*count*/ ctx[4] == 3) return create_if_block_9;
    		if (/*count*/ ctx[4] == 4) return create_if_block_10;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "draggable", "true");
    			set_style(div0, "transform", "rotate(90deg)");
    			set_style(div0, "margin-bottom", "-90px");
    			attr_dev(div0, "id", div0_id_value = /*count*/ ctx[4].toString());
    			add_location(div0, file$2, 42, 6, 1321);
    			attr_dev(div1, "class", "ships-container-row svelte-16f9pdg");
    			add_location(div1, file$2, 41, 2, 1281);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "dragend", /*dragend_handler_1*/ ctx[7], false, false, false),
    					listen_dev(div0, "dragstart", /*dragstart_handler_1*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			if (dirty & /*count*/ 16 && div0_id_value !== (div0_id_value = /*count*/ ctx[4].toString())) {
    				attr_dev(div0, "id", div0_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);

    			if (if_block) {
    				if_block.d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(41:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:0) {#if vertical == true}
    function create_if_block$1(ctx) {
    	let div1;
    	let div0;
    	let div0_id_value;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*count*/ ctx[4] == 0) return create_if_block_1$1;
    		if (/*count*/ ctx[4] == 1) return create_if_block_2;
    		if (/*count*/ ctx[4] == 2) return create_if_block_3;
    		if (/*count*/ ctx[4] == 3) return create_if_block_4;
    		if (/*count*/ ctx[4] == 4) return create_if_block_5;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "draggable", "true");
    			attr_dev(div0, "class", "ship-preview-container svelte-16f9pdg");
    			attr_dev(div0, "id", div0_id_value = /*count*/ ctx[4].toString());
    			add_location(div0, file$2, 10, 6, 252);
    			attr_dev(div1, "class", "ships-container-col svelte-16f9pdg");
    			add_location(div1, file$2, 9, 2, 212);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "dragend", /*dragend_handler*/ ctx[5], false, false, false),
    					listen_dev(div0, "dragstart", /*dragstart_handler*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			if (dirty & /*count*/ 16 && div0_id_value !== (div0_id_value = /*count*/ ctx[4].toString())) {
    				attr_dev(div0, "id", div0_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);

    			if (if_block) {
    				if_block.d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(9:0) {#if vertical == true}",
    		ctx
    	});

    	return block;
    }

    // (66:29) 
    function create_if_block_10(ctx) {
    	let each_1_anchor;
    	let each_value_9 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    	validate_each_argument(each_value_9);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_9.length; i += 1) {
    		each_blocks[i] = create_each_block_9(get_each_context_9(ctx, each_value_9, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ships, count*/ 17) {
    				each_value_9 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    				validate_each_argument(each_value_9);
    				let i;

    				for (i = 0; i < each_value_9.length; i += 1) {
    					const child_ctx = get_each_context_9(ctx, each_value_9, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_9.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(66:29) ",
    		ctx
    	});

    	return block;
    }

    // (62:29) 
    function create_if_block_9(ctx) {
    	let each_1_anchor;
    	let each_value_8 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    	validate_each_argument(each_value_8);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_8.length; i += 1) {
    		each_blocks[i] = create_each_block_8(get_each_context_8(ctx, each_value_8, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ships, count*/ 17) {
    				each_value_8 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    				validate_each_argument(each_value_8);
    				let i;

    				for (i = 0; i < each_value_8.length; i += 1) {
    					const child_ctx = get_each_context_8(ctx, each_value_8, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_8.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(62:29) ",
    		ctx
    	});

    	return block;
    }

    // (58:29) 
    function create_if_block_8(ctx) {
    	let each_1_anchor;
    	let each_value_7 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    	validate_each_argument(each_value_7);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_7.length; i += 1) {
    		each_blocks[i] = create_each_block_7(get_each_context_7(ctx, each_value_7, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ships, count*/ 17) {
    				each_value_7 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    				validate_each_argument(each_value_7);
    				let i;

    				for (i = 0; i < each_value_7.length; i += 1) {
    					const child_ctx = get_each_context_7(ctx, each_value_7, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_7.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(58:29) ",
    		ctx
    	});

    	return block;
    }

    // (54:29) 
    function create_if_block_7(ctx) {
    	let each_1_anchor;
    	let each_value_6 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    	validate_each_argument(each_value_6);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_6.length; i += 1) {
    		each_blocks[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ships, count*/ 17) {
    				each_value_6 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    				validate_each_argument(each_value_6);
    				let i;

    				for (i = 0; i < each_value_6.length; i += 1) {
    					const child_ctx = get_each_context_6(ctx, each_value_6, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_6.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(54:29) ",
    		ctx
    	});

    	return block;
    }

    // (50:8) {#if count == 0}
    function create_if_block_6(ctx) {
    	let each_1_anchor;
    	let each_value_5 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ships, count*/ 17) {
    				each_value_5 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_5.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(50:8) {#if count == 0}",
    		ctx
    	});

    	return block;
    }

    // (67:10) {#each new Array(ships[count].longitude) as j}
    function create_each_block_9(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "ship-preview-tile svelte-16f9pdg");
    			add_location(div, file$2, 67, 12, 2274);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_9.name,
    		type: "each",
    		source: "(67:10) {#each new Array(ships[count].longitude) as j}",
    		ctx
    	});

    	return block;
    }

    // (63:10) {#each new Array(ships[count].longitude) as j}
    function create_each_block_8(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "ship-preview-tile svelte-16f9pdg");
    			add_location(div, file$2, 63, 12, 2119);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_8.name,
    		type: "each",
    		source: "(63:10) {#each new Array(ships[count].longitude) as j}",
    		ctx
    	});

    	return block;
    }

    // (59:10) {#each new Array(ships[count].longitude) as j}
    function create_each_block_7(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "ship-preview-tile svelte-16f9pdg");
    			add_location(div, file$2, 59, 12, 1964);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_7.name,
    		type: "each",
    		source: "(59:10) {#each new Array(ships[count].longitude) as j}",
    		ctx
    	});

    	return block;
    }

    // (55:10) {#each new Array(ships[count].longitude) as j}
    function create_each_block_6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "ship-preview-tile svelte-16f9pdg");
    			add_location(div, file$2, 55, 12, 1809);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_6.name,
    		type: "each",
    		source: "(55:10) {#each new Array(ships[count].longitude) as j}",
    		ctx
    	});

    	return block;
    }

    // (51:10) {#each new Array(ships[count].longitude) as j}
    function create_each_block_5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "ship-preview-tile svelte-16f9pdg");
    			add_location(div, file$2, 51, 12, 1654);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(51:10) {#each new Array(ships[count].longitude) as j}",
    		ctx
    	});

    	return block;
    }

    // (34:29) 
    function create_if_block_5(ctx) {
    	let each_1_anchor;
    	let each_value_4 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ships, count*/ 17) {
    				each_value_4 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(34:29) ",
    		ctx
    	});

    	return block;
    }

    // (30:29) 
    function create_if_block_4(ctx) {
    	let each_1_anchor;
    	let each_value_3 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ships, count*/ 17) {
    				each_value_3 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(30:29) ",
    		ctx
    	});

    	return block;
    }

    // (26:29) 
    function create_if_block_3(ctx) {
    	let each_1_anchor;
    	let each_value_2 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ships, count*/ 17) {
    				each_value_2 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(26:29) ",
    		ctx
    	});

    	return block;
    }

    // (22:29) 
    function create_if_block_2(ctx) {
    	let each_1_anchor;
    	let each_value_1 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ships, count*/ 17) {
    				each_value_1 = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(22:29) ",
    		ctx
    	});

    	return block;
    }

    // (18:8) {#if count == 0}
    function create_if_block_1$1(ctx) {
    	let each_1_anchor;
    	let each_value = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ships, count*/ 17) {
    				each_value = new Array(/*ships*/ ctx[0][/*count*/ ctx[4]].longitude);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(18:8) {#if count == 0}",
    		ctx
    	});

    	return block;
    }

    // (35:10) {#each new Array(ships[count].longitude) as j}
    function create_each_block_4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "ship-preview-tile svelte-16f9pdg");
    			add_location(div, file$2, 35, 12, 1179);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(35:10) {#each new Array(ships[count].longitude) as j}",
    		ctx
    	});

    	return block;
    }

    // (31:10) {#each new Array(ships[count].longitude) as j}
    function create_each_block_3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "ship-preview-tile svelte-16f9pdg");
    			add_location(div, file$2, 31, 12, 1024);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(31:10) {#each new Array(ships[count].longitude) as j}",
    		ctx
    	});

    	return block;
    }

    // (27:10) {#each new Array(ships[count].longitude) as j}
    function create_each_block_2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "ship-preview-tile svelte-16f9pdg");
    			add_location(div, file$2, 27, 12, 869);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(27:10) {#each new Array(ships[count].longitude) as j}",
    		ctx
    	});

    	return block;
    }

    // (23:10) {#each new Array(ships[count].longitude) as j}
    function create_each_block_1$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "ship-preview-tile svelte-16f9pdg");
    			add_location(div, file$2, 23, 12, 714);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(23:10) {#each new Array(ships[count].longitude) as j}",
    		ctx
    	});

    	return block;
    }

    // (19:10) {#each new Array(ships[count].longitude) as j}
    function create_each_block$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "ship-preview-tile svelte-16f9pdg");
    			add_location(div, file$2, 19, 12, 559);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(19:10) {#each new Array(ships[count].longitude) as j}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*vertical*/ ctx[1] == true) return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ShipUI', slots, []);
    	let { ships } = $$props;
    	let { vertical } = $$props;
    	let { onDragShip } = $$props;
    	let { offDragShip } = $$props;
    	let { count = 0 } = $$props;
    	const writable_props = ['ships', 'vertical', 'onDragShip', 'offDragShip', 'count'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ShipUI> was created with unknown prop '${key}'`);
    	});

    	const dragend_handler = event => offDragShip(event);
    	const dragstart_handler = event => onDragShip(event);
    	const dragend_handler_1 = event => offDragShip(event);
    	const dragstart_handler_1 = event => onDragShip(event);

    	$$self.$$set = $$props => {
    		if ('ships' in $$props) $$invalidate(0, ships = $$props.ships);
    		if ('vertical' in $$props) $$invalidate(1, vertical = $$props.vertical);
    		if ('onDragShip' in $$props) $$invalidate(2, onDragShip = $$props.onDragShip);
    		if ('offDragShip' in $$props) $$invalidate(3, offDragShip = $$props.offDragShip);
    		if ('count' in $$props) $$invalidate(4, count = $$props.count);
    	};

    	$$self.$capture_state = () => ({
    		ships,
    		vertical,
    		onDragShip,
    		offDragShip,
    		count
    	});

    	$$self.$inject_state = $$props => {
    		if ('ships' in $$props) $$invalidate(0, ships = $$props.ships);
    		if ('vertical' in $$props) $$invalidate(1, vertical = $$props.vertical);
    		if ('onDragShip' in $$props) $$invalidate(2, onDragShip = $$props.onDragShip);
    		if ('offDragShip' in $$props) $$invalidate(3, offDragShip = $$props.offDragShip);
    		if ('count' in $$props) $$invalidate(4, count = $$props.count);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		ships,
    		vertical,
    		onDragShip,
    		offDragShip,
    		count,
    		dragend_handler,
    		dragstart_handler,
    		dragend_handler_1,
    		dragstart_handler_1
    	];
    }

    class ShipUI extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			ships: 0,
    			vertical: 1,
    			onDragShip: 2,
    			offDragShip: 3,
    			count: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ShipUI",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*ships*/ ctx[0] === undefined && !('ships' in props)) {
    			console.warn("<ShipUI> was created without expected prop 'ships'");
    		}

    		if (/*vertical*/ ctx[1] === undefined && !('vertical' in props)) {
    			console.warn("<ShipUI> was created without expected prop 'vertical'");
    		}

    		if (/*onDragShip*/ ctx[2] === undefined && !('onDragShip' in props)) {
    			console.warn("<ShipUI> was created without expected prop 'onDragShip'");
    		}

    		if (/*offDragShip*/ ctx[3] === undefined && !('offDragShip' in props)) {
    			console.warn("<ShipUI> was created without expected prop 'offDragShip'");
    		}
    	}

    	get ships() {
    		throw new Error("<ShipUI>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ships(value) {
    		throw new Error("<ShipUI>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vertical() {
    		throw new Error("<ShipUI>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vertical(value) {
    		throw new Error("<ShipUI>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onDragShip() {
    		throw new Error("<ShipUI>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onDragShip(value) {
    		throw new Error("<ShipUI>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offDragShip() {
    		throw new Error("<ShipUI>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offDragShip(value) {
    		throw new Error("<ShipUI>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get count() {
    		throw new Error("<ShipUI>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set count(value) {
    		throw new Error("<ShipUI>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/BoardUI.svelte generated by Svelte v3.50.1 */

    const { console: console_1 } = globals;
    const file$1 = "src/components/BoardUI.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[23] = i;
    	return child_ctx;
    }

    // (71:69) 
    function create_if_block_1(ctx) {
    	let div;

    	let t0_value = (/*board*/ ctx[1].board[/*rowIndex*/ ctx[21]][/*colIndex*/ ctx[23]] == "Hitted"
    	? "X"
    	: "") + "";

    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "ship-tile svelte-gr7vdb");
    			attr_dev(div, "data-row", /*rowIndex*/ ctx[21]);
    			attr_dev(div, "data-col", /*colIndex*/ ctx[23]);
    			add_location(div, file$1, 71, 10, 2104);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*board*/ 2 && t0_value !== (t0_value = (/*board*/ ctx[1].board[/*rowIndex*/ ctx[21]][/*colIndex*/ ctx[23]] == "Hitted"
    			? "X"
    			: "") + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(71:69) ",
    		ctx
    	});

    	return block;
    }

    // (62:8) {#if typeof board.board[rowIndex][colIndex] != "object"}
    function create_if_block(ctx) {
    	let div;

    	let t0_value = (/*board*/ ctx[1].board[/*rowIndex*/ ctx[21]][/*colIndex*/ ctx[23]] == "Hitted"
    	? "X"
    	: "") + "";

    	let t0;
    	let t1;
    	let div_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();

    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*board*/ ctx[1].board[/*rowIndex*/ ctx[21]][/*colIndex*/ ctx[23]] == 1 && /*dragging*/ ctx[0] == true
    			? "enable-tile"
    			: "empty-tile") + " svelte-gr7vdb"));

    			attr_dev(div, "data-row", /*rowIndex*/ ctx[21]);
    			attr_dev(div, "data-col", /*colIndex*/ ctx[23]);
    			add_location(div, file$1, 62, 10, 1686);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "dragover", /*dragover_handler*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*board*/ 2 && t0_value !== (t0_value = (/*board*/ ctx[1].board[/*rowIndex*/ ctx[21]][/*colIndex*/ ctx[23]] == "Hitted"
    			? "X"
    			: "") + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*board, dragging*/ 3 && div_class_value !== (div_class_value = "" + (null_to_empty(/*board*/ ctx[1].board[/*rowIndex*/ ctx[21]][/*colIndex*/ ctx[23]] == 1 && /*dragging*/ ctx[0] == true
    			? "enable-tile"
    			: "empty-tile") + " svelte-gr7vdb"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(62:8) {#if typeof board.board[rowIndex][colIndex] != \\\"object\\\"}",
    		ctx
    	});

    	return block;
    }

    // (61:6) {#each row as col, colIndex}
    function create_each_block_1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (typeof /*board*/ ctx[1].board[/*rowIndex*/ ctx[21]][/*colIndex*/ ctx[23]] != "object") return create_if_block;
    		if (typeof /*board*/ ctx[1].board[/*rowIndex*/ ctx[21]][/*colIndex*/ ctx[23]] == "object") return create_if_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(61:6) {#each row as col, colIndex}",
    		ctx
    	});

    	return block;
    }

    // (60:4) {#each board.board as row, rowIndex}
    function create_each_block(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*row*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*board, dragging, getCoordinates*/ 259) {
    				each_value_1 = /*row*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(60:4) {#each board.board as row, rowIndex}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let div0;
    	let t0;
    	let shipsui;
    	let t1;
    	let div1;
    	let p0;
    	let t2;
    	let p0_class_value;
    	let t3;
    	let p1;
    	let t4;
    	let p1_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*board*/ ctx[1].board;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	shipsui = new ShipUI({
    			props: {
    				ships: /*ships*/ ctx[5],
    				vertical: /*shipVertical*/ ctx[3],
    				onDragShip: /*dragShip*/ ctx[7],
    				offDragShip: /*dropShip*/ ctx[9],
    				count: /*count*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			create_component(shipsui.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t2 = text("Rotate");
    			t3 = space();
    			p1 = element("p");
    			t4 = text("Play");
    			attr_dev(div0, "class", "board-container svelte-gr7vdb");
    			add_location(div0, file$1, 58, 2, 1505);
    			attr_dev(main, "class", "container svelte-gr7vdb");
    			add_location(main, file$1, 57, 0, 1478);

    			attr_dev(p0, "class", p0_class_value = "" + (null_to_empty(/*count*/ ctx[2] == 5
    			? "inactive-button"
    			: "rotate-button") + " svelte-gr7vdb"));

    			add_location(p0, file$1, 86, 2, 2551);

    			attr_dev(p1, "class", p1_class_value = "" + (null_to_empty(/*count*/ ctx[2] == 5
    			? "rotate-button"
    			: "inactive-button") + " svelte-gr7vdb"));

    			add_location(p1, file$1, 87, 2, 2647);
    			set_style(div1, "position", "absolute");
    			set_style(div1, "top", "390px");
    			set_style(div1, "left", "15px");
    			set_style(div1, "display", "flex");
    			add_location(div1, file$1, 85, 0, 2476);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(main, t0);
    			mount_component(shipsui, main, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p0);
    			append_dev(p0, t2);
    			append_dev(div1, t3);
    			append_dev(div1, p1);
    			append_dev(p1, t4);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(p0, "click", /*rotateShips*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*board, dragging, getCoordinates*/ 259) {
    				each_value = /*board*/ ctx[1].board;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const shipsui_changes = {};
    			if (dirty & /*shipVertical*/ 8) shipsui_changes.vertical = /*shipVertical*/ ctx[3];
    			if (dirty & /*count*/ 4) shipsui_changes.count = /*count*/ ctx[2];
    			shipsui.$set(shipsui_changes);

    			if (!current || dirty & /*count*/ 4 && p0_class_value !== (p0_class_value = "" + (null_to_empty(/*count*/ ctx[2] == 5
    			? "inactive-button"
    			: "rotate-button") + " svelte-gr7vdb"))) {
    				attr_dev(p0, "class", p0_class_value);
    			}

    			if (!current || dirty & /*count*/ 4 && p1_class_value !== (p1_class_value = "" + (null_to_empty(/*count*/ ctx[2] == 5
    			? "rotate-button"
    			: "inactive-button") + " svelte-gr7vdb"))) {
    				attr_dev(p1, "class", p1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(shipsui.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(shipsui.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			destroy_component(shipsui);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let shipVertical;
    	let row;
    	let col;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BoardUI', slots, []);
    	let board = new Gameboard();
    	let carrier = new Ship(4, [], false);
    	let battleship = new Ship(4, [], false);
    	let cruiser = new Ship(3, [], false);
    	let submarine = new Ship(2, [], false);
    	let patrol = new Ship(2, [], false);
    	let ships = [carrier, battleship, cruiser, submarine, patrol];
    	let vertical = true;
    	const rotateShips = () => $$invalidate(10, vertical = !vertical);
    	let tileRow = 0;
    	let tileCol = 0;
    	let dragging = false;
    	let count = 0;

    	function dragShip(event) {
    		$$invalidate(0, dragging = true);

    		if (event.target.id == "0") {
    			return ships[0];
    		} else if (event.target.id == "1") {
    			return ships[1];
    		} else if (event.target.id == "2") {
    			return ships[2];
    		} else if (event.target.id == "3") {
    			return ships[3];
    		} else if (event.target.id == "4") {
    			return ships[4];
    		}
    	}

    	function getCoordinates(event) {
    		$$invalidate(11, tileRow = parseInt(event.target.getAttribute("data-row")));
    		$$invalidate(12, tileCol = parseInt(event.target.getAttribute("data-col")));
    	}

    	function dropShip(event) {
    		if (board.isShipPlaceable(dragShip(event), row, col, vertical) == true) {
    			board.placeShip(dragShip(event), row, col, vertical);
    			$$invalidate(1, board);
    			$$invalidate(2, count++, count);
    		}

    		$$invalidate(0, dragging = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<BoardUI> was created with unknown prop '${key}'`);
    	});

    	const dragover_handler = event => getCoordinates(event);

    	$$self.$capture_state = () => ({
    		Gameboard,
    		Ship,
    		ShipsUI: ShipUI,
    		board,
    		carrier,
    		battleship,
    		cruiser,
    		submarine,
    		patrol,
    		ships,
    		vertical,
    		rotateShips,
    		tileRow,
    		tileCol,
    		dragging,
    		count,
    		dragShip,
    		getCoordinates,
    		dropShip,
    		col,
    		row,
    		shipVertical
    	});

    	$$self.$inject_state = $$props => {
    		if ('board' in $$props) $$invalidate(1, board = $$props.board);
    		if ('carrier' in $$props) carrier = $$props.carrier;
    		if ('battleship' in $$props) battleship = $$props.battleship;
    		if ('cruiser' in $$props) cruiser = $$props.cruiser;
    		if ('submarine' in $$props) submarine = $$props.submarine;
    		if ('patrol' in $$props) patrol = $$props.patrol;
    		if ('ships' in $$props) $$invalidate(5, ships = $$props.ships);
    		if ('vertical' in $$props) $$invalidate(10, vertical = $$props.vertical);
    		if ('tileRow' in $$props) $$invalidate(11, tileRow = $$props.tileRow);
    		if ('tileCol' in $$props) $$invalidate(12, tileCol = $$props.tileCol);
    		if ('dragging' in $$props) $$invalidate(0, dragging = $$props.dragging);
    		if ('count' in $$props) $$invalidate(2, count = $$props.count);
    		if ('col' in $$props) col = $$props.col;
    		if ('row' in $$props) $$invalidate(4, row = $$props.row);
    		if ('shipVertical' in $$props) $$invalidate(3, shipVertical = $$props.shipVertical);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*vertical*/ 1024) {
    			$$invalidate(3, shipVertical = vertical);
    		}

    		if ($$self.$$.dirty & /*tileRow*/ 2048) {
    			$$invalidate(4, row = tileRow);
    		}

    		if ($$self.$$.dirty & /*tileCol*/ 4096) {
    			col = tileCol;
    		}

    		if ($$self.$$.dirty & /*dragging*/ 1) {
    			console.log(dragging);
    		}
    	};

    	return [
    		dragging,
    		board,
    		count,
    		shipVertical,
    		row,
    		ships,
    		rotateShips,
    		dragShip,
    		getCoordinates,
    		dropShip,
    		vertical,
    		tileRow,
    		tileCol,
    		dragover_handler
    	];
    }

    class BoardUI extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BoardUI",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.50.1 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let boardui;
    	let current;
    	boardui = new BoardUI({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(boardui.$$.fragment);
    			add_location(main, file, 3, 0, 80);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(boardui, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(boardui.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(boardui.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(boardui);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ BoardUi: BoardUI });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
