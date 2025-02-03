
// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAPk0glFjN0eqfIdI9rtgjGtBvzquPywOk",
    authDomain: "base1-4a6a4.firebaseapp.com",
    databaseURL: "https://base1-4a6a4-default-rtdb.firebaseio.com",
    projectId: "base1-4a6a4",
    storageBucket: "base1-4a6a4.firebasestorage.app",
    messagingSenderId: "879298189541",
    appId: "1:879298189541:web:367f6e1eb43973c297dc0c",
    measurementId: "G-V4VND5BJWX"
  };

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const adminRef = firebase.database().ref('admin/subscription');

// Default markup values
let detailMarkupPercentage = 20;
let wholesaleMarkupPercentage = 15;

// Références DOM
const navLinks = document.querySelectorAll('nav ul li a');
const sections = document.querySelectorAll('.section');
const venteForm = document.getElementById('venteForm');
const stockForm = document.getElementById('stockForm');
const stockTable = document.getElementById('stockTable').querySelector('tbody');
const beneficesTable = document.getElementById('beneficesTable').querySelector('tbody');
const recouvrementTable = document.getElementById('recouvrementTable').querySelector('tbody');
const ventesTable = document.getElementById('ventesTable').querySelector('tbody');
const boutiqueSelect = document.getElementById('boutiqueSelect');
const dateDebut = document.getElementById('dateDebut');
const dateFin = document.getElementById('dateFin');
const genererBeneficesButton = document.getElementById('genererBenefices');
const beneficeTotalSpan = document.getElementById('beneficeTotal');
const ventesJourSpan = document.getElementById('ventesJour');
const stockAlerteUl = document.getElementById('stockAlerte');
const imeiAVerifierInput = document.getElementById('imeiAVerifier');
const verifierImeiButton = document.getElementById('verifierImei');
const resultatVerificationDiv = document.getElementById('resultatVerification');
const produitResultatSpan = document.getElementById('produitResultat');
const dateVenteResultatSpan = document.getElementById('dateVenteResultat');
const nomClientResultatSpan = document.getElementById('nomClientResultat');
const statutPaiementResultatSpan = document.getElementById('statutPaiementResultat');
const depensesSpan = document.getElementById('depenses');
const currentUserSpan = document.getElementById('currentUser');
const logoutBtn = document.getElementById('logoutBtn');
const topVentesTable = document.getElementById('topVentesTable').querySelector('tbody'); // Changed ID
const invendusTable = document.getElementById('invendusTable').querySelector('tbody'); // Changed ID
const ventesParVendeurTable = document.getElementById('ventesParVendeur').querySelector('tbody');
const topSellerWeekSpan = document.getElementById('topSellerWeek');
const topSellerMonthSpan = document.getElementById('topSellerMonth');
const capitalGeneralSpan = document.getElementById('capitalGeneral');
const beneficeGeneralSpan = document.getElementById('beneficeGeneral');
const statusMessageDiv = document.getElementById('statusMessage');
const totalPurchasePriceValueCell = document.getElementById('totalPurchasePriceValue');
const totalSellingPriceValueCell = document.getElementById('totalSellingPriceValue');
const depenseForm = document.getElementById('depenseForm');
const depensesTable = document.getElementById('depensesTable').querySelector('tbody');
const totalBeneficeTableSpan = document.getElementById('totalBeneficeTable');
const beneficeNetSpan = document.getElementById('beneficeNet');
const periodeAnalyseSelect = document.getElementById('periodeAnalyse');
const dateDebutAnalyseInput = document.getElementById('dateDebutAnalyse');
const dateFinAnalyseInput = document.getElementById('dateFinAnalyse');
const appliquerAnalyseButton = document.getElementById('appliquerAnalyse');
const stockOperationsTable = document.getElementById('stockOperationsTable').querySelector('tbody');
const subscriptionStatusDisplay = document.getElementById('subscriptionStatus');
const subscribeMonthlyButton = document.getElementById('subscribeMonthly');
const subscribeYearlyButton = document.getElementById('subscribeYearly');
const cancelSubscriptionButton = document.getElementById('cancelSubscription');
const paymentModal = document.getElementById('paymentModal');
const overlay = document.getElementById('overlay');
const subscriptionRequiredModal = document.getElementById('subscriptionRequiredModal');


let currentUser = null;
let currentUserId = null;
let currentUserStatus = null; // Track user status

// Function to format currency (FCFA) and integers
function formatCurrency(amount) {
    const formattedAmount = parseInt(amount).toLocaleString('fr-FR', { // Force integer and use French locale
        currency: 'XOF', // FCFA currency code
        style: 'currency',
        currencyDisplay: 'code', // Display currency code
        maximumFractionDigits: 0, // No decimal digits
    }).replace('XOF', 'FCFA').trim(); // Replace 'XOF' with 'FCFA' and trim spaces
    return formattedAmount;
}
function formatInteger(number) {
    return parseInt(number).toLocaleString('fr-FR'); // Format as integer with French locale for thousand separators
}


function afficherSection(sectionId) {
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    });

    if (sectionId === 'ventes') {
        const boutique = boutiqueSelect.value;
        chargerProduitsPourBoutique(boutique); // Load products for the selected boutique in ventes section
    }
}

function checkUserAccess(sectionId) {
    firebase.database().ref('admin/subscription').once('value', snapshot => {
        const subscription = snapshot.val();
        const now = new Date();

        if (subscription && subscription.status === 'active') {
            const endDate = new Date(subscription.endDate);
            if (endDate < now) {
                showSubscriptionRequiredModal();
            } else {
                afficherSection(sectionId);
            }
        } else {
            showSubscriptionRequiredModal();
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const sectionId = this.dataset.section;
        checkUserAccess(sectionId);
         if (sectionId === 'depensesSection') {
            const boutique = boutiqueSelect.value;
            chargerDepenses(boutique);
        }
         if (sectionId === 'benefices') {
            const boutique = boutiqueSelect.value;
            chargerBenefices(boutique);
        }
        if (sectionId === 'ventes') {
            const boutique = boutiqueSelect.value;
            chargerVentes(boutique);
        }
        if (sectionId === 'stock') {
            const boutique = boutiqueSelect.value;
            chargerStock(boutique);
        }
        if (sectionId === 'recouvrement') {
            const boutique = boutiqueSelect.value;
            chargerRecouvrements(boutique);
        }
         if (sectionId === 'analyse') {
            const boutique = boutiqueSelect.value;
            updateAnalysisSection(boutique, 'semaine'); // Default to 'semaine'
        }
        if (sectionId === 'accueil') {
            const boutique = boutiqueSelect.value;
             chargerVentesDuJour(boutique);
             chargerAlertesStock(boutique);
             updateCapitalGeneralAndBeneficeGeneral(boutique);
             updateVentesChart(boutique);
              const today = new Date().toISOString().split('T')[0];
             const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            const dateFinSemaine = nextWeek.toISOString().split('T')[0];
             getSalesBySeller(boutique,  getFirstDayOfCurrentMonth().toISOString().split('T')[0], today);
        }
    });
});

function updateAnalysisSection(boutique, period, startDate = null, endDate = null) {
    let startD, endD;

    if (period === 'personnalise') {
        startD = startDate;
        endD = endDate;
    } else if (period === 'semaine') {
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        endD = nextWeek.toISOString().split('T')[0];
        startD = today;
    } else if (period === 'mois') {
        const today = new Date().toISOString().split('T')[0];
        startD = getFirstDayOfCurrentMonth().toISOString().split('T')[0];
        endD = today;
    } else { // Default to 'semaine'
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        endD = nextWeek.toISOString().split('T')[0];
        startD = today;
        period = 'semaine'; // Correct period if default is used
    }

    getTopSellingProducts(boutique, startD, endD);
    getUnsoldProducts(boutique, startD, endD);
    getSalesBySeller(boutique, getFirstDayOfCurrentMonth().toISOString().split('T')[0], new Date().toISOString().split('T')[0]);
}

periodeAnalyseSelect.addEventListener('change', function() {
    const periode = this.value;
    if (periode === 'personnalise') {
        dateDebutAnalyseInput.classList.remove('hidden');
        dateFinAnalyseInput.classList.remove('hidden');
    } else {
        dateDebutAnalyseInput.classList.add('hidden');
        dateFinAnalyseInput.classList.add('hidden');
    }
});

appliquerAnalyseButton.addEventListener('click', function() {
    const boutique = boutiqueSelect.value;
    const periode = periodeAnalyseSelect.value;
    const dateDebut = dateDebutAnalyseInput.value;
    const dateFin = dateFinAnalyseInput.value;

    updateAnalysisSection(boutique, periode, dateDebut, dateFin);
});


function getProduits() {
  const produitsRef = database.ref('produits');
  produitsRef.on('value', (snapshot) => {
    const produits = snapshot.val();
    const produitsListe = document.getElementById('produitsListe');
    produitsListe.innerHTML = '';

    for (const produitId in produits) {
      const produit = produits[produitId];
      const option = document.createElement('option');
      option.value = produit.nom;
      produitsListe.appendChild(option);
    }
  });
}

