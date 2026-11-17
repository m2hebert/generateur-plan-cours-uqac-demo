(() => {
  "use strict";

  const MAX_FILE_SIZE = 25 * 1024 * 1024;
  const SECTIONS = [
    { id: 1, title: "Présentation de la personne enseignante", aliases: ["presentation de la personne enseignante", "presentation de l enseignante", "presentation de l enseignant"] },
    { id: 2, title: "Identification du cours", aliases: ["identification du cours", "renseignements sur le cours", "informations sur le cours"] },
    { id: 3, title: "Description du cours", aliases: ["description du cours", "objectifs du cours", "objectifs d apprentissage"] },
    { id: 4, title: "Formule pédagogique", aliases: ["formule pedagogique", "modalites d enseignement"] },
    { id: 5, title: "Activités d’enseignement et d’apprentissage", aliases: ["activites d enseignement et d apprentissage", "activites d apprentissage", "activites pedagogiques"] },
    { id: 6, title: "Modalités de communications et d’encadrement", aliases: ["modalites de communications et d encadrement", "communications et encadrement", "modalites de communication"] },
    { id: 7, title: "Dates importantes", aliases: ["dates importantes", "dates du trimestre"] },
    { id: 8, title: "Calendrier du cours", aliases: ["calendrier du cours", "planification du cours", "calendrier des activites"] },
    { id: 9, title: "Utilisation de l’intelligence artificielle", aliases: ["utilisation de l intelligence artificielle", "utilisation de l iag", "intelligence artificielle generative"] },
    { id: 10, title: "Évaluations", aliases: ["evaluations", "modalites d evaluation", "evaluation des apprentissages"] },
    { id: 11, title: "Système de notation", aliases: ["systeme de notation", "echelle de notation", "notation"] },
    { id: 12, title: "Droit d’auteur et propriété intellectuelle", aliases: ["droit d auteur", "propriete intellectuelle", "materiel pedagogique"] },
    { id: 13, title: "Services offerts à l’UQAC", aliases: ["services offerts a l uqac", "services aux etudiants", "ressources uqac"] },
    { id: 14, title: "Politique pour promouvoir la civilité", aliases: ["politique pour promouvoir la civilite", "civilite discrimination harcelement", "harcelement et violence"] },
    { id: 15, title: "Exigences de formation", aliases: ["exigences de formation", "exigences institutionnelles", "regles de formation"] },
    { id: 16, title: "Bibliographie", aliases: ["bibliographie", "references bibliographiques", "references"] }
  ];

  const FIELD_SPECS = [
    { name: "teacherName", label: "Nom de la personne enseignante", section: 1, aliases: ["nom et prenom", "personne enseignante", "nom de l enseignant", "nom de l enseignante", "professeur", "professeure"] },
    { name: "teacherBio", label: "Présentation", section: 1, aliases: ["presentation de la personne enseignante", "biographie", "parcours"] },
    { name: "teacherOffice", label: "Local ou lieu de rendez-vous", section: 1, aliases: ["local de rendez vous", "bureau", "local de la personne enseignante", "lieu de rendez vous"] },
    { name: "teacherAvailability", label: "Disponibilités", section: 1, aliases: ["disponibilites", "heures de disponibilite", "heures de disponibilites", "disponibilite de la personne enseignante"] },
    { name: "teacherEmail", label: "Adresse courriel", section: 1, aliases: ["adresse courriel", "courriel", "email", "courriel de la personne enseignante"] },
    { name: "module", label: "Module ou unité", section: 2, aliases: ["module", "unite", "unite d enseignement", "faculte"] },
    { name: "department", label: "Département", section: 2, aliases: ["departement"] },
    { name: "courseName", label: "Nom du cours", section: 2, aliases: ["nom du cours", "titre du cours"] },
    { name: "courseCode", label: "Sigle", section: 2, aliases: ["sigle", "code du cours", "code de cours"] },
    { name: "group", label: "Numéro du groupe", section: 2, aliases: ["numero du groupe", "groupe"] },
    { name: "term", label: "Trimestre", section: 2, aliases: ["trimestre", "session", "semestre"] },
    { name: "location", label: "Local ou lien Zoom", section: 2, aliases: ["local ou lien zoom", "local du cours", "salle", "lieu du cours"] },
    { name: "courseStatus", label: "Statut dans le programme", section: 2, kind: "status", aliases: ["statut dans le programme", "statut du cours", "cours obligatoire ou optionnel"] },
    { name: "studyCycle", label: "Cycle de formation", section: 2, kind: "cycle", aliases: ["cycle de formation", "cycle d etudes", "cycle"] },
    { name: "programStatusDetails", label: "Programmes concernés", section: 2, aliases: ["programmes concernes", "statut dans chaque programme"] },
    { name: "courseLinks", label: "Liens avec les autres cours", section: 2, aliases: ["liens avec les autres cours", "liens avec les cours", "place dans le cheminement"] },
    { name: "prerequisites", label: "Cours préalables", section: 2, aliases: ["cours prealables", "prealables", "prerequis"] },
    { name: "generalObjective", label: "Objectif général", section: 3, aliases: ["objectif general", "competence attendue", "objectif du cours"] },
    { name: "teachingFormat", label: "Formule ou modalité", section: 4, kind: "format", aliases: ["formule pedagogique", "modalite d enseignement", "mode d enseignement", "enseignement"] },
    { name: "credits", label: "Nombre de crédits", section: 4, kind: "number", aliases: ["nombre de credits", "credits"] },
    { name: "teachingHours", label: "Heures d’enseignement", section: 4, kind: "number", aliases: ["heures d enseignement", "heures de cours"] },
    { name: "personalHours", label: "Heures de travail personnel", section: 4, kind: "number", aliases: ["heures de travail personnel", "travail personnel"] },
    { name: "learningActivities", label: "Activités d’apprentissage", section: 5, aliases: ["activites d apprentissage", "activites proposees", "activites d enseignement"] },
    { name: "importantDatesTerm", label: "Session des dates importantes", section: 7, aliases: ["session des dates importantes", "trimestre des dates importantes"] },
    { name: "courseSchedule", label: "Durée du cours", section: 7, kind: "schedule", aliases: ["duree du cours", "horaire du cours", "cours intensif"] },
    { name: "courseStart", label: "Date de début du cours", section: 7, kind: "date", aliases: ["date de debut du cours", "debut du cours"] },
    { name: "cancelDeadline", label: "Date limite d’annulation", section: 7, kind: "date", aliases: ["date limite d annulation", "annulation avec remboursement"] },
    { name: "withdrawDeadline", label: "Date limite d’abandon", section: 7, kind: "date", aliases: ["date limite d abandon", "abandon sans mention", "abandon sans echec"] },
    { name: "courseEnd", label: "Date de fin du cours", section: 7, kind: "date", aliases: ["date de fin du cours", "fin du cours"] },
    { name: "termEnd", label: "Fin du trimestre", section: 7, kind: "date", aliases: ["fin du trimestre", "fin de la session"] },
    { name: "courseSchedule", label: "Durée du cours", section: 7, kind: "schedule", aliases: ["periode reduite", "horaire condense"] },
    { name: "iagPolicy", label: "Balises d’utilisation des IAg", section: 9, aliases: ["balises generales", "regles d utilisation de l iag", "utilisation de l ia generative"] },
    { name: "finalAssessment", label: "Évaluation finale", section: 10, aliases: ["evaluation finale", "examen final"] },
    { name: "passingGrade", label: "Note de passage", section: 11, aliases: ["note de passage", "cote de passage"] },
    { name: "copyrightNotes", label: "Précisions sur le droit d’auteur", section: 12, aliases: ["precisions propres au cours", "droits d auteur du cours"] },
    { name: "serviceNotes", label: "Ressources locales", section: 13, aliases: ["ressources locales", "services propres au cours"] },
    { name: "languageQuality", label: "Qualité de la langue", section: 15, aliases: ["qualite de la langue", "evaluation de la langue", "penalite linguistique"] },
    { name: "policyReferences", label: "Références des politiques et procédures", section: 15, aliases: ["references des politiques", "references des politiques et procedures", "politique et procedures", "numero et date des politiques"] },
    { name: "presentationRules", label: "Règles de présentation des travaux", section: 15, aliases: ["regles de presentation des travaux", "presentation des travaux", "normes de presentation"] },
    { name: "lateRules", label: "Retards dans la remise des travaux", section: 15, aliases: ["retards dans la remise", "penalites de retard", "retard dans les travaux"] },
    { name: "ticLevel", label: "Utilisation des TIC", section: 15, kind: "tic", aliases: ["utilisation des tic", "technologies de l information et de la communication"] },
    { name: "ticConditions", label: "Conditions d’utilisation des TIC", section: 15, aliases: ["conditions d utilisation des tic", "modalites d utilisation des tic"] }
  ];

  const TABLE_SPECS = [
    { key: "synoptic", label: "Vue synoptique", section: 3, columns: [
      { key: "objective", aliases: ["objectif", "objectifs"] },
      { key: "content", aliases: ["contenu essentiel", "contenu", "theme"] },
      { key: "strategy", aliases: ["strategie d enseignement", "strategie", "activite d apprentissage"] },
      { key: "formative", aliases: ["evaluation formative"] },
      { key: "summative", aliases: ["evaluation sommative", "ponderation"] }
    ] },
    { key: "calendar", label: "Calendrier du cours", section: 8, columns: [
      { key: "session", aliases: ["seance", "cours", "semaine"] },
      { key: "date", aliases: ["date"] },
      { key: "modality", aliases: ["modalite", "lieu"] },
      { key: "themes", aliases: ["themes", "contenus abordes", "contenu"] },
      { key: "activities", aliases: ["activites prevues", "activites", "enseignement"] },
      { key: "preparation", aliases: ["activites preparatoires", "preparation", "lectures", "travail"] }
    ] },
    { key: "iaUses", label: "Utilisation des IAg", section: 9, columns: [
      { key: "activity", aliases: ["travail", "activite", "evaluation"] },
      { key: "authorization", aliases: ["utilisation permise", "autorisation", "niveau permis"] },
      { key: "conditions", aliases: ["conditions", "declaration", "regles"] }
    ] },
    { key: "evaluations", label: "Évaluations", section: 10, columns: [
      { key: "name", aliases: ["evaluation", "activite evaluee", "travail"] },
      { key: "target", aliases: ["objectifs ou contenus", "objectifs", "contenus cibles"] },
      { key: "weight", aliases: ["ponderation", "pourcentage", "poids"] },
      { key: "team", aliases: ["equipe ou individuelle", "equipe", "individuelle"] },
      { key: "date", aliases: ["date de remise", "date", "echeance"] },
      { key: "criteria", aliases: ["criteres", "critere d evaluation"] },
      { key: "iag", aliases: ["niveau d utilisation des iag", "iag", "ia generative"] }
    ] },
    { key: "grades", label: "Échelle de notation", section: 11, columns: [
      { key: "grade", aliases: ["cote", "lettre", "note"] },
      { key: "range", aliases: ["intervalle", "resultat", "pourcentage"] }
    ] },
    { key: "bibliography", label: "Bibliographie", section: 16, columns: [
      { key: "author", aliases: ["auteur", "auteurs"] },
      { key: "year", aliases: ["annee", "date"] },
      { key: "title", aliases: ["titre", "ouvrage"] },
      { key: "source", aliases: ["publication", "editeur", "reference", "source"] },
      { key: "url", aliases: ["url", "doi", "lien"] }
    ] }
  ];

  const fileInput = document.querySelector("#importFileInput");
  const dropZone = document.querySelector("#dropZone");
  const importStatus = document.querySelector("#importStatus");
  const importReport = document.querySelector("#importReport");
  const importReportContent = document.querySelector("#importReportContent");
  const applyButton = document.querySelector("#applyImportButton");
  let latestAnalysis = null;

  function normalize(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’'`]/g, " ")
      .replace(/[^a-z0-9%]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  function cleanText(value) {
    return String(value ?? "").replace(/\u00a0/g, " ").replace(/[ \t]+/g, " ").trim();
  }

  function elementText(element) {
    const clone = element.cloneNode(true);
    clone.querySelectorAll("br").forEach(br => br.replaceWith(document.createTextNode("\n")));
    return cleanText(clone.textContent).replace(/\s*\n\s*/g, "\n");
  }

  function extractDocxBlocks(html) {
    const parsed = new DOMParser().parseFromString(html, "text/html");
    const blocks = [];
    for (const element of Array.from(parsed.body.children)) {
      if (element.tagName === "TABLE") {
        const rows = Array.from(element.querySelectorAll("tr"), row =>
          Array.from(row.querySelectorAll("th, td"), cell => elementText(cell)));
        if (rows.some(row => row.some(Boolean))) blocks.push({ type: "table", rows });
        continue;
      }
      if (element.matches("ul, ol")) {
        for (const item of element.querySelectorAll(":scope > li")) {
          const text = elementText(item);
          if (text) blocks.push({ type: "list", text });
        }
        continue;
      }
      const text = elementText(element);
      if (!text) continue;
      blocks.push({
        type: "text",
        text,
        semanticHeading: /^H[1-6]$/.test(element.tagName)
      });
    }
    return blocks;
  }

  async function extractDocx(file) {
    if (!window.mammoth || typeof window.mammoth.convertToHtml !== "function") {
      throw new Error("Le moteur DOCX local n’est pas chargé. Rechargez l’application ou vérifiez les fichiers vendor.");
    }
    const arrayBuffer = await file.arrayBuffer();
    const result = await window.mammoth.convertToHtml({ arrayBuffer });
    const blocks = extractDocxBlocks(result.value);
    const warnings = result.messages.map(message => message.message);
    return { blocks, warnings, format: "DOCX", pageCount: null };
  }

  function pdfLines(items) {
    const lines = [];
    for (const item of items) {
      if (typeof item.str !== "string" || !item.str.trim()) continue;
      const x = item.transform?.[4] ?? 0;
      const y = item.transform?.[5] ?? 0;
      let line = lines.find(candidate => Math.abs(candidate.y - y) < 2.5);
      if (!line) {
        line = { y, items: [] };
        lines.push(line);
      }
      line.items.push({ x, end: x + (item.width || 0), text: item.str });
    }
    return lines.sort((a, b) => b.y - a.y).map(line => {
      const sorted = line.items.sort((a, b) => a.x - b.x);
      const cells = [];
      let previousEnd = null;
      for (const item of sorted) {
        const gap = previousEnd === null ? 0 : item.x - previousEnd;
        if (!cells.length || gap > 20) cells.push(item.text.trim());
        else cells[cells.length - 1] = `${cells[cells.length - 1]} ${item.text.trim()}`.trim();
        previousEnd = Math.max(previousEnd || 0, item.end);
      }
      const text = cleanText(cells.join("   "));
      return text ? { type: "text", text, cells, page: null } : null;
    }).filter(Boolean);
  }

  async function extractPdf(file) {
    if (!window.pdfjsLib || typeof window.pdfjsLib.getDocument !== "function") {
      throw new Error("Le moteur PDF local n’est pas chargé. Rechargez l’application ou vérifiez les fichiers vendor.");
    }
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("vendor/pdf.worker.min.js", document.baseURI).href;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const pdf = await window.pdfjsLib.getDocument({
      data: bytes,
      isEvalSupported: false,
      enableXfa: false
    }).promise;
    const blocks = [];
    const emptyPages = [];
    let textCharacters = 0;
    try {
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const pageBlocks = pdfLines(content.items);
        if (!pageBlocks.length) emptyPages.push(pageNumber);
        for (const block of pageBlocks) {
          block.page = pageNumber;
          textCharacters += block.text.length;
          blocks.push(block);
        }
      }
    } finally {
      await pdf.destroy();
    }
    return {
      blocks,
      warnings: [],
      format: "PDF",
      pageCount: pdf.numPages,
      emptyPages,
      isScanned: textCharacters === 0,
      textCharacters
    };
  }

  function detectHeading(block) {
    const text = cleanText(block.text);
    const numbered = text.match(/^(?:section\s*)?(\d{1,2})[.)]\s+(.+)$/i) ||
      text.match(/^section\s+(\d{1,2})\s*[:\-–]\s*(.+)$/i);
    const title = numbered ? numbered[2] : text;
    const normalized = normalize(title);
    const matchedSection = SECTIONS.find(section => section.aliases.some(alias => {
      const normalizedAlias = normalize(alias);
      return normalized === normalizedAlias ||
        (normalizedAlias.length >= 10 && normalized.startsWith(`${normalizedAlias} `));
    }));
    if (matchedSection) {
      return {
        id: matchedSection.id,
        title,
        confidence: numbered && Number(numbered[1]) !== matchedSection.id ? "medium" : "high"
      };
    }
    if (numbered) {
      const id = Number(numbered[1]);
      if (block.semanticHeading && id >= 1 && id <= 16 && numbered[2].length >= 3) {
        return { id, title: numbered[2], confidence: "medium" };
      }
    }
    return null;
  }

  function addSectionContexts(blocks) {
    const found = new Map();
    let currentSection = null;
    for (const block of blocks) {
      const heading = block.type === "text" ? detectHeading(block) : null;
      if (heading) {
        currentSection = heading.id;
        block.isSectionHeading = true;
        block.headingId = heading.id;
        found.set(heading.id, heading);
      }
      block.sectionId = currentSection;
    }
    return found;
  }

  function sectionBlocks(blocks, sectionId) {
    return blocks.filter(block => block.sectionId === sectionId && !block.isSectionHeading);
  }

  function blockText(block) {
    return block.type === "table" ? block.rows.flat().join(" ") : block.text || "";
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function parseLabeledText(text, aliases) {
    const raw = cleanText(text);
    const separator = raw.search(/[:：]/);
    if (separator > 0) {
      const label = normalize(raw.slice(0, separator));
      if (aliases.some(alias => label === normalize(alias))) {
        return { value: cleanText(raw.slice(separator + 1)), confidence: "high" };
      }
    }
    for (const alias of aliases) {
      const pattern = new RegExp(`^\\s*${escapeRegExp(alias).replace(/\s+/g, "\\s+")}\\s+(?:[-–—]\\s*)?(.+)$`, "i");
      const match = raw.match(pattern);
      if (match) return { value: cleanText(match[1]), confidence: "medium" };
    }
    return null;
  }

  function findLabeledValue(spec, blocks) {
    const preferred = blocks.filter(block => block.sectionId === spec.section);
    const candidates = preferred.length ? preferred.concat(blocks.filter(block => block.sectionId !== spec.section)) : blocks;
    for (let index = 0; index < candidates.length; index++) {
      const block = candidates[index];
      if (block.isSectionHeading) continue;
      if (block.type === "table") {
        for (let rowIndex = 0; rowIndex < block.rows.length; rowIndex++) {
          const row = block.rows[rowIndex];
          for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
            const label = normalize(row[columnIndex]);
            if (!spec.aliases.some(alias => label === normalize(alias))) continue;
            const value = cleanText(row.slice(columnIndex + 1).filter(Boolean).join(" "));
            if (value) return { value, confidence: "high" };
            const nextRow = block.rows[rowIndex + 1];
            if (nextRow && nextRow[columnIndex]) return { value: cleanText(nextRow[columnIndex]), confidence: "medium" };
          }
          if (rowIndex + 1 < block.rows.length) {
            const nextRow = block.rows[rowIndex + 1];
            for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
              const label = normalize(row[columnIndex]);
              if (spec.aliases.some(alias => label === normalize(alias)) && nextRow[columnIndex]) {
                return { value: cleanText(nextRow[columnIndex]), confidence: "medium" };
              }
            }
          }
        }
      } else {
        const pair = parseLabeledText(block.text, spec.aliases);
        if (pair?.value) return pair;
        if (spec.aliases.some(alias => normalize(block.text) === normalize(alias))) {
          const next = candidates[index + 1];
          if (next && !next.isSectionHeading && next.sectionId === block.sectionId && next.type === "text" && next.text.length < 400) {
            return { value: cleanText(next.text), confidence: "medium" };
          }
        }
      }
    }
    return null;
  }

  function parseDate(value) {
    const normalized = normalize(value);
    const iso = normalized.match(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
    if (iso) return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;
    const months = {
      janvier: "01", janvier: "01", janv: "01", fevrier: "02", fevr: "02", mars: "03",
      avril: "04", avr: "04", mai: "05", juin: "06", juillet: "07", juil: "07",
      aout: "08", septembre: "09", sept: "09", octobre: "10", oct: "10",
      novembre: "11", nov: "11", decembre: "12", dec: "12"
    };
    const french = normalized.match(/\b(\d{1,2})(?:er|e)?\s+([a-z]+)\.?\s+(20\d{2})\b/);
    if (french && months[french[2]]) return `${french[3]}-${months[french[2]]}-${french[1].padStart(2, "0")}`;
    return null;
  }

  function normalizeFieldValue(spec, rawValue) {
    const value = cleanText(rawValue);
    if (!value) return { value: null, reason: "valeur vide" };
    if (spec.kind === "date") {
      const date = parseDate(value);
      return date ? { value: date } : { value: null, reason: "format de date non reconnu" };
    }
    if (spec.kind === "number") {
      const match = value.replace(/,/g, ".").match(/\d+(?:\.\d+)?/);
      return match ? { value: match[0] } : { value: null, reason: "valeur numérique non reconnue" };
    }
    if (spec.kind === "status") {
      const text = normalize(value);
      if (text.includes("obligatoire") && text.includes("optionnel")) return { value: "Obligatoire dans un programme, optionnel dans un autre" };
      if (text.includes("obligatoire")) return { value: "Obligatoire" };
      if (text.includes("optionnel") || text.includes("facultatif")) return { value: "Optionnel" };
      return { value: null, reason: "statut ambigu" };
    }
    if (spec.kind === "cycle") {
      const text = normalize(value);
      if (/\b(1er|premier|1)\b/.test(text)) return { value: "1er cycle" };
      if (/\b(2e|deuxieme|2)\b/.test(text)) return { value: "2e cycle" };
      if (/\b(3e|troisieme|3)\b/.test(text)) return { value: "3e cycle" };
      if (text.includes("autre")) return { value: "Autre" };
      return { value: null, reason: "cycle non reconnu" };
    }
    if (spec.kind === "format") {
      const text = normalize(value);
      if (text.includes("hybride")) return { value: "Hybride" };
      if (text.includes("comodal")) return { value: "Comodal" };
      if (text.includes("distance") || text.includes("ligne") || text.includes("zoom")) return { value: "À distance" };
      if (text.includes("presence") || text.includes("classe")) return { value: "En présence" };
      if (text.includes("autre")) return { value: "Autre" };
      return { value: null, reason: "formule pédagogique ambiguë" };
    }
    if (spec.kind === "schedule") {
      const text = normalize(value);
      if (text.includes("condense") || text.includes("intensif") || text.includes("reduite") || text.includes("atypique")) {
        return { value: "Période réduite ou horaire condensé" };
      }
      if (text.includes("toute la session") || text.includes("session complete")) return { value: "Cours sur toute la session" };
      return { value: null, reason: "durée du cours à confirmer" };
    }
    if (spec.kind === "tic") {
      const text = normalize(value);
      if (text.includes("interdit")) return { value: "Usage interdit" };
      if (text.includes("condition")) return { value: "Usage permis sous certaines conditions" };
      if (text.includes("permis") || text.includes("autorise")) return { value: "Usage permis si non perturbant (par défaut)" };
      return { value: null, reason: "niveau d’utilisation des TIC ambigu" };
    }
    return { value };
  }

  function headingScore(row, tableSpec) {
    const indexes = {};
    for (const column of tableSpec.columns) {
      const index = row.findIndex(cell => {
        const header = normalize(cell);
        return column.aliases.some(alias => {
          const normalizedAlias = normalize(alias);
          return header === normalizedAlias || (normalizedAlias.length > 4 && header.includes(normalizedAlias));
        });
      });
      if (index >= 0) indexes[column.key] = index;
    }
    return { indexes, score: Object.keys(indexes).length };
  }

  function mapTable(table, tableSpec, sourceFormat) {
    let headerIndex = -1;
    let matched = null;
    for (let index = 0; index < Math.min(table.rows.length, 3); index++) {
      const score = headingScore(table.rows[index], tableSpec);
      if (!matched || score.score > matched.score) {
        matched = score;
        headerIndex = index;
      }
    }
    if (!matched || matched.score < 2) return null;
    const rows = table.rows.slice(headerIndex + 1).map(row => {
      const mapped = {};
      for (const column of tableSpec.columns) {
        const index = matched.indexes[column.key];
        let value = index === undefined ? "" : cleanText(row[index] || "");
        if (column.key === "date" && value) value = parseDate(value) || value;
        if (column.key === "weight" && value) {
          const number = value.replace(/,/g, ".").match(/\d+(?:\.\d+)?/);
          value = number ? number[0] : value;
        }
        if (column.key === "team" && value) {
          const normalized = normalize(value);
          value = normalized.includes("equipe") || normalized.includes("groupe") ? "Équipe" : "Individuelle";
        }
        if (column.key === "authorization" && value) {
          const normalized = normalize(value);
          value = normalized.includes("interdit") ? "Interdite" :
            normalized.includes("condition") ? "Autorisée sous conditions" :
              normalized.includes("autorise") || normalized.includes("permis") ? "Autorisée" : value;
        }
        if (column.key === "iag" && value) {
          const normalized = normalize(value);
          value = normalized.includes("interdit") ? "Interdite" :
            normalized.includes("condition") ? "Autorisée sous conditions" :
              normalized.includes("autorise") || normalized.includes("permis") ? "Autorisée" : value;
        }
        mapped[column.key] = value;
      }
      return mapped;
    }).filter(row => Object.values(row).some(Boolean));
    if (!rows.length) return null;
    const confidence = matched.score >= Math.min(4, tableSpec.columns.length) && sourceFormat === "DOCX" ? "high" : "medium";
    return { key: tableSpec.key, label: tableSpec.label, section: tableSpec.section, rows, confidence, matchedColumns: matched.score };
  }

  function collectTables(blocks, format) {
    const candidates = [];
    for (const block of blocks) {
      if (block.type === "table") candidates.push({ rows: block.rows, sectionId: block.sectionId });
    }
    if (format === "PDF") {
      let activeSection = null;
      let lines = [];
      const flush = () => {
        for (let index = 0; index < lines.length; index++) {
          if ((lines[index].cells || []).length < 2) continue;
          const tableRows = lines.slice(index).map(line => line.cells || []);
          if (tableRows.length > 1) candidates.push({ rows: tableRows, sectionId: activeSection });
        }
        lines = [];
      };
      for (const block of blocks) {
        if (block.isSectionHeading) {
          flush();
          activeSection = block.headingId;
        } else {
          lines.push(block);
        }
      }
      flush();
    }

    const mapped = new Map();
    for (const candidate of candidates) {
      const scored = TABLE_SPECS.map(spec => ({
        spec,
        result: mapTable(candidate, spec, format)
      })).filter(item => item.result);
      if (!scored.length) continue;
      scored.sort((a, b) => b.result.matchedColumns - a.result.matchedColumns);
      const best = scored[0].result;
      const existing = mapped.get(best.key);
      if (existing) {
        existing.rows.push(...best.rows);
        if (best.confidence === "high") existing.confidence = "high";
      } else {
        mapped.set(best.key, best);
      }
    }
    return Array.from(mapped.values());
  }

  function splitObjectiveText(text) {
    return cleanText(text)
      .split(/\n|(?:^|\s)(?:\d{1,2}[.)]|[•▪●])\s+/)
      .map(value => value.replace(/^[\s•▪●\-–]+/, "").trim())
      .filter(value => value.length > 3);
  }

  function findNarrativeField(blocks, sectionId, excluded = []) {
    const content = sectionBlocks(blocks, sectionId)
      .filter(block => block.type !== "table")
      .map(block => block.text)
      .filter(text => !excluded.some(alias => normalize(text).startsWith(normalize(alias))))
      .filter(text => !FIELD_SPECS.some(spec => parseLabeledText(text, spec.aliases)?.value))
      .filter(text => text.length > 20);
    return content.length ? content.join("\n") : "";
  }

  function communicationTableText(rows) {
    if (!rows.length) return "";
    const headers = rows[0];
    const headerRow = headers.some(cell => {
      const value = normalize(cell);
      return value.includes("type de communication") ||
        value.includes("personnes enseignantes") ||
        value.includes("personnes etudiantes") ||
        value === "moyens";
    });
    const contentRows = headerRow ? rows.slice(1) : rows;
    return contentRows.map(row => {
      if (headerRow) {
        return headers.map((header, index) => {
          const value = cleanText(row[index] || "");
          return value ? `${cleanText(header)} : ${value}` : "";
        }).filter(Boolean).join("; ");
      }
      return row.map(cleanText).filter(Boolean).join(" — ");
    }).filter(Boolean).join("\n\n");
  }

  function extractCommunicationModalities(blocks) {
    return sectionBlocks(blocks, 6).map(block => {
      if (block.type === "table") return communicationTableText(block.rows);
      if (block.cells?.length > 1) return block.cells.filter(Boolean).join(" — ");
      const labeled = parseLabeledText(block.text, [
        "modalites de communication",
        "modalites de communications et d encadrement",
        "moyens de communication"
      ]);
      return labeled?.value || cleanText(block.text);
    }).filter(Boolean).join("\n\n");
  }

  function mapDocument(extracted, fileName) {
    const foundSections = addSectionContexts(extracted.blocks);
    const fields = {};
    const fieldDetails = [];
    const warnings = [...extracted.warnings];
    const activeSections = new Set(foundSections.keys());

    for (const spec of FIELD_SPECS) {
      const candidate = findLabeledValue(spec, extracted.blocks);
      if (!candidate) continue;
      const normalized = normalizeFieldValue(spec, candidate.value);
      if (!normalized.value) {
        warnings.push(`${spec.label} : ${normalized.reason}; cette valeur n’a pas été transférée automatiquement.`);
        continue;
      }
      fields[spec.name] = normalized.value;
      fieldDetails.push({
        name: spec.name,
        label: spec.label,
        value: normalized.value,
        confidence: candidate.confidence,
        section: spec.section
      });
      activeSections.add(spec.section);
    }

    const objectivesSection = sectionBlocks(extracted.blocks, 3);
    const objectiveMarker = objectivesSection.findIndex(block => normalize(block.text).includes("objectifs specifiques"));
    let objectiveCandidates = [];
    if (objectiveMarker >= 0) {
      objectiveCandidates = objectivesSection.slice(objectiveMarker + 1)
        .filter(block => block.type !== "table" && !block.isSectionHeading)
        .flatMap(block => {
          const text = cleanText(block.text);
          if (!text || normalize(text).includes("objectif general")) return [];
          const split = splitObjectiveText(text);
          return split.length ? split : text.length > 8 ? [text] : [];
        });
    } else {
      objectiveCandidates = objectivesSection.filter(block => block.type === "list").flatMap(block => splitObjectiveText(block.text));
    }
    const objectives = Array.from(new Set(objectiveCandidates)).slice(0, 5);
    if (objectiveCandidates.length > 5) warnings.push("Plus de cinq objectifs spécifiques ont été repérés; seuls les cinq premiers sont proposés.");
    if (objectives.length) {
      activeSections.add(3);
    }

    if (!fields.generalObjective) {
      const general = objectivesSection.find(block =>
        block.type !== "table" && block.text.length > 20 &&
        !normalize(block.text).includes("objectifs specifiques") &&
        !block.isSectionHeading
      );
      if (general) {
        const pair = parseLabeledText(general.text, ["objectif general", "competence attendue"]);
        const value = pair?.value || general.text;
        if (value.length > 15) {
          fields.generalObjective = value;
          fieldDetails.push({ name: "generalObjective", label: "Objectif général", value, confidence: pair ? "high" : "medium", section: 3 });
          activeSections.add(3);
        }
      }
    }

    for (const [sectionId, fieldName, label] of [
      [1, "teacherBio", "Présentation"],
      [5, "learningActivities", "Activités d’apprentissage"]
    ]) {
      if (fields[fieldName]) continue;
      const narrative = findNarrativeField(extracted.blocks, sectionId);
      if (narrative) {
        fields[fieldName] = narrative;
        fieldDetails.push({ name: fieldName, label, value: narrative, confidence: "medium", section: sectionId });
        activeSections.add(sectionId);
      }
    }

    const communicationModalities = extractCommunicationModalities(extracted.blocks);
    if (communicationModalities) {
      fields.communicationModalities = communicationModalities;
      fieldDetails.push({
        name: "communicationModalities",
        label: "Modalités de communication et d’encadrement",
        value: communicationModalities,
        confidence: "medium",
        section: 6
      });
      activeSections.add(6);
    }

    const tables = collectTables(extracted.blocks, extracted.format);
    for (const table of tables) activeSections.add(table.section);

    const institutionalText = [];
    const institutionalIndicators = [
      "politique", "universite du quebec", "plagiat", "tricherie", "harcelement",
      "droit d auteur", "copibec", "compilatio", "services aux etudiants",
      "intelligence artificielle", "valorisation du francais"
    ];
    for (const sectionId of [9, 12, 13, 14, 15]) {
      const text = sectionBlocks(extracted.blocks, sectionId).map(block =>
        block.type === "table" ? block.rows.flat().join(" ") : block.text
      ).join(" ");
      if (text.length > 40 && institutionalIndicators.some(indicator => normalize(text).includes(indicator))) {
        institutionalText.push({ sectionId, title: SECTIONS[sectionId - 1].title });
      }
    }
    const oldYears = new Set();
    for (const block of extracted.blocks) {
      const matches = blockText(block).match(/\b(?:19|20)\d{2}\b/g) || [];
      for (const year of matches) if (Number(year) < 2026) oldYears.add(year);
    }
    if (oldYears.size) warnings.push(`Année(s) antérieure(s) à 2026 repérée(s) : ${Array.from(oldYears).join(", ")}. Vérifiez le trimestre, les échéances et les références avant de réutiliser le plan.`);

    const sectionIds = Array.from(activeSections).sort((a, b) => a - b);
    const missingSections = SECTIONS.filter(section => !activeSections.has(section.id));
    const scannedPages = extracted.emptyPages || [];
    if (extracted.isScanned) warnings.push("Aucune couche de texte exploitable n’a été trouvée. Le document peut être numérisé ou ne pas contenir de texte; aucune reconnaissance OCR n’est effectuée.");
    else if (extracted.format === "PDF" && extracted.textCharacters < 100) {
      warnings.push("Très peu de texte a été extrait du PDF. Il peut être partiellement numérisé ou mal extrait; vérifiez manuellement l’ensemble du document.");
    }
    else if (scannedPages.length) warnings.push(`Aucun texte n’a été extrait des pages ${scannedPages.join(", ")}; elles peuvent être numérisées ou vides.`);
    if (extracted.format === "PDF" && tables.length === 0 && extracted.textCharacters > 100) {
      warnings.push("Le texte du PDF est lisible, mais aucun tableau n’a pu être aligné de façon assez sûre. Vérifiez et recopiez manuellement le calendrier, les évaluations et la bibliographie au besoin.");
    }
    if (!Object.keys(fields).length && !tables.length && !objectives.length) {
      warnings.push("Aucune information n’a été associée automatiquement aux champs. Vous pouvez tout de même ouvrir le formulaire et compléter les sections manuellement.");
    }

    return {
      fileName,
      format: extracted.format,
      pageCount: extracted.pageCount,
      textCharacters: extracted.textCharacters ?? extracted.blocks.reduce((sum, block) => sum + blockText(block).length, 0),
      fields,
      fieldDetails,
      objectives,
      tables: Object.fromEntries(tables.map(table => [table.key, table.rows])),
      tableDetails: tables.map(({ key, label, rows, confidence, matchedColumns }) => ({ key, label, rows: rows.length, confidence, matchedColumns })),
      activeSections: sectionIds,
      missingSections,
      institutionalText,
      warnings,
      isScanned: Boolean(extracted.isScanned)
    };
  }

  function addText(parent, tag, text, className = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    parent.append(element);
    return element;
  }

  function resultGroup(title, className = "") {
    const group = document.createElement("section");
    group.className = `import-result-group ${className}`.trim();
    addText(group, "h4", title);
    importReportContent.append(group);
    return group;
  }

  function renderAnalysis(analysis) {
    importReportContent.replaceChildren();
    const summary = resultGroup("Document analysé");
    addText(summary, "p", `${analysis.fileName} — ${analysis.format}${analysis.pageCount ? `, ${analysis.pageCount} page(s)` : ""}. ${analysis.textCharacters} caractères lisibles.`);
    addText(summary, "p", `${analysis.activeSections.length} section(s) ou contenu(s) associés; ${Object.keys(analysis.fields).length} champ(s), ${analysis.tableDetails.length} tableau(x) et ${analysis.objectives.length} objectif(s) proposé(s).`);

    const mappings = resultGroup("Champs proposés");
    if (!analysis.fieldDetails.length) {
      addText(mappings, "p", "Aucun champ individuel n’a pu être récupéré automatiquement.");
    } else {
      const list = document.createElement("ul");
      list.className = "import-mapping-list";
      for (const item of analysis.fieldDetails) {
        const row = document.createElement("li");
        row.className = "import-mapping-item";
        addText(row, "strong", item.label);
        const value = item.value.length > 180 ? `${item.value.slice(0, 177)}…` : item.value;
        addText(row, "span", value);
        const confidence = item.confidence === "high" ? "Correspondance directe" : "Correspondance à vérifier";
        addText(row, "span", confidence, `confidence-badge confidence-${item.confidence}`);
        list.append(row);
      }
      mappings.append(list);
    }

    const tables = resultGroup("Tableaux reconnus");
    if (!analysis.tableDetails.length) {
      addText(tables, "p", "Aucun tableau n’a été transféré. Les tableaux PDF, en particulier, peuvent nécessiter une vérification ou une saisie manuelle.");
    } else {
      const list = document.createElement("ul");
      for (const item of analysis.tableDetails) {
        const status = item.confidence === "high" ? "correspondance directe" : "correspondance à vérifier";
        addText(list, "li", `${item.label} : ${item.rows} ligne(s), ${status}.`);
      }
      tables.append(list);
    }

    const objectives = resultGroup("Objectifs spécifiques proposés — à vérifier");
    if (!analysis.objectives.length) {
      addText(objectives, "p", "Aucun objectif spécifique n’a pu être récupéré automatiquement.");
    } else {
      const list = document.createElement("ol");
      for (const objective of analysis.objectives) addText(list, "li", objective);
      objectives.append(list);
      addText(objectives, "p", "Vérifiez que chaque objectif correspond bien au descriptif officiel du cours avant le transfert.");
    }

    const coverage = resultGroup("Sections détectées et manquantes");
    const recognized = new Set(analysis.activeSections);
    addText(coverage, "p", `${recognized.size} section(s) reconnue(s) ou alimentée(s) sur 16.`);
    if (analysis.missingSections.length) {
      addText(coverage, "p", `Non détectées (le titre peut différer) : ${analysis.missingSections.map(section => `${section.id}. ${section.title}`).join("; ")}.`);
    } else {
      addText(coverage, "p", "Les 16 sections sont représentées.");
    }

    const institutional = resultGroup("Textes institutionnels à actualiser");
    if (analysis.institutionalText.length) {
      addText(institutional, "p", `Du contenu institutionnel ou réglementaire a été repéré dans : ${analysis.institutionalText.map(section => `${section.sectionId}. ${section.title}`).join("; ")}.`);
    } else {
      addText(institutional, "p", "Aucun ancien texte institutionnel n’a pu être identifié avec certitude.");
    }
    addText(institutional, "p", "Le document final utilisera les textes institutionnels intégrés au gabarit 2026–2027. Les paragraphes institutionnels de l’ancien fichier ne sont jamais copiés dans les champs personnels. Les numéros et dates des politiques importés doivent tout de même être vérifiés manuellement.");

    const warnings = resultGroup("À vérifier avant de poursuivre", "import-warning");
    if (!analysis.warnings.length) {
      addText(warnings, "p", "Aucun problème technique relevé. Vérifiez malgré tout toutes les correspondances avant l’export.");
    } else {
      const list = document.createElement("ul");
      for (const warning of analysis.warnings) addText(list, "li", warning);
      warnings.append(list);
    }
    applyButton.textContent = Object.keys(analysis.fields).length || analysis.tableDetails.length || analysis.objectives.length
      ? "Transférer les informations récupérées"
      : "Ouvrir le formulaire pour compléter manuellement";
    importReport.hidden = false;
  }

  async function analyzeFile(file) {
    if (!file) return;
    importReport.hidden = true;
    importReportContent.replaceChildren();
    latestAnalysis = null;
    importStatus.classList.remove("error");
    if (file.size > MAX_FILE_SIZE) {
      importStatus.textContent = "Le fichier dépasse la limite de 25 Mo. Choisissez un document plus petit.";
      importStatus.classList.add("error");
      return;
    }
    const extension = file.name.split(".").pop().toLowerCase();
    if (!["docx", "pdf"].includes(extension)) {
      importStatus.textContent = "Format non pris en charge. Choisissez un fichier Word .docx ou un PDF.";
      importStatus.classList.add("error");
      return;
    }
    importStatus.textContent = `Analyse locale de « ${file.name} »…`;
    applyButton.disabled = true;
    try {
      const extracted = extension === "docx" ? await extractDocx(file) : await extractPdf(file);
      latestAnalysis = mapDocument(extracted, file.name);
      renderAnalysis(latestAnalysis);
      importStatus.textContent = latestAnalysis.isScanned
        ? "Analyse terminée, mais aucun texte exploitable n’a été extrait."
        : "Analyse terminée. Examinez les correspondances et les avertissements avant le transfert.";
    } catch (error) {
      console.error("Échec de l’analyse locale du document.", error);
      importStatus.textContent = `Impossible d’analyser ce fichier : ${error.message || "format invalide ou document endommagé"}`;
      importStatus.classList.add("error");
    } finally {
      applyButton.disabled = false;
    }
  }

  fileInput.addEventListener("change", () => analyzeFile(fileInput.files[0]));
  dropZone.addEventListener("dragover", event => {
    event.preventDefault();
    dropZone.classList.add("drag-over");
  });
  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
  dropZone.addEventListener("drop", event => {
    event.preventDefault();
    dropZone.classList.remove("drag-over");
    analyzeFile(event.dataTransfer.files[0]);
  });
  document.querySelector("#cancelImportButton").addEventListener("click", () => {
    latestAnalysis = null;
    fileInput.value = "";
    importReport.hidden = true;
    importStatus.textContent = "Choisissez un autre fichier à analyser.";
    fileInput.focus();
  });
  applyButton.addEventListener("click", () => {
    if (!latestAnalysis) return;
    const hasImportedContent = Object.keys(latestAnalysis.fields).length ||
      latestAnalysis.tableDetails.length || latestAnalysis.objectives.length;
    if (hasImportedContent && !window.confirm("Les informations transférées remplaceront les valeurs correspondantes déjà saisies; les autres valeurs seront conservées. Continuer?")) return;
    window.dispatchEvent(new CustomEvent("uqac:apply-import", { detail: latestAnalysis }));
  });
})();
