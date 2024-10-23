// indexdb.js
console.log("IndexedDB script loaded.");

// Open or create the Pokemon database
const request = indexedDB.open('Pokemon', 1);

// Create the object store for Pokemon
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore('PokemonStore', { keyPath: 'name' });
    objectStore.createIndex('level', 'level', { unique: false });
    objectStore.createIndex('att', 'att', { unique: false });
};

// Once the database is open, proceed with transactions
request.onsuccess = function(event) {
    const db = event.target.result;

    // Add Pokemon data
    const transaction = db.transaction('PokemonStore', 'readwrite');
    const objectStore = transaction.objectStore('PokemonStore');

    // Add Pikachu
    objectStore.add({ name: 'Pikachu', level: 10, att: 5 });
    // Add Charizard
    objectStore.add({ name: 'Charizard', level: 8, att: 10 });

    // Update Charizard's attack value
    objectStore.put({ name: 'Charizard', level: 8, att: 11 });

    // Read data for Pikachu
    const getPikachuRequest = objectStore.get('Pikachu');
    getPikachuRequest.onsuccess = function() {
        console.log('Pikachu:', getPikachuRequest.result);
    };

    // Read data for Charizard
    const getCharizardRequest = objectStore.get('Charizard');
    getCharizardRequest.onsuccess = function() {
        console.log('Charizard:', getCharizardRequest.result);
    };

    // Delete Pikachu
    objectStore.delete('Pikachu');
};

// Handle errors
request.onerror = function(event) {
    console.error('Database error:', event.target.errorCode);
};
