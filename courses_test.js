// Function to add a new section input field in the modal
function addSection() {
    const container = document.getElementById('sections-container');
    const sectionHtml = `
        <div class="section-group">
            <input type="text" placeholder="Section Name (e.g. Syllabus)" class="section-title">
            <textarea placeholder="Section Content"></textarea>
        </div>`;
    container.insertAdjacentHTML('beforeend', sectionHtml);
}

// Function to collect all sections into a JSON object
function getSectionsJson() {
    const sections = [];
    document.querySelectorAll('.section-group').forEach(group => {
        sections.push({
            title: group.querySelector('.section-title').value,
            content: group.querySelector('textarea').value
        });
    });
    return JSON.stringify(sections);
}