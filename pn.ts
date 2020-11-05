// experiment with Polish Notation (PN)

import { some_basic_definitions } from "./some_basic_definitions.js"
import { tests } from "./tests"

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
export interface EntryArray{
    [key:string]:Entry
}

export class Interpreter{

    public global_scope:VariableArray={}
    words:string[]=[]
    definitions:EntryArray={}
    add_definitions(definition_provider: (interpreter:Interpreter)=>EntryArray):void{
        let definitions_to_add:EntryArray=definition_provider(interpreter);
        this.definitions={ ...this.definitions, ...definitions_to_add }
    }

    run(pn:string){
        let words_array:string[]=program_to_array(pn)//pn.split(" ")
        return this.run_array(words_array)
    }
    run_array(words_array:string[]):any{
        const size_before=this.words.length
        let new_words:string[]=words_array
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
        return JSON.parse(word)//eval(word)
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

export let interpreter=new Interpreter()
interpreter.add_definitions(some_basic_definitions)

export function run(pn:string){
    return interpreter.run(pn)
}

//tests()

export function program_to_array(program:string):string[]{
    function split_quote(str:string):string[]{
        var out=[]
        var word=""
        var ignore_blanks=true
        for(var i=0; i<str.length; i++){
            var current=str[i]
            var is_quote=current==="\"" && ( i>0 && str[i-1] !== "\\" )
            var is_blank=[" ", "\t", "\n"].indexOf(current)!==-1
            
            if(is_quote)  ignore_blanks=!ignore_blanks
            if(is_blank && !ignore_blanks || !is_blank) word+=current
            var terminate_word=(i==str.length-1) || ( is_blank && ignore_blanks &&
                ( i>0 && [" ", "\t", "\n"].indexOf(str[i-1])===-1 ) )
            if(terminate_word){ out.push(word); word="" }
        }
        return out
    }

    var out:string[]=split_quote(program)
    for(var i=0; i<out.length; i++){
        var current=out[i]
        if(typeof current==="string" && current[0]=='"')
            out[i]=current.replace(/\n/g,"\\n")
    }
    return out
}
