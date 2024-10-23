console.log("IndexedDB script loaded.");

function initDB(datastore) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(datastore, 1);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(datastore)) {
                const objectStore = db.createObjectStore(datastore, { keyPath: 'name' });
                objectStore.createIndex('level', 'level', { unique: false });
                objectStore.createIndex('att', 'att', { unique: false });
            }
        };

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };

        request.onerror = function (event) {
            reject('Database error: ' + event.target.errorCode);
        };
    });
}

function saveDataStore(datastore, key, value) {
    initDB(datastore).then(db => {
        const transaction = db.transaction(datastore, 'readwrite');
        const objectStore = transaction.objectStore(datastore);

        objectStore.put({ name: key, ...value });

        transaction.onerror = (event) => {
            console.error(`Error saving data for ${key}: `, event.target.error);
        };
    }).catch(error => console.error(error));
}

function removeDataStore(datastore, key) {
    initDB(datastore).then(db => {
        const transaction = db.transaction(datastore, 'readwrite');
        const objectStore = transaction.objectStore(datastore);

        objectStore.delete(key);

        transaction.onerror = (event) => {
            console.error(`Error removing ${key}: `, event.target.error);
        };
    }).catch(error => console.error(error));
}

function getDataStore(datastore, key) {
    return new Promise((resolve, reject) => {
        initDB(datastore).then(db => {
            const transaction = db.transaction(datastore, 'readonly');
            const objectStore = transaction.objectStore(datastore);

            const request = objectStore.get(key);

            request.onsuccess = () => {
                if (request.result) {
                    resolve(request.result);
                } else {
                    console.log(`${key} not found`);
                    resolve(null);  // Return null if the key is not found
                }
            };

            request.onerror = (event) => {
                console.error(`Error getting ${key}: `, event.target.error);
                reject(event.target.error);
            };
        }).catch(error => reject(error));
    });
}

