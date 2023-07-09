window.addEventListener("load", function () {
                setTimeout(() => {               

                        const main = document.querySelector(".brandname");
                        const cont = document.querySelector(".container")
                        main.style.visibility="hidden";
                        cont.style.visibility="visible"
                        document.querySelector(".name").style.visibility="visible";
                }, 3000);
             })

// calling variables. always assign before use variables so be careful
//as cant access these variable before assigning them so either call them in function or initialise all variables in very begining before writing code, so can use it below anywhere in function and entire codeline so assign them is first thing as done in tutorial but now i know why
let balvalue = document.querySelector("#bal");
let incomevalue = document.querySelector("#rec");
let chart = document.querySelector("#chart");
let spendingvalue = document.querySelector("#spen");
let desc = document.querySelector(".desctext");
let sign = document.querySelector("#sign");

//calling input values
let income = document.querySelector(".text");
let ammount = document.querySelector(".txtvalue");
let type = document.querySelector("#type");
let btn = document.querySelector(".add");

// call element to display list items on diff toggels
let incomelist = document.querySelector(".income");
let withdrawllist = document.querySelector(".withdrawl");
let alltrans = document.querySelector(".alltrans");

//calling togle btn
let incomebtn = document.querySelector(".btnreciept");
let spendingbtn = document.querySelector(".btnspending");
let allbtn = document.querySelector(".alltab");

// togling effect
incomebtn.addEventListener("click",function(){
    hide([withdrawllist,alltrans])
    show(incomelist)
})
spendingbtn.addEventListener("click",function(){
    hide([incomelist,alltrans])
    show(withdrawllist)
})
allbtn.addEventListener("click",function(){
    hide([incomelist,withdrawllist])
    show(alltrans)
})
function hide(arr){
    arr.forEach(element => {
        element.style.visibility = "hidden";       
    });
}
function show(i){
    i.style.visibility = "visible"
}




let entrylist;
//caling list from localstorage so can use in functions, if no data then create an empty list
entrylist = JSON.parse(localStorage.getItem("budgetlist")) || [];


let canvas = document.querySelector("#chart");
//getting display value on load, so call everytime an event accure so be uptodate.
let ctx = canvas.getContext("2d");//as using ctx in this update ui so initialise first before use.


// chart update

// TO DRAW ON CANVAS, WE NEED TO GET CONTEXT OF CANVAS



// CHANGE THE LINE WIDTH
ctx.lineWidth = 20;

// CIRCLE RADIUS
const R = 40;

function drawCircle(color, ratio, anticlockwise){

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc( canvas.width/2, canvas.height/2, R, 0, ratio * 2 * Math.PI, anticlockwise);
    ctx.stroke();
}

function updateChart( income, outcome){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let ratio = income / (income+outcome);

    drawCircle("blue", - ratio, true);
    drawCircle("red", 1 - ratio, false);
}
updateui()

// onclick event
btn.addEventListener("click", function () {
    if(!income.value || !ammount.value || !type.value)return //if any of three value is empty return and close function could have used required as well

    let data = {
        "title": income.value,
        "ammount": ammount.value,
        "type": type.value
    }

    //add this in list
    entrylist.push(data);
    updateui();

    //now done all so clear the prompt
    income.value = "";
    ammount.value = "";
    type.value = "Entry Type";

})

//now work on update ui
function calculate(list, type) {
    let sum = 0 //initial value of sum to zero to add later
    list.forEach(element => {

        //simple for loop would work but foreach remember syntax
        if (element.type == type) { // if data.type == income so add income if spending then spending, will pass them in calling function not now
            sum += Math.floor(element.ammount)
        }

    });
    return sum;
}

// calculate balance
function balance(rec, spen) {
    let balance = 0; // as before add or sub keep it zero as wont affect values but make it integer
    balance = Math.floor(rec - spen);//floor as not to get exponential values
    return balance;
}
//make function to display list items take list to find out, type to separate show items