function chargerProduitsPourBoutique(boutique) {
    const produitVenteSelect = document.getElementById('produitVente');
    produitVenteSelect.innerHTML = '<option value="">Sélectionnez un produit</option>'; // Reset dropdown

    if (boutique === 'Toutes') {
        produitVenteSelect.disabled = true; // Disable if 'Toutes' is selected
        const option = document.createElement('option');
        option.value = '';
        option.text = 'Sélectionnez une boutique d\'abord';
        produitVenteSelect.appendChild(option);

        return; // Exit function if 'Toutes' is selected
    } else {
        produitVenteSelect.disabled = false; // Enable if a specific boutique is selected
    }


    const stockRef = database.ref(`stock/${boutique}`);
    stockRef.once('value', (snapshot) => {
        const stock = snapshot.val();
        if (stock) {
            for (const produitNom in stock) {
                const optionVente = document.createElement('option');
                optionVente.value = produitNom;
                optionVente.text = produitNom;
                produitVenteSelect.appendChild(optionVente);
            }
        }
    });
}


getProduits();

function showStatusMessage(message, isSuccess = true) {
    statusMessageDiv.textContent = message;
    statusMessageDiv.classList.remove('hidden');
    if (isSuccess) {
        statusMessageDiv.style.backgroundColor = '#d4edda';
        statusMessageDiv.style.color = '#155724';
        statusMessageDiv.style.borderColor = '#c3e6cb';
    } else {
        statusMessageDiv.style.backgroundColor = '#f8d7da';
        statusMessageDiv.style.color = '#721c24';
        statusMessageDiv.style.borderColor = '#f5c6cb';
    }

    setTimeout(() => {
        statusMessageDiv.classList.add('hidden');
    }, 3000);
}


venteForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const venteId = venteForm.dataset.venteId;
    const boutique = boutiqueSelect.value;

     if (boutique === 'Toutes') {
        showStatusMessage('Veuillez sélectionner une boutique avant d\'enregistrer une vente.', false);
        return;
    }

    if (venteId) {
        const dateVente = document.getElementById('dateVente').value;
        const produitVente = document.getElementById('produitVente').value;
        const quantiteVente = parseInt(document.getElementById('quantiteVente').value);
        const prixUnitaireVente = parseFloat(document.getElementById('prixUnitaireVente').value);
        const typeVente = document.getElementById('typeVente').value;
        const imeiVente = document.getElementById('imeiVente').value;
        const nomClient = document.getElementById('nomClient').value;
        const telClient = document.getElementById('telClient').value;
        const estPaye = document.getElementById('estPaye').checked;
        const prixTotal = quantiteVente * prixUnitaireVente;
        const vendeur = currentUser;

        const venteRef = database.ref(`ventes/${boutique}/${venteId}`);

        venteRef.once('value', (originalSaleSnapshot) => {
            const originalSale = originalSaleSnapshot.val();
            if (originalSale) {
                mettreAJourStock(originalSale.produit, -originalSale.quantite, boutique, 'vente', originalSale.type);

                venteRef.update({
                    date: dateVente,
                    produit: produitVente,
                    quantite: quantiteVente,
                    prixUnitaire: prixUnitaireVente,
                    type: typeVente,
                    imei: imeiVente,
                    nomClient: nomClient,
                    telClient: telClient,
                    statutPaiement: estPaye ? 'Payé' : 'Non payé',
                    prixTotal: prixTotal,
                    vendeur: vendeur
                })
                .then(() => {
                    mettreAJourStock(produitVente, quantiteVente, boutique, 'vente', typeVente);
                    showStatusMessage('Vente mise à jour avec succès et stock ajusté!');
                    venteForm.reset();
                    venteForm.querySelector('button[type="submit"]').textContent = 'Enregistrer';
                    delete venteForm.dataset.venteId;
                    chargerVentes(boutique);
                })
                .catch(error => {
                    console.error("Erreur lors de la mise à jour de la vente:", error);
                    showStatusMessage("Erreur lors de la mise à jour de la vente.", false);
                });
            }
        });
    } else {
         const dateVente = document.getElementById('dateVente').value;
        const produitVente = document.getElementById('produitVente').value;
        const quantiteVente = parseInt(document.getElementById('quantiteVente').value);
        const prixUnitaireVente = parseFloat(document.getElementById('prixUnitaireVente').value);
        const typeVente = document.getElementById('typeVente').value;
        const imeiVente = document.getElementById('imeiVente').value;
        const nomClient = document.getElementById('nomClient').value;
        const telClient = document.getElementById('telClient').value;
        const estPaye = document.getElementById('estPaye').checked;
        const prixTotal = quantiteVente * prixUnitaireVente;
        const vendeur = currentUser;

        const venteRef = database.ref(`ventes/${boutique}`).push();
        venteRef.set({
            date: dateVente,
            produit: produitVente,
            quantite: quantiteVente,
            prixUnitaire: prixUnitaireVente,
            type: typeVente,
            imei: imeiVente,
            nomClient: nomClient,
            telClient: telClient,
            statutPaiement: estPaye ? 'Payé' : 'Non payé',
            prixTotal: prixTotal,
            vendeur: vendeur
        })
        .then(() => {
            showStatusMessage('Vente enregistrée avec succès!');
            venteForm.reset();
            mettreAJourStock(produitVente, quantiteVente, boutique, 'vente', typeVente);
            chargerVentes(boutique);
        })
        .catch(error => {
            console.error("Erreur lors de l'enregistrement de la vente:", error);
            showStatusMessage("Erreur lors de l'enregistrement de la vente.", false);
        });
    }
});

function chargerVentes(boutique) {
    const ventesRef = database.ref(`ventes/${boutique}`);
    ventesRef.on('value', (snapshot) => {
        ventesTable.innerHTML = '';
        snapshot.forEach(childSnapshot => {
            const vente = childSnapshot.val();
            const row = ventesTable.insertRow();
            row.insertCell().textContent = vente.date;
            row.insertCell().textContent = vente.produit;
            row.insertCell().textContent = formatInteger(vente.quantite);
            row.insertCell().textContent = formatCurrency(vente.prixUnitaire);
            row.insertCell().textContent = formatCurrency(vente.prixTotal);
            row.insertCell().textContent = vente.type;
            row.insertCell().textContent = vente.nomClient;
            row.insertCell().textContent = vente.telClient;
            row.insertCell().textContent = vente.statutPaiement;
            row.insertCell().textContent = vente.vendeur;

            const actionsCell = row.insertCell();
            const actionIcons = document.createElement('div');
            actionIcons.className = 'action-icons';

            if (currentUserStatus !== 'Vendeur') { // Check user status here
                const editIcon = document.createElement('i');
                editIcon.className = 'fas fa-edit';
                editIcon.addEventListener('click', () => {
                    document.getElementById('dateVente').value = vente.date;
                    document.getElementById('produitVente').value = vente.produit;
                    document.getElementById('quantiteVente').value = vente.quantite;
                    document.getElementById('prixUnitaireVente').value = vente.prixUnitaire;
                    document.getElementById('typeVente').value = vente.type;
                    document.getElementById('imeiVente').value = vente.imei;
                    document.getElementById('nomClient').value = vente.nomClient;
                    document.getElementById('telClient').value = vente.telClient;
                    document.getElementById('estPaye').checked = vente.statutPaiement === 'Payé';

                    venteForm.querySelector('button[type="submit"]').textContent = 'Mettre à jour';
                    venteForm.dataset.venteId = childSnapshot.key;
                });

                const deleteIcon = document.createElement('i');
                deleteIcon.className = 'fas fa-trash-alt';
                deleteIcon.addEventListener('click', () => {
                    if (confirm(`Êtes-vous sûr de vouloir supprimer cette vente ?`)) {
                        supprimerVente(childSnapshot.key, boutique);
                    }
                });

                actionIcons.appendChild(editIcon);
                actionIcons.appendChild(deleteIcon);
            }
            actionsCell.appendChild(actionIcons);
        });
    });
}


function supprimerVente(venteId, boutique) {
    const venteRef = database.ref(`ventes/${boutique}/${venteId}`);
    venteRef.once('value', (snapshot) => {
        const vente = snapshot.val();
        if (vente) {
            mettreAJourStock(vente.produit, -vente.quantite, boutique, 'vente', vente.type);
            venteRef.remove()
            .then(() => {
                showStatusMessage(`Vente supprimée avec succès et stock mis à jour!`);
                chargerVentes(boutique);
            })
            .catch(error => {
                console.error("Erreur lors de la suppression de la vente:", error);
                showStatusMessage("Erreur lors de la suppression de la vente.", false);
            });
        }
    });
}


document.getElementById('produitVente').addEventListener('change', function() {
    const produitVenteNom = this.value;
    const boutique = boutiqueSelect.value;
    if (produitVenteNom && boutique && boutique !== 'Toutes') {
        const stockRef = database.ref(`stock/${boutique}/${produitVenteNom}`);
        stockRef.once('value', (snapshot) => {
            const stockData = snapshot.val();
            if (stockData && stockData.prixVenteDetail !== undefined) {
                document.getElementById('prixUnitaireVente').value = stockData.prixVenteDetail;
            } else {
                document.getElementById('prixUnitaireVente').value = '';
            }
        });
    } else {
        document.getElementById('prixUnitaireVente').value = '';
    }
});

stockForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const produit = document.getElementById('produitStock').value;
    const stockInitial = parseInt(document.getElementById('stockInitial').value);
    const approvisionnement = parseInt(document.getElementById('approvisionnement').value);
    const prixAchat = parseFloat(document.getElementById('prixAchat').value);
    const boutique = boutiqueSelect.value;
    const dateApprovisionnement = new Date().toISOString().split('T')[0];
    const vendeurApprovisionnement = currentUser;
    const isApprovisionnerMode = stockForm.querySelector('button[type="submit"]').textContent === 'Approvisionner';
    const operationType = isApprovisionnerMode ? 'Approvisionnement' : 'Ajout Initial'; // Determine operation type

    if (boutique === 'Toutes') {
        showStatusMessage('Veuillez sélectionner une boutique pour gérer le stock.', false);
        return;
    }

    const prixVenteDetail = prixAchat * (1 + (detailMarkupPercentage / 100));
    const prixVenteGros = prixAchat * (1 + (wholesaleMarkupPercentage / 100));

    const stockRef = database.ref(`stock/${boutique}/${produit}`);
    stockRef.once('value', (snapshot) => {
        const existingStock = snapshot.val();
        if (existingStock) {
            if (isApprovisionnerMode) {
                const newQuantite = existingStock.quantite + approvisionnement;
                const newApprovisionnementTotal = (existingStock.approvisionnement || 0) + approvisionnement;

                stockRef.update({
                    quantite: newQuantite,
                    prixAchat: prixAchat,
                    approvisionnement: newApprovisionnementTotal,
                    prixVenteDetail: prixVenteDetail,
                    prixVenteGros: prixVenteGros
                })
                .then(() => {
                    logStockOperation(boutique, produit, operationType, approvisionnement); // Log operation
                    const approvisionnementRef = database.ref(`approvisionnements/${boutique}`).push();
                    approvisionnementRef.set({
                        dateApprovisionnement: dateApprovisionnement,
                        produit: produit,
                        quantiteApprovisionnement: approvisionnement,
                        prixAchatUnitaire: prixAchat,
                        vendeurApprovisionnement: vendeurApprovisionnement
                    }).then(() => {
                        showStatusMessage('Stock approvisionné et mise à jour réussie!');
                        stockForm.reset();
                        stockForm.querySelector('button[type="submit"]').textContent = 'Ajouter au stock';
                        document.getElementById('produitStock').readOnly = false;
                        chargerStock(boutique);
                        updateCapitalGeneralAndBeneficeGeneral(boutique);
                    }).catch(error => {
                        console.error("Erreur lors de l'enregistrement de l'approvisionnement:", error);
                        showStatusMessage("Erreur lors de l'enregistrement de l'approvisionnement.", false);
                    });
                })
                .catch(error => {
                    console.error("Erreur lors de la mise à jour du stock:", error);
                    showStatusMessage("Erreur lors de la mise à jour du stock.", false);
                });

            } else {
                const newQuantite = existingStock.quantite + approvisionnement;
                 const newApprovisionnementTotal = (existingStock.approvisionnement || 0) + approvisionnement;
                stockRef.update({
                    quantite: newQuantite,
                    prixAchat: prixAchat,
                    approvisionnement: newApprovisionnementTotal,
                    prixVenteDetail: prixVenteDetail,
                    prixVenteGros: prixVenteGros
                })
                .then(() => {
                     logStockOperation(boutique, produit, operationType, approvisionnement); // Log operation
                     const approvisionnementRef = database.ref(`approvisionnements/${boutique}`).push();
                    approvisionnementRef.set({
                        dateApprovisionnement: dateApprovisionnement,
                        produit: produit,
                        quantiteApprovisionnement: approvisionnement,
                        prixAchatUnitaire: prixAchat,
                        vendeurApprovisionnement: vendeurApprovisionnement
                    }).then(() => {
                        showStatusMessage('Stock mis à jour et approvisionnement enregistré avec succès!');
                        stockForm.reset();
                        chargerStock(boutique);
                        updateCapitalGeneralAndBeneficeGeneral(boutique);
                    }).catch(error => {
                        console.error("Erreur lors de l'enregistrement de l'approvisionnement:", error);
                        showStatusMessage("Erreur lors de l'enregistrement de l'approvisionnement.", false);
                    });
                })
                .catch(error => {
                    console.error("Erreur lors de la mise à jour du stock:", error);
                    showStatusMessage("Erreur lors de la mise à jour du stock.", false);
                });
            }

        } else {
            stockRef.set({
                quantite: stockInitial + approvisionnement,
                prixAchat: prixAchat,
                stockInitial: stockInitial,
                approvisionnement: approvisionnement,
                prixVenteDetail: prixVenteDetail,
                prixVenteGros: prixVenteGros
            })
            .then(() => {
                logStockOperation(boutique, produit, operationType, stockInitial + approvisionnement); // Log initial add
                const approvisionnementRef = database.ref(`approvisionnements/${boutique}`).push();
                approvisionnementRef.set({
                    dateApprovisionnement: dateApprovisionnement,
                    produit: produit,
                    quantiteApprovisionnement: approvisionnement,
                    prixAchatUnitaire: prixAchat,
                    vendeurApprovisionnement: vendeurApprovisionnement
                }).then(() => {
                    showStatusMessage('Produit ajouté au stock et approvisionnement enregistré avec succès!');
                    stockForm.reset();
                    chargerStock(boutique);
                    updateCapitalGeneralAndBeneficeGeneral(boutique);
                }).catch(error => {
                    console.error("Erreur lors de l'enregistrement de l'approvisionnement initial:", error);
                    showStatusMessage("Erreur lors de l'enregistrement de l'approvisionnement initial.", false);
                });
            })
            .catch(error => {
                console.error("Erreur lors de l'ajout du produit au stock:", error);
                showStatusMessage("Erreur lors de l'ajout du produit au stock.", false);
            });
        }
    });
    const produitsRef = database.ref('produits');
    produitsRef.orderByChild('nom').equalTo(produit).once('value', (snapshot) => {
        if (snapshot.exists()) {
            // Product already exists, no action needed
        } else {
            const newProduitRef = produitsRef.push();
            newProduitRef.set({
                nom: produit
            })
            .then(() => {
                console.log('Produit ajouté à la liste des produits');
            })
            .catch(error => { // Correction: Changed ')' =>' to 'error => {' and added curly braces
                console.error("Erreur lors de l'ajout du produit à la liste des produits:", error);
            });
        }
    });
});


function mettreAJourStock(produit, quantite, boutique, typeOperation, typeVente) {
    const stockRef = database.ref(`stock/${boutique}/${produit}`);
    stockRef.transaction(stockActuel => {
        if (stockActuel) {
            if (typeOperation === 'vente') {
                if (quantite > 0) {
                    if (stockActuel.quantite >= quantite) {
                        let quantiteVendue = quantite;

                        if (stockActuel.approvisionnement && stockActuel.approvisionnement > 0) {
                            const approvisionnementPrelevement = Math.min(stockActuel.approvisionnement, quantiteVendue);
                            stockActuel.approvisionnement -= approvisionnementPrelevement;
                            quantiteVendue -= approvisionnementPrelevement;
                        }

                        if (quantiteVendue > 0 && stockActuel.stockInitial && stockActuel.stockInitial > 0) {
                            const stockInitialPrelevement = Math.min(stockActuel.stockInitial, quantiteVendue);
                            stockActuel.stockInitial -= stockInitialPrelevement;
                            quantiteVendue -= stockInitialPrelevement;
                        }

                        stockActuel.quantite -= quantite;

                         if (typeVente === 'detail') {
                            return stockActuel;
                        } else if (typeVente === 'gros') {
                           return stockActuel;
                        }
                    } else {
                        showStatusMessage("Quantité insuffisante en stock.", false);
                        return;
                    }
                } else if (quantite < 0) {
                    const quantiteRetour = -quantite;
                    stockActuel.quantite += quantiteRetour;

                    if (stockActuel.approvisionnement !== undefined) {
                        stockActuel.approvisionnement += quantiteRetour;
                    } else {
                        stockActuel.approvisionnement = quantiteRetour;
                    }

                    if (stockActuel.approvisionnement < 0) {
                        const excessNegatifApprovisionnement = -stockActuel.approvisionnement;
                        stockActuel.approvisionnement = 0;
                        if (stockActuel.stockInitial !== undefined) {
                            stockActuel.stockInitial += excessNegatifApprovisionnement;
                        } else {
                            stockActuel.stockInitial = excessNegatifApprovisionnement;
                        }
                    }
                     return stockActuel;


                }
            } else if (typeOperation === 'ajout') {
                stockActuel.quantite += quantite;
            }
        }
        return stockActuel;
    }, (error, committed) => {
        if (error) {
            console.error("Erreur lors de la mise à jour du stock:", error);
            showStatusMessage("Erreur lors de la mise à jour du stock.", false);
        } else if (committed) {
            console.log("Stock mis à jour avec succès.");
            chargerStock(boutique);
            updateCapitalGeneralAndBeneficeGeneral(boutique);
        } else {
            console.log("La transaction de mise à jour du stock a été annulée.");
        }
    });
}

