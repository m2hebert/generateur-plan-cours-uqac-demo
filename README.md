# Générateur de plans de cours UQAC

Application statique locale sans compte ni dépendance à installer. Les 16 sections numérotées et la vue synoptique du gabarit sont saisissables. Les sections marquées d’un astérisque dans le gabarit sont obligatoires et toujours incluses; les autres peuvent être activées ou retirées du PDF.

## Ouvrir et tester sous Windows

1. Dans Visual Studio Code, choisissez **Fichier > Ouvrir le dossier…** et ouvrez le dossier `generateur-plan-cours-uqac`.
2. Ouvrez `index.html`. Pour un lancement plus fiable et une sauvegarde locale persistante, installez l’extension **Live Server** si elle est permise dans votre environnement, puis cliquez sur **Go Live** dans la barre d’état. Le navigateur s’ouvre sur une adresse locale semblable à `http://127.0.0.1:5500`.
3. Parcourez les sections avec les liens **Ouvrir** de la liste. Essayez notamment d’ajouter/supprimer des lignes au calendrier et aux évaluations, de décocher une section facultative et de compléter toutes les dates.
4. Les champs et tableaux sont conservés dans le stockage local du navigateur. Le bouton **Effacer le brouillon** demande confirmation avant de retirer ces données.
5. Pour exporter : remplissez les champs obligatoires et les champs conditionnels affichés, complétez la liste de vérification, faites totaliser les évaluations à 100 %, respectez la limite de 50 % par évaluation au premier cycle et assurez au moins 20 % d’évaluations avant la date limite d’abandon (ou avant la 10e séance pour un cours intensif). Cliquez sur **Exporter en PDF**; dans la boîte d’impression de Chrome/Edge, sélectionnez **Enregistrer au format PDF**.

## Importer un ancien plan

1. À l’accueil, choisissez **Importer un ancien plan** et sélectionnez un fichier `.docx` ou un PDF de 25 Mo ou moins.
2. Examinez les champs, les tableaux et les objectifs proposés, puis les sections non détectées et les avertissements. Les correspondances de confiance moyenne sont à confirmer.
3. Les informations importées remplacent seulement les champs correspondants; les autres valeurs du brouillon sont conservées. Les textes institutionnels du gabarit courant ne sont pas remplacés par ceux du document importé.
4. Après le transfert, vérifiez chaque champ dans le formulaire, notamment les dates, les statuts, les politiques et les tableaux, puis complétez les sections manquantes avant l’export.

L’extraction DOCX et PDF s’effectue localement dans le navigateur, avec les moteurs intégrés dans `vendor`; aucun fichier n’est téléversé. L’import PDF nécessite une couche de texte sélectionnable. Aucun OCR n’est effectué : un PDF numérisé ou des pages sans texte sont signalés, et doivent être transcrits manuellement. La mise en page complexe, les tableaux PDF et les formulations différentes du gabarit peuvent réduire la précision de l’association; le rapport n’est pas une validation institutionnelle.

La section 06 est une zone de texte facultative. **Utiliser un modèle de rédaction** insère l’exemple modifiable sans remplacer un texte déjà saisi; les communications récupérées d’un ancien tableau sont converties en lignes de texte. Les paragraphes et sauts de ligne sont conservés à l’impression.

## Vérifier la couverture et le PDF

La page couverture suit l’ordre du gabarit UQAC : logo officiel extrait du gabarit, module/unité et département, « Plan de cours », nom du cours, sigle, groupe, trimestre, local ou lien Zoom, puis le bloc « Coordonnées » (nom, local de rendez-vous, disponibilités et adresse courriel). Le PDF est mis en page en format lettre et utilise un saut de page après la couverture. Dans l’aperçu d’impression, vérifiez que la couverture occupe une page et que la section 1 commence à la page suivante.

Comparez le PDF enregistré à `references/Gabarit plan de cours_2026-2027.docx`, notamment l’ordre des éléments de la couverture, les 16 titres, les tableaux, les contenus institutionnels et les sauts de page. Vérifiez aussi l’échelle de notation et les exigences particulières de votre programme; ce générateur ne constitue pas une approbation institutionnelle.

## Références de développement

Les documents ci-dessous ont servi à développer l’application. Ils restent dans le dossier local `references/`, exclu du dépôt par `.gitignore`, et ne sont pas requis à l’exécution.
- `references/Gabarit plan de cours_2026-2027.docx` : ordre de la couverture, libellés des 16 sections, astérisques, vue synoptique et exemples de tableaux.
- `references/Guide de rédaction d'un plan de cours_2026-2027.docx` : recommandations, échéances, charge de travail, formulations institutionnelles suggérées, évaluations, exigences de formation et ressources.
- `references/Formulaire_validation_plan_de_cours_editable (4).pdf` : grille d’une page décodée et consultée pour intégrer les contrôles de validation, dont le seuil de 20 % avant l’abandon, la limite de 50 % par évaluation au premier cycle, les critères d’évaluation, les références de politiques à jour, les hyperliens et la cohérence du plan. Les numéros et dates exacts des politiques doivent être vérifiés manuellement auprès de l’unité; ne considérez pas cette application comme remplaçant sa validation.

L’interface reprend le vert UQAC `#7A9C49` et le vert pâle `#95B147`; des tons plus foncés sont utilisés pour les textes et boutons afin d’assurer le contraste. Rien n’est déployé publiquement.
