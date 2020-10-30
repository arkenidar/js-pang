// experiment with Polish Notation (PN)
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { console_add } from "./console.js";
var global_scope = {};
demo();
function demo() {
    var pn1 = '( set "counter" 1 while_ not greater get "counter" 5 ( print get "counter" set "counter" + 1 get "counter" ) )';
    var pn2 = '( set "counter" 1 while_ not greater get "counter" 5 ( print if_ multiple get "counter" 2 "multiple_of_2" get "counter" set "counter" + 1 get "counter" ) )';
    var pn3 = '( set "counter" 1 while_ not greater get "counter" 20 ( print if_ multiple get "counter" 15 "FizzBuzz" if_ multiple get "counter" 3 "Fizz" if_ multiple get "counter" 5 "Buzz" get "counter" set "counter" + 1 get "counter" ) )';
    run(pn1);
    run(pn2);
    run(pn3);
}
export function run(pn) {
    var words = pn.split(" ");
    var definitions = { "print": [1, print], "add": [2, add], "+": [2, add], "dont_": [1, dont_], "if_": [3, if_], "while_": [2, while_], };
    definitions["multiple"] = [2, multiple];
    function multiple(x, y) {
        return x % y == 0;
    }
    function print() {
        var x = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            x[_i] = arguments[_i];
        }
        if (typeof console_add !== "undefined") {
            var text = "";
            var args = __spreadArrays(x);
            args.map(function (e) { return e.toString(); });
            text = args.join(" ") + "\n";
            console_add(text);
        }
        console.log.apply(console, x);
    }
    function add(x, y) { return x + y; }
    function dont_() { }
    function if_(condition, case_true, case_false) {
        if (evaluate_word(condition))
            return evaluate_word(case_true);
        else
            return evaluate_word(case_false);
    }
    function while_(condition, do_this) {
        while (evaluate_word(condition))
            evaluate_word(do_this);
    }
    definitions["set"] = [2, set];
    function set(what, value) {
        global_scope[what] = value;
    }
    definitions["get"] = [1, get];
    function get(what) {
        return global_scope[what];
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
    function phrase_length(word_index) {
        var word = words[word_index];
        var length = 1;
        if (definitions[word] !== undefined)
            for (var i = 0; i < definitions[word][0]; i++)
                length += phrase_length(word_index + length);
        else if (word == "(")
            while (true) {
                if (words[word_index + length] == ")") {
                    length += 1;
                    break;
                }
                length += phrase_length(word_index + length);
            }
        return length;
    }
    function evaluate_word(word_index) {
        var word = words[word_index];
        var definition = definitions[word];
        if (typeof definition !== "undefined") {
            var word_arity = definition[0];
            var word_function = definition[1];
            var args = [], argument_word_index = word_index + 1;
            for (var argument_index = 1; argument_index <= word_arity; argument_index++) {
                var argument;
                if (word[word.length - 1] == "_")
                    argument = argument_word_index;
                else
                    argument = evaluate_word(argument_word_index);
                args.push(argument);
                argument_word_index += phrase_length(argument_word_index);
            }
            return word_function.apply(void 0, args);
        }
        if (word == "(") {
            var do_word_index = word_index + 1;
            while (words[do_word_index] != ")") {
                evaluate_word(do_word_index);
                do_word_index += phrase_length(do_word_index);
            }
            return;
        }
        return eval(word);
    }
    return evaluate_word(0);
}
