let singers = []

function addSinger(){
    const singerInput = document.getElementById("singer");
    const singerName = singerInput.value.trim();
    if(!singerName){
        alert("Please add a name");
        return;
    }
    const singer = new Singer(singerName);
    singers.push(singer);
    singerInput.value = "";
    showSingers();
}

function showSingers(){
    const singerContainer = document.getElementById("singer-container");
    // clear existing list
    singerContainer.innerHTML = "";
    if(singers.length === 0) return;
    for (const singer of singers){
        const liDiv = document.createElement('div')
        liDiv.className = "li-div"

        const li = document.createElement('li');
        li.id = `singer-${singer.id}`;
        li.className = 'singer-item';
        li.textContent = singer.name;

        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.textContent = 'X';
        closeButton.addEventListener('click', function(){
            const idx = singers.findIndex(s => s.id === singer.id);
            if(idx > -1){
                singers.splice(idx, 1);
                showSingers();
            }
        });
        liDiv.appendChild(li)
        liDiv.appendChild(closeButton);
        singerContainer.appendChild(liDiv);
    }
}

class Singer{
    static idCounter = 0;
    constructor(name){
        this.id = Singer.idCounter++;
        this.name = name;
    }
}

// Attach form submit handler so Enter key triggers addSinger()
document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('singer-form');
    if(form){
        form.addEventListener('submit', function(e){
            e.preventDefault();
            addSinger();
        });
    }
});