function chargerStock(boutique) {
    const stockRef = database.ref(`stock/${boutique}`);
    stockRef.on('value', (snapshot) => {
        stockTable.innerHTML = '';
        let totalPurchasePriceSum = 0;
        let totalSellingPriceSum = 0;

        snapshot.forEach(childSnapshot => {
            const produit = childSnapshot.key;
            const details = childSnapshot.val();
            const row = stockTable.insertRow();
            row.insertCell().textContent = produit;
            row.insertCell().textContent = formatInteger(details.stockInitial !== undefined ? details.stockInitial : 'N/A');
            row.insertCell().textContent = formatInteger(details.approvisionnement !== undefined ? details.approvisionnement : 'N/A');
            row.insertCell().textContent = formatInteger(details.quantite);
            row.insertCell().textContent = formatCurrency(details.prixAchat);
            row.insertCell().textContent = formatCurrency(details.prixVenteDetail);
            row.insertCell().textContent = formatCurrency(details.prixVenteGros);

            const totalPurchasePrice = details.quantite * details.prixAchat;
            const totalSellingPrice = details.quantite * details.prixVenteDetail;

            row.insertCell().textContent = formatCurrency(totalPurchasePrice);
            row.insertCell().textContent = formatCurrency(totalSellingPrice);

            totalPurchasePriceSum += totalPurchasePrice;
            totalSellingPriceSum += totalSellingPrice;


            const actionsCell = row.insertCell();
            const actionIcons = document.createElement('div');
            actionIcons.className = 'action-icons';

            if (currentUserStatus !== 'Vendeur') { // Check user status here
                const editIcon = document.createElement('i');
                editIcon.className = 'fas fa-edit';
                editIcon.addEventListener('click', () => {
                    document.getElementById('produitStock').value = produit;
                    document.getElementById('stockInitial').value = details.stockInitial !== undefined ? details.stockInitial : 0;
                    document.getElementById('approvisionnement').value = details.approvisionnement !== undefined ? details.approvisionnement : 0;
                    document.getElementById('prixAchat').value = details.prixAchat;

                    stockForm.querySelector('button[type="submit"]').textContent = 'Mettre à jour';
                    stockForm.dataset.produit = produit;
                     logStockOperation(boutique, produit, 'Modification', null); // Log modification operation
                });

                const deleteIcon = document.createElement('i');
                deleteIcon.className = 'fas fa-trash-alt';
                deleteIcon.addEventListener('click', () => {
                    if (confirm(`Êtes-vous sûr de vouloir supprimer ${produit} du stock?`)) {
                        supprimerProduitDuStock(produit, boutique);
                    }
                });

                actionIcons.appendChild(editIcon);
                actionIcons.appendChild(deleteIcon);
            }

             const approvisionnerIcon = document.createElement('i');
            approvisionnerIcon.className = 'fas fa-box-open';
            approvisionnerIcon.addEventListener('click', () => {
                approvisionnerProduitDuStock(produit, boutique);
            });
             actionIcons.appendChild(approvisionnerIcon);


            actionsCell.appendChild(actionIcons);
        });

        totalPurchasePriceValueCell.textContent = formatCurrency(totalPurchasePriceSum);
        totalSellingPriceValueCell.textContent = formatCurrency(totalSellingPriceSum);

        updateCapitalGeneralAndBeneficeGeneral(boutique);
        chargerStockOperationsLog(boutique); // Load stock operations log when stock is loaded
    });
}

function supprimerProduitDuStock(produit, boutique) {
    const stockRef = database.ref(`stock/${boutique}/${produit}`);
    stockRef.remove()
    .then(() => {
        showStatusMessage(`${produit} supprimé du stock avec succès!`);
        logStockOperation(boutique, produit, 'Suppression', null); // Log deletion operation
        chargerStock(boutique);
        updateCapitalGeneralAndBeneficeGeneral(boutique);
    })
    .catch(error => {
        console.error("Erreur lors de la suppression du produit du stock:", error);
        showStatusMessage("Erreur lors de la suppression du produit du stock.", false);
    });
}

function approvisionnerProduitDuStock(produit, boutique) {
    const stockRef = database.ref(`stock/${boutique}/${produit}`);
    stockRef.once('value', (snapshot) => {
        const currentStockData = snapshot.val();
        if (currentStockData) {
            document.getElementById('produitStock').value = produit;
            document.getElementById('produitStock').readOnly = true;
            document.getElementById('stockInitial').value = currentStockData.stockInitial !== undefined ? currentStockData.stockInitial : 0;
            document.getElementById('approvisionnement').value = '';
            document.getElementById('prixAchat').value = currentStockData.prixAchat;

            stockForm.querySelector('button[type="submit"]').textContent = 'Approvisionner';
            stockForm.dataset.approvisionnerProduit = produit;

        } else {
            showStatusMessage("Produit non trouvé dans le stock.", false);
        }
    });
}

function logStockOperation(boutique, produit, operationType, quantiteChange) {
    const stockOperationsRef = database.ref(`stockOperationsLogs/${boutique}`).push();
    stockOperationsRef.set({
        date: new Date().toISOString(),
        produit: produit,
        operationType: operationType,
        quantiteChange: quantiteChange ? quantiteChange : 'N/A',
        utilisateur: currentUser
    });
}
function chargerStockOperationsLog(boutique) {
    stockOperationsTable.innerHTML = '';
    const stockOperationsLogRef = database.ref(`stockOperationsLogs/${boutique}`).orderByChild('date').limitToLast(5); // Fetch last 5 operations

    stockOperationsLogRef.on('value', (snapshot) => {
        stockOperationsTable.innerHTML = ''; // Clear existing table data
        snapshot.forEach(childSnapshot => {
            const operation = childSnapshot.val();
            const row = stockOperationsTable.insertRow();
            row.insertCell().textContent = operation.date.split('T')[0]; // Date only
            row.insertCell().textContent = operation.produit;
            row.insertCell().textContent = operation.operationType;
            row.insertCell().textContent = operation.quantiteChange;
            row.insertCell().textContent = operation.utilisateur;
        });
    });
}


boutiqueSelect.addEventListener('change', () => {
    const boutique = boutiqueSelect.value;
    if (boutique === 'Toutes') {
        chargerStockToutesBoutiques();
         chargerBenefices('Toutes');
         chargerDepensesToutesBoutiques();
         chargerRecouvrementsToutesBoutiques();
         chargerVentesDuJourToutesBoutiques();
         updateVentesChartToutesBoutiques();
         stockOperationsTable.innerHTML = '<tr><td colspan="5">Sélectionnez une boutique spécifique pour voir l\'historique des opérations de stock.</td></tr>';


    } else {
        chargerStock(boutique);
        chargerBenefices(boutique);
        chargerDepenses(boutique);
        chargerRecouvrements(boutique);
        chargerVentesDuJour(boutique);
        updateVentesChart(boutique);
        chargerStockOperationsLog(boutique);


    }
     chargerVentesDuJour(boutique);
     chargerAlertesStock(boutique);
    chargerVentes(boutique);
     updateCapitalGeneralAndBeneficeGeneral(boutique);
     chargerRecouvrements(boutique);
     updateVentesChart(boutique);
     chargerProduitsPourBoutique(boutique); // Update product list in ventes section

    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dateFinSemaine = nextWeek.toISOString().split('T')[0];

    updateAnalysisSection(boutique, periodeAnalyseSelect.value, dateDebutAnalyseInput.value, dateFinAnalyseInput.value);
    loadMarkupPercentages();
});

function chargerStockToutesBoutiques() {
    stockTable.innerHTML = '';
    const boutiques = ['Boutique1', 'Boutique2', 'Boutique3'];
     const boutiquesRef = database.ref('boutiques');
     boutiquesRef.once('value').then((snapshot) => {
         snapshot.forEach(childSnapshot => {
                boutiques.push(childSnapshot.key);
            });

            let totalPurchasePriceSumAllBoutiques = 0;
            let totalSellingPriceSumAllBoutiques = 0;

            boutiques.forEach(boutique => {
                const stockRef = database.ref(`stock/${boutique}`);
                stockRef.once('value', (snapshot) => {
                    snapshot.forEach(childSnapshot => {
                        const produit = childSnapshot.key;
                        const details = childSnapshot.val();
                        const row = stockTable.insertRow();
                        row.insertCell().textContent = `${boutique} - ${produit}`;
                         row.insertCell().textContent = formatInteger(details.stockInitial !== undefined ? details.stockInitial : 'N/A');
                        row.insertCell().textContent = formatInteger(details.approvisionnement !== undefined ? details.approvisionnement : 'N/A');
                        row.insertCell().textContent = formatInteger(details.quantite);
                        row.insertCell().textContent = formatCurrency(details.prixAchat);
                        row.insertCell().textContent = formatCurrency(details.prixVenteDetail);
                        row.insertCell().textContent = formatCurrency(details.prixVenteGros);

                        const totalPurchasePrice = details.quantite * details.prixAchat;
                        const totalSellingPrice = details.quantite * details.prixVenteDetail;

                        row.insertCell().textContent = formatCurrency(totalPurchasePrice);
                        row.insertCell().textContent = formatCurrency(totalSellingPrice);

                        row.insertCell().textContent = 'Non applicable';
                    });
                     totalPurchasePriceValueCell.textContent = formatCurrency(totalPurchasePriceSumAllBoutiques);
                     totalSellingPriceValueCell.textContent = formatCurrency(totalSellingPriceSumAllBoutiques);
                });
            });
       });
        updateCapitalGeneralAndBeneficeGeneral('Toutes');
}

