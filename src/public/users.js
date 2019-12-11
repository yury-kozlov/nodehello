const port = 3001;

(async function () {
    function createNode(element) {
        return document.createElement(element);
    }

    function append(parent, el) {
        return parent.appendChild(el);
    }

    //let api = `http://localhost:${port}/api/users`;
    let api = `/api/users`;
    let contanier = document.getElementById("users");
    let response = await fetch(api);
    let people = await response.json();
    people.map((user) => {
        const userNameHtml = createNode('span');
        userNameHtml.className = 'user-name'
        userNameHtml.innerHTML = user.name;

        let emailHtml = createNode('span');
        emailHtml.className = 'user-email'
        emailHtml.innerHTML = user.email;

        const userHtml = createNode('div');
        append(userHtml, userNameHtml);
        append(userHtml, emailHtml);
        append(contanier, userHtml);
    });
})()