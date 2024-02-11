import React from "react";
import type {PropsWithChildren} from 'react';
import { useState, useEffect } from 'react';
import { stylesGlob,stylesACtPanel,stylesConnPanel,stylesDevItems,stylesRxTxPan} from "./style";
import {CButton}from"./custoComp";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
  TextInput,
  
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
import ToolbarAndroid from '@react-native-community/toolbar-android'

import Icon from 'react-native-vector-icons/AntDesign';

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
//import { color } from "native-base/lib/typescript/theme/styled-system";

const SCAN_INTERV = 10;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = false;

const App = () => {
/////////////////////////////////////////////////////////////////
///////////////      VARIABLES
/////////////////////////////////////////////////////////////////
  const [value, setvalue] = useState("am i");
  const [deviceName,setDevName]=useState("UNCONNECTED");
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(new Map<Peripheral['id'], Peripheral>() );
  //const [devices,setdevs]=useState([]);
  var devices=[{}];
  const backgroundStyle = Colors.darker;
  const [sensHeight,setsensHeight]=useState("-");
  const dTyp={height:0x31,oxi:0x50,cust:0x00};
  var dataState=dTyp.height;
 // var devices=[{}];

/////////////////////////////////////////////////////////////////
///////////////       FUNCTIONS
/////////////////////////////////////////////////////////////////
function byte2string(a:Array<string>){let s="";for(let i=0;i<a.length;++i){s+=(String.fromCharCode(a[i])); };return s; }

function string2byte(a:string){let b=[];for(var i=0;i<a.length;++i){let c= a.charCodeAt(i);b=b.concat([c]);return } return b;}
/////////////////////////////////////////////////////////////////
///////////////       DEVICES
/////////////////////////////////////////////////////////////////
const addDev=(perif:Peripheral)=>{let isin=false;
  perif.name=perif.name||"NO NAME";
  //setPeripherals(map =>{return new Map(map.set(perif.id,perif)); });
  for(let i=0;i<devices.length;i++){if(devices[i].id==perif.id)isin=true; }
  if(!isin){devices.push({name:perif.name,id:perif.id});
  console.log('[NEW_DEV]:',{name:perif.name,id:perif.id});
 setPeripherals(map =>{return new Map(map.set(perif.id,perif)); }); 
} }

const clrDev=()=>{devices=[];setPeripherals(new Map<Peripheral['id'], Peripheral>()); }

const rmvDev=(did:string)=>{for(let i=0;i<devices.length;i++)if(devices[i].id==did)devices.filter(item=>item.id!==value); }
/////////////////////////////////////////////////////////////////
///////////////       HANDLERQ
/////////////////////////////////////////////////////////////////
var handleLocReq = () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then(result => {
        if (result) {
          console.debug(
            '[HANDLERQ]: User accepts runtime permissions android 12+',
          );return true;
        } else {
          console.error(
            '[HANDLERQ]:error: User refuses runtime permissions android 12+',
          );return false;
        }
      });
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(checkResult => {
        if (checkResult) {
          console.debug(
            '[HANDLERQ]: runtime permission Android <12 already OK',
          );return true;
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(requestResult => {
            if (requestResult) {
              console.debug(
                '[HANDLERQ]:error: User accepts runtime permission android <12**',
              );return true;
            } else {
              console.error(
                '[HANDLERQ]:error: User refuses runtime permission android <12*',
              );return false;
            }
          });
        }
      });
    }return false;
  };

////////////////////////////////////////////////////
//////  LISTENERDISC
////////////////////////////////////////////////////
/*const handleDiscoverPeripheral=(peripheral:Peripheral)=>{if(peripheral.advertising.isConnectable){let nme=peripheral.name||'NO NAME';let id=peripheral.id;addDev(peripheral); } };  

const handleStopScan=()=>{setIsScanning(false);console.log('[handleStopScan] scan is stopped.'); };

const handleDisconnectedPeripheral=(event: BleDisconnectPeripheralEvent)=>{console.log(`[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`);
setDevName("UNCONNECTED");clrDev(); };

const handleConnectPeripheral=(event:any)=>{setDevName(event.peripheral);console.log(`[CONNECTEDDEV]:[${event.peripheral}] connected.`); };

const handleUpdateValueForCharacteristic = (data: BleManagerDidUpdateValueForCharacteristicEvent) => {
  console.log(`RXDATA : '${data.peripheral}' CHAR='${data.characteristic}' VAL='${data.value}'`);
};*/
////////////////////////////////////////////////////
////      BLEMANAGE
////////////////////////////////////////////////////

const startScan=()=>{if(!isScanning){clrDev();try {BleManager.scan(SERVICE_UUIDS, SCAN_INTERV, undefined, {matchMode: BleScanMatchMode.Sticky,scanMode: BleScanMode.LowLatency,callbackType: BleScanCallbackType.AllMatches }).then(()=>{setIsScanning(true);console.log('[BLEMANAGE] scan promise returned successfully.'); }).catch((err: any)=>{console.error('[BLEMANAGE]:error:',err); });console.log('[BLEMANAGE]:starting scan...'); }catch (error){console.error('[BLEMANAGE]:error:', error); } } }

const stopScan=(call:any)=>{clrDev();BleManager.stopScan().then(()=>{setIsScanning(false);console.log("[BLEMANAGE]:Scan stopped");call(); }); };

