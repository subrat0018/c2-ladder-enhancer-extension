(()=>{
    table = document.getElementsByClassName("table")[0];
    header = table.children[0].children[0];
    notesCol = document.createElement("th");
    notesCol.className = header.children[0].className;
    notesCol.innerHTML = "Notes";
    header.appendChild(notesCol);
    let user = "";
    rating = 0;
    let userNotes = [];
    let observer = new MutationObserver((mutationsList, observer)=>{
        new_user = document.getElementsByClassName("col-auto my-auto")[1]?.children[0]?.innerHTML.split(' ')[0];
        ratingBar = document.getElementsByClassName("col-12 col-md-10 col-lg-9 col-xl-8 text-center")[0].children;
        new_rating = rating;
        for(let i=0;i<ratingBar.length;i++){
            if(ratingBar[i].style.backgroundColor != "white"){
                new_rating = parseInt(ratingBar[i].innerHTML);
            }
        }
        // console.log('nu',new_user);
        // console.log('nr',new_rating);
        // console.log('u',user);
        // console.log('r',rating);
        if(new_user && new_rating){
            if(new_user != user || new_rating != rating){
                user = new_user;
                rating = new_rating;
                updateNotes();
            }
        }
    })
    const updateNotes = () =>{
        chrome.storage.local.get([user], (result)=>{
            // console.log(rating);
            // console.log("Resul getting: ", result[user])
            if(!result[user][rating]){
                let notes = Array.from({length: 100}, (_, index)=>({
                    icon: '+',
                    value: '',
                    index: index + 1
                }))
                let dataToStore = {};
                let rating_notes = {};
                rating_notes[rating] = notes;
                dataToStore[user] = {...result[user], ...rating_notes};
                chrome.storage.local.set(dataToStore, ()=>{
                    // console.log(dataToStore);
                    console.log("Data saved successfully");
                });
            }else{
                userNotes = [...result[user][rating]];
                console.log(userNotes);
                loadNotes();
            }
        })
    }  
    const loadNotes = ()=>{
        console.log("Loading Notes....");
        let table_rows = document.querySelector("tbody").children;
        if(table_rows[0].children.length === 5){
            for(let i=0;i<100;i++){
                temp = document.createElement("td");
                temp.className = "text-center";
                temp.innerHTML = `${userNotes[i].icon}`;
                temp.addEventListener("click", (e)=>{
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if(userNotes[i].value){
                        console.log(userNotes[i].value);
                    }else{
                        alert("Hello");
                    }
                })
                table_rows[i].appendChild(temp)
            }
        }else{
            for(let i=0;i<100;i++){
                table_rows[i].children[5].innerHTML = `${userNotes[i].icon}`;
            }
        }
    }

    // Specify the target node and the configuration options
    let targetNode = document.body;

    // The configuration object must be structured properly
    let config = {
    attributes: true, // Observe attribute changes
    childList: true,  // Observe addition or removal of child nodes
    subtree: true     // Observe the target node and its descendants
    };
    console.log(targetNode);
    if(targetNode)
        observer.observe(targetNode, config); 
})();