function chargerBenefices(boutique) {
     beneficesTable.innerHTML = '';
     depensesSpan.textContent = formatCurrency(0);
    if (boutique === 'Toutes') {

        const boutiques = ['Boutique1', 'Boutique2', 'Boutique3'];
        const boutiquesRef = database.ref('boutiques');
        boutiquesRef.once('value').then((snapshot) => {
         snapshot.forEach(childSnapshot => {
                boutiques.push(childSnapshot.key);
            });
        let beneficesToutesBoutiques = {};
        let totalVentes = 0;
        let totalDepensesAllBoutiques = 0;

        const fusionnerBenefices = (boutique, benefices, depenses) => {
            for (const produit in benefices) {
                if (!beneficesToutesBoutiques[produit]) {
                    beneficesToutesBoutiques[produit] = 0;
                }
                beneficesToutesBoutiques[produit] += benefices[produit];
            }
             totalDepensesAllBoutiques += depenses;
            depensesSpan.textContent = formatCurrency(totalDepensesAllBoutiques);
            actualiserTableauBenefices(beneficesToutesBoutiques);
        };

        boutiques.forEach(boutique => {
            calculerEtAfficherBenefices(boutique)
                .then(({ benefices, depenses }) => {
                    fusionnerBenefices(boutique, benefices, depenses);
                })
                .catch(error => {
                    console.error("Erreur lors du calcul des bénéfices pour", boutique, error);
                });
        });

        database.ref('benefices').once('value', (snapshot) => {
            const allBenefices = snapshot.val();
            let beneficeTotal = 0;

            for (const boutiqueKey in allBenefices) {
                for (const dateKey in allBenefices[boutiqueKey]) {
                    beneficeTotal += parseFloat(allBenefices[boutiqueKey][dateKey].total) || 0;
                }
            }

            beneficeTotalSpan.textContent = formatCurrency(totalBeneficeSum);
            beneficeNetSpan.textContent = formatCurrency(beneficeTotal - parseFloat(depensesSpan.textContent.replace(/[^0-9.-]+/g,"")));
        });


        const actualiserTableauBenefices = (benefices) => {
            beneficesTable.innerHTML = '';
            let totalBeneficeSum = 0;
            for (const produit in benefices) {
                const row = beneficesTable.insertRow();
                row.insertCell().textContent = produit;
                row.insertCell().textContent = formatCurrency(benefices[produit]);
                totalBeneficeSum += benefices[produit];
            }
            totalBeneficeTableSpan.textContent = formatCurrency(totalBeneficeSum);
        };
      });
    } else {
        calculerEtAfficherBenefices(boutique)
            .then(({ benefices, totalVentes, depenses }) => {
                beneficesTable.innerHTML = '';
                let tableBeneficeSum = 0;
                for (const produit in benefices) {
                    const row = beneficesTable.insertRow();
                    row.insertCell().textContent = produit;
                    row.insertCell().textContent = formatCurrency(benefices[produit]);
                    tableBeneficeSum += benefices[produit];
                }
                depensesSpan.textContent = formatCurrency(depenses);
                totalBeneficeTableSpan.textContent = formatCurrency(tableBeneficeSum);
                beneficeNetSpan.textContent = formatCurrency(tableBeneficeSum - depenses);


            })
            .catch(error => {
                console.error("Erreur lors du calcul des bénéfices:", error);
            });

        const beneficeRef = database.ref(`benefices/${boutique}`);
        beneficeRef.once('value', (snapshot) => {
            const benefices = snapshot.val();
            let beneficeTotal = 0;
            for (const date in benefices) {
                    beneficeTotal += parseFloat(benefices[date].total) || 0;
            }
            totalBeneficeTableSpan.textContent = formatCurrency(tableBeneficeSum);
            beneficeNetSpan.textContent = formatCurrency(beneficeTotal - parseFloat(depensesSpan.textContent.replace(/[^0-9.-]+/g,"")));
        });
    }
}


function calculerEtAfficherBenefices(boutique) {
    return new Promise((resolve, reject) => {
        const ventesRef = database.ref(`ventes/${boutique}`);
        const depensesRef = database.ref(`depenses/${boutique}`);
        let benefices = {};
        let totalVentes = 0;
        let depensesTotales = 0;

        Promise.all([ventesRef.once('value'), depensesRef.once('value')])
        .then(([ventesSnapshot, depensesSnapshot]) => {
            const ventes = ventesSnapshot.val();
            const depensesData = depensesSnapshot.val();


            if (depensesData) {
                for (const depenseId in depensesData) {
                    const depense = depensesData[depenseId];
                        depensesTotales += parseFloat(depense.montantDepense) || 0;
                }
            }


            let quantiteVendue = 0;

            for (const venteId in ventes) {
                const vente = ventes[venteId];
                    totalVentes += vente.prixTotal;
                    quantiteVendue += vente.quantite;

                    const stockRef = database.ref(`stock/${boutique}/${vente.produit}`);
                    stockRef.once('value', (stockSnapshot) => {
                        const stock = stockSnapshot.val();
                        if (stock) {
                            const coutVente = vente.quantite * stock.prixAchat;
                            const beneficeProduit = vente.prixTotal - coutVente;

                            if (!benefices[vente.produit]) {
                                benefices[vente.produit] = 0;
                            }
                            benefices[vente.produit] += beneficeProduit;
                        }

                        const beneficeRef = database.ref(`benefices/${boutique}/${vente.date}`);
                        beneficeRef.transaction((currentBenefice) => {
                            if (!currentBenefice) {
                                currentBenefice = { total: 0 };
                            }
                            currentBenefice.total += beneficeProduit;
                            return currentBenefice;
                        }, (error, committed) => {
                            if (error) {
                                console.error("Erreur lors de l'enregistrement du bénéfice:", error);
                                reject(error);
                            } else if (committed) {
                                console.log("Bénéfice enregistré avec succès.");
                            } else {
                                console.log("La transaction d'enregistrement du bénéfice a été annulée.");
                            }
                        });
                    });
            }
            let beneficeTotalCalculated = 0;
            for (const produit in benefices) {
                beneficeTotalCalculated += benefices[produit];
            }
            beneficeTotalCalculated -= depensesTotales;
            depensesSpan.textContent = formatCurrency(depensesTotales);


            resolve({ benefices, totalVentes, depenses: depensesTotales});
        }).catch(error => {
             reject(error);
        });


    });
}


function chargerRecouvrements(boutique) {
    recouvrementTable.innerHTML = '';
    const recouvrementsRef = database.ref(`ventes/${boutique}`);
    recouvrementsRef.on('value', (snapshot) => {
        snapshot.forEach(childSnapshot => {
            const vente = childSnapshot.val();
            if (vente.statutPaiement === 'Non payé') {
                const row = recouvrementTable.insertRow();
                row.insertCell().textContent = vente.nomClient;
                row.insertCell().textContent = vente.telClient;
                row.insertCell().textContent = vente.produit;
                row.insertCell().textContent = formatCurrency(vente.prixTotal);
                row.insertCell().textContent = vente.date;
                row.insertCell().textContent = vente.statutPaiement;

                const payerButton = document.createElement('button');
                payerButton.textContent = 'Payer';
                payerButton.addEventListener('click', () => {
                    marquerCommePaye(childSnapshot.key, boutique);
                });
                const actionsCell = row.insertCell();
                actionsCell.appendChild(payerButton);
            }
        });
    });
}

function marquerCommePaye(venteId, boutique) {
    const venteRef = database.ref(`ventes/${boutique}/${venteId}`);
    venteRef.update({ statutPaiement: 'Payé' })
    .then(() => {
        showStatusMessage('Vente marquée comme payée avec succès!');
        chargerRecouvrements(boutique);
    })
    .catch(error => {
        console.error("Erreur lors de la mise à jour du statut de paiement:", error);
        showStatusMessage("Erreur lors de la mise à jour du statut de paiement.", false);
    });
}


boutiqueSelect.addEventListener('change', () => {
    const boutique = boutiqueSelect.value;
    if (boutique === 'Toutes') {
        chargerRecouvrementsToutesBoutiques();
    } else {
        chargerRecouvrements(boutique);
    }
});

