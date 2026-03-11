class SuperAdminComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        this.config = {
            url: 'https://qomhhffaetgwjvifgcai.supabase.co',
            key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbWhoZmZhZXRnd2p2aWZnY2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMzY2NjQsImV4cCI6MjA4NjgxMjY2NH0.4Uf9enXmwlMEGZez8E9tNOzfh9AA74qcTUz15yfz1lQ', // Use your full key here
            bucket: 'chapters-pdf'
        };

        this.supabase = window.supabase.createClient(this.config.url, this.config.key);
    }

    async connectedCallback() {
        this.render();
        await this.refreshData('boards');
        this.setupEvents();
    }

    // --- REFRESH DATA ---
    async refreshData(type, parentId = null) {
        // Table name mapping to handle your 'subject' vs 'subjects' mismatch
        const tableName = type === 'subject' ? 'subject' : type; 
        
        let query = this.supabase.from(tableName).select('*');
        if (type === 'standards' && parentId) query = query.eq('board_id', parentId);
        if (type === 'subject' && parentId) query = query.eq('standard_id', parentId);
        
        const { data, error } = await query;
        if (error) console.error(`Error fetching ${type}:`, error);
        this.populateDropdown(type, data || []);
    }

    // --- CRUD ACTIONS ---
    async handleQuickAdd(type, parentIdCol = null, parentId = null) {
        if (parentIdCol && !parentId) return alert(`Please select a parent ${parentIdCol.split('_')[0]} first!`);
        
        const name = prompt(`Enter new ${type} name:`);
        if (!name) return;
        
        const tableName = type === 'subject' ? 'subject' : type;
        const payload = { name };
        if (parentIdCol) payload[parentIdCol] = parentId;

        const { error } = await this.supabase.from(tableName).insert([payload]);
        if (error) alert("Insert Error: " + error.message);
        else await this.refreshData(type, parentId);
    }

    async handleEdit(type, id, parentId = null) {
        if (!id) return alert("Please select an item to edit.");
        const newName = prompt("Enter new name:");
        if (!newName) return;

        const tableName = type === 'subject' ? 'subject' : type;
        const { error } = await this.supabase.from(tableName).update({ name: newName }).eq('id', id);
        
        if (error) alert("Edit Error: " + error.message);
        else await this.refreshData(type, parentId);
    }

    async handleDelete(type, id, parentId = null) {
        if (!id || !confirm("Are you sure? This will delete the item and potentially linked data.")) return;

        const tableName = type === 'subject' ? 'subject' : type;
        const { error } = await this.supabase.from(tableName).delete().eq('id', id);
        
        if (error) alert("Delete Error: " + error.message);
        else await this.refreshData(type, parentId);
    }

    // --- SUBMIT CHAPTER ---
    async handleGlobalSubmit(e) {
        e.preventDefault();
        const btn = this.shadowRoot.querySelector('.submit-btn');
        const fileInput = this.shadowRoot.getElementById('pdf-file');
        const chapterName = this.shadowRoot.getElementById('chapter-name').value;
        const subId = this.shadowRoot.getElementById('subject-select').value;

        if (!subId) return alert("Please select a Subject first!");

        btn.disabled = true;
        btn.textContent = "Uploading & Saving...";

        try {
            let finalUrl = "";

            // 1. Handle File Upload if exists
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const cleanFileName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
                const path = `uploads/${Date.now()}_${cleanFileName}`;

                const { error: uploadError } = await this.supabase.storage
                    .from(this.config.bucket)
                    .upload(path, file);

                if (uploadError) throw uploadError;

                const { data: urlData } = this.supabase.storage
                    .from(this.config.bucket)
                    .getPublicUrl(path);
                
                finalUrl = urlData.publicUrl;
            }

            // 2. Insert into chapters
            const { error: dbError } = await this.supabase.from('chapters').insert([{
                name: chapterName,
                subject_id: subId,
                sub_id: subId, // Matching your schema requirement
                pdf_url: finalUrl
            }]);

            if (dbError) throw dbError;

            alert("Chapter added successfully!");
            this.shadowRoot.getElementById('chapter-form').reset();
        } catch (err) {
            alert("Error: " + err.message);
            console.error(err);
        } finally {
            btn.disabled = false;
            btn.textContent = "SAVE CHAPTER DATA";
        }
    }

    populateDropdown(type, data) {
        const idMap = { 'boards': 'board-select', 'standards': 'standard-select', 'subject': 'subject-select' };
        const el = this.shadowRoot.getElementById(idMap[type]);
        if (!el) return;
        
        el.innerHTML = `<option value="">-- Select ${type} --</option>` + 
            data.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            :host { --primary: #00BFFF; --accent: #FF8C00; font-family: 'Segoe UI', sans-serif; display: block; max-width: 500px; margin: 20px auto; background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid #eee; }
            .header { background: var(--primary); color: white; padding: 20px; border-radius: 12px 12px 0 0; font-size: 1.2rem; text-align: center; font-weight: bold; }
            .p-4 { padding: 20px; }
            .row { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 15px; }
            .flex-1 { flex: 1; }
            label { display: block; font-size: 11px; font-weight: bold; margin-bottom: 4px; color: #555; text-transform: uppercase; }
            select, input { width: 100%; padding: 10px; border: 2px solid #f0f0f0; border-radius: 6px; font-size: 14px; outline: none; }
            select:focus, input:focus { border-color: var(--primary); }
            .btn-group { display: flex; gap: 4px; }
            .icon-btn { cursor: pointer; border: none; background: #f8f9fa; padding: 8px 12px; border-radius: 6px; font-size: 14px; transition: 0.2s; border: 1px solid #ddd; }
            .icon-btn:hover { background: #e9ecef; }
            .btn-add { background: var(--primary); color: white; border-color: var(--primary); }
            .btn-del { color: #ff4d4d; }
            .submit-btn { width: 100%; padding: 14px; background: var(--accent); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 15px; font-size: 15px; }
            .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
            hr { border: 0; border-top: 1px solid #eee; margin: 25px 0; }
        </style>

        <div class="header">Educational Content Admin</div>
        <div class="p-4">
            <div class="row">
                <div class="flex-1"><label>Board</label><select id="board-select"></select></div>
                <div class="btn-group">
                    <button class="icon-btn btn-add" id="add-board">➕</button>
                    <button class="icon-btn" id="edit-board">✏️</button>
                    <button class="icon-btn btn-del" id="del-board">🗑️</button>
                </div>
            </div>

            <div class="row">
                <div class="flex-1"><label>Standard</label><select id="standard-select"></select></div>
                <div class="btn-group">
                    <button class="icon-btn btn-add" id="add-std">➕</button>
                    <button class="icon-btn" id="edit-std">✏️</button>
                    <button class="icon-btn btn-del" id="del-std">🗑️</button>
                </div>
            </div>

            <div class="row">
                <div class="flex-1"><label>Subject</label><select id="subject-select"></select></div>
                <div class="btn-group">
                    <button class="icon-btn btn-add" id="add-sub">➕</button>
                    <button class="icon-btn" id="edit-sub">✏️</button>
                    <button class="icon-btn btn-del" id="del-sub">🗑️</button>
                </div>
            </div>

            <hr>

            <form id="chapter-form">
                <label>Chapter Name</label>
                <div class="row"><input type="text" id="chapter-name" placeholder="E.g. Chapter 1: Fractions" required></div>
                
                <label>Chapter PDF</label>
                <div class="row"><input type="file" id="pdf-file" accept=".pdf"></div>
                
                <button type="submit" class="submit-btn">SAVE CHAPTER DATA</button>
            </form>
        </div>
        `;
    }

    setupEvents() {
        const s = (id) => this.shadowRoot.getElementById(id);
        const getV = (id) => s(id).value;

        // Dropdown Chaining
        s('board-select').onchange = (e) => this.refreshData('standards', e.target.value);
        s('standard-select').onchange = (e) => this.refreshData('subject', e.target.value);

        // CRUD Actions - Board
        s('add-board').onclick = () => this.handleQuickAdd('boards');
        s('edit-board').onclick = () => this.handleEdit('boards', getV('board-select'));
        s('del-board').onclick = () => this.handleDelete('boards', getV('board-select'));

        // CRUD Actions - Standard
        s('add-std').onclick = () => this.handleQuickAdd('standards', 'board_id', getV('board-select'));
        s('edit-std').onclick = () => this.handleEdit('standards', getV('standard-select'), getV('board-select'));
        s('del-std').onclick = () => this.handleDelete('standards', getV('standard-select'), getV('board-select'));

        // CRUD Actions - Subject
        s('add-sub').onclick = () => this.handleQuickAdd('subject', 'standard_id', getV('standard-select'));
        s('edit-sub').onclick = () => this.handleEdit('subject', getV('subject-select'), getV('standard-select'));
        s('del-sub').onclick = () => this.handleDelete('subject', getV('subject-select'), getV('standard-select'));

        s('chapter-form').onsubmit = (e) => this.handleGlobalSubmit(e);
    }
}

customElements.define('super-admin-panel', SuperAdminComponent);