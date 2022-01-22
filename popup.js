let loadExtBtn = document.getElementById("load-ext-btn");
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
    loadExtBtn.style.backgroundColor = color;
});
loadExtBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let id = parseInt(String(datalist.value).split("#").pop())
    chrome.scripting.executeScript({
        target: {
            tabId: tab.id
        },
        function: fillForm,
        args: [{ id: id, url: `https://jsonplaceholder.typicode.com/users/${id}` }]
    });
});

const getFormWidgetAttributes = (formWidget) => {
    return [...formWidget.attributes].map(attr => attr.nodeName).map(attr => formWidget.getAttribute(attr)).toString().toLowerCase().replace(/[^a-z]/g, '')
}

const widgetIsForSearchString = (widget, search_strings=[]) => {
    const attributes = getFormWidgetAttributes(widget)
    for (let index = 0; index < search_strings.length; index++) {
        const search_string = array[index];
        if (attributes.includes(search_string)) {
            return true
        }
    }
    return false
}
// The body of this function will be executed as a content script inside the
// current page
const fillForm = (data) => {
    /* data: { id } */
    // get form
    // send form and data to backend
    // get form and data and fill form 
    const forms = document.querySelectorAll("form")
    forms.forEach(form => {
        if (form) {
            const loadButton = document.createElement("button")
            loadButton.style.backgroundColor = "#aaa"
            loadButton.style.color = "#fff"
            loadButton.style.padding = "3px 12px"
            loadButton.style.outline = "none"
            loadButton.style.borderWidth = "0px"
            loadButton.style.margin = "12px 50%"
            loadButton.style.borderRadius = "8px"
            loadButton.innerText = "fill"
            loadButton.addEventListener("click", (e) => {
                e.preventDefault()
                const inputWidgets = form.querySelectorAll("textarea, input, radio, select")
                // convert form to backend format
                fetch(data.url)
                .then(response => response.json())
                .then(json => {
                    // fill form with json
                    alert("Sending form to backend")
                    alert(`Form filled with :${JSON.stringify(json)}`)
                    const code = document.createElement("code")
                    code.innerHTML = JSON.stringify(json, null, 2)
                    inputWidgets.forEach(inputWidget => {
                        if (getFormWidgetAttributes(inputWidget).includes("name")) {
                            inputWidget.value = json.name
                        } else if (getFormWidgetAttributes(inputWidget).includes("surname")) {
                            inputWidget.value = json.name
                        }
                    })
                    form.appendChild(code)
                    form.focus()
                })
                return false
            })
            form.prepend(loadButton)
        }
    })
}