function chargerRecouvrementsToutesBoutiques() {
    recouvrementTable.innerHTML = '';
    const boutiques = ['Boutique1', 'Boutique2', 'Boutique3'];
    const boutiquesRef = database.ref('boutiques');
     boutiquesRef.once('value').then((snapshot) => {
         snapshot.forEach(childSnapshot => {
                boutiques.push(childSnapshot.key);
            });
            boutiques.forEach(boutique => {
                const recouvrementsRef = database.ref(`ventes/${boutique}`);
                recouvrementsRef.on('value', (snapshot) => {
                    snapshot.forEach(childSnapshot => {
                        const vente = childSnapshot.val();
                        if (vente.statutPaiement === 'Non payé') {
                            const row = recouvrementTable.insertRow();
                            row.insertCell().textContent = `(${boutique}) ${vente.nomClient}`;
                            row.insertCell().textContent = vente.telClient;
                            row.insertCell().textContent = vente.produit;
                            row.insertCell().textContent = formatCurrency(vente.prixTotal);
                            row.insertCell().textContent = vente.date;
                            row.insertCell().textContent = vente.statutPaiement;

                            const payerButton = document.createElement('button');
                            payerButton.textContent = 'Payer';
                            payerButton.addEventListener('click', () => {
                                marquerCommePaye(childSnapshot.key, boutique);
                            });
                            const actionsCell = row.insertCell();
                            actionsCell.appendChild(payerButton);
                        }
                    });
                });
            });
       });
}


function chargerVentesDuJour(boutique) {
    const ventesRef = database.ref(`ventes/${boutique}`);
    ventesRef.on('value', (snapshot) => {
        const ventes = snapshot.val();
        const today = new Date().toISOString().split('T')[0];
        let ventesDuJour = 0;

        for (const venteId in ventes) {
            if (ventes[venteId].date === today) {
                ventesDuJour++;
            }
        }

        ventesJourSpan.textContent = formatInteger(ventesDuJour);
        updateVentesChart(boutique);
    });
}
function chargerVentesDuJourToutesBoutiques() {
    let totalVentesDuJour = 0;
    const boutiques = ['Boutique1', 'Boutique2', 'Boutique3'];
    const boutiquesRef = database.ref('boutiques');
     boutiquesRef.once('value').then((snapshot) => {
         snapshot.forEach(childSnapshot => {
                boutiques.push(childSnapshot.key);
            });
            const today = new Date().toISOString().split('T')[0];
            const promises = boutiques.map(boutique => {
                return new Promise(resolve => {
                    const ventesRef = database.ref(`ventes/${boutique}`);
                    ventesRef.once('value', (snapshot) => {
                        let ventesDuJourBoutique = 0;
                        const ventes = snapshot.val();
                        if (ventes) {
                            for (const venteId in ventes) {
                                if (ventes[venteId].date === today) {
                                    ventesDuJourBoutique++;
                                }
                            }
                        }
                        totalVentesDuJour += ventesDuJourBoutique;
                        resolve();
                    });
                });
            });

            Promise.all(promises).then(() => {
                ventesJourSpan.textContent = formatInteger(totalVentesDuJour);
                updateVentesChartToutesBoutiques();
            });
       });

}


function chargerAlertesStock(boutique) {
    const stockRef = database.ref(`stock/${boutique}`);
    stockRef.on('value', (snapshot) => {
        stockAlerteUl.innerHTML = '';
        snapshot.forEach(childSnapshot => {
            const produit = childSnapshot.key;
            const details = childSnapshot.val();
            if (details.quantite < 5) {
                const li = document.createElement('li');
                li.textContent = `${produit} : ${formatInteger(details.quantite)} restant(s)`;
                stockAlerteUl.appendChild(li);
            }
        });
    });
}


verifierImeiButton.addEventListener('click', () => {
    const imeiAVerifier = imeiAVerifierInput.value;
     const boutiquesRef = database.ref('boutiques');
    const boutiques = ['Boutique1', 'Boutique2', 'Boutique3'];
     boutiquesRef.once('value').then((snapshot) => {
         snapshot.forEach(childSnapshot => {
                boutiques.push(childSnapshot.key);
            });
        let imeiTrouve = false;

        boutiques.forEach(boutique => {
            const ventesRef = database.ref(`ventes/${boutique}`);
            ventesRef.once('value', (snapshot) => {
                snapshot.forEach(childSnapshot => {
                    const vente = childSnapshot.val();
                    if (vente.imei === imeiAVerifier) {
                        imeiTrouve = true;
                        produitResultatSpan.textContent = vente.produit;
                        dateVenteResultatSpan.textContent = vente.date;
                        nomClientResultatSpan.textContent = vente.nomClient;
                        statutPaiementResultatSpan.textContent = vente.statutPaiement;
                        resultatVerificationDiv.classList.remove('hidden');
                    }
                });

                if (!imeiTrouve) {
                    produitResultatSpan.textContent = 'IMEI non trouvé';
                    dateVenteResultatSpan.textContent = '';
                    nomClientResultatSpan.textContent = '';
                    statutPaiementResultatSpan.textContent = '';
                    resultatVerificationDiv.classList.remove('hidden');
                }
            });
        });
     });
});

