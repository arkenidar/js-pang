// experiment with Polish Notation (PN)

pn1='( set "counter" 1 while not greater counter 5 ( print counter set "counter" + 1 counter ) )'

pn2='( set "counter" 1 while not greater counter 5 ( print if multiple counter 2 "multiple_of_2" counter set "counter" + 1 counter ) )'

pn3='( set "counter" 1 while not greater counter 20 ( print if multiple counter 15 "FizzBuzz" if multiple counter 3 "Fizz" if multiple counter 5 "Buzz" counter set "counter" + 1 counter ) )'

run(pn3)

function run(pn){
var words=pn.split(" ")

var definitions={"print":[1,print],"add":[2,add],"+":[2,add],"dont":[1,dont_],"if":[3,if_],"while":[2,while_],}

definitions["multiple"]=[2,multiple]
function multiple(x,y){
    return x%y==0
}

function print(...x){console.log(...x)}
function add(x,y){return x+y}
function dont_(){}
function if_(condition,case_true,case_false){
if(evaluate_word(condition))
    return evaluate_word(case_true)
else
    return evaluate_word(case_false)
}
function while_(condition,do_this){
while(evaluate_word(condition))
    evaluate_word(do_this)
}
definitions["set"]=[2,set]
function set(what,value){
    globalThis[what]=value
}
definitions["lesser"]=[2,lesser]
function lesser(first,second){
    return first<second
}
definitions["greater"]=[2,greater]
function greater(first,second){
    return first>second
}
definitions["not"]=[1,not]
function not(what){
    return !what
}

function phrase_length(word_index){
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

function evaluate_word(word_index){
    var word=words[word_index]
    var definition=definitions[word]
    if(typeof definition!=="undefined"){
        var word_arity=definition[0]
        var word_function=definition[1]
        var args=[],argument_word_index=word_index+1
        for(var argument_index=1; argument_index<=word_arity; argument_index++){
        var argument
        if(word_function.name[word_function.name.length-1]=="_")
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

evaluate_word(0)
}