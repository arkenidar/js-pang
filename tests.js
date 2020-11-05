import { interpreter, run } from "./pn.js";
tests();
export function tests() {
    demo1(interpreter);
    demo2(interpreter);
    function demo1(interpreter) {
        interpreter.run_array(["print",
            '"hello word from language experiment codenamed pang"']);
        const pn1 = '( set "counter" 1 while_ not greater get "counter" 5 ( print get "counter" set "counter" + 1 get "counter" ) )';
        const pn2 = '( set "counter" 1 while_ not greater get "counter" 5 ( print if_ multiple get "counter" 2 "multiple_of_2" get "counter" set "counter" + 1 get "counter" ) )';
        const pn3 = '( set "counter" 1 while_ not greater get "counter" 20 ( print if_ multiple get "counter" 15 "FizzBuzz" if_ multiple get "counter" 3 "Fizz" if_ multiple get "counter" 5 "Buzz" get "counter" set "counter" + 1 get "counter" ) )';
        run(pn1);
        run(pn2);
        run(pn3);
    }
    function demo2(interpreter) {
        var program_string = `(
        print "FizzBuzz test"
        set "counter" 1
        while_ not greater get "counter" 20 (
            print if_ multiple get "counter" 15 "FizzBuzz"
            if_ multiple get "counter" 3 "Fizz"
            if_ multiple get "counter" 5 "Buzz"
            get "counter"
            
            set "counter" + 1 get "counter"
            )
        print "test ended"
        )`;
        //var array: string[] = program_to_array(program_string);
        //interpreter.run_array(array);
        interpreter.run(program_string);
    }
}