function updateVentesChart(boutique) {
    const ventesRef = database.ref(`ventes/${boutique}`);
    ventesRef.once('value', (snapshot) => {
        const ventes = snapshot.val();
        const ventesParJour = {};

        for (const venteId in ventes) {
            const date = ventes[venteId].date;
            if (!ventesParJour[date]) {
                ventesParJour[date] = 0;
            }
            ventesParJour[date]++;
        }

        const labels = Object.keys(ventesParJour);
        const data = Object.values(ventesParJour);

        const ctx = document.getElementById('ventesChart').getContext('2d');
        if (window.ventesChart) {
            window.ventesChart.destroy();
        }
        window.ventesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nombre de ventes par jour',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
}



function updateVentesChartToutesBoutiques() {
    const ventesParJour = {};
    const boutiques = ['Boutique1', 'Boutique2', 'Boutique3'];
    const boutiquesRef = database.ref('boutiques');
     boutiquesRef.once('value').then((snapshot) => {
         snapshot.forEach(childSnapshot => {
                boutiques.push(childSnapshot.key);
            });

        const promises = boutiques.map(boutique => {
            return new Promise((resolve) => {
                const ventesRef = database.ref(`ventes/${boutique}`);
                ventesRef.once('value', (snapshot) => {
                    const ventes = snapshot.val();
                    for (const venteId in ventes) {
                        const date = ventes[venteId].date;
                        if (!ventesParJour[date]) {
                            ventesParJour[date] = 0;
                        }
                        ventesParJour[date]++;
                    }
                    resolve();
                });
            });
        });

        Promise.all(promises).then(() => {
            const labels = Object.keys(ventesParJour);
            const data = Object.values(ventesParJour);

            const ctx = document.getElementById('ventesChart').getContext('2d');
            if (window.ventesChart) {
                window.ventesChart.destroy();
            }
            window.ventesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Nombre de ventes par jour (Toutes les boutiques)',
                        data: data,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
    });
}


function loadBoutiqueNames() {
    const boutiquesRef = database.ref('boutiques');
    boutiquesRef.once('value').then((snapshot) => {
        boutiqueSelect.innerHTML = '<option value="Toutes">Toutes les boutiques</option>';
        snapshot.forEach(childSnapshot => {
            const boutique = childSnapshot.val();
            const option = document.createElement('option');
            option.value = childSnapshot.key;
            option.text = boutique.name;
            boutiqueSelect.appendChild(option);
        });
        const today = new Date().toISOString().split('T')[0];
        dateDebut.value = today;

        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        dateFin.value = nextWeek.toISOString().split('T')[0];
        boutiqueSelect.dispatchEvent(new Event('change'));
    });
}

function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    currentUser = sessionStorage.getItem('currentUser');
    currentUserStatus = sessionStorage.getItem('currentUserStatus'); // Retrieve user status

    if (isLoggedIn === 'true' && currentUser) {
        currentUserSpan.textContent = `Connecté en tant que : ${currentUser}`;
        logoutBtn.classList.remove('hidden');
         loadBoutiqueNames()
        afficherSection('accueil');
        loadMarkupPercentages();
         const boutique = boutiqueSelect.value;
         chargerVentesDuJour(boutique);
         chargerAlertesStock(boutique);
         updateCapitalGeneralAndBeneficeGeneral(boutique);
         updateVentesChart(boutique);
          const today = new Date().toISOString().split('T')[0];
             const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            const dateFinSemaine = nextWeek.toISOString().split('T')[0];
             getSalesBySeller(boutique,  getFirstDayOfCurrentMonth().toISOString().split('T')[0], today);
             checkSubscriptionStatus();


    } else {
        currentUserSpan.textContent = '';
        logoutBtn.classList.add('hidden');
        window.location.href = 'login.html';
    }
}


logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUserStatus'); // Remove user status on logout
    currentUser = null;
    currentUserSpan.textContent = '';
    logoutBtn.classList.add('hidden');
    window.location.href = 'login.html';
});


function loadMarkupPercentages() {
    const settingsRef = database.ref('settings');
    settingsRef.once('value', (snapshot) => {
        const settings = snapshot.val();
        if (settings) {
            detailMarkupPercentage = settings.detailMarkup !== undefined ? parseFloat(settings.detailMarkup) : 20;
            wholesaleMarkupPercentage = settings.wholesaleMarkup !== undefined ? parseFloat(settings.wholesaleMarkup) : 15;
        } else {
            detailMarkupPercentage = 20;
            wholesaleMarkupPercentage = 15;
        }
    });
}

function showLoader() {
    document.getElementById('loaderWrapper').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loaderWrapper').style.display = 'none';
}

function showPageLoader() {
    document.getElementById('pageLoaderWrapper').style.display = 'flex';
}

function hidePageLoader() {
    document.getElementById('pageLoaderWrapper').style.display = 'none';
}
function showSubscriptionRequiredModal() {
    subscriptionRequiredModal.style.display = 'flex';
}

function hideSubscriptionRequiredModal() {
    subscriptionRequiredModal.style.display = 'none';
}

function redirectToSubscription() {
    hideSubscriptionRequiredModal();
    // Focus on subscription section if needed
}
function closePaymentModal() {
    paymentModal.style.display = 'none';
    overlay.style.display = 'none';
}
function initiatePayment(plan) {
    const amount = plan === 'monthly' ? 2000 : 22000; // Updated prices
    const planDescription = plan === 'monthly' ? 'Abonnement mensuel' : 'Abonnement annuel';

    FedaPay.init({
        public_key: 'pk_live_TfSz212W0xSMKK7oPEogkFmp',
        transaction: {
            amount: amount,
            description: planDescription,
        },
        customer: {
            email: 'admin@example.com', // Admin email
        },
        onComplete: async function(response) {
            if (response.reason === FedaPay.DIALOG_DISMISSED) {
                alert('Paiement annulé.');
            } else if (response.reason === FedaPay.CHECKOUT_COMPLETED) {
                handleSuccessfulPayment(plan, response);
            }
        }
    }).open();
}

async function handleSuccessfulPayment(plan, response) {
    const startDate = new Date();
    const endDate = new Date(startDate);
    if (plan === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
    } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscriptionData = {
        status: 'active',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        transactionId: response.transaction.id,
        plan: plan
    };

    try {
        await firebase.database().ref('admin/subscription').set(subscriptionData);
        checkSubscriptionStatus();
        alert(`Abonnement ${plan === 'monthly' ? 'mensuel' : 'annuel'} réussi!`);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
        alert('Erreur lors de la mise à jour de l\'abonnement.');
    }
}

async function cancelSubscription() {
    try {
        await firebase.database().ref('admin/subscription').set({ status: 'cancelled' });
        checkSubscriptionStatus();
        alert('Abonnement annulé.');
    } catch (error) {
        console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
        alert('Erreur lors de l\'annulation de l\'abonnement.');
    }
}
function checkSubscriptionStatus() {
    return new Promise((resolve, reject) => {
        firebase.database().ref('admin/subscription').once('value', (snapshot) => {
            const subscription = snapshot.val();
            const now = new Date();

            if (subscription && subscription.status === 'active') {
                const endDate = new Date(subscription.endDate);
                if (endDate < now) {
                    // Subscription expired
                    subscriptionStatusDisplay.textContent = "Statut de l'abonnement: Expiré";
                    subscriptionStatusDisplay.style.color = 'red';
                    subscribeMonthlyButton.style.display = 'inline-block';
                    subscribeYearlyButton.style.display = 'inline-block';
                    cancelSubscriptionButton.style.display = 'none';
                    firebase.database().ref('admin/subscription').update({ status: 'expired' }); // Update status to expired in DB
                } else {
                    // Subscription active
                    subscriptionStatusDisplay.textContent = `Statut de l'abonnement: Actif jusqu'au ${endDate.toLocaleDateString()}`;
                    subscriptionStatusDisplay.style.color = 'green';
                    subscribeMonthlyButton.style.display = 'none';
                    subscribeYearlyButton.style.display = 'none';
                    cancelSubscriptionButton.style.display = 'inline-block';
                }
                resolve(); // Resolve the promise after handling subscription status
            } else {
                // No active subscription
                subscriptionStatusDisplay.textContent = "Statut de l'abonnement: Inactif";
                subscriptionStatusDisplay.style.color = 'red';
                subscribeMonthlyButton.style.display = 'inline-block';
                subscribeYearlyButton.style.display = 'inline-block';
                cancelSubscriptionButton.style.display = 'none';
                resolve(); // Resolve promise even when no active subscription, to continue initialization
            }
        }).catch((error) => {
            console.error("Error fetching subscription status:", error);
            reject(error); // Reject promise if there's an error fetching subscription status
        });
    });
}


subscribeMonthlyButton.addEventListener('click', () => initiatePayment('monthly'));
subscribeYearlyButton.addEventListener('click', () => initiatePayment('yearly'));
cancelSubscriptionButton.addEventListener('click', () => cancelSubscription());


checkLoginStatus();

    function getMondayOfCurrentWeek() {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(today.setDate(diff));
    }

    function getFirstDayOfCurrentMonth() {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1);
    }

    function getTopSellingProducts(boutique, startDate, endDate) {
        const ventesRef = boutique === 'Toutes' ? database.ref('ventes') : database.ref(`ventes/${boutique}`);
        ventesRef.once('value', (snapshot) => {
            const allVentes = snapshot.val();
            let ventes = {};

            for (const boutiqueKey in allVentes) {
                if (boutique === 'Toutes' || boutiqueKey === boutique) {
                    for (const venteId in allVentes[boutiqueKey]) {
                        const vente = allVentes[boutiqueKey][venteId];
                        if (vente.date >= startDate && vente.date <= endDate) {
                            if (!ventes[vente.produit]) {
                                ventes[vente.produit] = 0;
                            }
                            ventes[vente.produit]++;
                        }
                    }
                }
            }

            let sortedProducts = Object.entries(ventes).sort((a, b) => b[1] - a[1]);

            topVentesTable.innerHTML = '';
            for (let i = 0; i < sortedProducts.length; i++) {
                const row = topVentesTable.insertRow();
                row.insertCell().textContent = i + 1;
                row.insertCell().textContent = sortedProducts[i][0];
                row.insertCell().textContent = formatInteger(sortedProducts[i][1]);
            }
        }, (error) => {
            console.error("Error fetching top selling products:", error);
        });
    }

    function getUnsoldProducts(boutique, startDate, endDate) {
        const stockRef = boutique === 'Toutes' ? database.ref('stock') : database.ref(`stock/${boutique}`);
        const ventesRef = boutique === 'Toutes' ? database.ref('ventes') : database.ref(`ventes/${boutique}`);

        Promise.all([stockRef.once('value'), ventesRef.once('value')])
            .then(([stockSnapshot, ventesSnapshot]) => {
                const allStock = stockSnapshot.val();
                const allVentes = ventesSnapshot.val();
                let soldProducts = new Set();

                for (const boutiqueKey in allVentes) {
                    if (boutique === 'Toutes' || boutiqueKey === boutique) {
                        for (const venteId in allVentes[boutiqueKey]) {
                            const vente = allVentes[boutiqueKey][venteId];
                            if (vente.date >= startDate && vente.date <= endDate) {
                                soldProducts.add(vente.produit);
                            }
                        }
                    }
                }

                let unsoldProducts = new Set();
                for (const boutiqueKey in allStock) {
                    if (boutique === 'Toutes' || boutiqueKey === boutique) {
                        for (const produit in allStock[boutiqueKey]) {
                            if (!soldProducts.has(produit)) {
                                unsoldProducts.add(produit);
                            }
                        }
                    }
                }

                invendusTable.innerHTML = '';
                unsoldProducts.forEach(product => {
                    const row = invendusTable.insertRow();
                    row.insertCell().textContent = product;
                });
            }, (error) => {
                console.error("Error fetching unsold products:", error);
            });
    }

   function getSalesBySeller(boutique, startDate, endDate) {
        const ventesRef = boutique === 'Toutes' ? database.ref('ventes') : database.ref(`ventes/${boutique}`);
        ventesRef.once('value', (snapshot) => {
            const allVentes = snapshot.val();
            let salesBySeller = {};

            for (const boutiqueKey in allVentes) {
                if (boutique === 'Toutes' || boutiqueKey === boutique) {
                    for (const venteId in allVentes[boutiqueKey]) {
                        const vente = allVentes[boutiqueKey][venteId];
                        if (vente.date >= startDate && vente.date <= endDate) {
                            if (!salesBySeller[vente.vendeur]) {
                                salesBySeller[vente.vendeur] = 0;
                            }
                            salesBySeller[vente.vendeur] += vente.prixTotal;
                        }
                    }
                }
            }

            let sortedSellers = Object.entries(salesBySeller).sort((a, b) => b[1] - a[1]);

            ventesParVendeurTable.innerHTML = '';
            for (let i = 0; i < sortedSellers.length; i++) {
                const row = ventesParVendeurTable.insertRow();
                row.insertCell().textContent = sortedSellers[i][0];
                row.insertCell().textContent = formatCurrency(sortedSellers[i][1]);
            }
            const topSellerWeek = sortedSellers.length > 0 ? sortedSellers[0][0] : 'N/A';
            topSellerWeekSpan.textContent = topSellerWeek;

            const topSellerMonth = sortedSellers.length > 0 ? sortedSellers[0][0] : 'N/A';
            topSellerMonthSpan.textContent = topSellerMonth;
        }, (error) => {
            console.error("Error fetching sales by seller:", error);
        });
    }

