import { console_add } from "./pn.js";
export function some_basic_definitions(interpreter) {
    let definitions = {};
    definitions = { "print": [1, print], "add": [2, add], "+": [2, add], "dont_": [1, dont_], "if_": [3, if_], "while_": [2, while_], };
    definitions["multiple"] = [2, multiple];
    function multiple(x, y) {
        return x % y == 0;
    }
    function print(...x) {
        if (typeof console_add !== "undefined") {
            var text = "";
            var args = [...x];
            args.map(e => e.toString());
            text = args.join(" ") + "\n";
            console_add(text);
        }
        console.log(...x);
    }
    function add(x, y) { return x + y; }
    function dont_() { }
    function if_(condition, case_true, case_false) {
        if (interpreter.evaluate_word(condition))
            return interpreter.evaluate_word(case_true);
        else
            return interpreter.evaluate_word(case_false);
    }
    function while_(condition, do_this) {
        while (interpreter.evaluate_word(condition))
            interpreter.evaluate_word(do_this);
    }
    definitions["set"] = [2, set];
    function set(what, value) {
        interpreter.global_scope[what] = value;
    }
    definitions["get"] = [1, get];
    function get(what) {
        return interpreter.global_scope[what];
    }
    definitions["lesser"] = [2, lesser];
    function lesser(first, second) {
        return first < second;
    }
    definitions["greater"] = [2, greater];
    function greater(first, second) {
        return first > second;
    }
    definitions["not"] = [1, not];
    function not(what) {
        return !what;
    }
    return definitions;
}
