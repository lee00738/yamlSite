import YAML from 'https://cdn.jsdelivr.net/npm/yaml@2.3.1/+esm';


function main() {

    if (localStorage.getItem('lastFile')) {
        const lastFile = JSON.parse(localStorage.getItem('lastFile'));
        console.log("found saved file:");
        console.log(lastFile);
    } 

    document.getElementById('yamlFile').addEventListener('change', function(event) {
        const currentFile = event.target.files[0]
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const yamlText = e.target.result;
    
            document.getElementById('output').textContent = yamlText;
            
            const doc = YAML.parse(yamlText);
            console.log(doc);

            localStorage.setItem('lastFile', JSON.stringify(doc));
        };
    
        reader.readAsText(currentFile);
    });
    

}




document.addEventListener('DOMContentLoaded', main);