function printTableToPDF(tableId) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const table = document.getElementById(tableId);

    let title = '';
    switch (tableId) {
        case 'ventesTable':
            title = 'Liste des ventes';
            break;
        case 'stockTable':
            title = 'Stock';
            break;
        case 'beneficesTable':
            title = 'Bénéfices';
            break;
        case 'recouvrementTable':
            title = 'Recouvrements';
            break;
         case 'topVentesTable': // Changed ID
            title = 'Top des ventes';
            break;
         case 'invendusTable': // Changed ID
            title = 'Produits invendus';
            break;
         case 'ventesParVendeur':
            title = 'Ventes par vendeur';
            break;
         case 'depensesTable':
            title = 'Liste des dépenses';
            break;
         case 'stockOperationsTable':
            title = 'Opérations de Stock';
            break;
        default:
            title = 'Tableau';
    }

    doc.text(title, 14, 15);

    doc.autoTable({ html: '#' + tableId, startY: 25 });

    doc.output('dataurlnewwindow');
}


document.getElementById('printVentes').addEventListener('click', function() {
    printTableToPDF('ventesTable');
});

document.getElementById('printStock').addEventListener('click', function() {
    printTableToPDF('stockTable');
});

document.getElementById('printBenefices').addEventListener('click', function() {
    printTableToPDF('beneficesTable');
});

document.getElementById('printRecouvrement').addEventListener('click', function() {
    printTableToPDF('recouvrementTable');
});


document.getElementById('printTopVentes').addEventListener('click', function() { // Changed ID
    printTableToPDF('topVentesTable');
});

document.getElementById('printInvendus').addEventListener('click', function() { // Changed ID
    printTableToPDF('invendusTable');
});


document.getElementById('printVentesParVendeur').addEventListener('click', function() {
    printTableToPDF('ventesParVendeur');
});
document.getElementById('printDepenses').addEventListener('click', function() {
    printTableToPDF('depensesTable');
});
document.getElementById('printStockOperations').addEventListener('click', function() {
    printTableToPDF('stockOperationsTable');
});


function updateCapitalGeneralAndBeneficeGeneral(boutique) {
    let capitalGeneral = 0;
    let beneficeGeneralEstime = 0;
    const stockRef = boutique === 'Toutes' ? database.ref('stock') : database.ref(`stock/${boutique}`);

    stockRef.once('value', (snapshot) => {
        const stockData = snapshot.val();
        if (stockData) {
            for (const produit in stockData) {
                const details = stockData[produit];
                    capitalGeneral += (details.stockInitial !== undefined ? details.stockInitial : 0) * details.prixAchat;
                    beneficeGeneralEstime += details.quantite * (details.prixVenteDetail - details.prixAchat);
            }
        }
        capitalGeneralSpan.textContent = formatCurrency(capitalGeneral);
        beneficeGeneralSpan.textContent = formatCurrency(beneficeGeneralEstime);
    });
}


depenseForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const dateDepense = document.getElementById('dateDepense').value;
    const descriptionDepense = document.getElementById('descriptionDepense').value;
    const montantDepense = parseFloat(document.getElementById('montantDepense').value);
    const categorieDepense = document.getElementById('categorieDepense').value;
    const boutique = boutiqueSelect.value;

    if (boutique === 'Toutes') {
        showStatusMessage('Veuillez sélectionner une boutique pour enregistrer une dépense.', false);
        return;
    }

    const depenseRef = database.ref(`depenses/${boutique}`).push();
    depenseRef.set({
        dateDepense: dateDepense,
        descriptionDepense: descriptionDepense,
        montantDepense: montantDepense,
        categorieDepense: categorieDepense
    })
    .then(() => {
        showStatusMessage('Dépense enregistrée avec succès!');
        depenseForm.reset();
        chargerDepenses(boutique);
        chargerBenefices(boutique);
    })
    .catch(error => {
        console.error("Erreur lors de l'enregistrement de la dépense:", error);
        showStatusMessage("Erreur lors de l'enregistrement de la dépense.", false);
    });
});


function chargerDepenses(boutique) {
    const depensesRef = database.ref(`depenses/${boutique}`);
    depensesRef.on('value', (snapshot) => {
        depensesTable.innerHTML = '';
        snapshot.forEach(childSnapshot => {
            const depense = childSnapshot.val();
            const row = depensesTable.insertRow();
            row.insertCell().textContent = depense.dateDepense;
            row.insertCell().textContent = depense.descriptionDepense;
            row.insertCell().textContent = formatCurrency(depense.montantDepense);
            row.insertCell().textContent = depense.categorieDepense;

            const actionsCell = row.insertCell();
            const actionIcons = document.createElement('div');
            actionIcons.className = 'action-icons';
             if (currentUserStatus !== 'Vendeur') { // Check user status here
                const deleteIcon = document.createElement('i');
                deleteIcon.className = 'fas fa-trash-alt';
                deleteIcon.addEventListener('click', () => {
                    if (confirm(`Êtes-vous sûr de vouloir supprimer cette dépense ?`)) {
                        supprimerDepense(childSnapshot.key, boutique);
                    }
                });
                 actionIcons.appendChild(deleteIcon);
            }


            actionsCell.appendChild(actionIcons);
        });
    });
}


function supprimerDepense(depenseId, boutique) {
    const depenseRef = database.ref(`depenses/${boutique}/${depenseId}`);
    depenseRef.remove()
    .then(() => {
        showStatusMessage('Dépense supprimée avec succès!');
        chargerDepenses(boutique);
        chargerBenefices(boutique);
    })
    .catch(error => {
        console.error("Erreur lors de la suppression de la dépense:", error);
        showStatusMessage("Erreur lors de la suppression de la dépense.", false);
    });
}
function chargerDepensesToutesBoutiques() {
    depensesTable.innerHTML = '';
    const boutiques = ['Boutique1', 'Boutique2', 'Boutique3'];
    const boutiquesRef = database.ref('boutiques');
     boutiquesRef.once('value').then((snapshot) => {
         snapshot.forEach(childSnapshot => {
                boutiques.push(childSnapshot.key);
            });
            boutiques.forEach(boutique => {
                const depensesRef = database.ref(`depenses/${boutique}`);
                depensesRef.on('value', (snapshot) => {
                    snapshot.forEach(childSnapshot => {
                        const depense = childSnapshot.val();
                            const row = depensesTable.insertRow();
                            row.insertCell().textContent = `(${boutique}) ${depense.dateDepense}`;
                            row.insertCell().textContent = depense.descriptionDepense;
                            row.insertCell().textContent = formatCurrency(depense.montantDepense);
                            row.insertCell().textContent = depense.categorieDepense;

                            const actionsCell = row.insertCell();
                            const actionIcons = document.createElement('div');
                            actionIcons.className = 'action-icons';

                            const deleteIcon = document.createElement('i');
                            deleteIcon.className = 'fas fa-trash-alt';
                            deleteIcon.addEventListener('click', () => {
                                if (confirm(`Êtes-vous sûr de vouloir supprimer cette dépense de ${boutique} ?`)) {
                                    supprimerDepense(childSnapshot.key, boutique);
                                }
                            });

                            actionIcons.appendChild(deleteIcon);
                            actionsCell.appendChild(actionIcons);
                    });
                });
            });
       });
}

function approvisionnerProduitDuStock(produit, boutique) {
    const stockRef = database.ref(`stock/${boutique}/${produit}`);
    stockRef.once('value', (snapshot) => {
        const currentStockData = snapshot.val();
        if (currentStockData) {
            document.getElementById('produitStock').value = produit;
            document.getElementById('produitStock').readOnly = true;
            document.getElementById('stockInitial').value = currentStockData.stockInitial !== undefined ? currentStockData.stockInitial : 0;
            document.getElementById('approvisionnement').value = '';
            document.getElementById('prixAchat').value = currentStockData.prixAchat;

            stockForm.querySelector('button[type="submit"]').textContent = 'Approvisionner';
            stockForm.dataset.approvisionnerProduit = produit;

        } else {
            showStatusMessage("Produit non trouvé dans le stock.", false);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    showPageLoader();
    checkSubscriptionStatus()
        .then(() => {
          lucide.createIcons();
          hidePageLoader();
        })
        .catch((error) => {
            console.error("Subscription check error:", error);
            hidePageLoader();
            showStatusMessage("Erreur lors de la vérification de l'abonnement.", false);
        });
});

window.redirectToSubscription = redirectToSubscription;
window.hideSubscriptionRequiredModal = hideSubscriptionRequiredModal;
window.closePaymentModal = closePaymentModal;