const connect=(a:string)=>{stopScan(()=>{console.log("[BLEMANAGE]:connecting");BleManager.connect(a).then(()=>{console.log("[BLEMANAGE]:Connected"); }).catch((error)=>{console.log("[BLEMANAGE]:error:",error); });}); };

const disconnect=(a:string)=>{BleManager.disconnect(a).then(()=>{console.log("[BLEMANAGE]:Disconnected"); }).catch((error)=>{console.log("[BLEMANAGE]:error:",error); }); }

const notify=(id:string)=>{BleManager.startNotification(id,uuids.service,uuids.rxtx).then(()=>{console.log("[BLEMANAGE]:BLE SUBSCRIBED"); }).catch((error)=>{console.log("[BLEMANAGE]:error:",error); }); }

const sendData=(id:string,a:[])=>{BleManager.write(id,uuids.service,uuids.rxtx,a).then(()=>{console.log("[BLEMANAGE]:WRITE: ",a); }).catch((error) => {console.log(error); }); };

const readData=(id:string)=>{BleManager.read(id,uuids.service,uuids.rxtx).then((d)=>{console.log(d); }).catch((error)=>{console.log("[BLEMANAGE]:error:"+error); }); };

useEffect(()=>{try{BleManager.start({ showAlert: false }).then(()=>console.log('[BLEMANAGE]:BleManager started.')).catch((error: any) =>console.error('[BLEMANAGE]:error:', error) ); }catch(error){console.error('[BLEMANAGE]:error:', error);return; }

////////////////////////////////////////////////////
////      LISTENERS
////////////////////////////////////////////////////
const listeners=[
bleManagerEmitter.addListener('BleManagerDiscoverPeripheral',
(peripheral:Peripheral)=>{if(peripheral.advertising.isConnectable){let nme=peripheral.name||'NO NAME';let id=peripheral.id;addDev(peripheral);
 } } ),

bleManagerEmitter.addListener('BleManagerStopScan',()=>{setIsScanning(false);console.log('[LISTENERS]: scan is stopped.'); }),

bleManagerEmitter.addListener('BleManagerDisconnectPeripheral',
(event: BleDisconnectPeripheralEvent)=>{console.log(`[LISTENERS]:[${event.peripheral}] disconnected.`);setDevName("UNCONNECTED");clrDev(); }),

bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic',(data:BleManagerDidUpdateValueForCharacteristicEvent)=>{
  if(dataState==dTyp.height)setsensHeight(byte2string(data.value));
  console.log(`[LISTENERS]:rxd='${data.peripheral}',CHAR='${data.characteristic}'VAL='${byte2string(data.value)}'`); } ),

bleManagerEmitter.addListener('BleManagerConnectPeripheral',(event:any)=>{setDevName(event.peripheral);console.log(`[LISTENERS]:[${event.peripheral}] connected.`); } )
];
handleLocReq();

return()=>{console.log('[LISTENERS]:main component unmounting. Removing listeners...');for(const listener of listeners){listener.remove(); } };


}, []);

////////////////////////////////////////////////////
////      RENDERS
////////////////////////////////////////////////////
const styles_x = StyleSheet.create({
  txt:{color:"yellow" }
});


const renderItem = ({item}: {item: Peripheral}) => {
  const backgroundColor = item.connected ? '#069400' : Colors.orange;
  return (
    <TouchableHighlight
      underlayColor="#0082FC"
      onPress={() =>{console.log("[RENDER]:clicked:",item.id);connect(item.id)}}>
      <View style={[{backgroundColor}]}>
        <Text style={stylesDevItems.id}>
          {item.name} {item?.advertising?.localName}{"\n"}
          {item.id}
        </Text>
      </View>
    </TouchableHighlight>
  );
};


  /////////#####################styles
return (<SafeAreaView style={[backgroundStyle, stylesGlob.mainBody]}>


  
  <StatusBar barStyle={'light-content'} backgroundColor={Colors.black} />

  <View style={stylesACtPanel.panel}>
    <Text style={stylesConnPanel.dev}>React-Native-Ble</Text>
    <Icon.Button style={stylesConnPanel.ico} name="sync" onPress={startScan} />
  </View>
  <View style={stylesConnPanel.panel}>
    <Text style={stylesConnPanel.dev}>{deviceName}</Text>
    <CButton onPress={()=>{disconnect(deviceName); }} text="DIS" style={stylesConnPanel.button}/>
    <CButton onPress={()=>{notify(deviceName); }} text="NFY" style={stylesConnPanel.button}/>
  </View>


  <View style={[stylesGlob.containerMain,{marginTop:20}]}>

  <View style={stylesRxTxPan.panel}>
    <Text style={stylesRxTxPan.label}>HEIGHT : </Text>
    <Text style={stylesRxTxPan.vals}>{sensHeight}</Text>
    <CButton onPress={()=>{dataState=dTyp.height;sendData(deviceName,[dataState]); }} text="READ" style={stylesRxTxPan.button}/>
  </View>
{/*
  <View style={stylesRxTxPan.panel}>
    <Text style={stylesRxTxPan.label}>HEIGHT : </Text>
    <TextInput style={stylesRxTxPan.invals} />
    <CButton onPress={()=>{dataState=dTyp.cust;
    console.log("NAME",this.refs.username.value);
    //sendData(deviceName,[string2byte(value)]);
     }} text="READ" style={stylesRxTxPan.button}
    />
    </View>*/}
    
     <FlatList
          data={Array.from(peripherals.values())}
          contentContainerStyle={{rowGap: 12}}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        
  </View>
</SafeAreaView>
  );
};

export default App;