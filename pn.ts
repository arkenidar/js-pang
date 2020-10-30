// experiment with Polish Notation (PN)

import { console_add } from "./console.js";

interface VariableArray{
    [key:string]:any
}
let global_scope:VariableArray={}

demo()
function demo() {
    const pn1='( set "counter" 1 while_ not greater get "counter" 5 ( print get "counter" set "counter" + 1 get "counter" ) )'

    const pn2='( set "counter" 1 while_ not greater get "counter" 5 ( print if_ multiple get "counter" 2 "multiple_of_2" get "counter" set "counter" + 1 get "counter" ) )'
    
    const pn3='( set "counter" 1 while_ not greater get "counter" 20 ( print if_ multiple get "counter" 15 "FizzBuzz" if_ multiple get "counter" 3 "Fizz" if_ multiple get "counter" 5 "Buzz" get "counter" set "counter" + 1 get "counter" ) )'
    
    run(pn1)
    run(pn2)
    run(pn3)        
}

export function run(pn:string){
var words:string[]=pn.split(" ")

interface Entry{
[0]:number
[1]:CallableFunction
}
interface EntryArray{
    [key:string]:Entry
}
var definitions:EntryArray={"print":[1,print],"add":[2,add],"+":[2,add],"dont_":[1,dont_],"if_":[3,if_],"while_":[2,while_],}

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
if(evaluate_word(condition))
    return evaluate_word(case_true)
else
    return evaluate_word(case_false)
}
function while_(condition:number,do_this:number){
while(evaluate_word(condition))
    evaluate_word(do_this)
}
definitions["set"]=[2,set]
function set(what:string,value:any){
    global_scope[what]=value
}
definitions["get"]=[1,get]
function get(what:string):any{
    return global_scope[what]
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

function phrase_length(word_index:number){
    var word=words[word_index]
    var length=1
    if(definitions[word]!==undefined)
        for(var i=0; i<definitions[word][0]; i++)
            length+=phrase_length(word_index+length)
    else if(word=="(")
        while(true){
            if(words[word_index+length]==")"){ length+=1; break }
            length+=phrase_length(word_index+length)
        }
    return length
}

function evaluate_word(word_index:number):any{
    var word:string=words[word_index]
    var definition=definitions[word]
    if(typeof definition!=="undefined"){
        var word_arity=definition[0]
        var word_function=definition[1]
        var args=[],argument_word_index=word_index+1
        for(var argument_index=1; argument_index<=word_arity; argument_index++){
        var argument
        if(word[word.length-1]=="_")
            argument=argument_word_index
        else
            argument=evaluate_word(argument_word_index)
        args.push(argument)
        argument_word_index+=phrase_length(argument_word_index)
        }
        return word_function(...args)
    }
    if(word=="("){
        var do_word_index=word_index+1
        while (words[do_word_index]!=")") {
            evaluate_word(do_word_index)
            do_word_index+=phrase_length(do_word_index)
        }
        return
    }
    return eval(word)
}

return evaluate_word(0)
}