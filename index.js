import YAML from 'https://cdn.jsdelivr.net/npm/yaml@2.3.1/+esm';

const YAML_TEXT_STORAGE_NAME = 'yamlText';
const PARSED_YAML_STORAGE_NAME = 'parsedYaml';


function main() {
    
    // Set up output section
    let outputSection = document.getElementById('rawOutput')
    outputSection.textContent = "No file loaded.";

    outputSection.addEventListener('click', (e) => {
        // console.log("toggling expanded");
        e.target.classList.toggle('expanded')
    });

    // Check for saved file in localStorage
    if (localStorage.getItem(YAML_TEXT_STORAGE_NAME)) {
        // console.log("found saved text:");
        let storedText = localStorage.getItem(YAML_TEXT_STORAGE_NAME);
        console.log(YAML.parse(storedText));
        displayYamlText(storedText);
    } 

    document.getElementById('yamlFile').addEventListener('change', readFile); 

    displayInfo();
}



function displayInfo() {
    const parsedYaml = JSON.parse(localStorage.getItem(PARSED_YAML_STORAGE_NAME))
    if (!parsedYaml) return

    const info = {
        course: parsedYaml.course.course_name,
        student: parsedYaml.lab.student,
        lab: parsedYaml.lab.lab_name,
        total_points: parsedYaml.lab.total_points,
        earned_points: parsedYaml.lab.earned_points,
        deduction: parsedYaml.lab.deduction,
        extra_points: parsedYaml.lab.extra_points,
        adjusted_points: parsedYaml.lab.adjusted_points,
        grade: parsedYaml.lab.lab_grade,
    }

    document.getElementById('infoContainer').innerHTML = Object.entries(info).map(e => {
        return `
        <p class="card"><strong>${e[0].replaceAll('_', ' ').toUpperCase()}:</strong> ${e[1]}</p>`
    }).join('');

    // console.log(info);
    // Object.entries(info).forEach(e => {
    //     console.log(e);
    // });

}



function displayYamlText(t) {
    document.getElementById('rawOutput').textContent = t; 
}


function readFile(event) {
    console.log("new file added");
    const currentFile = event.target.files[0]

    const reader = new FileReader();
    reader.onload = (e) => {

        const yamlText = e.target.result;
        localStorage.setItem(YAML_TEXT_STORAGE_NAME, yamlText);

        displayYamlText(yamlText);
        
        const doc = YAML.parse(yamlText);
        localStorage.setItem(PARSED_YAML_STORAGE_NAME, JSON.stringify(doc));
        console.log(doc);
    };

    reader.readAsText(currentFile);
}


document.addEventListener('DOMContentLoaded', main);
