document.addEventListener("DOMContentLoaded", function(){
    let count = 2
    let form_button = document.querySelector(".avocado_button");
    form_button.addEventListener('click', function(){
        let week = document.querySelector("input[name='week']").value;
        let name_of = document.querySelector("input[name='name_of']").value;
        let date = document.querySelector("input[name='date']").value;
        let disk = document.querySelector("input[name='disk']").value;
        let type = document.querySelector("input[name='type']").value;


        let new_row = document.createElement('tr');
        new_row.innerHTML = `
                            <td>${week}</td>
                            <td>${name_of}</td>
                            <td>${date}</td>
                            <td><span class="sp_red">${disk}</span></td>
                            <td><span class="sp_green">${type}</span></td>
                            <td></td>
                            `
     let tbody = document.querySelector("table tbody");
    tbody.appendChild(new_row);
    count++;
    })
})