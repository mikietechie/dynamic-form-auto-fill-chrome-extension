let changeColor = document.getElementById("changeColor");
let datalist = document.getElementById("data-select");
fetch('https://jsonplaceholder.typicode.com/users')
.then(response => response.json())
.then(json => {
    json.forEach(e => {
        const option = document.createElement("option")
        option.value = `${e.name} #${e.id}`
        option.innerText = `${e.name} #${e.id}`
        datalist.appendChild(option)
    console.log(e)
    })
})
chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
});
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let id = parseInt(String(datalist.value).split("#").pop())
    chrome.scripting.executeScript({
        target: {
            tabId: tab.id
        },
        function: getForm
    }, (frameResults) => {
        for (const frameResult of frameResults) {
            console.log(frameResult)
            let forms = frameResult.result
            return
            alert("forms ", forms)
            fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
            .then(response => response.json())
            .then(data => {
                // alert(JSON.stringify(json))
                chrome.scripting.executeScript({
                    target: {
                        tabId: tab.id
                    },
                    function: fillForm,
                    args: [data]
                });
            })
        }
    })
});

// The body of this function will be executed as a content script inside the
// current page
const fillForm = (data) => {
    alert(JSON.stringify(data))
}

const getForm = () => {
    return "document.forms"
}



