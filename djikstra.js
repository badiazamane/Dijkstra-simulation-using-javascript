const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

const canv = document.querySelector('canvas');
const context = canv.getContext('2d');
const buttonOne = document.getElementById("buttonOne");
const buttonTwo = document.getElementById("buttonTwo");
const buttonThree = document.getElementById("buttonTree");

let MyGraph={};
let unvisitedVertices={};
let thePreviousvertex={};
var nodes = [];
var edges = [];
var selection = undefined;
var val;
let i=0;
// function for founding the property with its value
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
//  function for generating random values, i have used it here in this application to generate value for edges randomly between 1 and 10
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
//  function to find the selected vertex 
function within(x, y) {
    return nodes.find(n => {
        return x > (n.x - n.radius) && 
            y > (n.y - n.radius) &&
            x < (n.x + n.radius) &&
            y < (n.y + n.radius);
    });
}

function move(e) {
    if (selection && e.buttons) {
        selection.x = e.x-270;
        selection.y = e.y-10;
        draw();
    }
}


function up(e) {
    if (!selection) {
        let node = {
            x: e.x-270,
            y: e.y-10,
            radius: 30,
            font :'18pt Calibri',
            fillText : alphabet[i],
            selectedFill: '#88aaaa',
            strokeStyle: '#020202',
            selected: false
        };
        console.log(node.fillText);
        nodes.push(node);
        MyGraph[nodes[i].fillText]={};
        unvisitedVertices[nodes[i].fillText]=Infinity;
        thePreviousvertex[nodes[i].fillText]=[nodes[i].fillText,0];
        
        draw();
        i+=1;
    }
    if (selection && !selection.selected) {
        selection = undefined;
    }
    draw();
}

// Draw edges between selected Vertices + Drawing Vertices which are stored in the array of objects [{Nodes}]
function draw() {
    context.clearRect(0, 0, canv.width ,  canv.height);

    for (let i = 0; i < edges.length; i++) {
        let fromNode = edges[i].from;
        let toNode = edges[i].to;
        context.beginPath();
        context.strokeStyle = fromNode.strokeStyle;
        context.moveTo(fromNode.x, fromNode.y);
        context.lineTo(toNode.x, toNode.y);
        context.fillText(edges[i].random, ((fromNode.x)+(toNode.x))/2, ((fromNode.y)+(toNode.y))/2);
        context.stroke();
    }

    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        context.beginPath();
        context.fillStyle = node.selected ? node.selectedFill : node.fillStyle;
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2, true);
        context.fillStyle = "#ccc975 ";
        context.strokeStyle = node.strokeStyle;
        context.font = node.font;
        context.fillText(node.fillText, node.x-50, node.y+5);
        context.fill();
        context.stroke();
    }
}

function down(e) {
    let target = within(e.x-270, e.y-10);
    if (selection && selection.selected) {
        selection.selected = false;
    }
    if (target) {
        if (selection && selection !== target) {
            // The weight of the edges is random
            let rand = getRandomArbitrary(1,10);           
            edges.push({ from: selection, to: target ,random:rand});
            if(MyGraph.hasOwnProperty([selection.fillText]))  {
                MyGraph[selection.fillText][[target.fillText]] = rand; 
                MyGraph[target.fillText][[selection.fillText]] = rand; 
            }
        }
        selection = target;
        selection.selected = true;
        draw();
    }
}
buttonOne.addEventListener("click", function() {
    const elements = document.getElementsByClassName("hide");
    
    for (var i = 0; i < elements.length; i++){
    if (elements[i].style.display === 'none') {
        elements[i].style.display = 'block';
    } else {
        elements[i].style.display = 'none';}
    }
});

