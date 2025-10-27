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
        displayInfo();
        displayWrongAnswers();
    } 

    document.getElementById('yamlFile').addEventListener('change', readFile); 

}

function displayWrongAnswers() {
    const parsedYaml = JSON.parse(localStorage.getItem(PARSED_YAML_STORAGE_NAME))
    if (!parsedYaml) return []
    
    let wrongAnswers = []
    parsedYaml.feedback.forEach(t => {
        let tt = {
            task: t.task,
            results: []
        };
        
        t.results.forEach(result => {
            if (result.feedback.includes("❌")) {
                tt.results.push(result);
            }
        });

        if (tt.results.length > 0) {
            wrongAnswers.push(tt);
        }
    });
    document.getElementById('wrongAnswersContainer').innerHTML = wrongAnswers.map(t => {
        return `
            <div class="wrongAnswerUnit">
                <p><strong>Task: ${t.task.replace(/-/g, '')}</strong></p>
                ${t.results.map(r => {
                    return (
                        "<p class='feedback'>" + r.feedback + "</p>"
                    )
                }).join('')}
            </div>
        `
    }).join('');


    
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


    document.getElementById('infoContainer').innerHTML = `
        <div class="card">
            <h3>Info:</h3>
            <p class="small"><strong>Course:</strong></p>
            <p>${info.course}</p>
            <p class="small"><strong>Lab:</strong></p>
            <p>${info.lab}</p>
            <p class="small"><strong>Student:</strong></p>
            <p>${info.student}</p>
        </div>
        <div class="card">
            <h3>Points:</h3>
            <div id="points">
                <p>${info.earned_points}</p>
                <p>${info.total_points}</p>
            </div>
            <p class="small"><strong>Percentage:</strong></p>
            <p>${info.grade}</p>
        </div>
    `;

    let conicGrad = `conic-gradient(from 0deg at 50% 50%, rgb(10, 129, 14) 0% ${info.grade}, #d21818 ${info.grade} 100%)`
    document.getElementById('points').style.background = conicGrad;


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
        displayInfo();
        displayWrongAnswers();
    };

    reader.readAsText(currentFile);
}


document.addEventListener('DOMContentLoaded', main);
