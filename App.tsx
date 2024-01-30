import React from "react";
import type {PropsWithChildren} from 'react';
import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  Dimensions,
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';

import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';
import { FloatingAction } from 'react-native-floating-action';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
const uuids={service:"0000ABF0-0000-1000-8000-00805F9B34FB",rxtx:"0000ABF1-0000-1000-8000-00805F9B34FB"}
var conDev={name:"COC",id:"58:CF:79:26:24:3E"};

declare module 'react-native-ble-manager' {
  // enrich local contract with custom state properties needed by App.tsx
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}


import {
  Colors,
  DebugInstructions,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const SECONDS_TO_SCAN_FOR = 10;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;

const App = () => {
  const [value, setvalue] = useState("am i");
  const hellod = (a:string) => {setvalue(a); };
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral['id'], Peripheral>(),
  );
  var devices=[{}];
  var actions =[];

/////////////////////////////////////////////////////////////////
///////////////       DEVICES
/////////////////////////////////////////////////////////////////
const addDev=(nme:string,did:string)=>{let isin=false;
  for(let i=0;i<devices.length;i++)if(devices[i].id==did)isin=true;
  if(!isin)devices.push({name:nme,id:did}); }
const clrDev=()=>{devices=[]; }
/////////////////////////////////////////////////////////////////
///////////////       HANDLE RQ
/////////////////////////////////////////////////////////////////
var handleLocReq = () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then(result => {
        if (result) {
          console.debug(
            '[handleAndroidPermissions] User accepts runtime permissions android 12+',
          );return true;
        } else {
          console.error(
            '[handleAndroidPermissions] User refuses runtime permissions android 12+',
          );return false;
        }
      });
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(checkResult => {
        if (checkResult) {
          console.debug(
            '[handleAndroidPermissions] runtime permission Android <12 already OK',
          );return true;
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(requestResult => {
            if (requestResult) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permission android <12**',
              );return true;
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permission android <12*',
              );return false;
            }
          });
        }
      });
    }return false;
  };

////////////////////////////////////////////////////
//////
////////////////////////////////////////////////////
const handleDiscoverPeripheral = (peripheral: Peripheral) => {
 if(peripheral.advertising.isConnectable){console.log('newBLEperipheral',actions.length, peripheral);
  let nme=peripheral.name||'NO NAME';let id=peripheral.id;
  //let act={text:nme,name:nme};
 // actions[actions.length]=act; }
 addDev(nme,id);
}
 
//setPeripherals(map => {return new Map(map.set(peripheral.id, peripheral)); });

  console.log('perifData',devices);
};  



const handleStopScan=()=>{setIsScanning(false);console.log('[handleStopScan] scan is stopped.'); };


const handleDisconnectedPeripheral=(event: BleDisconnectPeripheralEvent)=>{console.log(`[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`);
 setPeripherals(map=>{let p=map.get(event.peripheral);if(p){p.connected=false;return new Map(map.set(event.peripheral,p)); };return map; }); };


const handleConnectPeripheral = (event: any) => {console.log(`[handleConnectPeripheral][${event.peripheral}] connected.`); };

const handleUpdateValueForCharacteristic = (
  data: BleManagerDidUpdateValueForCharacteristicEvent,
) => {
  console.log(
    `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
  );
};
////////////////////////////////////////////////////
////      LISTENER
////////////////////////////////////////////////////

const startScan=()=>{if(!isScanning){clrDev();
  //setPeripherals(new Map<Peripheral['id'], Peripheral>());
  try {BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, undefined, {matchMode: BleScanMatchMode.Sticky,scanMode: BleScanMode.LowLatency,callbackType: BleScanCallbackType.AllMatches }).then(()=>{setIsScanning(true);console.log('[startScan] scan promise returned successfully.'); }).catch((err: any)=>{
  console.error('[startScan] ble scan returned in error', err); });console.log('[startScan] starting scan...'); } catch (error){console.error('[startScan] ble scan error thrown', error); } } }

const stopScan=()=>{BleManager.stopScan().then(()=>{setIsScanning(false);console.log("Scan stopped"); }); };

const connect=(a:string)=>{BleManager.connect(a).then(()=>{console.log("Connected"); }).catch((error)=>{console.log(error); }); };



const notify=(id:string)=>{BleManager.startNotification(id,uuids.service,uuids.rxtx).then(() => {
    // Success code
    console.log("Notification started");
  })
  .catch((error) => {
    // Failure code
    console.log("NOTIF",error);
  });
}


const sendData=(a:[])=>{BleManager.write(conDev.id,uuids.service,uuids.rxtx,a).then(() => {
console.log("WRITE: "+[0x31] ); }).catch((error) => {console.log(error); }); };

const readData=()=>{BleManager.read(conDev.id,uuids.service,uuids.rxtx).then((d) => {
  //let readedData = bytesToString(readData);
console.log(d); }).catch((error) => {console.log(error); }); };


/*const readFromBle = (id: string) => {
  BleManager.retrieveServices(id).then((response) => {readData();
  })
}*/

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };




  useEffect(() => {
    try {
      BleManager.start({ showAlert: false })
        .then(() => console.log('BleManager started.'))
        .catch((error: any) =>
          console.error('BeManager could not be started.', error),
        );
    } catch (error) {
      console.error('unexpected error starting BleManager.', error);
      return;
    }

    const listeners = [
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      ),
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      ),
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      ),
      bleManagerEmitter.addListener(
        'BleManagerConnectPeripheral',
        handleConnectPeripheral,
      ),
    ];

    handleLocReq();

    return () => {
      console.log('[app] main component unmounting. Removing listeners...');
      for (const listener of listeners) {
        listener.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

////////////////////////////////////////////////////
////      RENDERS
////////////////////////////////////////////////////
const styles_x = StyleSheet.create({
  container: {
  },
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  txt:{color:"yellow" },
  titleWrapper: {
    color:"yellow" 
  },
  inputWrapper: {

  },
  contentContainer: {
  },
  footer: {
  }
});



  /////////#####################styles
return (<SafeAreaView style={[backgroundStyle, styles.mainBody]}>
  <View style={styles.containerMain}>
     <Text style={styles_x.txt} onPress={(a)=>connect("58:CF:79:26:24:3E")}>CONNECT</Text>
     <Text style={styles_x.txt}></Text>
     <Text style={styles_x.txt} onPress={(a)=>notify(conDev.id)}>NOTIFY</Text>
     <Text style={styles_x.txt}></Text>
     <Text style={styles_x.txt} onPress={(a)=>{sendData([0x31]); } }>SENDDATA</Text>
    
     <FlatList style={styles.txt}

data={devices}

renderItem={({item}) => (

    <TouchableWithoutFeedback onPress={ () => console.log(item)}>

        <View>
           <Text>ID: {item.id}</Text>
           <Text>Title: {item.name}</Text>
        </View>

   </TouchableWithoutFeedback>

)}
/> 
      <ScrollView>
    
      </ScrollView>
<View style={styles.bottomView}><FloatingAction onPressItem={name => {hellod(name+""); }} onOpen={startScan} onClose={stopScan}/></View>
  </View>
<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} /></SafeAreaView>
  );
};
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    height: windowHeight,
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  containerMain: {
    flex: 1,
  },
  bottomView: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
  textStyle: {
    color: '#fff',
    fontSize: 18,
  }
});
export default App;