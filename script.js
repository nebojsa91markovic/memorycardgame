let board = document.querySelector('.board');
let counter = document.querySelector('#counter');
let radios = document.getElementsByName('lvl');
let username = document.querySelector('#username');
username.value = localStorage.getItem("username");
let table = document.querySelector('#resultTable');
let btnTable = document.querySelectorAll('.btnTable');
let difficulty = 'lako';
let tableResArray = [];
var counterWrite = 0;
btnTable.forEach(btn =>{
    btn.addEventListener('click', event =>{
        difficulty = event.target.value;
        tableWrite();
    })
})

function changeResTable(radio){
    return difficulty = radio;
}
let nameTd = document.querySelectorAll('#name');
let timeTd = document.querySelectorAll('#time');
let emptyObj = {};
function tableWrite (){
    let tableResName = 'results_' + difficulty;
    let tableResults = JSON.parse(localStorage.getItem(tableResName));
    if(tableResults == null){
        localStorage.setItem(`${tableResName}`, JSON.stringify(tableResArray));
    }
    tableResults = JSON.parse(localStorage.getItem(tableResName));
        for (let i = 0; i < nameTd.length; i++){
            if(tableResults[i] == undefined){
                nameTd[i].innerHTML = '';
                timeTd[i].innerHTML = '';
                emptyObj = {
                    username: '',
                    time: ''
                };
                tableResults.push(emptyObj)
            }
            else {
                let timeMin = '';
                let mins = Math.floor(tableResults[i].time / 60);
                let secs = tableResults[i].time % 60;
                if (mins < 10) mins = `0${mins}`;
                if (secs < 10) secs = `0${secs}`;
                timeMin = `${mins}:${secs}`;
                counter.value = timeMin;
                nameTd[i].innerHTML = tableResults[i].username;
                timeTd[i].innerHTML = timeMin;
            }
        }
        localStorage.setItem(`${tableResName}`, JSON.stringify(tableResults))
}

tableWrite();

function changeScoreTable() {
    finishedTime = counterWrite;
    let finishedUsername = username.value;
    let timeScores = [];
    let nameScores = [];
    tableResName = 'results_' + difficulty;
    tableResults = JSON.parse(localStorage.getItem(tableResName));
    tableWrite();
    tableResults.forEach(scores => {
        timeScores.push(Number(scores.time));
        nameScores.push(scores.username);
    })
    for(let i = 0; i < timeScores.length; i++){
        let saveScoreToChange = 0;
        let saveNameToChange = '';
        if (timeScores[i] == 0 || timeScores[i] == null){
            timeScores[i] = Number(finishedTime);
            nameScores[i] = finishedUsername;
            finishedTime = '';
            finishedUsername =  '';
        }
        else if(finishedTime <= Number(timeScores[i]) && finishedTime > 0){
            saveScoreToChange = Number(timeScores[i]);
            saveNameToChange = nameScores[i];
            timeScores[i] = Number(finishedTime);
            nameScores[i] = finishedUsername;

            finishedTime = saveScoreToChange;
            finishedUsername =  saveNameToChange;
        }
    }
    for(let j = 0; j < tableResults.length; j++){
        tableResults[j]['username'] = nameScores[j];
        tableResults[j]['time'] = timeScores[j];
    }
    localStorage.setItem(`${tableResName}`, JSON.stringify(tableResults));
    tableWrite();
}

//  Letting Board starts here
let lvl = 0;
let picSize = 0;
let allPics = ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012", "013", "014", "015", "016", "017", "018", "019", "020", "021", "022", "023", "024", "025", "026", "027", "028", "029", "030", "031", "032", "033", "034", "035", "036", "037", "038", "039", "040", "041", "042", "043", "044", "045", "046", "047", "048", "049", "050"]


//  Username input, setting in LocalStorrage and checking for value
username.addEventListener('keyup', event =>{
    if(event.keyCode == 13){
        usernameValidation();
    }
})

function usernameValidation(){
    if(username.value == "" || username.value == null){
        blankName();
    }
    else {
        localStorage.setItem("username", username.value);
        return true;
    }
}

let labels = document.querySelectorAll('.radios label');
//  Radio listeners
if(username.value != null || username.value != '') radioFunc();