// function to caste description of account health
function description(a,b){//a is rec, b is spen
    let text = "";
    let account = ""
    if(a>b){
        account = "Surplus";

    }else{
        account = "Deficit"
    }
    if(account == "Surplus"){
        text = "Your Account health is good. You added more Money then your expenditure."
        desc.style.backgroundColor="Green";
    }else{
        text = "Your account health is toward decline. You loosing more money than you added to your account. "
        desc.style.backgroundColor="red";
    }
    return text;

}
    // now create and use update ui function on everytime something loads, del, edit, or entry made
    //not just on onclick as not showing value on load so also call it on load with just after getting data from localstorage
    function updateui() {

        //got values by calculating based on type and function balance based on recipt and spending value
        let rec = calculate(entrylist, "recieved");
        let spen = calculate(entrylist, "spending"); // so calculate values whenever new event happend list updated
        updateChart(rec,spen)

        let bal = balance(rec, spen);
        if (bal < 0) {
            sign.innerHTML = "-"
        } else {
            sign.innerHTML = ""//as to convert back sign to nothing to show pasitive num when value change from negative to positive
        }

        //now changing innerhtml of elements
        balvalue.innerHTML = Math.abs(bal); //will change sign - for negative calculation and use abs value for balance as can be negative not above but here while write
        incomevalue.innerHTML = rec;
        spendingvalue.innerHTML = spen;
        desc.innerHTML = description(rec,spen)
        // add update chart function to but at last

        // clear elements before reinserting 
        clearelement([incomelist,withdrawllist,alltrans])

        //updat list first do it then other things.
        
        entrylist.forEach( (entry, index) => {
            if( entry.type == "spending" ){ 
                showEntry(withdrawllist, entry.type, entry.title, entry.ammount, index)
            }else if( entry.type == "recieved" ){
                showEntry(incomelist, entry.type, entry.title, entry.ammount, index)
            }
            showEntry(alltrans, entry.type, entry.title, entry.ammount, index)
        });

        localStorage.setItem("budgetlist", JSON.stringify(entrylist))
    
        // to create new object we use adjacentadjusthtml, know very little about dom, so now, three month focus on learning, and start project in third month not now as wasting time
    }


function showEntry(list, type, title, amount, id){

    const entry = ` <li id = "${id}" class="${type}">
                        <div class="entry">${title}: <span>&#8377</span> ${amount}</div>
                        <div id="edit"> edit</div>
                        <div id="delete"> del </div>
                    </li>`;

    const position = "afterbegin";

    list.insertAdjacentHTML(position, entry);
    
}

incomelist.addEventListener("click", deleteOrEdit);
withdrawllist.addEventListener("click", deleteOrEdit);
alltrans.addEventListener("click", deleteOrEdit);

// HELPERS

function deleteOrEdit(event){
    const targetBtn = event.target;
  

    const entry = targetBtn.parentNode;
    

    if( targetBtn.id == "delete" ){
        deleteEntry(entry);
    }else if(targetBtn.id == "edit" ){
        editEntry(entry);
    }

}

function deleteEntry(entry){
    entrylist.splice( entry.id, 1);
    updateui();
}

function editEntry(entry){
    
    let ENTRY = entrylist[entry.id];

    

    if(ENTRY.type == "recieved"){
        ammount.value = ENTRY.ammount;
        income.value = ENTRY.title;
        type.value = ENTRY.type;
    }else if(ENTRY.type == "spending"){
        ammount.value = ENTRY.ammount;
        income.value = ENTRY.title;
        type.value = ENTRY.type;
    }

    deleteEntry(entry);
}

// function to clear innerhtml of list so can rescan and recreate list everytime any alteration happened
function clearelement(elements){
    // loop on all element in that elements arr and value = "" each diff class ul elem and all innerhtml to null
    elements.forEach(element => {
        element.innerHTML = ""
        
    });
}

