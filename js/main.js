let activeList = []
let masterList = []

/* * * * * * * * * * * * * * * * * * * * LIST GET/SET MANIPULATORS * * * * * * * * * * * * * * * * * * * * */

function getActiveList(){
    //get active list from localstorage (if there)
    tempActiveList = JSON.parse(localStorage.getItem("activeList"))
    if(tempActiveList){
        activeList = tempActiveList;
    }
}

function getMasterList(){
    //get master list from localstorage (if there)
    tempMasterList = JSON.parse(localStorage.getItem("masterList"))
    if(tempMasterList){
        masterList = tempMasterList;
    }
}

function getLists(){
    getActiveList();
    getMasterList();
    
}

function saveMasterList(){
    localStorage.setItem("masterList", JSON.stringify(masterList))
}

function saveActiveList(){
    localStorage.setItem("activeList", JSON.stringify(activeList))
}

function clearActiveList(){
    activeList = []
    saveActiveList()
    showSingers(true);
}

function clearMasterList(){
    masterList = []
    saveMasterList()
}


/* * * * * * * * * * * * * * * * * * * * LIST ITEM MANIPULATORS * * * * * * * * * * * * * * * * * * * * */

function addSingerToMaster(){
    const singerInput = document.getElementById("add-to-master");
    const singerName = singerInput.value.trim();
    if(!singerName){
        alert("Please add a name");
        return;
    }
    pushToMaster(singerName)
    
    //clear the input
    singerInput.value = "";
}

function pushToMaster(singerName){
    const singer = new Singer(singerName);
    //add to master
    masterList.push(singer);

    if(masterList.length > 1){
        masterList.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    }
    
    //add to active
    activeList.push(singer);
    
    //save to local storage
    saveMasterList()
    saveActiveList()

    //update the list shown to the audience
    displayMasterOptions()
    showSingers(true);
}

function deleteFromMaster(){
    console.log("DeleteFromMaster reached")
    const singerSelected = document.getElementById("select-singer").selectedIndex;
    singer = masterList[singerSelected]
    const idx = masterList.findIndex(s => s.id === singer.id);
                if(idx > -1){
                    masterList.splice(idx, 1);
                    saveMasterList()
                    displayMasterOptions()
                }
            }
    

function addSingerToActive(){
    //get the singer from the masterlist dropdown
    const singerSelected = document.getElementById("select-singer").selectedIndex;
    singer = masterList[singerSelected]
    //add it to the active list
    activeList.push(singer)
    //save to local storate
    saveActiveList()
    //update the list shown to the audience
    showSingers(true);
}

/* * * * * * * * * * * * * * * * * * * * DISPLAY SINGERS * * * * * * * * * * * * * * * * * * * * */
function showSingers(location=false){
    const singerContainer = document.getElementById("singer-container");
    // clear existing list
    singerContainer.innerHTML = "";
    getActiveList()
    
    if(activeList.length === 0) return;

    for (const singer of activeList){
        const liDiv = document.createElement('div')
        liDiv.className = "li-div"

        const li = document.createElement('li');
        li.className = 'singer-item';
        li.textContent = singer.name;

        liDiv.appendChild(li)

        if(location === true){
            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.textContent = 'X';
            closeButton.addEventListener('click', function(){
                const idx = activeList.findIndex(s => s.id === singer.id);
                if(idx > -1){
                    activeList.splice(idx, 1);
                    saveActiveList()
                    showSingers(true);
                }
            });
            liDiv.appendChild(closeButton);
        }
        
        singerContainer.appendChild(liDiv);
    }
    const span = document.getElementById("total-count");
    if(span) span.textContent = activeList.length;
}

//function to create the options that fill the Select so dad can choose from the master list
function displayMasterOptions(){
    selectEl = document.getElementById("select-singer")
    selectEl.innerHTML = ""
    for (const singer of masterList){
        const option = document.createElement("option");
        option.value = singer.name;
        selectEl.appendChild(option)
        option.textContent = singer.name;
    }
}

function nextSinger(){

    activeList.push(activeList.splice(0, 1)[0]);
        saveActiveList()
        showSingers(true);
    }


class Singer{
    static idCounter = 0;
    constructor(name){
        this.id = Singer.idCounter++;
        this.name = name;
    }
}

function uploadFile() {
    const fileInput = document.getElementById("files");
    const file = fileInput.files[0];
    
    Papa.parse(file, {
        header: true,
        complete: function(results) {
            const data = results.data;

            for (let item of data) {
                if (item.Name) {
                    pushToMaster(item.Name);
                }
            }
            displayMasterOptions()
            // Now safe to reset and alert
            const form = document.getElementById("csv-form");
            form.reset();
            alert("Singers Added to Master List");
        }
    });
}