buttonTwo.addEventListener("click",function(){

    const elements1 = document.getElementsByClassName("hide1");
    for (var i = 0; i < elements1.length; i++){
    if (elements1[i].style.display === 'none') {
        elements1[i].style.display = 'block';
    } else {
        elements1[i].style.display = 'none';}
    }
    const elements = document.getElementsByClassName("hide");
    for (var i = 0; i < elements.length; i++){
        elements[i].style.display = 'none';
    }

    val = document.querySelector('input').value;
    if(unvisitedVertices.hasOwnProperty(val)){
        unvisitedVertices[val]=0;
    }else{"invalid Vertex"};

    console.log("Edges : ",edges);
    console.log("MyGraph : ",MyGraph);
    console.log("Unvisited Vertices : ",unvisitedVertices);
    console.log("The Previous vertex",thePreviousvertex);



// implementation of Djikstra algorithm


while (Object.keys(unvisitedVertices).length !== 0 || unvisitedVertices.constructor !== Object){
    const minDistance =Math.min.apply(Math,Object.values(unvisitedVertices));
    const currentVertex = getKeyByValue(unvisitedVertices,minDistance);
    let theNewDistance=[];
    for (let X of Object.values(MyGraph[currentVertex])) {
        theNewDistance.push(X+unvisitedVertices[currentVertex]);
    }
    let i=0;
    for(let XX of Object.keys(MyGraph[currentVertex])){
        // Edge Relaxation
        if (theNewDistance[i] < unvisitedVertices[XX]) {
            unvisitedVertices[XX]=theNewDistance[i] ;
            thePreviousvertex[XX]=[currentVertex,theNewDistance[i]] ;
        } 
        i++;
    }
    delete unvisitedVertices[currentVertex];

}
for (let Y of Object.keys(thePreviousvertex)){
let tbl = document.getElementById("myTable");
        let row = tbl.insertRow();
        let c1 = row.insertCell();
        let c2 = row.insertCell();
        let c3 = row.insertCell();
        c1.innerHTML =Y;
        c2.innerHTML =thePreviousvertex[Y][0];
        c3.innerHTML =thePreviousvertex[Y][1];
}
const element = document.getElementById("myTable");
if (element.style.display === 'none') {
    element.style.display = 'block';
} else {
    element.style.display = 'none';}

});

// Display and calculate the shortest distance to specific vertex
buttonThree.addEventListener("click",function(){
    context.clearRect(0, 0, canv.width ,  canv.height);
    draw();
    let val1 = document.getElementById("input1").value;      
    
    document.getElementById("info1").innerHTML = ("The shortest distance from the start Vertex to " +val1+" is "+ thePreviousvertex[val1][1]);
    document.getElementById("info2").innerHTML ="Path : "+ val1 +"->";
    let extraLoopCondition=false;
    while((thePreviousvertex[val1][0] !=val && thePreviousvertex[val1][1]!=0 ) || !extraLoopCondition){

        let temp1=(nodes[alphabet.indexOf(val1)]);
        let temp2=(nodes[alphabet.indexOf(thePreviousvertex[val1][0])]);
        
        context.beginPath();
        context.moveTo(temp1.x, temp1.y);
        context.lineTo(temp2.x, temp2.y);
        context.strokeStyle = "#ff0000";
        context.stroke();
        document.getElementById("info2").innerHTML += thePreviousvertex[val1][0] +"->";
        val1 = thePreviousvertex[val1][0];

        if(!(thePreviousvertex[val1][0] !=val && thePreviousvertex[val1][1]!=0 )) {
            let temp1=(nodes[alphabet.indexOf(val1)]);
            let temp2=(nodes[alphabet.indexOf(thePreviousvertex[val1][0])]);
            context.moveTo(temp1.x, temp1.y);
            context.lineTo(temp2.x, temp2.y);
            context.strokeStyle = "#ff0000";
            context.stroke();
            extraLoopCondition = true;
    
        }

    }   
    document.getElementById("info2").innerHTML += val;
});

canv.onmousemove = move;
canv.onmousedown = down;
canv.onmouseup = up;

