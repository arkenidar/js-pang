export function console_add(text:string){
    if(typeof document==="undefined") return
    const console_element: any|null=document.getElementById("console")
    console_element.innerText+=text
}