function radioFunc() {
radios.forEach(radio =>{
    radio.addEventListener('click', event=>{ 
            let radio = event.target.value;
            if(radio == "lako"){
                lvl = 16;
                picSize = 100/4;
                changeResTable(radio);
                tableWrite();
                createPlayingArray();
            }
            else if(radio == "srednje"){
                lvl = 36;
                picSize = 100/6;
                changeResTable(radio);
                tableWrite();
                createPlayingArray();
            }
            else if(radio == "tesko"){
                lvl = 64;
                picSize = 100/8;
                changeResTable(radio);
                tableWrite();
                createPlayingArray();
            }
            else if(radio == "expert"){
                lvl = 100;
                picSize = 100/10;
                changeResTable(radio);
                tableWrite();
                createPlayingArray();
            }
            arrayForPlaying = arrayForPlaying.sort(() => 0.5 - Math.random());
            createBoard(lvl, picSize);
        })
    })
}

let radio = document.querySelector('input[name="lvl"]:checked');
let timer = null;
let pickedCards = [];
let pickedCardsID = [];
let foundDuplicate = [];
let pickedCard = null;
let secondPick = null;
let arrayForPlaying = [];
let mixedPicsArray = [];
//  Creating Playing Array
function createPlayingArray(){
    mixedPicsArray = allPics.sort(() => 0.5 - Math.random());
    arrayForPlaying = [];
    foundDuplicate = [];
    for(let i = 0; i < lvl/2; i++){
        arrayForPlaying.push(mixedPicsArray[i])
        arrayForPlaying.push(mixedPicsArray[i])
    }
    arrayForPlaying = arrayForPlaying.sort(() => 0.5 - Math.random());
    createBoard(lvl, picSize);
} 

//Creating Board
function createBoard(lvl, picSize) {
    if(usernameValidation()){
        clearInterval(timer);
        counterWrite = 0;
        counter.value = 0;
        board.innerHTML = '';
        board.setAttribute('style', 'background: repeating-linear-gradient(-45deg, transparent, transparent 10px, #ccc 10px, #ccc 20px )')
        for (let i = 0; i < lvl; i++){
            let img = document.createElement('img');
            img.setAttribute('style', `width: ${picSize}%; height: auto;`);
            img.id = i;
            img.name = arrayForPlaying[i];
            img.setAttribute('class', 'card');
            img.src = `images/pokeball.png`
            img.addEventListener('click', turnCard);
            board.appendChild(img);
        }
        timer = setInterval(() =>{
            counterWrite++;
            let counterMinWrite = '';
            let mins = Math.floor(counterWrite / 60);
            let secs = counterWrite % 60;
            if (mins < 10) mins = `0${mins}`;
            if (secs < 10) secs = `0${secs}`;
            counterMinWrite = `${mins}:${secs}`;
            counter.value = counterMinWrite;
        }, 1000)
    }
}

let imgs = document.querySelectorAll('.card');
function turnCard() {
    pickedCard = this.id;
    pickedCards.push(pickedCard)
    this.src = `images/${this.name}.png`;
    //not letting choose the same pic
    if(pickedCards[0] == pickedCards[1]){
        pickedCards = [pickedCards[0]];
    }
    if (pickedCards.length === 2){
        setTimeout(checkForMatch, 300);
    }
}

function checkForMatch (){
    let images = document.querySelectorAll('.card')
    let imageID1 = document.getElementById(`${pickedCards[0]}`);
    let imageID2 = document.getElementById(`${pickedCards[1]}`);
    if (imageID1.name == imageID2.name){
        foundDuplicate.push(imageID2.name);
        foundDuplicate.push(imageID1.name);
        imageID2.removeEventListener('click', turnCard);
        imageID1.removeEventListener('click', turnCard);
    }
    else {
        imageID1.src = 'images/pokeball.png';
        imageID2.src = 'images/pokeball.png';
    }
    if (foundDuplicate.length == lvl){
        changeScoreTable();
        let playAgain = swalConfirm();
    }
    pickedCards = [];
}

//Sweet alert

let swalConfirm = () =>{
    swal({
        title: 'Congratulations!',
        text: 'Do you wish to play again?',
        type: 'success',
        showCancelButton: true,
        confirmButtonColor: 'green',
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No.'
      }).then((result) => {
        if (result.value) {
            foundDuplicate=[];
            createPlayingArray();
        } else {
            foundDuplicate=[];
            clearInterval(timer);
        }
      });
}

let blankName = () =>{
    swal({
        title: 'You must enter some name!',
        input: 'text',
        showCancelButton: true,
        confirmButtonColor: 'green',
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No.'
      }).then((result) => {
        console.log(result)
          if (result.value) {
            username.value = result.value;
            createPlayingArray();
          }
          else {
            console.log(result)
          }
      })
}