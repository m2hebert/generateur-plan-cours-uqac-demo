(() => {
  "use strict";

  const STORAGE_KEY = "uqac-course-plan-draft-v2";
  const sections = [
    { id: 1, title: "Présentation de la personne enseignante", required: false },
    { id: 2, title: "Identification du cours", required: true },
    { id: 3, title: "Description du cours", required: true },
    { id: 4, title: "Formule pédagogique", required: true },
    { id: 5, title: "Activités d’enseignement et d’apprentissage", required: true },
    { id: 6, title: "Modalités de communications et d’encadrement", required: false },
    { id: 7, title: "Dates importantes", required: true },
    { id: 8, title: "Calendrier du cours", required: true },
    { id: 9, title: "Utilisation de l’intelligence artificielle (IAg) dans le cadre du cours", required: false },
    { id: 10, title: "Évaluations", required: true },
    { id: 11, title: "Système de notation", required: false },
    { id: 12, title: "Droit d’auteur et propriété intellectuelle du matériel", required: false },
    { id: 13, title: "Services offerts à l’UQAC", required: false },
    { id: 14, title: "Politique pour promouvoir la civilité, prévenir et contrer la discrimination, le harcèlement et la violence", required: false },
    { id: 15, title: "Exigences de formation", required: true },
    { id: 16, title: "Bibliographie", required: true }
  ];

  const tableDefinitions = {
    synoptic: {
      label: "Vue synoptique",
      columns: [
        { key: "objective", label: "Objectifs" },
        { key: "content", label: "Contenu essentiel", multiline: true },
        { key: "strategy", label: "Stratégie d’enseignement et d’apprentissage", multiline: true },
        { key: "formative", label: "Évaluation formative", multiline: true },
        { key: "summative", label: "Évaluation sommative (%)" }
      ]
    },
    calendar: {
      label: "Calendrier du cours",
      columns: [
        { key: "session", label: "Séance" },
        { key: "date", label: "Date", type: "date" },
        { key: "modality", label: "Modalité" },
        { key: "themes", label: "Thèmes ou contenus abordés", multiline: true },
        { key: "activities", label: "Activités prévues en séance", multiline: true },
        { key: "preparation", label: "Activités préparatoires, lectures, travaux ou évaluations", multiline: true }
      ]
    },
    iaUses: {
      label: "Utilisation de l’IAg",
      columns: [
        { key: "activity", label: "Travail ou activité" },
        { key: "authorization", label: "Utilisation permise", options: ["", "Interdite", "Autorisée", "Autorisée sous conditions"] },
        { key: "conditions", label: "Niveau, conditions et règles de déclaration", multiline: true }
      ]
    },
    evaluations: {
      label: "Évaluations",
      columns: [
        { key: "name", label: "Évaluation" },
        { key: "target", label: "Objectifs ou contenus ciblés", multiline: true },
        { key: "weight", label: "Pondération (%)", type: "number", min: 0, max: 100, step: 0.1 },
        { key: "team", label: "Équipe ou individuelle", options: ["", "Individuelle", "Équipe"] },
        { key: "date", label: "Date de remise ou réalisation", type: "date" },
        { key: "criteria", label: "Critères (s’il y a lieu)", multiline: true },
        { key: "iag", label: "Niveau d’utilisation des IAg permis", options: ["", "Interdite", "Autorisée", "Autorisée sous conditions"] }
      ]
    },
    grades: {
      label: "Échelle de notation",
      columns: [
        { key: "grade", label: "Cote" },
        { key: "range", label: "Intervalle de résultat" }
      ]
    },
    bibliography: {
      label: "Bibliographie",
      columns: [
        { key: "author", label: "Auteur(s)" },
        { key: "year", label: "Année" },
        { key: "title", label: "Titre", multiline: true },
        { key: "source", label: "Publication / éditeur / référence", multiline: true },
        { key: "url", label: "URL ou DOI" }
      ]
    }
  };

  const defaultTables = {
    synoptic: Array.from({ length: 6 }, () => ({})),
    calendar: [],
    iaUses: [],
    evaluations: [],
    grades: [
      { grade: "A+", range: "95 à 100" }, { grade: "A", range: "90 à 94" }, { grade: "A-", range: "87 à 89" },
      { grade: "B+", range: "84 à 86" }, { grade: "B", range: "80 à 83" }, { grade: "B-", range: "77 à 79" },
      { grade: "C+", range: "74 à 76" }, { grade: "C", range: "70 à 73" }, { grade: "C-", range: "67 à 69" },
      { grade: "D+", range: "64 à 66" }, { grade: "D", range: "60 à 63" }, { grade: "E", range: "59 et moins" },
      { grade: "I", range: "Incomplet" }
    ],
    bibliography: []
  };
  const communicationTemplate = `Lorsque la personne enseignante souhaite communiquer avec l’ensemble du groupe, elle utilise l’outil « Annonces » du site Moodle du cours. Pour les communications individuelles, elle privilégie les adresses courriel institutionnelles UQAC.

Les personnes étudiantes qui souhaitent communiquer avec la personne enseignante peuvent la joindre par courriel à l’adresse indiquée dans le plan de cours. Elles peuvent généralement s’attendre à une réponse dans un délai de 24 heures les jours ouvrables. Les messages reçus entre le vendredi après-midi et le dimanche peuvent recevoir une réponse le lundi.

Des rencontres individuelles ou de groupe, en présence ou à distance, peuvent être organisées sur demande, formulée pendant le cours ou par courriel.`;

  const form = document.querySelector("#courseForm");
  const sectionList = document.querySelector("#sectionList");
  const objectivesList = document.querySelector("#objectivesList");
  const printDocument = document.querySelector("#printDocument");
  const saveStatus = document.querySelector("#saveStatus");
  const validationSummary = document.querySelector("#validationSummary");
  const startPanel = document.querySelector("#startPanel");
  const importPanel = document.querySelector("#importPanel");
  const appWorkspace = document.querySelector("#appWorkspace");
  const importAppliedNotice = document.querySelector("#importAppliedNotice");
  let state = {
    fields: {},
    objectives: [""],
    tables: structuredClone(defaultTables),
    activeSections: sections.filter(section => section.required || section.id === 1).map(section => section.id)
  };
  let saveTimeout;

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function legacyCommunicationText(rows) {
    const labels = {
      type: "Type de communication",
      teacher: "Personnes enseignantes",
      student: "Personnes étudiantes",
      means: "Moyens",
      environment: "Application / environnement"
    };
    return rows.map(row => Object.entries(labels)
      .filter(([key]) => String(row[key] ?? "").trim())
      .map(([key, label]) => `${label} : ${String(row[key]).trim()}`)
      .join("; "))
      .filter(Boolean)
      .join("\n\n");
  }

  function loadDraft() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== "object") return;
      state.fields = parsed.fields && typeof parsed.fields === "object" ? parsed.fields : {};
      state.objectives = Array.isArray(parsed.objectives) ? parsed.objectives.slice(0, 5).map(String) : [""];
      state.tables = { ...structuredClone(defaultTables), ...(parsed.tables && typeof parsed.tables === "object" ? parsed.tables : {}) };
      if (!String(state.fields.communicationModalities ?? "").trim() && Array.isArray(state.tables.communications)) {
        state.fields.communicationModalities = legacyCommunicationText(state.tables.communications);
      }
      delete state.tables.communications;
      for (const [key, rows] of Object.entries(state.tables)) {
        if (!Array.isArray(rows)) state.tables[key] = [];
      }
      const validIds = new Set(sections.map(section => section.id));
      const selected = Array.isArray(parsed.activeSections) ? parsed.activeSections.filter(id => validIds.has(id)) : [];
      state.activeSections = sections.filter(section => section.required || selected.includes(section.id)).map(section => section.id);
    } catch (error) {
      console.error("Impossible de lire le brouillon local.", error);
      saveStatus.textContent = "Le brouillon local n’a pas pu être lu";
    }
  }

  function saveDraft() {
    state.fields = Object.fromEntries(new FormData(form).entries());
    state.objectives = Array.from(objectivesList.querySelectorAll("input"), input => input.value);
    for (const container of form.querySelectorAll("[data-table]")) {
      state.tables[container.dataset.table] = readTable(container);
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      saveStatus.textContent = "Brouillon enregistré localement";
    } catch (error) {
      console.error("Impossible d’enregistrer le brouillon local.", error);
      saveStatus.textContent = "Sauvegarde locale indisponible";
    }
  }

  function queueSave() {
    saveStatus.textContent = "Enregistrement…";
    window.clearTimeout(saveTimeout);
    saveTimeout = window.setTimeout(saveDraft, 180);
  }

  function restoreFields() {
    for (const [name, value] of Object.entries(state.fields)) {
      const control = form.querySelector(`[name="${CSS.escape(name)}"]`);
      if (!control) continue;
      if (control.type === "checkbox") control.checked = value === control.value;
      else control.value = value;
    }
    if (state.fields.credits !== undefined && state.fields.teachingHours === undefined) {
      form.elements.teachingHours.value = Number(state.fields.credits) * 15;
      form.elements.personalHours.value = Number(state.fields.credits) * 30;
    }
  }

  function renderSectionToggles() {
    sectionList.innerHTML = sections.map(section => `
      <div class="section-toggle">
        <label>
          <input type="checkbox" data-section-id="${section.id}" ${state.activeSections.includes(section.id) ? "checked" : ""} ${section.required ? "disabled" : ""}>
          <span>${String(section.id).padStart(2, "0")}. ${escapeHtml(section.title)}</span>
          ${section.required ? '<span class="toggle-star" aria-label="obligatoire">*</span>' : ""}
        </label>
        <a href="#section-${section.id}" aria-label="Aller à la section ${section.id}">Ouvrir</a>
      </div>
    `).join("");
  }

  function renderObjectives(values = null) {
    const current = values || Array.from(objectivesList.querySelectorAll("input"), input => input.value);
    const items = current.length ? current : [""];
    objectivesList.innerHTML = items.map((value, index) => `
      <div class="objective-row">
        <span class="objective-number" aria-hidden="true">${index + 1}.</span>
        <input type="text" aria-label="Objectif spécifique ${index + 1}" ${index === 0 ? "required" : ""} placeholder="Verbe d’action + contenu ou objet d’apprentissage" value="${escapeHtml(value)}">
        <button type="button" data-remove-objective="${index}" aria-label="Supprimer l’objectif ${index + 1}" ${items.length === 1 ? "disabled" : ""}>×</button>
      </div>
    `).join("");
    document.querySelector("#addObjective").disabled = items.length >= 5;
  }

  function renderSectionTable(container) {
    const key = container.dataset.table;
    const definition = tableDefinitions[key];
    const rows = state.tables[key] || [];
    const header = definition.columns.map(column => `<th scope="col">${escapeHtml(column.label)}</th>`).join("");
    const body = rows.map((row, rowIndex) => `
      <tr>
        ${definition.columns.map(column => {
          const value = row[column.key] || "";
          const aria = `${column.label}, ligne ${rowIndex + 1}`;
          if (column.options) {
            return `<td><select data-table-key="${key}" data-row-index="${rowIndex}" data-column="${column.key}" aria-label="${escapeHtml(aria)}">${column.options.map(option => `<option value="${escapeHtml(option)}" ${value === option ? "selected" : ""}>${escapeHtml(option || "Choisir…")}</option>`).join("")}</select></td>`;
          }
          const tag = column.multiline ? "textarea" : "input";
          const type = column.type || "text";
          const attrs = column.multiline ? 'rows="2"' : `type="${type}"`;
          const bounds = column.min === undefined ? "" : ` min="${column.min}" max="${column.max}" step="${column.step}"`;
          return `<td><${tag} ${attrs}${bounds} data-table-key="${key}" data-row-index="${rowIndex}" data-column="${column.key}" aria-label="${escapeHtml(aria)}" value="${tag === "input" ? escapeHtml(value) : ""}">${tag === "textarea" ? escapeHtml(value) : ""}</${tag}></td>`;
        }).join("")}
        <td class="table-actions"><button type="button" data-remove-row="${rowIndex}" data-table-key="${key}" aria-label="Supprimer la ligne ${rowIndex + 1} de ${escapeHtml(definition.label)}">×</button></td>
      </tr>
    `).join("");
    container.innerHTML = `<div class="table-wrap"><table class="data-table"><caption>${escapeHtml(definition.label)}</caption><thead><tr>${header}<th class="actions-heading" scope="col"><span class="visually-hidden">Actions</span></th></tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function readTable(container) {
    const key = container.dataset.table;
    const definition = tableDefinitions[key];
    const rows = Array.from(container.querySelectorAll("tbody tr"));
    return rows.map(row => Object.fromEntries(definition.columns.map(column => {
      const control = row.querySelector(`[data-column="${CSS.escape(column.key)}"]`);
      return [column.key, control ? control.value : ""];
    })));
  }

  function renderTables() {
    for (const container of form.querySelectorAll("[data-table]")) renderSectionTable(container);
  }

  function text(value, empty = "À compléter") {
    const normalized = String(value ?? "").trim();
    return normalized ? escapeHtml(normalized) : `<span class="document-placeholder">${empty}</span>`;
  }

  function paragraph(label, value) {
    return `<p class="document-label">${escapeHtml(label)}</p><p>${text(value)}</p>`;
  }

  function tableRows(key, includeEmpty = false) {
    const rows = state.tables[key] || [];
    return includeEmpty ? rows : rows.filter(row => Object.values(row).some(value => String(value || "").trim()));
  }

  function htmlTable(key) {
    const definition = tableDefinitions[key];
    const rows = tableRows(key);
    return `<div class="document-table-wrap"><table class="document-table"><thead><tr>${definition.columns.map(column => `<th scope="col">${escapeHtml(column.label)}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${definition.columns.map(column => `<td>${text(row[column.key], "—")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }

  function makePrintableSection(section) {
    const clone = section.cloneNode(true);
    const sectionNumber = section.id.match(/^section-(\d+)$/)?.[1];
    clone.removeAttribute("id");
    clone.classList.add("document-section");
    if (sectionNumber) {
      clone.querySelector(".section-index")?.remove();
      const heading = clone.querySelector(".form-section-heading h3");
      if (heading) {
        const documentHeading = document.createElement("h2");
        documentHeading.textContent = `${Number(sectionNumber)}. ${heading.textContent.trim()}`;
        heading.replaceWith(documentHeading);
      }
    }
    clone.querySelectorAll("[id]").forEach(element => element.removeAttribute("id"));
    clone.querySelectorAll(".section-description, .section-kind, .field-note, button, .validation-message").forEach(element => element.remove());
    clone.querySelectorAll(".check-field").forEach(element => element.remove());
    clone.querySelectorAll("[hidden]").forEach(element => element.remove());
    clone.querySelectorAll(".table-actions, .actions-heading").forEach(element => element.remove());
    clone.querySelectorAll("input, textarea, select").forEach(control => {
      const value = control.tagName === "SELECT" ? control.selectedOptions[0]?.textContent : control.value;
      const output = document.createElement("span");
      output.className = `print-value${control.tagName === "TEXTAREA" ? " print-multiline" : ""}`;
      output.textContent = value?.trim() || "À compléter";
      control.replaceWith(output);
    });
    return clone.outerHTML;
  }

  function renderPreview() {
    const values = Object.fromEntries(new FormData(form).entries());
    const cover = `
      <header class="document-cover">
        <div class="document-brand"><img src="assets/uqac-logo.jpg" alt="Université du Québec à Chicoutimi"></div>
        <div class="cover-unit">
          <p>${text(values.module, "Module ou unité")}</p>
          <p>${text(values.department, "Département")}</p>
        </div>
        <div class="cover-title">
          <h1>Plan de cours</h1>
          <p class="cover-course-name">${text(values.courseName, "Nom du cours")}</p>
        </div>
        <dl class="document-course-meta cover-course-meta">
          <div><dt>Sigle</dt><dd>${text(values.courseCode)}</dd></div>
          <div><dt>Numéro du groupe</dt><dd>${text(values.group)}</dd></div>
          <div><dt>Trimestre</dt><dd>${text(values.term)}</dd></div>
          <div><dt>Local ou lien Zoom</dt><dd>${text(values.location)}</dd></div>
        </dl>
        <section class="cover-contact" aria-label="Coordonnées de la personne enseignante">
          <h2>Coordonnées:</h2>
          <p><span>Nom, Prénom</span><strong>${text(values.teacherName)}</strong></p>
          <p><span>Local pour les rendez-vous (si applicable)</span><strong>${text(values.teacherOffice)}</strong></p>
          <p><span>Heures de disponibilités</span><strong>${text(values.teacherAvailability)}</strong></p>
          <p><span>Adresse courriel</span><strong>${text(values.teacherEmail)}</strong></p>
        </section>
      </header>`;
    const synopsis = makePrintableSection(form.querySelector("#synoptic"));
    const content = sections.filter(section => state.activeSections.includes(section.id))
      .map(section => makePrintableSection(form.querySelector(`#section-${section.id}`))).join("");
    printDocument.innerHTML = `${cover}${synopsis}${content}`;
    document.querySelector("#synopticObjective").textContent = values.generalObjective?.trim() || "À compléter dans la section 3.";
    updateProgress(values);
    updateEvaluationTotal();
  }

  function present(value) {
    return String(value ?? "").trim().length > 0;
  }

  function completeRows(key, requiredColumns) {
    return tableRows(key).filter(row => requiredColumns.every(column => present(row[column])));
  }

  function updateProgress(values) {
    const objectives = Array.from(objectivesList.querySelectorAll("input"), input => input.value.trim()).filter(Boolean);
    const dates = ["courseStart", "cancelDeadline", "withdrawDeadline", "courseEnd", "termEnd"].every(name => present(values[name]));
    const assessments = tableRows("evaluations");
    const assessmentTotal = assessments.reduce((sum, row) => sum + (Number(row.weight) || 0), 0);
    const completion = {
      1: !state.activeSections.includes(1) || present(values.teacherBio),
      2: present(values.module) && present(values.department) && present(values.courseName) &&
        present(values.courseCode) && present(values.group) && present(values.term) &&
        present(values.location) && present(values.courseStatus) && present(values.courseLinks),
      3: present(values.generalObjective) && objectives.length > 0,
      4: present(values.teachingFormat) && present(values.credits),
      5: present(values.learningActivities),
      6: !state.activeSections.includes(6) || present(values.communicationModalities),
      7: dates,
      8: completeRows("calendar", ["session", "date", "modality", "themes", "activities", "preparation"]).length > 0,
      9: !state.activeSections.includes(9) || present(values.iagPolicy) || tableRows("iaUses").length > 0,
      10: assessments.length > 0 && Math.abs(assessmentTotal - 100) < 0.001,
      11: !state.activeSections.includes(11) || present(values.passingGrade),
      12: true,
      13: true,
      14: true,
      15: present(values.languageQuality) && present(values.policyReferences) && present(values.presentationRules) &&
        present(values.lateRules) && present(values.ticLevel),
      16: completeRows("bibliography", ["author", "year", "title", "source"]).length > 0
    };
    const relevantSections = sections.filter(section => section.required || state.activeSections.includes(section.id));
    const count = relevantSections.filter(section => completion[section.id]).length;
    document.querySelector("#progressLabel").textContent = `${count} / ${relevantSections.length} sections complétées`;
    document.querySelector("#progressBar").style.width = `${count / relevantSections.length * 100}%`;
  }

  function updateEvaluationTotal() {
    const rows = tableRows("evaluations");
    const total = rows.reduce((sum, row) => sum + (Number(row.weight) || 0), 0);
    document.querySelector("#evaluationTotal").textContent = `${Number(total.toFixed(2))} %`;
    const validation = document.querySelector("#evaluationValidation");
    const complete = rows.length > 0 && Math.abs(total - 100) < 0.001;
    validation.textContent = complete ? "La pondération totale est de 100 %." : "Les évaluations doivent totaliser 100 %.";
    validation.classList.toggle("valid", complete);
  }

  function updateWorkload() {
    const teaching = Number(form.elements.teachingHours.value) || 0;
    const personal = Number(form.elements.personalHours.value) || 0;
    const total = teaching + personal;
    document.querySelector("#workloadTotal").textContent = `${total} ${total === 1 ? "heure" : "heures"}`;
  }

  function updateConditionalBlocks() {
    for (const block of form.querySelectorAll("[data-condition]")) {
      if (block.dataset.condition === "hasBibliographyLinks") {
        block.hidden = !tableRows("bibliography").some(row => present(row.url));
        continue;
      }
      const control = form.elements.namedItem(block.dataset.condition);
      const matches = control instanceof HTMLInputElement && control.type === "checkbox"
        ? control.checked
        : control && (block.dataset.conditionValue ? control.value === block.dataset.conditionValue : Boolean(control.value));
      block.hidden = !matches;
    }
  }

  function handleSectionChange(event) {
    const checkbox = event.target.closest("[data-section-id]");
    if (!checkbox || checkbox.disabled) return;
    const id = Number(checkbox.dataset.sectionId);
    if (checkbox.checked && !state.activeSections.includes(id)) state.activeSections.push(id);
    if (!checkbox.checked) state.activeSections = state.activeSections.filter(sectionId => sectionId !== id);
    renderPreview();
    queueSave();
  }

  function handleTableInput(event) {
    const control = event.target.closest("[data-table-key][data-column]");
    if (!control) return;
    const { tableKey, rowIndex, column } = control.dataset;
    const row = state.tables[tableKey]?.[Number(rowIndex)];
    if (row) row[column] = control.value;
    renderPreview();
    queueSave();
  }

  function handleObjectiveClick(event) {
    const removeButton = event.target.closest("[data-remove-objective]");
    if (removeButton) {
      const values = Array.from(objectivesList.querySelectorAll("input"), input => input.value);
      if (values.length > 1) {
        values.splice(Number(removeButton.dataset.removeObjective), 1);
        state.objectives = values;
        renderObjectives(values);
        renderPreview();
        queueSave();
      }
      return;
    }
    if (event.target.closest("#addObjective")) {
      const values = Array.from(objectivesList.querySelectorAll("input"), input => input.value);
      if (values.length >= 5) return;
      values.push("");
      state.objectives = values;
      renderObjectives(values);
      objectivesList.lastElementChild.querySelector("input").focus();
      queueSave();
    }
  }

  function handleTableClick(event) {
    const addButton = event.target.closest("[data-add-row]");
    if (addButton) {
      const key = addButton.dataset.addRow;
      state.tables[key].push({});
      renderSectionTable(form.querySelector(`[data-table="${CSS.escape(key)}"]`));
      form.querySelector(`[data-table="${CSS.escape(key)}"] tbody tr:last-child [data-column]`)?.focus();
      queueSave();
      return;
    }
    const removeButton = event.target.closest("[data-remove-row]");
    if (!removeButton) return;
    const key = removeButton.dataset.tableKey;
    state.tables[key].splice(Number(removeButton.dataset.removeRow), 1);
    renderSectionTable(form.querySelector(`[data-table="${CSS.escape(key)}"]`));
    renderPreview();
    queueSave();
  }

  function validateTableRows(key, requiredColumns, label, sectionId, errors) {
    const rows = tableRows(key);
    if (!rows.length) {
      errors.push({ sectionId, message: `Ajoutez au moins une ligne dans « ${label} ».` });
      return [];
    }
    const incomplete = rows.findIndex(row => !requiredColumns.every(column => present(row[column])));
    if (incomplete >= 0) errors.push({ sectionId, message: `Complétez tous les champs de la ligne ${incomplete + 1} de « ${label} ».` });
    return rows;
  }

  function collectValidationErrors() {
    const errors = [];
    const values = Object.fromEntries(new FormData(form).entries());
    const dateNames = ["courseStart", "cancelDeadline", "withdrawDeadline", "courseEnd", "termEnd"];
    const dateValues = dateNames.map(name => values[name]);
    if (dateValues.every(Boolean) && !(dateValues[0] <= dateValues[1] && dateValues[1] <= dateValues[2] && dateValues[2] <= dateValues[3] && dateValues[3] <= dateValues[4])) {
      errors.push({ sectionId: 7, message: "Vérifiez l’ordre des dates importantes : début, échéances, fin du cours et fin du trimestre." });
    }

    validateTableRows("calendar", ["session", "date", "modality", "themes", "activities", "preparation"], "Calendrier du cours", 8, errors);
    const evaluations = validateTableRows("evaluations", ["name", "target", "weight", "team", "date", "iag"], "Évaluations", 10, errors);
    const total = evaluations.reduce((sum, row) => sum + (Number(row.weight) || 0), 0);
    if (evaluations.length && Math.abs(total - 100) >= 0.001) {
      errors.push({ sectionId: 10, message: `Les pondérations totalisent ${Number(total.toFixed(2))} %; le total attendu est 100 %.` });
    }
    if (evaluations.some(row => Number(row.weight) < 0 || Number(row.weight) > 100)) {
      errors.push({ sectionId: 10, message: "Chaque pondération doit être comprise entre 0 % et 100 %." });
    }

    const cutoff = values.intensiveCourse === "yes"
      ? tableRows("calendar").filter(row => present(row.date)).map(row => row.date).sort()[9]
      : values.withdrawDeadline;
    if (values.intensiveCourse === "yes" && !cutoff) {
      errors.push({ sectionId: 8, message: "Pour un cours intensif, saisissez les dates d’au moins dix séances afin de vérifier l’échéance." });
    } else if (cutoff) {
      const beforeCutoff = evaluations.filter(row => row.date && row.date < cutoff)
        .reduce((sum, row) => sum + (Number(row.weight) || 0), 0);
      if (beforeCutoff < 20) {
        errors.push({ sectionId: 10, message: `Au moins 20 % de la note doit être évaluée avant l’échéance pertinente; le total saisi est ${Number(beforeCutoff.toFixed(2))} %.` });
      }
    }
    if (values.studyCycle === "1er cycle" && evaluations.some(row => Number(row.weight) > 50)) {
      errors.push({ sectionId: 10, message: "Pour un cours de premier cycle, aucune évaluation ne peut compter pour plus de 50 %." });
    }

    validateTableRows("bibliography", ["author", "year", "title", "source"], "Bibliographie", 16, errors);
    if (values.courseStatus === "Obligatoire dans un programme, optionnel dans un autre" && !present(values.programStatusDetails)) {
      errors.push({ sectionId: 2, message: "Précisez le statut du cours pour chacun des programmes concernés." });
    }
    if (values.courseSchedule === "Période réduite ou horaire condensé" && !present(values.dateAdjustments)) {
      errors.push({ sectionId: 7, message: "Précisez les dates ajustées pour la période réduite ou l’horaire condensé." });
    }
    const bibliographyLinks = tableRows("bibliography").map(row => row.url).filter(present);
    for (const link of bibliographyLinks) {
      try {
        const parsed = new URL(link);
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("protocol");
      } catch {
        errors.push({ sectionId: 16, message: `L’hyperlien « ${link} » n’est pas une URL HTTP ou HTTPS valide.` });
      }
    }
    if (bibliographyLinks.length && values.hyperlinksReviewed !== "yes") {
      errors.push({ sectionId: 16, message: "Testez les hyperliens de la bibliographie et confirmez-le dans la liste de vérification." });
    }
    if (state.activeSections.includes(11) && !present(values.passingGrade)) {
      errors.push({ sectionId: 11, message: "Indiquez la note de passage du cours ou désactivez la section 11." });
    }
    return errors;
  }

  function displayValidationErrors(errors) {
    validationSummary.replaceChildren();
    if (!errors.length) {
      validationSummary.hidden = true;
      return;
    }
    validationSummary.hidden = false;
    const title = document.createElement("strong");
    title.textContent = "Le plan doit être corrigé avant l’export :";
    const list = document.createElement("ul");
    for (const error of errors) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#section-${error.sectionId}`;
      link.textContent = error.message;
      item.append(link);
      list.append(item);
    }
    validationSummary.append(title, list);
  }

  function exportPdf() {
    if (!form.reportValidity()) return;
    const errors = collectValidationErrors();
    displayValidationErrors(errors);
    if (errors.length) {
      validationSummary.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    renderPreview();
    window.print();
  }

  function resetDraft(confirmUser = true) {
    if (confirmUser && !window.confirm("Effacer le brouillon enregistré dans ce navigateur?")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = {
      fields: {},
      objectives: [""],
      tables: structuredClone(defaultTables),
      activeSections: sections.filter(section => section.required || section.id === 1).map(section => section.id)
    };
    form.reset();
    form.elements.credits.value = "3";
    form.elements.teachingHours.value = "45";
    form.elements.personalHours.value = "90";
    renderSectionToggles();
    renderObjectives([""]);
    renderTables();
    updateConditionalBlocks();
    validationSummary.hidden = true;
    renderPreview();
    saveStatus.textContent = "Brouillon effacé";
  }

  function hasDraftContent() {
    const savedFields = Object.entries(state.fields).some(([name, value]) =>
      !["credits", "teachingHours", "personalHours"].includes(name) && present(value));
    const savedTables = Object.entries(state.tables).some(([key, rows]) =>
      key !== "grades" && rows.some(row => Object.values(row).some(present)));
    return savedFields || savedTables || state.objectives.some(present);
  }

  function showWorkspace() {
    startPanel.hidden = true;
    importPanel.hidden = true;
    appWorkspace.hidden = false;
  }

  function beginNewPlan() {
    if (hasDraftContent()) {
      const discard = window.confirm("Un brouillon existe dans ce navigateur. Voulez-vous l’effacer et commencer un plan vierge? Cette action ne peut pas être annulée.");
      if (!discard) return;
      resetDraft(false);
    }
    importAppliedNotice.hidden = true;
    showWorkspace();
  }

  function applyImportedData(imported) {
    for (const [name, value] of Object.entries(imported.fields || {})) {
      const control = form.querySelector(`[name="${CSS.escape(name)}"]`);
      if (!control) continue;
      if (control.type === "checkbox") {
        control.checked = value === control.value;
      } else if (control.tagName === "SELECT") {
        const option = Array.from(control.options).find(item => item.value === value || item.textContent.trim() === value);
        if (option) control.value = option.value;
      } else {
        control.value = value;
      }
    }
    if (Array.isArray(imported.objectives) && imported.objectives.length) {
      state.objectives = imported.objectives.slice(0, 5);
      renderObjectives(state.objectives);
    }
    for (const [key, rows] of Object.entries(imported.tables || {})) {
      if (!Array.isArray(state.tables[key]) || !Array.isArray(rows) || !rows.length) continue;
      state.tables[key] = rows;
      renderSectionTable(form.querySelector(`[data-table="${CSS.escape(key)}"]`));
    }
    for (const id of imported.activeSections || []) {
      if (sections.some(section => section.id === id) && !state.activeSections.includes(id)) {
        state.activeSections.push(id);
      }
    }
    renderSectionToggles();
    updateConditionalBlocks();
    updateWorkload();
    renderPreview();
    queueSave();
    showWorkspace();
    importAppliedNotice.hidden = false;
    const fieldCount = Object.keys(imported.fields || {}).length;
    const tableCount = Object.keys(imported.tables || {}).length;
    document.querySelector("#importAppliedText").textContent =
      `${fieldCount} champ(s) et ${tableCount} tableau(x) transféré(s). Vérifiez les valeurs et les avertissements du rapport. Les textes institutionnels 2026–2027 du gabarit ont été conservés.`;
  }

  document.querySelector("#chooseNewPlan").addEventListener("click", beginNewPlan);
  document.querySelector("#resumeDraftButton").hidden = !hasDraftContent();
  document.querySelector("#resumeDraftButton").addEventListener("click", showWorkspace);
  document.querySelector("#chooseImport").addEventListener("click", () => {
    startPanel.hidden = true;
    importPanel.hidden = false;
    document.querySelector("#importFileInput").focus();
  });
  document.querySelector("#useCommunicationTemplate").addEventListener("click", () => {
    const field = form.querySelector('[name="communicationModalities"]');
    const hasExistingText = present(field.value);
    field.value = hasExistingText ? `${field.value.trimEnd()}\n\n${communicationTemplate}` : communicationTemplate;
    document.querySelector("#communicationTemplateStatus").textContent = hasExistingText
      ? "Le modèle a été ajouté à la suite de votre texte. Vous pouvez modifier librement l’ensemble du contenu."
      : "Le modèle a été inséré. Vous pouvez le modifier librement, notamment les outils, les délais de réponse et les modalités de rencontre.";
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.focus();
    field.setSelectionRange(field.value.length, field.value.length);
  });
  document.querySelector("#backToStart").addEventListener("click", () => {
    importPanel.hidden = true;
    startPanel.hidden = false;
    document.querySelector("#chooseImport").focus();
  });
  document.querySelector("#reviewImportButton").addEventListener("click", () => {
    appWorkspace.hidden = true;
    importPanel.hidden = false;
    document.querySelector("#importReportHeading").focus();
  });
  window.addEventListener("uqac:apply-import", event => applyImportedData(event.detail));

  form.addEventListener("input", event => {
    if (event.target.name === "credits") {
      const credits = Number(event.target.value) || 0;
      form.elements.teachingHours.value = String(credits * 15);
      form.elements.personalHours.value = String(credits * 30);
    }
    handleTableInput(event);
    updateConditionalBlocks();
    if (!event.target.matches("[data-table-key]")) {
      renderPreview();
      updateWorkload();
      queueSave();
    }
  });
  form.addEventListener("change", event => {
    handleTableInput(event);
    updateConditionalBlocks();
    renderPreview();
    queueSave();
  });
  sectionList.addEventListener("change", handleSectionChange);
  form.addEventListener("click", event => {
    handleObjectiveClick(event);
    handleTableClick(event);
  });
  document.querySelector("#exportButton").addEventListener("click", exportPdf);
  document.querySelector("#resetButton").addEventListener("click", resetDraft);

  loadDraft();
  document.querySelector("#resumeDraftButton").hidden = !hasDraftContent();
  restoreFields();
  renderSectionToggles();
  renderObjectives(state.objectives);
  renderTables();
  updateConditionalBlocks();
  updateWorkload();
  renderPreview();
})();
