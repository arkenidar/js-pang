// experiment with Polish Notation (PN)

export function console_add(text:string){
    if(typeof document==="undefined") return
    const console_element: any|null=document.getElementById("console")
    console_element.innerText+=text
}

interface VariableArray{
    [key:string]:any
}

interface Entry{
    [0]:number
    [1]:CallableFunction
}
interface EntryArray{
    [key:string]:Entry
}

class Interpreter{

    public global_scope:VariableArray={}
    words:string[]=[]
    definitions:EntryArray={}
    add_definitions(definition_provider: (interpreter:Interpreter)=>EntryArray):void{
        let definitions_to_add:EntryArray=definition_provider(interpreter);
        this.definitions={ ...this.definitions, ...definitions_to_add }
    }

    run(pn:string){
        const size_before=this.words.length
        let new_words:string[]=pn.split(" ")
        this.words=[...this.words,...new_words]
        return this.evaluate_word(size_before)
    }

    public evaluate_word(word_index:number):any{
        var word:string=this.words[word_index]
        var definition=this.definitions[word]
        if(typeof definition!=="undefined"){
            var word_arity=definition[0]
            var word_function=definition[1]
            var args=[],argument_word_index=word_index+1
            for(var argument_index=1; argument_index<=word_arity; argument_index++){
            var argument
            if(word[word.length-1]=="_")
                argument=argument_word_index
            else
                argument=this.evaluate_word(argument_word_index)
            args.push(argument)
            argument_word_index+=this.phrase_length(argument_word_index)
            }
            return word_function(...args)
        }
        if(word=="("){
            var do_word_index=word_index+1
            while (this.words[do_word_index]!=")") {
                this.evaluate_word(do_word_index)
                do_word_index+=this.phrase_length(do_word_index)
            }
            return
        }
        return eval(word)
    }

    phrase_length(word_index:number){
        var word=this.words[word_index]
        var length=1
        if(this.definitions[word]!==undefined)
            for(var i=0; i<this.definitions[word][0]; i++)
                length+=this.phrase_length(word_index+length)
        else if(word=="(")
            while(true){
                if(this.words[word_index+length]==")"){ length+=1; break }
                length+=this.phrase_length(word_index+length)
            }
        return length
    }
}

let interpreter=new Interpreter()
interpreter.add_definitions(some_basic_definitions)

export function run(pn:string){
    return interpreter.run(pn)
}

export function some_basic_definitions(interpreter: Interpreter):EntryArray{

let definitions:EntryArray={}

definitions={"print":[1,print],"add":[2,add],"+":[2,add],"dont_":[1,dont_],"if_":[3,if_],"while_":[2,while_],}

definitions["multiple"]=[2,multiple]
function multiple(x:number,y:number){
    return x%y==0
}

function print(...x: any[]){
    if(typeof console_add!=="undefined"){
        var text=""
        var args=[...x]
        args.map(e=>e.toString())
        text=args.join(" ")+"\n"
        console_add(text)
    }
    console.log(...x)}
function add(x: number,y: number){return x+y}
function dont_(){}
function if_(condition:number,case_true:number,case_false:number){
if(interpreter.evaluate_word(condition))
    return interpreter.evaluate_word(case_true)
else
    return interpreter.evaluate_word(case_false)
}
function while_(condition:number,do_this:number){
while(interpreter.evaluate_word(condition))
interpreter.evaluate_word(do_this)
}
definitions["set"]=[2,set]
function set(what:string,value:any){
    interpreter.global_scope[what]=value
}
definitions["get"]=[1,get]
function get(what:string):any{
    return interpreter.global_scope[what]
}
definitions["lesser"]=[2,lesser]
function lesser(first:number,second:number){
    return first<second
}
definitions["greater"]=[2,greater]
function greater(first:number,second:number){
    return first>second
}
definitions["not"]=[1,not]
function not(what:boolean){
    return !what
}

return definitions
}

demo()
function demo() {
    const pn1='( set "counter" 1 while_ not greater get "counter" 5 ( print get "counter" set "counter" + 1 get "counter" ) )'

    const pn2='( set "counter" 1 while_ not greater get "counter" 5 ( print if_ multiple get "counter" 2 "multiple_of_2" get "counter" set "counter" + 1 get "counter" ) )'
    
    const pn3='( set "counter" 1 while_ not greater get "counter" 20 ( print if_ multiple get "counter" 15 "FizzBuzz" if_ multiple get "counter" 3 "Fizz" if_ multiple get "counter" 5 "Buzz" get "counter" set "counter" + 1 get "counter" ) )'
    
    run(pn1)
    run(pn2)
    run(pn3)
}
