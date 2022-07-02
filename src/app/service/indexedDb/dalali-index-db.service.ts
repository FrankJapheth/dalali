import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DalaliIndexDbService {

  constructor() { }

  createDatabase(databaseName:string, databaseVersion:number): Promise<IDBDatabase>{
    return new Promise((dbResp,dbRej)=>{
      const request:IDBOpenDBRequest = window.indexedDB.open(databaseName, databaseVersion);
      request.onerror=(event:Event)=>{
        dbRej(event)
      }
      request.onupgradeneeded=()=>{
        const dataBase:IDBDatabase=request.result
        dbResp(dataBase)
      }
    })
  }

  writeToDatabase(databaseName:string,databaseVersion:number): Promise<IDBDatabase> {
    return new Promise((dbResp,dbRej)=>{
      this.createDatabase(databaseName,databaseVersion).then((resp:IDBDatabase)=>{
        dbResp(resp)
      }).catch((err)=>{
        dbRej(err)
      })
    })
  }

  deleteDatasase(databaseName:string,): Promise<IDBDatabase>{
    const request:IDBOpenDBRequest=indexedDB.deleteDatabase(databaseName)
    return new Promise((dbResp,dbRej)=>{
      request.onsuccess=()=>{
        const database:IDBDatabase=request.result
        dbResp(database)
      }
      request.onerror=(event:any)=>{
        dbRej(event)
      }
    })
  }

  createObjectStore(database:IDBDatabase,objetStoreName:string,objectStoreKeyPath:string):Promise<IDBObjectStore>{
    return new Promise<any>((resolve,reject) => {
      try {
        const objectStore:IDBObjectStore = database.createObjectStore(objetStoreName, { keyPath: objectStoreKeyPath });
        resolve(objectStore)
        
      } catch (error) {
        reject(error)
      }
    })
  }

  readObjectStore(database:IDBDatabase,objetStoreName:string):Promise<IDBObjectStore>{
    return new Promise<any>((resolve, reject) => {
        try {
          const objectStore:IDBObjectStore = database.transaction(objetStoreName).objectStore(objetStoreName)
          resolve(objectStore)
          
        } catch (error) {
          reject(error)
        }
    })
  }


  updateObjectStore(database:IDBDatabase,objetStoreName:string):Promise<IDBObjectStore>{
    return new Promise<any>((resolve, reject) => {
        try {
          const objectStore:IDBObjectStore = database.transaction(objetStoreName,'readwrite').objectStore(objetStoreName);
          resolve(objectStore)
        } catch (error) {
          reject(error)
        }
    })
    
  }
  
  deleteObjectStore(database:IDBDatabase,objetStoreName:string):Promise<boolean>{
    return new Promise<any>((resolve, reject) => {
        try {

            database.deleteObjectStore(objetStoreName);
            resolve(true)
          
        } catch (error) {
          reject(error)
        }
    })
  }

  addRecord(objectStore:IDBObjectStore,storeData:any):Promise<IDBRequest>{
    return new Promise<any>((resolve, reject) => {
      objectStore.transaction.oncomplete=()=>{
          try {

                const idbReaquest:IDBRequest=objectStore.add(storeData);

                idbReaquest.onsuccess=()=>{
                  resolve(idbReaquest)
                }

          } catch (error) {
            reject(error)
          }
      }
    })
  }

  readRecord(objectStore:IDBObjectStore,recordKey:string):Promise<IDBRequest>{
    return new Promise<any>((resolve, reject) => {
      objectStore.transaction.oncomplete=()=>{
        try {
              const idbReaquest:IDBRequest=objectStore.get(recordKey);
              idbReaquest.onsuccess=()=>{
                resolve(idbReaquest)
              }
        } catch (error) {
          reject(error)
        }
      }
      
    })
  }

  updateRecord(objectStore:IDBObjectStore,record:string):Promise<IDBRequest>{
    return new Promise<any>((resolve, reject) => {
      objectStore.transaction.oncomplete=()=>{
          try {
                const idbReaquest:IDBRequest=objectStore.put(record);
                idbReaquest.onsuccess=()=>{
                  resolve(idbReaquest)
                }
          } catch (error) {
            reject(error)
          }
      }
      
    })
  }

  deleteRecord(objectStore:IDBObjectStore,recordKey:string):Promise<IDBRequest>{
    return new Promise<any>((resolve, reject) => {
      objectStore.transaction.oncomplete=()=>{
        try {

            const idbReaquest:IDBRequest=objectStore.delete(recordKey);

            idbReaquest.onsuccess=()=>{
              resolve(idbReaquest)
            }

        } catch (error) {
          reject(error)
        }
      }
      
    })
  }

}
